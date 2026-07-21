(function () {
  const STORAGE_KEY = "envmarkSettings";
  const { findEnvironment } = window.EnvMarkMatcher;
  const DEFAULT_CAPTURE_SETTINGS = {
    enabled: true,
    position: "top-right",
    color: "#0f172a",
    size: 28,
    textSize: 16,
    opacity: 1,
    bodyWidth: 240,
    bodyMaxHeight: 280
  };
  const NAV_FALLBACK_BG = "#0f172a";
  const NAV_FALLBACK_FG = "#ffffff";
  const NAV_ICON_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<line x1="8" y1="6" x2="21" y2="6"/>' +
    '<line x1="8" y1="12" x2="21" y2="12"/>' +
    '<line x1="8" y1="18" x2="21" y2="18"/>' +
    '<circle cx="3.5" cy="6" r="1.5" fill="currentColor" stroke="none"/>' +
    '<circle cx="3.5" cy="12" r="1.5" fill="currentColor" stroke="none"/>' +
    '<circle cx="3.5" cy="18" r="1.5" fill="currentColor" stroke="none"/>' +
    "</svg>";
  let activeEnvironment = null;
  let activeSettings = null;
  let originalTitle = document.title;
  let titleApplied = false;
  let lastUrl = window.location.href;
  let autoFillKey = "";
  let autoFillTimer = null;
  let autoFillObserver = null;
  let capturePanelObserver = null;
  let capturePanelSyncTimer = null;
  let navigatorPanel = null;
  let navigatorExpandedGroups = new Set();
  let navigatorOutsideClickHandler = null;
  let navigatorEscapeHandler = null;

  function t(key, substitutions) {
    const message = chrome.i18n.getMessage(key, substitutions);
    return message || key;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function uid(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function truncate(text, max) {
    const value = String(text || "");
    return value.length > max ? value.slice(0, max) : value;
  }

  function removeMarkers() {
    document.querySelectorAll("[data-envmate-root]").forEach((node) => node.remove());
    if (titleApplied) {
      document.title = originalTitle;
      titleApplied = false;
    }
  }

  function removeCapturePanels() {
    document.querySelectorAll('[data-envmate-root="capture"]').forEach((node) => node.remove());
  }

  function markerLabel(environment) {
    const badge = typeof environment?.badge === "string" ? environment.badge.trim() : "";
    const name = typeof environment?.name === "string" ? environment.name.trim() : "";
    return badge || name || t("environmentFallback");
  }

  function watermarkLabel(environment) {
    const watermarkText = typeof environment?.watermarkText === "string" ? environment.watermarkText.trim() : "";
    const name = typeof environment?.name === "string" ? environment.name.trim() : "";
    return watermarkText || name || t("environmentFallback");
  }

  function accountDisplayLabel(account) {
    const username = String(account?.username || "").trim();
    const label = String(account?.label || "").trim();
    if (username && label) return `${username} (${label})`;
    return username || label || t("accountFallback");
  }

  function applyTitle(environment) {
    if (!environment.titlePrefix) return;
    const badge = markerLabel(environment);
    if (!titleApplied) originalTitle = document.title;
    document.title = `[${badge}] ${originalTitle}`;
    titleApplied = true;
  }

  function shouldShowCaptureButton(environment, resolvedInputs) {
    if (!environment) return false;
    const cs = resolveCaptureSettings(environment);
    if (!cs.enabled) return false;
    if (!resolvedInputs?.passwordInput) return false;
    return isLikelyLoginForm(
      resolvedInputs.usernameInput,
      resolvedInputs.passwordInput
    );
  }

  function shouldShowWatermark(environment) {
    if (typeof environment.watermarkEnabled === "boolean") return environment.watermarkEnabled;
    return environment.markerMode === "watermark" || environment.markerMode === "badge-watermark";
  }

  function shouldShowBadge(environment) {
    if (typeof environment.badgeEnabled === "boolean") return environment.badgeEnabled;
    return environment.markerMode !== "watermark";
  }

  function normalizeNavSettings(value) {
    const source = (typeof value === "object" && value) || {};
    return { enabled: source.enabled !== false };
  }

  function resolveNavSettings(environment) {
    return normalizeNavSettings(environment && environment.navSettings);
  }

  function shouldShowNavigator(environment) {
    if (!environment) return false;
    return resolveNavSettings(environment).enabled === true;
  }

  function isValidNavUrl(url) {
    if (typeof url !== "string" || !url.trim()) return false;
    return /^https?:\/\//i.test(url) || url.startsWith("//");
  }

  function resolveGroupIdForNav(settings, rawGroupId) {
    const gid = rawGroupId || "default";
    const exists = (settings && settings.groups || []).some((g) => g.id === gid);
    return exists ? gid : "default";
  }

  function resolveGroupNameForNav(settings, gid) {
    const groups = (settings && settings.groups) || [];
    const found = groups.find((g) => g.id === gid);
    return (found && found.name) || "Default Group";
  }

  function groupedEnvironmentsForNav(settings, matchedEnv) {
    const environments = (settings && settings.environments) || [];
    const eligible = environments.filter(
      (env) => env && env.enabled !== false && isValidNavUrl(env.homepageUrl)
    );

    const byGroup = new Map();
    for (const env of eligible) {
      const gid = resolveGroupIdForNav(settings, env.groupId);
      if (!byGroup.has(gid)) byGroup.set(gid, []);
      byGroup.get(gid).push(env);
    }

    const matchedGroupId = resolveGroupIdForNav(
      settings,
      matchedEnv && matchedEnv.groupId
    );
    const orderedGroupIds = [];

    if (byGroup.has(matchedGroupId)) {
      orderedGroupIds.push(matchedGroupId);
    }
    const groups = (settings && settings.groups) || [];
    for (const g of groups) {
      if (g.id === matchedGroupId) continue;
      if (byGroup.has(g.id) && !orderedGroupIds.includes(g.id)) {
        orderedGroupIds.push(g.id);
      }
    }
    // Orphan groups not declared in settings.groups (defensive — shouldn't normally happen)
    for (const gid of byGroup.keys()) {
      if (!orderedGroupIds.includes(gid)) orderedGroupIds.push(gid);
    }

    return orderedGroupIds.map((gid) => ({
      group: { id: gid, name: resolveGroupNameForNav(settings, gid) },
      environments: byGroup.get(gid) || []
    }));
  }

  function clearAutoFill() {
    if (autoFillTimer) {
      window.clearInterval(autoFillTimer);
      autoFillTimer = null;
    }
    if (autoFillObserver) {
      autoFillObserver.disconnect();
      autoFillObserver = null;
    }
  }

  function enableBadgePeekThrough(badge) {
    let restoreListener = null;
    let restoreTimer = null;
    let peekPending = false;
    let peekActive = false;

    function isInsideBadge(clientX, clientY) {
      const rect = badge.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    }

    function cleanup() {
      peekPending = false;
      peekActive = false;
      if (restoreTimer) {
        window.clearTimeout(restoreTimer);
        restoreTimer = null;
      }
      if (restoreListener) {
        window.removeEventListener("mousemove", restoreListener, true);
        restoreListener = null;
      }
      badge.classList.remove("envmate-badge--peek");
      badge.style.pointerEvents = "";
    }

    badge.addEventListener("mouseenter", () => {
      if (peekPending || peekActive) return;
      cleanup();
      badge.classList.add("envmate-badge--peek");
      peekPending = true;
      restoreTimer = window.setTimeout(() => {
        peekPending = false;
        peekActive = true;
        badge.style.pointerEvents = "none";
        restoreListener = (event) => {
          const { clientX, clientY } = event;
          if (!isInsideBadge(clientX, clientY)) cleanup();
        };
        window.addEventListener("mousemove", restoreListener, true);
      }, 120);
    });

    badge.addEventListener("mouseleave", () => {
      if (peekActive) return;
      cleanup();
    });
  }

  function createAccountRow(account, panel) {
    const username = String(account.username || "").trim();
    const label = String(account.label || "").trim();
    const primaryText = username || label || t("accountFallback");
    const remarkText = username && label ? label : "";

    const row = document.createElement("button");
    row.type = "button";
    row.className = "envmate-capture-panel__item";
    row.classList.toggle("is-default", Boolean(account.defaultFill));
    row.title = accountDisplayLabel(account);

    const content = document.createElement("span");
    content.className = "envmate-capture-panel__content";

    const name = document.createElement("span");
    name.className = "envmate-capture-panel__name";
    name.textContent = primaryText;
    content.append(name);

    if (remarkText) {
      const remark = document.createElement("span");
      remark.className = "envmate-capture-panel__remark";
      remark.textContent = remarkText;
      content.append(remark);
    }

    row.append(content);

    const customFieldsCount = (account.customFields || []).length;
    if (customFieldsCount > 0) {
      const fields = document.createElement("span");
      fields.className = "envmate-capture-panel__fields";
      fields.textContent = String(customFieldsCount);
      fields.title = t("customFields");
      row.append(fields);
    }

    row.addEventListener("click", () => {
      try {
        fillAccount(account, { auto: false });
        showToast(account);
      } catch (_) {
        // Silent failure - do not surface error toast
      }
      if (panel) collapsePanel(panel);
    });

    return row;
  }

  function collapsePanel(panel) {
    panel.dataset.expanded = "false";
    const body = panel.querySelector(".envmate-capture-panel__body");
    if (body) body.setAttribute("hidden", "");
  }

  function syncPanelBody(panel, environment) {
    const body = panel.querySelector(".envmate-capture-panel__body");
    if (!body) return;
    body.innerHTML = "";

    if (panel.dataset.expanded !== "true") {
      body.setAttribute("hidden", "");
      return;
    }
    body.removeAttribute("hidden");

    const captureRow = document.createElement("button");
    captureRow.type = "button";
    captureRow.className = "envmate-capture-panel__capture";
    captureRow.textContent = "+ " + t("captureTitle");
    captureRow.addEventListener("click", () => {
      handleCapture().catch(() => {});
      collapsePanel(panel);
    });
    body.append(captureRow);

    const accounts = Array.isArray(environment.accounts) ? environment.accounts : [];
    if (accounts.length === 0) {
      const empty = document.createElement("div");
      empty.className = "envmate-capture-panel__empty";
      empty.textContent = t("capturePanelEmpty");
      body.append(empty);
    } else {
      const list = document.createElement("div");
      list.className = "envmate-capture-panel__list";
      accounts.forEach((account) => {
        list.append(createAccountRow(account, panel));
      });
      body.append(list);
    }
  }

  function normalizeCaptureSettings(value) {
    const source = (typeof value === "object" && value) || {};
    const validPositions = [
      "top-left", "top-center", "top-right",
      "middle-left", "middle-right",
      "bottom-left", "bottom-center", "bottom-right"
    ];
    return {
      enabled: source.enabled !== false,
      position: validPositions.includes(source.position) ? source.position : DEFAULT_CAPTURE_SETTINGS.position,
      color: typeof source.color === "string" ? source.color : DEFAULT_CAPTURE_SETTINGS.color,
      size: clamp(Number(source.size) || DEFAULT_CAPTURE_SETTINGS.size, 16, 48),
      textSize: clamp(Number(source.textSize) || DEFAULT_CAPTURE_SETTINGS.textSize, 8, 24),
      opacity: clamp(Number(source.opacity ?? DEFAULT_CAPTURE_SETTINGS.opacity), 0, 1),
      bodyWidth: clamp(Number(source.bodyWidth ?? DEFAULT_CAPTURE_SETTINGS.bodyWidth), 180, 400),
      bodyMaxHeight: clamp(Number(source.bodyMaxHeight ?? DEFAULT_CAPTURE_SETTINGS.bodyMaxHeight), 100, 600)
    };
  }

  function resolveCaptureSettings(environment) {
    return normalizeCaptureSettings(environment && environment.captureSettings);
  }

  function createCapturePanel(environment) {
    if (document.querySelector('[data-envmate-root="capture"]')) return;
    const panel = document.createElement("div");
    panel.className = "envmate-capture-panel";
    panel.dataset.envmateRoot = "capture";
    const cs = resolveCaptureSettings(environment);
    panel.dataset.position = cs.position;
    panel.dataset.expanded = "false";
    panel.style.setProperty("--envmate-capture-color", cs.color);
    panel.style.setProperty("--envmate-capture-size", `${cs.size}px`);
    panel.style.setProperty("--envmate-capture-text-size", `${cs.textSize}px`);
    panel.style.setProperty("--envmate-capture-opacity", String(cs.opacity));
    panel.style.setProperty("--envmate-capture-body-width", `${cs.bodyWidth}px`);
    panel.style.setProperty("--envmate-capture-body-max-height", `${cs.bodyMaxHeight}px`);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "envmate-capture-panel__add";
    addButton.title = t("captureTitle");
    addButton.setAttribute("aria-label", t("captureTitle"));
    addButton.textContent = "+";
    addButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const isExpanded = panel.dataset.expanded === "true";
      panel.dataset.expanded = isExpanded ? "false" : "true";
      syncPanelBody(panel, environment);
    });
    panel.append(addButton);

    const body = document.createElement("div");
    body.className = "envmate-capture-panel__body";
    body.setAttribute("hidden", "");
    panel.append(body);

    syncPanelBody(panel, environment);
    document.documentElement.append(panel);
  }

  function clearCapturePanelSync() {
    if (capturePanelSyncTimer) {
      window.clearTimeout(capturePanelSyncTimer);
      capturePanelSyncTimer = null;
    }
    if (capturePanelObserver) {
      capturePanelObserver.disconnect();
      capturePanelObserver = null;
    }
  }

  function clearNavigatorPanel() {
    detachNavigatorDismissHandlers();
    navigatorPanel = null;
    navigatorExpandedGroups = new Set();
  }

  function collapseNavigatorPanel(panel) {
    if (!panel) return;
    panel.dataset.expanded = "false";
    const body = panel.querySelector(".envmate-nav-panel__body");
    if (body) body.setAttribute("hidden", "");
  }

  function expandNavigatorPanel(panel, env, settings) {
    panel.dataset.expanded = "true";
    syncNavigatorBody(panel, env, settings);
  }

  function handleNavigatorEnvClick(envItem, panel) {
    if (!isValidNavUrl(envItem && envItem.homepageUrl)) return;
    window.open(envItem.homepageUrl, "_blank", "noopener");
    collapseNavigatorPanel(panel);
  }

  function attachNavigatorDismissHandlers(panel) {
    detachNavigatorDismissHandlers();
    navigatorOutsideClickHandler = (event) => {
      if (panel.dataset.expanded !== "true") return;
      if (!panel.contains(event.target)) {
        collapseNavigatorPanel(panel);
      }
    };
    navigatorEscapeHandler = (event) => {
      if (event.key === "Escape" && panel.dataset.expanded === "true") {
        collapseNavigatorPanel(panel);
      }
    };
    document.addEventListener("click", navigatorOutsideClickHandler, true);
    document.addEventListener("keydown", navigatorEscapeHandler);
  }

  function detachNavigatorDismissHandlers() {
    if (navigatorOutsideClickHandler) {
      document.removeEventListener("click", navigatorOutsideClickHandler, true);
      navigatorOutsideClickHandler = null;
    }
    if (navigatorEscapeHandler) {
      document.removeEventListener("keydown", navigatorEscapeHandler);
      navigatorEscapeHandler = null;
    }
  }

  function syncNavigatorBody(panel, env, settings) {
    const body = panel.querySelector(".envmate-nav-panel__body");
    if (!body) return;
    body.innerHTML = "";

    if (panel.dataset.expanded !== "true") {
      body.setAttribute("hidden", "");
      return;
    }
    body.removeAttribute("hidden");

    const groups = groupedEnvironmentsForNav(settings, env);
    if (groups.length === 0) {
      const empty = document.createElement("div");
      empty.className = "envmate-nav-panel__empty";
      empty.textContent = t("navPanelEmpty");
      body.append(empty);
      return;
    }

    const matchedEnvId = env && env.id;

    groups.forEach(({ group, environments }) => {
      const groupEl = document.createElement("div");
      groupEl.className = "envmate-nav-panel__group";

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "envmate-nav-panel__group-toggle";
      const isExpanded = navigatorExpandedGroups.has(group.id);
      toggle.dataset.expanded = isExpanded ? "true" : "false";
      toggle.textContent = group.name;
      toggle.addEventListener("click", () => {
        if (navigatorExpandedGroups.has(group.id)) {
          navigatorExpandedGroups.delete(group.id);
        } else {
          navigatorExpandedGroups.add(group.id);
        }
        syncNavigatorBody(panel, env, settings);
      });
      groupEl.append(toggle);

      if (isExpanded) {
        const list = document.createElement("div");
        list.className = "envmate-nav-panel__group-list";
        environments.forEach((envItem) => {
          list.append(
            createNavigatorEnvRow(envItem, envItem.id === matchedEnvId, panel)
          );
        });
        groupEl.append(list);
      }

      body.append(groupEl);
    });
  }

  function createNavigatorEnvRow(envItem, isCurrent, panel) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "envmate-nav-panel__env";
    if (isCurrent) row.classList.add("envmate-nav-panel__env--current");

    const head = document.createElement("span");
    head.className = "envmate-nav-panel__env-head";

    const name = document.createElement("span");
    name.className = "envmate-nav-panel__env-name";
    name.textContent = envItem.name || envItem.badge || envItem.homepageUrl;
    head.append(name);

    if (envItem.badge) {
      const badge = document.createElement("span");
      badge.className = "envmate-nav-panel__env-badge";
      badge.textContent = envItem.badge;
      badge.style.setProperty(
        "--envmate-nav-env-badge-bg",
        envItem.badgeColor || "#2563eb"
      );
      badge.style.setProperty(
        "--envmate-nav-env-badge-fg",
        envItem.badgeTextColor || "#ffffff"
      );
      head.append(badge);
    }

    row.append(head);

    if (isCurrent) {
      const tag = document.createElement("span");
      tag.className = "envmate-nav-panel__env-current";
      tag.textContent = t("navCurrentLabel");
      row.append(tag);
    }

    row.addEventListener("click", (event) => {
      event.stopPropagation();
      handleNavigatorEnvClick(envItem, panel);
    });

    return row;
  }

  function createNavigatorPanel(env, settings) {
    const groups = groupedEnvironmentsForNav(settings, env);
    if (groups.length === 0) return;

    document
      .querySelectorAll('[data-envmate-root="navigator"]')
      .forEach((node) => node.remove());

    const panel = document.createElement("div");
    panel.className = "envmate-nav-panel";
    panel.dataset.envmateRoot = "navigator";

    const bgColor = (env && env.badgeColor) || NAV_FALLBACK_BG;
    const fgColor = (env && env.badgeTextColor) || NAV_FALLBACK_FG;
    panel.style.setProperty("--envmate-nav-bg", bgColor);
    panel.style.setProperty("--envmate-nav-fg", fgColor);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "envmate-nav-panel__button";
    button.title = t("navButtonTitle");
    button.setAttribute("aria-label", t("navButtonTitle"));
    button.innerHTML = NAV_ICON_SVG;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (panel.dataset.expanded === "true") {
        collapseNavigatorPanel(panel);
      } else {
        expandNavigatorPanel(panel, env, settings);
      }
    });
    panel.append(button);

    const body = document.createElement("div");
    body.className = "envmate-nav-panel__body";
    body.setAttribute("hidden", "");
    panel.append(body);

    panel.dataset.expanded = "false";
    navigatorExpandedGroups = new Set();
    navigatorExpandedGroups.add(resolveGroupIdForNav(settings, env && env.groupId));

    attachNavigatorDismissHandlers(panel);
    document.documentElement.append(panel);
    navigatorPanel = panel;
  }

  function syncCapturePanelVisibility(environment = activeEnvironment) {
    capturePanelSyncTimer = null;
    if (!environment) {
      removeCapturePanels();
      return;
    }

    const shouldShow = shouldShowCaptureButton(environment, resolveLoginInputs());
    const existingPanel = document.querySelector('[data-envmate-root="capture"]');
    if (shouldShow) {
      if (!existingPanel) createCapturePanel(environment);
      return;
    }
    if (existingPanel) removeCapturePanels();
  }

  function scheduleCapturePanelSync(environment = activeEnvironment) {
    if (!environment) return;
    if (capturePanelSyncTimer) window.clearTimeout(capturePanelSyncTimer);
    capturePanelSyncTimer = window.setTimeout(() => {
      syncCapturePanelVisibility(environment);
    }, 160);
  }

  function startCapturePanelSync(environment) {
    clearCapturePanelSync();
    syncCapturePanelVisibility(environment);
    const root = document.body || document.documentElement;
    if (!root) return;
    capturePanelObserver = new MutationObserver(() => {
      scheduleCapturePanelSync(environment);
    });
    capturePanelObserver.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden", "type", "disabled", "readonly", "aria-hidden"]
    });
  }

  function createBadge(environment, settings) {
    const badge = document.createElement("div");
    badge.className = "envmate-badge";
    badge.dataset.envmateRoot = "badge";
    badge.dataset.position = environment.badgePosition || "top-right";
    badge.dataset.style = environment.badgeStyle || "slanted";
    badge.style.setProperty("--envmate-color", environment.badgeColor || environment.color || "#2563eb");
    badge.style.setProperty("--envmate-text-color", environment.badgeTextColor || environment.textColor || "#ffffff");
    badge.style.setProperty("--envmate-badge-offset", "12px");
    badge.style.setProperty("--envmate-badge-opacity", environment.badgeOpacity ?? 1);
    badge.style.setProperty("--envmate-badge-scale", environment.badgeScale ?? 1);
    badge.style.setProperty("--envmate-badge-size", `${environment.badgeSize ?? 14}px`);
    badge.title = t("markerTitle");

    const name = document.createElement("span");
    name.className = "envmate-badge__name";
    name.textContent = markerLabel(environment);
    badge.append(name);

    enableBadgePeekThrough(badge);
    document.documentElement.append(badge);
  }

  function createWatermark(environment) {
    const label = watermarkLabel(environment);
    const wrap = document.createElement("div");
    wrap.className = "envmate-watermark";
    wrap.dataset.envmateRoot = "watermark";
    wrap.style.setProperty("--envmate-watermark-color", environment.watermarkColor || environment.color || "#2563eb");
    wrap.style.setProperty("--envmate-watermark-opacity", environment.watermarkOpacity ?? 0.08);
    wrap.style.setProperty("--envmate-watermark-angle", `${environment.watermarkAngle ?? -24}deg`);
    wrap.style.setProperty("--envmate-watermark-size", `${environment.watermarkSize ?? 42}px`);
    wrap.style.setProperty("--envmate-watermark-gap", `${environment.watermarkGap ?? 80}px`);

    const grid = document.createElement("div");
    grid.className = "envmate-watermark__grid";
    for (let index = 0; index < 36; index += 1) {
      const item = document.createElement("div");
      item.className = "envmate-watermark__item";
      item.textContent = label;
      grid.append(item);
    }

    wrap.append(grid);
    document.documentElement.append(wrap);
  }

  function applyMarkers(settings) {
    activeSettings = settings;
    clearCapturePanelSync();
    clearNavigatorPanel();
    removeMarkers();
    clearAutoFill();

    const environment = findEnvironment(settings, window.location.href);
    activeEnvironment = environment || null;
    if (!environment) {
      autoFillKey = "";
      return;
    }

    applyTitle(environment);
    if (shouldShowWatermark(environment)) createWatermark(environment);
    if (shouldShowBadge(environment)) createBadge(environment, settings);
    startCapturePanelSync(environment);
    scheduleDefaultFill(environment);
    if (shouldShowNavigator(environment)) {
      createNavigatorPanel(environment, settings);
    }
  }

  function refreshForCurrentUrl() {
    if (!activeSettings) return;
    if (lastUrl === window.location.href) return;
    lastUrl = window.location.href;
    applyMarkers(activeSettings);
  }

  function wrapHistoryMethod(methodName) {
    const original = window.history[methodName];
    window.history[methodName] = function (...args) {
      const result = original.apply(this, args);
      setTimeout(refreshForCurrentUrl, 0);
      return result;
    };
  }

  function isVisibleInput(input) {
    if (!input || input.disabled || input.readOnly) return false;
    const rect = input.getBoundingClientRect();
    const style = window.getComputedStyle(input);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
  }

  function findInput(candidates) {
    for (const selector of candidates) {
      const input = document.querySelector(selector);
      if (isVisibleInput(input)) return input;
    }
    return null;
  }

  function visibleInputs() {
    return Array.from(document.querySelectorAll("input, textarea")).filter(isVisibleInput);
  }

  function inferInputs() {
    const inputs = visibleInputs();
    const passwordInputs = inputs.filter((input) => input.matches('input[type="password"]'));
    const usernameInputs = inputs.filter((input) => {
      const type = (input.getAttribute("type") || "text").toLowerCase();
      return !["password", "hidden", "checkbox", "radio", "submit", "button", "reset", "file", "image"].includes(type);
    });

    return {
      usernameInput: usernameInputs[0] || null,
      passwordInput: passwordInputs[0] || null,
      usernameCandidates: usernameInputs.length,
      passwordCandidates: passwordInputs.length
    };
  }

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function tokenizeInput(input) {
    if (!input) return "";
    const labelText = input.labels ? Array.from(input.labels).map((label) => label.textContent || "").join(" ") : "";
    return normalizeText([
      input.getAttribute("name"),
      input.getAttribute("id"),
      input.getAttribute("class"),
      input.getAttribute("placeholder"),
      input.getAttribute("aria-label"),
      input.getAttribute("autocomplete"),
      labelText
    ].join(" "));
  }

  function findSubmitControl(root) {
    if (!root) return null;
    return root.querySelector(
      'button[type="submit"], input[type="submit"], button, [role="button"], .btn, .button'
    );
  }

  function authContextText(input) {
    if (!input) return "";
    const form = input.closest("form");
    const submit = findSubmitControl(form || input.closest('[role="dialog"], .modal, .dialog, main, section, article') || document.body);
    return normalizeText([
      form?.getAttribute("id"),
      form?.getAttribute("name"),
      form?.getAttribute("class"),
      form?.getAttribute("action"),
      submit?.textContent,
      submit?.getAttribute("aria-label"),
      document.title
    ].join(" "));
  }

  function inputMatchesKeywords(input, keywords) {
    if (!input) return false;
    return keywords.test(tokenizeInput(input));
  }

  function hasAuthContext(input) {
    return /(login|log in|signin|sign in|auth|sso|登录|登陆|认证)/i.test(authContextText(input));
  }

  function findCustomFieldInput(field, usedInputs) {
    if (!field) return null;

    // 1. Explicit CSS selector - authoritative, no fallback to keyword matching.
    //    Once a user configures a selector they have taken explicit control; if it
    //    does not yield a usable input we return null and let the toast surface
    //    "N unmatched" rather than silently filling a different input.
    const selector = String(field.selector || "").trim();
    if (selector) {
      try {
        const input = document.querySelector(selector);
        if (
          input &&
          !input.disabled &&
          !input.readOnly &&
          !usedInputs.has(input)
        ) {
          return input;
        }
      } catch (_) {
        // Invalid selector syntax - treat as no match.
      }
      return null;
    }

    // 2. Keyword auto-match (substring on tokenized input attributes)
    const keyword = String(field.key || "").trim().toLowerCase();
    if (!keyword) return null;

    return (
      visibleInputs().find((input) => {
        if (usedInputs.has(input)) return false;
        return tokenizeInput(input).includes(keyword);
      }) || null
    );
  }

  function deriveCustomFieldKey(input) {
    if (input.labels && input.labels.length) {
      const labelText = Array.from(input.labels)
        .map((label) => label.textContent || "")
        .join(" ")
        .trim();
      if (labelText) return truncate(labelText, 32);
    }
    const aria = input.getAttribute("aria-label");
    if (aria && aria.trim()) return truncate(aria.trim(), 32);
    const placeholder = input.getAttribute("placeholder");
    if (placeholder && placeholder.trim()) return truncate(placeholder.trim(), 32);
    const name = input.getAttribute("name");
    if (name && name.trim()) return truncate(name.trim(), 32);
    return input.id || t("captureFallbackKey");
  }

  function captureCustomFields(resolved) {
    const { usernameInput, passwordInput } = resolved;
    const exclude = new Set([usernameInput, passwordInput].filter(Boolean));
    const excludedTypes = new Set([
      "checkbox",
      "radio",
      "hidden",
      "submit",
      "button",
      "reset",
      "file",
      "image",
      "password",
      "range",
      "color"
    ]);

    return visibleInputs()
      .filter((input) => !exclude.has(input))
      .filter((input) => {
        const type = (input.getAttribute("type") || "text").toLowerCase();
        return !excludedTypes.has(type);
      })
      .filter((input) => Boolean(input.value))
      .map((input) => ({
        id: uid("field"),
        key: deriveCustomFieldKey(input),
        value: input.value,
        selector: ""
      }));
  }

  function isSameForm(left, right) {
    if (!left || !right) return false;
    return left.closest("form") && left.closest("form") === right.closest("form");
  }

  function resolveLoginInputs() {
    const inferred = inferInputs();
    const usernameInput = findInput([
      'input[name="username"]',
      'input[name="user"]',
      'input[name="account"]',
      'input[name="login"]',
      'input[name="loginName"]',
      'input[name="login_name"]',
      'input[name="email"]',
      'input[id*="username" i]',
      'input[id*="user" i]',
      'input[id*="account" i]',
      'input[id*="login" i]',
      'input[id*="email" i]',
      'input[class*="username" i]',
      'input[class*="account" i]',
      'input[class*="login" i]',
      'input[type="email"]',
      'input[autocomplete="username"]',
      'input[placeholder*="用户名"]',
      'input[placeholder*="账号"]',
      'input[placeholder*="账户"]',
      'input[placeholder*="登录名"]',
      'input[placeholder*="手机号"]',
      'input[placeholder*="手机"]',
      'input[placeholder*="工号"]',
      'input[placeholder*="邮箱"]',
      'input[placeholder*="User" i]',
      'input[placeholder*="Account" i]',
      'input[placeholder*="Login" i]',
      'input[type="text"]',
      'input[type="tel"]',
      "input:not([type])",
      "textarea"
    ]) || inferred.usernameInput;
    const passwordInput = findInput([
      'input[type="password"]',
      'input[name="password"]',
      'input[name="passwd"]',
      'input[name="pwd"]',
      'input[id*="password" i]',
      'input[id*="passwd" i]',
      'input[id*="pwd" i]',
      'input[autocomplete="current-password"]',
      'input[placeholder*="密码"]',
      'input[placeholder*="Password" i]'
    ]) || inferred.passwordInput;

    return {
      usernameInput,
      passwordInput,
      usernameCandidates: inferred.usernameCandidates,
      passwordCandidates: inferred.passwordCandidates
    };
  }

  function isLikelyLoginForm(usernameInput, passwordInput) {
    if (!passwordInput) return false;

    const usernameLooksExplicit = inputMatchesKeywords(
      usernameInput,
      /(username|user|account|login|email|phone|mobile|tel|用户名|账号|账户|登录名|邮箱|手机|工号)/i
    );
    const passwordLooksExplicit = inputMatchesKeywords(passwordInput, /(password|passwd|pwd|密码)/i);
    const sharedForm = isSameForm(usernameInput, passwordInput);
    const contextMatches = hasAuthContext(passwordInput) || hasAuthContext(usernameInput);

    return Boolean(passwordLooksExplicit && (sharedForm || usernameLooksExplicit || contextMatches));
  }

  function setInputValue(input, value) {
    const prototype = input instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
    if (setter) {
      setter.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function showToast(account, unmatchedCount = 0) {
    document.querySelectorAll('[data-envmate-root="toast"]').forEach((node) => node.remove());
    const toast = document.createElement("div");
    toast.className = "envmate-toast";
    toast.dataset.envmateRoot = "toast";
    toast.style.setProperty("--envmate-color", activeEnvironment?.badgeColor || activeEnvironment?.color || "#2563eb");

    const title = document.createElement("div");
    title.className = "envmate-toast__title";
    title.textContent = t("defaultFill");

    const detail = document.createElement("div");
    detail.className = "envmate-toast__detail";
    const baseLabel = accountDisplayLabel(account);
    detail.textContent = unmatchedCount > 0
      ? `${baseLabel} (${t("customFieldsUnmatchedSuffix", [String(unmatchedCount)])})`
      : baseLabel;

    toast.append(title, detail);
    document.documentElement.append(toast);
    window.setTimeout(() => toast.remove(), 2200);
  }

  function showCaptureToast(mode, captured) {
    document.querySelectorAll('[data-envmate-root="toast"]').forEach((node) => node.remove());
    const toast = document.createElement("div");
    toast.className = "envmate-toast";
    toast.dataset.envmateRoot = "toast";
    toast.style.setProperty(
      "--envmate-color",
      activeEnvironment?.badgeColor || activeEnvironment?.color || "#2563eb"
    );

    const title = document.createElement("div");
    title.className = "envmate-toast__title";
    title.textContent = t("captureToastTitle");

    const username = (captured?.username || "").trim() || t("accountFallback");
    let message;
    if (mode === "captured") {
      const fieldCount = (captured?.customFields || []).length;
      message =
        fieldCount > 0
          ? t("captureToastCapturedWithFields", [username, String(fieldCount)])
          : t("captureToastCaptured", [username]);
    } else if (mode === "duplicate") {
      message = t("captureToastDuplicate", [username]);
    } else {
      message = t("captureToastEmpty");
    }

    const detail = document.createElement("div");
    detail.className = "envmate-toast__detail";
    detail.textContent = message;

    toast.append(title, detail);
    document.documentElement.append(toast);
    window.setTimeout(() => toast.remove(), 2200);
  }

  async function handleCapture() {
    try {
      const resolved = resolveLoginInputs();
      const { usernameInput, passwordInput } = resolved;
      const captured = {
        username: usernameInput?.value || "",
        password: passwordInput?.value || "",
        customFields: captureCustomFields(resolved)
      };

      const result = await chrome.storage.local.get([STORAGE_KEY]);
      const settings = result[STORAGE_KEY];
      if (!settings || !activeEnvironment) return;

      const env = (settings.environments || []).find(
        (item) => item.id === activeEnvironment.id
      );
      if (!env) return;

      const username = captured.username.trim();
      const accounts = env.accounts || [];
      if (username && accounts.some((account) => (account.username || "").trim() === username)) {
        showCaptureToast("duplicate", captured);
        return;
      }

      if (!username && !captured.password && !captured.customFields.length) {
        showCaptureToast("empty", captured);
        return;
      }

      const newAccount = {
        id: uid("account"),
        label: "",
        username: captured.username,
        password: captured.password,
        defaultFill: false,
        customFields: captured.customFields
      };
      env.accounts = [...accounts, newAccount];

      await chrome.storage.local.set({ [STORAGE_KEY]: settings });
      showCaptureToast("captured", captured);
    } catch (_) {
      // Silent failure per spec 4.1 - storage errors etc. do not surface a toast
    }
  }

  function fillAccount(account, options = {}) {
    const { auto = false } = options;
    const resolved = resolveLoginInputs();
    const { usernameInput, passwordInput } = resolved;

    if (auto && !isLikelyLoginForm(usernameInput, passwordInput)) {
      return {
        usernameFilled: false,
        passwordFilled: false,
        customFieldsFilled: [],
        usernameCandidates: resolved.usernameCandidates,
        passwordCandidates: resolved.passwordCandidates
      };
    }

    if (usernameInput && account.username) setInputValue(usernameInput, account.username);
    if (passwordInput && account.password) setInputValue(passwordInput, account.password);

    // Custom fields use a stricter gate than username/password above:
    // they require isLikelyLoginForm even on manual popup clicks, since
    // custom fields are new and we default to a conservative safety posture.
    const customFieldsFilled = [];
    if (isLikelyLoginForm(usernameInput, passwordInput)) {
      const usedInputs = new Set([usernameInput, passwordInput].filter(Boolean));
      for (const field of account.customFields || []) {
        if (!field.value) continue;
        const input = findCustomFieldInput(field, usedInputs);
        if (input) {
          setInputValue(input, field.value);
          usedInputs.add(input);
          customFieldsFilled.push({ id: field.id, filled: true });
        } else {
          customFieldsFilled.push({ id: field.id, filled: false });
        }
      }
    }

    return {
      usernameFilled: Boolean(usernameInput && account.username),
      passwordFilled: Boolean(passwordInput && account.password),
      customFieldsFilled,
      usernameCandidates: resolved.usernameCandidates,
      passwordCandidates: resolved.passwordCandidates
    };
  }

  function scheduleDefaultFill(environment) {
    const account = (environment.accounts || []).find((item) => item.defaultFill);
    if (!account) return;

    const nextKey = `${environment.id || environment.name}:${account.id || account.username}:${window.location.href}`;
    if (autoFillKey === nextKey) return;
    autoFillKey = nextKey;

    let attempts = 0;
    const tryFill = () => {
      attempts += 1;
      const result = fillAccount(account, { auto: true });
      if (result.usernameFilled || result.passwordFilled) {
        const unmatchedCount = (result.customFieldsFilled || []).filter((r) => !r.filled).length;
        showToast(account, unmatchedCount);
        clearAutoFill();
        return true;
      }
      if (attempts >= 24) {
        clearAutoFill();
        return true;
      }
      return false;
    };

    if (tryFill()) return;

    autoFillTimer = window.setInterval(tryFill, 300);
    if (document.body) {
      autoFillObserver = new MutationObserver(() => {
        tryFill();
      });
      autoFillObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "ENVMATE_GET_PAGE_ENV") {
      sendResponse({ environment: activeEnvironment, url: window.location.href });
      return true;
    }
    if (message?.type === "ENVMATE_FILL_ACCOUNT") {
      sendResponse(fillAccount(message.account || {}));
      return true;
    }
    return false;
  });

  chrome.storage.local.get([STORAGE_KEY]).then((result) => {
    if (result[STORAGE_KEY]) applyMarkers(result[STORAGE_KEY]);
  });

  wrapHistoryMethod("pushState");
  wrapHistoryMethod("replaceState");
  window.addEventListener("popstate", () => setTimeout(refreshForCurrentUrl, 0));

  document.addEventListener("click", (event) => {
    const expandedPanel = document.querySelector(
      ".envmate-capture-panel[data-expanded='true']"
    );
    if (!expandedPanel) return;
    if (expandedPanel.contains(event.target)) return;
    collapsePanel(expandedPanel);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const expandedPanel = document.querySelector(
      ".envmate-capture-panel[data-expanded='true']"
    );
    if (!expandedPanel) return;
    collapsePanel(expandedPanel);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes[STORAGE_KEY]) {
      applyMarkers(changes[STORAGE_KEY].newValue);
    }
  });
})();
