const STORAGE_KEY = "envmarkSettings";
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
const DEFAULT_GROUP_ID = "default";
const SAMPLE_GROUP_ID = "sample";
const DEFAULT_TEMPLATE_GROUP_ID = "default-templates";
const ENVIRONMENT_COLOR_PRESETS = ["#2563eb", "#059669", "#dc2626", "#7c3aed", "#ea580c", "#0f766e", "#db2777", "#4f46e5"];
const TEXT_COLOR_PRESETS = ["#ffffff", "#f8fafc", "#e2e8f0", "#111827", "#0f172a", "#334155"];
const EXPORTED_PASSWORD_SCHEME = "emsec";
const EXPORTED_PASSWORD_VERSION = "v1";
const EXPORTED_PASSWORD_KEY_V1 = "EnvMark export password v1";
const LUCIDE_ICON_ATTRS = {
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2"
};
const LUCIDE_ICON_NODES = {
  plus: [
    ["path", { d: "M12 5v14" }],
    ["path", { d: "M5 12h14" }]
  ],
  flaskConical: [
    ["path", { d: "M10 2v7.31" }],
    ["path", { d: "M14 9.3V2" }],
    ["path", { d: "M8.5 2h7" }],
    ["path", { d: "M14 9.3a6.5 6.5 0 1 1-4 0" }],
    ["path", { d: "M5.58 16h12.85" }]
  ],
  download: [
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["path", { d: "m7 10 5 5 5-5" }],
    ["path", { d: "M12 15V3" }]
  ],
  upload: [
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["path", { d: "M17 8l-5-5-5 5" }],
    ["path", { d: "M12 3v12" }]
  ],
  save: [
    ["path", { d: "M15.2 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.8Z" }],
    ["path", { d: "M17 21v-8H7v8" }],
    ["path", { d: "M7 3v5h8" }]
  ],
  badgeHelp: [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M9.09 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" }],
    ["path", { d: "M12 17h.01" }]
  ],
  edit: [
    ["path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }],
    ["path", { d: "M18.5 2.5a2.12 2.12 0 1 1 3 3L12 15l-4 1 1-4Z" }]
  ],
  trash: [
    ["path", { d: "M3 6h18" }],
    ["path", { d: "M8 6V4h8v2" }],
    ["path", { d: "M19 6l-1 14H6L5 6" }],
    ["path", { d: "M10 11v6" }],
    ["path", { d: "M14 11v6" }]
  ],
  copy: [
    ["rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }],
    ["path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }]
  ],
  x: [
    ["path", { d: "M18 6 6 18" }],
    ["path", { d: "m6 6 12 12" }]
  ],
  eye: [
    ["path", { d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }],
    ["circle", { cx: "12", cy: "12", r: "3" }]
  ],
  eyeOff: [
    ["path", { d: "M10.733 5.076A10.744 10.744 0 0 1 12 5c4.642 0 8.73 2.965 9.938 7a10.523 10.523 0 0 1-1.441 2.497" }],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242" }],
    ["path", { d: "M17.479 17.499A10.75 10.75 0 0 1 12 19c-4.642 0-8.73-2.965-9.938-7a10.523 10.523 0 0 1 4.446-5.143" }],
    ["path", { d: "m2 2 20 20" }]
  ],
  power: [
    ["path", { d: "M12 2v10" }],
    ["path", { d: "M18.4 6.6a9 9 0 1 1-12.8 0" }]
  ]
};

function createSampleSettings() {
  return {
    groups: [{ id: DEFAULT_GROUP_ID, name: t("defaultGroup") }],
    environments: [],
    templateGroups: [{ id: DEFAULT_TEMPLATE_GROUP_ID, name: t("defaultTemplateGroup"), templates: [] }]
  };
}

const nodes = {
  list: document.querySelector("#environment-list"),
  status: document.querySelector("#status"),
  addGroup: document.querySelector("#add-group"),
  addTemplateGroup: document.querySelector("#add-template-group"),
  saveTemplateFromEnv: document.querySelector("#save-template-from-env"),
  deleteEnvironment: document.querySelector("#delete-environment"),
  save: document.querySelector("#save-config"),
  exportConfig: document.querySelector("#export-config"),
  importConfigTrigger: document.querySelector("#import-config-trigger"),
  aboutTrigger: document.querySelector("#about-trigger"),
  importConfig: document.querySelector("#import-config"),
  localeSwitcher: document.querySelector("#locale-switcher"),
  environmentSearch: document.querySelector("#environment-search"),
  loadSample: document.querySelector("#load-sample"),
  addRule: document.querySelector("#add-rule"),
  addAccount: document.querySelector("#add-account"),
  form: document.querySelector("#environment-form"),
  name: document.querySelector("#env-name"),
  group: document.querySelector("#env-group"),
  homepageUrl: document.querySelector("#env-homepage-url"),
  badge: document.querySelector("#env-badge"),
  badgeEnabled: document.querySelector("#env-badge-enabled"),
  enabled: document.querySelector("#env-enabled"),
  enabledLabel: document.querySelector("#env-enabled-label"),
  titlePrefix: document.querySelector("#env-title-prefix"),
  rules: document.querySelector("#rules-list"),
  accounts: document.querySelector("#accounts-list"),
  basicValidation: document.querySelector("#basic-validation"),
  accountsValidation: document.querySelector("#accounts-validation"),
  badgeColor: document.querySelector("#badge-color"),
  badgeColorSwatches: document.querySelector("#badge-color-swatches"),
  badgeTextColor: document.querySelector("#badge-text-color"),
  badgeTextColorSwatches: document.querySelector("#badge-text-color-swatches"),
  badgePosition: document.querySelector("#badge-position"),
  badgeStyleOptions: Array.from(document.querySelectorAll("input[name='badge-style']")),
  badgeScale: document.querySelector("#badge-scale"),
  badgeSize: document.querySelector("#badge-size"),
  badgeOpacity: document.querySelector("#badge-opacity"),
  watermarkText: document.querySelector("#env-watermark-text"),
  watermarkColor: document.querySelector("#watermark-color"),
  watermarkColorSwatches: document.querySelector("#watermark-color-swatches"),
  watermarkEnabled: document.querySelector("#env-watermark-enabled"),
  watermarkOpacity: document.querySelector("#watermark-opacity"),
  watermarkAngle: document.querySelector("#watermark-angle"),
  watermarkSize: document.querySelector("#watermark-size"),
  watermarkGap: document.querySelector("#watermark-gap"),
  badgePreviewSurface: document.querySelector("#badge-preview-surface"),
  watermarkPreviewSurface: document.querySelector("#watermark-preview-surface"),
  sectionNavButtons: Array.from(document.querySelectorAll("[data-scroll-target]")),
  workspaceShell: document.querySelector(".workspace-shell"),
  toolbox: document.querySelector("#workspace-toolbox"),
  modalBackdrop: document.querySelector("#selection-modal-backdrop"),
  exportModal: document.querySelector("#export-modal"),
  exportModalClose: document.querySelector("#export-modal-close"),
  exportModalCancel: document.querySelector("#export-modal-cancel"),
  exportModalConfirm: document.querySelector("#export-modal-confirm"),
  exportSelectionList: document.querySelector("#export-selection-list"),
  importModal: document.querySelector("#import-modal"),
  importModalClose: document.querySelector("#import-modal-close"),
  importModalCancel: document.querySelector("#import-modal-cancel"),
  importModalConfirm: document.querySelector("#import-modal-confirm"),
  importSelectionList: document.querySelector("#import-selection-list"),
  importDropzone: document.querySelector("#import-dropzone"),
  importDropzoneDetail: document.querySelector("#import-dropzone-detail"),
  aboutModal: document.querySelector("#about-modal"),
  aboutModalClose: document.querySelector("#about-modal-close"),
  aboutModalConfirm: document.querySelector("#about-modal-confirm"),
  aboutWechatSection: document.querySelector("#about-wechat-section"),
  envCaptureEditor: document.querySelector("#env-capture-editor"),
  envNavEditor: document.querySelector("#env-nav-editor"),
  templateGroupList: document.querySelector("#template-group-list")
};

const t = window.envmarkI18n.t;

let settings = createSampleSettings();
let savedSettingsSnapshot = clone(settings);
let selectedId = null;
let selectedGroupId = DEFAULT_GROUP_ID;
let isRendering = false;
let activeSectionId = "section-basic";
let hasUnsavedChanges = false;
let scrollTargetLockId = "";
let scrollSettleTimer = 0;
let draggingAccountId = "";
let draggingEnvironmentId = "";
let environmentSearchQuery = "";
let collapsedGroupIds = new Set();
let expandedCustomFieldsAccountId = "";
let autofocusCustomFieldId = "";
let exportSelectionState = null;
let importPreviewSettings = null;
let importSelectionState = null;
let activeModalName = "";

function syncLocaleSwitcher() {
  if (!nodes.localeSwitcher || !window.envmarkI18n?.getLocaleChoice) return;
  const localeChoice = window.envmarkI18n.getLocaleChoice();
  if (localeChoice === "auto") {
    const browserLocale = chrome.i18n.getUILanguage();
    nodes.localeSwitcher.value = String(browserLocale || "").toLowerCase().startsWith("zh") ? "zh_CN" : "en";
    return;
  }
  nodes.localeSwitcher.value = localeChoice;
}

function isChineseUi() {
  return String(document.documentElement.lang || "").toLowerCase().startsWith("zh");
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function pickEnvironmentColor() {
  return ENVIRONMENT_COLOR_PRESETS[Math.floor(Math.random() * ENVIRONMENT_COLOR_PRESETS.length)];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return window.btoa(binary);
}

function base64ToBytes(value) {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function encodeExportedPasswordV1(value) {
  if (!value) return "";
  const source = new TextEncoder().encode(String(value));
  const key = new TextEncoder().encode(EXPORTED_PASSWORD_KEY_V1);
  const mixed = new Uint8Array(source.length);
  for (let index = 0; index < source.length; index += 1) {
    mixed[index] = source[index] ^ key[index % key.length] ^ ((index * 29 + 17) & 0xff);
  }
  return bytesToBase64(mixed);
}

function decodeExportedPasswordV1(payload) {
  const mixed = base64ToBytes(payload);
  const key = new TextEncoder().encode(EXPORTED_PASSWORD_KEY_V1);
  const source = new Uint8Array(mixed.length);
  for (let index = 0; index < mixed.length; index += 1) {
    source[index] = mixed[index] ^ key[index % key.length] ^ ((index * 29 + 17) & 0xff);
  }
  return new TextDecoder().decode(source);
}

function obfuscateExportedPassword(value) {
  if (!value) return "";
  const payload = encodeExportedPasswordV1(value);
  return `${EXPORTED_PASSWORD_SCHEME}:${EXPORTED_PASSWORD_VERSION}:${payload}`;
}

function revealImportedPassword(value) {
  if (!value) return "";
  if (typeof value !== "string") throw new Error(t("invalidImportedPassword"));
  const [scheme, version, ...payloadParts] = value.split(":");
  const payload = payloadParts.join(":");
  if (!scheme || !version || !payload || scheme !== EXPORTED_PASSWORD_SCHEME) {
    throw new Error(t("invalidImportedPassword"));
  }
  try {
    if (version === "v1") return decodeExportedPasswordV1(payload);
    throw new Error(t("invalidImportedPassword"));
  } catch (_) {
    throw new Error(t("invalidImportedPassword"));
  }
}

function buildExportSettings(sourceSettings = settings) {
  const next = clone(sourceSettings);
  next.environments = (next.environments || []).map((environment) => ({
    ...environment,
    accounts: Array.isArray(environment.accounts)
      ? environment.accounts.map((account) => ({
          ...account,
          password: obfuscateExportedPassword(account.password || ""),
          customFields: Array.isArray(account.customFields)
            ? account.customFields.map((field) => ({
                ...field,
                value: obfuscateExportedPassword(field.value || "")
              }))
            : []
        }))
      : []
  }));
  return next;
}

function decodeImportedSettings(value) {
  const next = clone(value);
  next.environments = (next.environments || []).map((environment) => ({
    ...environment,
    accounts: Array.isArray(environment.accounts)
      ? environment.accounts.map((account) => ({
          ...account,
          password: revealImportedPassword(account.password || ""),
          customFields: Array.isArray(account.customFields)
            ? account.customFields.map((field) => ({
                ...field,
                value: revealImportedPassword(field.value || "")
              }))
            : []
        }))
      : []
  }));
  return next;
}

function groupedEnvironments(sourceSettings) {
  return (sourceSettings.groups || [])
    .map((group) => ({
      id: group.id,
      name: group.name,
      environments: (sourceSettings.environments || []).filter((environment) => environment.groupId === group.id)
    }))
    .filter((group) => group.environments.length > 0);
}

function createSelectionState(groups) {
  const state = { groups: {}, environments: {}, expanded: {} };
  groups.forEach((group) => {
    state.expanded[group.id] = false;
    if (!group.environments.length) {
      state.groups[group.id] = true;
      return;
    }
    group.environments.forEach((environment) => {
      state.environments[environment.id] = true;
    });
  });
  return state;
}

function selectedEnvironmentCount(group, selectionState) {
  return group.environments.filter((environment) => selectionState.environments[environment.id] !== false).length;
}

function groupSelectionStatus(group, selectionState) {
  if (!group.environments.length) {
    return {
      checked: selectionState.groups[group.id] !== false,
      indeterminate: false
    };
  }
  const selectedCount = selectedEnvironmentCount(group, selectionState);
  return {
    checked: selectedCount === group.environments.length,
    indeterminate: selectedCount > 0 && selectedCount < group.environments.length
  };
}

function selectedTreeHasValue(groups, selectionState) {
  return groups.some((group) => {
    if (!group.environments.length) return selectionState.groups[group.id] !== false;
    return selectedEnvironmentCount(group, selectionState) > 0;
  });
}

function selectedEnvironmentTotal(groups, selectionState) {
  return groups.reduce((total, group) => {
    if (!group.environments.length) return total;
    return total + selectedEnvironmentCount(group, selectionState);
  }, 0);
}

function renderSelectionTree(container, groups, selectionState, options = {}) {
  container.innerHTML = "";
  container.classList.toggle("selection-tree--empty", !groups.length);

  if (!groups.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = options.emptyText || t("selectionEmpty");
    container.append(empty);
    return;
  }

  groups.forEach((group) => {
    const groupCard = document.createElement("section");
    groupCard.className = "selection-item";

    const row = document.createElement("div");
    row.className = "selection-node selection-node--group";

    const disclosure = document.createElement("button");
    disclosure.type = "button";
    disclosure.className = "selection-disclosure";
    disclosure.disabled = !group.environments.length;
    disclosure.hidden = !group.environments.length;
    disclosure.title = selectionState.expanded[group.id] ? t("hideEnvironments") : t("showEnvironments");
    disclosure.classList.toggle("is-expanded", selectionState.expanded[group.id]);
    disclosure.addEventListener("click", () => {
      selectionState.expanded[group.id] = !selectionState.expanded[group.id];
      renderSelectionTree(container, groups, selectionState, options);
    });

    const checkLabel = document.createElement("label");
    checkLabel.className = "selection-check";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const selection = groupSelectionStatus(group, selectionState);
    checkbox.checked = selection.checked;
    checkbox.indeterminate = selection.indeterminate;

    checkbox.addEventListener("change", () => {
      if (!group.environments.length) {
        selectionState.groups[group.id] = checkbox.checked;
      } else {
        group.environments.forEach((environment) => {
          selectionState.environments[environment.id] = checkbox.checked;
        });
      }
      renderSelectionTree(container, groups, selectionState, options);
      options.onChange?.();
    });

    const summary = document.createElement("span");
    summary.className = "selection-group__summary";
    const icon = document.createElement("span");
    icon.className = "selection-icon selection-icon--group";
    icon.setAttribute("aria-hidden", "true");
    const title = document.createElement("span");
    title.className = "selection-group__title";
    title.textContent = group.name;
    const meta = document.createElement("span");
    meta.className = "selection-group__meta";
    meta.textContent = group.environments.length
      ? t("groupEnvironmentCount", [String(group.environments.length)])
      : t("emptyGroup");
    summary.append(title, meta);
    checkLabel.append(checkbox, icon, summary);

    row.append(disclosure, checkLabel);
    groupCard.append(row);

    if (group.environments.length && selectionState.expanded[group.id]) {
      const children = document.createElement("div");
      children.className = "selection-children";

      group.environments.forEach((environment) => {
        const childRow = document.createElement("div");
        childRow.className = "selection-node selection-node--child";

        const branch = document.createElement("span");
        branch.className = "selection-branch";
        branch.setAttribute("aria-hidden", "true");

        const child = document.createElement("label");
        child.className = "selection-check";
        const childCheckbox = document.createElement("input");
        childCheckbox.type = "checkbox";
        childCheckbox.checked = selectionState.environments[environment.id] !== false;
        childCheckbox.addEventListener("change", () => {
          selectionState.environments[environment.id] = childCheckbox.checked;
          renderSelectionTree(container, groups, selectionState, options);
          options.onChange?.();
        });

        const childSummary = document.createElement("span");
        childSummary.className = "selection-environment__summary";
        const childIcon = document.createElement("span");
        childIcon.className = "selection-icon selection-icon--environment";
        childIcon.setAttribute("aria-hidden", "true");
        const childTitle = document.createElement("span");
        childTitle.className = "selection-environment__title";
        childTitle.textContent = environment.name || t("environmentFallback");
        const childMeta = document.createElement("span");
        childMeta.className = "selection-environment__meta";
        childMeta.textContent = environment.rules?.[0]?.value || t("noUrlRules");
        childSummary.append(childTitle, childMeta);
        child.append(childCheckbox, childIcon, childSummary);

        childRow.append(branch, child);
        children.append(childRow);
      });

      groupCard.append(children);
    }

    container.append(groupCard);
  });
}

function buildSelectedSettings(sourceSettings, selectionState) {
  const groups = groupedEnvironments(sourceSettings);
  const nextGroups = [];
  const nextEnvironments = [];

  groups.forEach((group) => {
    const selectedEnvironments = group.environments.filter((environment) => selectionState.environments[environment.id] !== false);
    const includeGroup = group.environments.length
      ? selectedEnvironments.length > 0
      : selectionState.groups[group.id] !== false;
    if (!includeGroup) return;
    nextGroups.push({ id: group.id, name: group.name });
    nextEnvironments.push(...selectedEnvironments.map((environment) => clone(environment)));
  });

  return {
    groups: nextGroups,
    environments: nextEnvironments,
    templateGroups: clone(sourceSettings.templateGroups || [])
  };
}

function uniqueGroupNameForImport(baseName, groups) {
  if (!groups.some((group) => group.name === baseName)) return baseName;
  let suffix = 2;
  while (groups.some((group) => group.name === `${baseName} ${suffix}`)) {
    suffix += 1;
  }
  return `${baseName} ${suffix}`;
}

function mergeImportedSettings(currentSettings, importedSubset) {
  const next = clone(currentSettings);
  const groupIdMap = new Map();
  const existingEnvironmentIds = new Set((next.environments || []).map((environment) => environment.id).filter(Boolean));

  (importedSubset.groups || []).forEach((group) => {
    if (group.id === DEFAULT_GROUP_ID) {
      groupIdMap.set(group.id, DEFAULT_GROUP_ID);
      return;
    }
    const sameId = next.groups.find((item) => item.id === group.id);
    if (sameId) {
      groupIdMap.set(group.id, sameId.id);
      return;
    }
    const sameName = next.groups.find((item) => item.name === group.name);
    if (sameName) {
      groupIdMap.set(group.id, sameName.id);
      return;
    }
    const nextGroup = {
      id: group.id || uid("group"),
      name: uniqueGroupNameForImport(group.name || t("defaultGroup"), next.groups)
    };
    next.groups.push(nextGroup);
    groupIdMap.set(group.id, nextGroup.id);
  });

  (importedSubset.environments || []).forEach((environment) => {
    if (environment.id && existingEnvironmentIds.has(environment.id)) return;
    const nextEnvironment = clone(environment);
    nextEnvironment.id = environment.id || uid("env");
    nextEnvironment.groupId = groupIdMap.get(environment.groupId) || DEFAULT_GROUP_ID;
    next.environments.push(nextEnvironment);
    if (nextEnvironment.id) existingEnvironmentIds.add(nextEnvironment.id);
  });

  (importedSubset.templateGroups || []).forEach((templateGroup) => {
    const sameId = (next.templateGroups || []).find((item) => item.id === templateGroup.id);
    const sameName = (next.templateGroups || []).find((item) => item.name === templateGroup.name);
    const targetGroup = sameId || sameName;
    if (targetGroup) {
      const existingTemplateIds = new Set((targetGroup.templates || []).map((template) => template.id).filter(Boolean));
      targetGroup.templates = targetGroup.templates || [];
      (templateGroup.templates || []).forEach((template) => {
        if (template.id && existingTemplateIds.has(template.id)) return;
        targetGroup.templates.push(normalizeTemplate(template));
      });
      return;
    }
    next.templateGroups = next.templateGroups || [];
    next.templateGroups.push({
      id: templateGroup.id || uid("template-group"),
      name: templateGroup.name || t("defaultTemplateGroup"),
      templates: Array.isArray(templateGroup.templates) ? templateGroup.templates.map(normalizeTemplate) : []
    });
  });

  return next;
}

function setStatus(message, isError = false) {
  if (!nodes.status) return;
  nodes.status.textContent = message;
  nodes.status.style.color = isError ? "#dc2626" : "#64748b";
}

async function handleLocaleChange(nextLocale) {
  if (!window.envmarkI18n?.setLocaleChoice) return;
  await window.envmarkI18n.setLocaleChoice(nextLocale);
  syncLocaleSwitcher();
  render();
  if (activeModalName === "export" && exportSelectionState) {
    syncExportModalState();
  }
  if (activeModalName === "import") {
    if (importPreviewSettings && importSelectionState) {
      syncImportModalState();
    } else {
      resetImportPreview();
    }
  }
  syncAboutModalState();
  setStatus(hasUnsavedChanges ? t("unsavedChanges") : t("ready"));
}

function syncSaveButtonState() {
  if (!nodes.save) return;
  nodes.save.classList.toggle("is-dirty", hasUnsavedChanges);
  applyButtonIcon(nodes.save, "save", hasUnsavedChanges ? t("savePending") : t("save"));
}

function settingsDifferFromSavedSnapshot() {
  return JSON.stringify(settings) !== JSON.stringify(savedSettingsSnapshot);
}

function restoreSavedSettingsSnapshot() {
  settings = clone(savedSettingsSnapshot);
  hasUnsavedChanges = false;
  syncSaveButtonState();
}

async function persistSettingsSnapshot() {
  await chrome.storage.local.set({ [STORAGE_KEY]: settings });
  savedSettingsSnapshot = clone(settings);
  hasUnsavedChanges = false;
  syncSaveButtonState();
}

function setModalOpen(name, open) {
  const modalMap = {
    export: nodes.exportModal,
    import: nodes.importModal,
    about: nodes.aboutModal
  };
  const modal = modalMap[name];
  if (!modal || !nodes.modalBackdrop) return;
  modal.hidden = !open;
  nodes.modalBackdrop.hidden = !open;
  document.documentElement.classList.toggle("modal-open", open);
  document.body.classList.toggle("modal-open", open);
  activeModalName = open ? name : "";
}

function syncAboutModalState() {
  if (!nodes.aboutWechatSection) return;
  nodes.aboutWechatSection.hidden = !isChineseUi();
}

function openAboutModal() {
  syncAboutModalState();
  setModalOpen("about", true);
}

function closeAboutModal() {
  setModalOpen("about", false);
}

function syncExportModalState() {
  const groups = groupedEnvironments(settings);
  renderSelectionTree(nodes.exportSelectionList, groups, exportSelectionState, {
    onChange: syncExportModalState
  });
  const selectedCount = selectedEnvironmentTotal(groups, exportSelectionState);
  nodes.exportModalConfirm.disabled = selectedCount === 0;
  nodes.exportModalConfirm.textContent = t("exportSelectedCount", [String(selectedCount)]);
}

function openExportModal() {
  exportSelectionState = createSelectionState(groupedEnvironments(settings));
  syncExportModalState();
  setModalOpen("export", true);
}

function closeExportModal() {
  setModalOpen("export", false);
}

function resetImportPreview() {
  importPreviewSettings = null;
  importSelectionState = null;
  nodes.importSelectionList.classList.add("selection-tree--empty");
  nodes.importSelectionList.innerHTML = `<div class="empty">${t("importNoFile")}</div>`;
  nodes.importDropzoneDetail.textContent = t("importDropzoneHint");
  nodes.importModalConfirm.disabled = true;
  nodes.importModalConfirm.textContent = t("importSelectedCount", ["0"]);
}

function syncImportModalState() {
  if (!importPreviewSettings || !importSelectionState) {
    resetImportPreview();
    return;
  }
  const groups = groupedEnvironments(importPreviewSettings);
  renderSelectionTree(nodes.importSelectionList, groups, importSelectionState, {
    onChange: syncImportModalState
  });
  nodes.importSelectionList.classList.remove("selection-tree--empty");
  const selectedCount = selectedEnvironmentTotal(groups, importSelectionState);
  nodes.importModalConfirm.disabled = selectedCount === 0;
  nodes.importModalConfirm.textContent = t("importSelectedCount", [String(selectedCount)]);
}

function openImportModal() {
  nodes.importConfig.value = "";
  resetImportPreview();
  setModalOpen("import", true);
}

function closeImportModal() {
  setModalOpen("import", false);
}

async function readImportFile(file) {
  if (!file) return;
  try {
    const parsed = decodeImportedSettings(JSON.parse(await file.text()));
    importPreviewSettings = normalizeSettings(parsed);
    importSelectionState = createSelectionState(groupedEnvironments(importPreviewSettings));
    nodes.importDropzoneDetail.textContent = file.name;
    syncImportModalState();
  } catch (error) {
    resetImportPreview();
    setStatus(error.message, true);
  }
}

function confirmDiscardUnsavedChanges() {
  if (!hasUnsavedChanges) return true;
  if (!window.confirm(t("confirmUnsavedSwitch"))) return false;
  restoreSavedSettingsSnapshot();
  return true;
}

function selectEnvironment(groupId, environmentId) {
  if (groupId === selectedGroupId && environmentId === selectedId) return true;
  if (!confirmDiscardUnsavedChanges()) return false;
  selectedGroupId = groupId;
  selectedId = environmentId;
  clearAccountsValidationError();
  render();
  return true;
}

function syncEnabledLabel() {
  if (!nodes.enabled || !nodes.enabledLabel) return;
  applyInlineStatusIcon(nodes.enabledLabel, "power", nodes.enabled.checked ? t("environmentEnabledOn") : t("environmentEnabledOff"));
}

function selectedBadgeStyle() {
  return nodes.badgeStyleOptions.find((option) => option.checked)?.value || "slanted";
}

function syncBadgeStyleOptions(value) {
  nodes.badgeStyleOptions.forEach((option) => {
    option.checked = option.value === value;
  });
}

function clearAccountsValidationError() {
  if (!nodes.accountsValidation) return;
  nodes.accountsValidation.hidden = true;
  nodes.accountsValidation.textContent = "";
}

function clearAccountDropIndicators() {
  if (!nodes.accounts) return;
  nodes.accounts.querySelectorAll(".row-card.account").forEach((row) => {
    row.classList.remove("is-drag-source", "is-drop-before", "is-drop-after");
  });
}

function clearEnvironmentDropIndicators() {
  if (!nodes.list) return;
  nodes.list.querySelectorAll(".environment-group").forEach((group) => {
    group.classList.remove("is-drop-target");
  });
  nodes.list.querySelectorAll(".environment-item").forEach((item) => {
    item.classList.remove("is-drag-source", "is-drop-before", "is-drop-after");
  });
}

function setEnvironmentDropIndicator(targetItem, placement) {
  if (!nodes.list) return;
  nodes.list.querySelectorAll(".environment-item").forEach((item) => {
    const isTarget = item === targetItem;
    item.classList.toggle("is-drop-before", isTarget && placement === "before");
    item.classList.toggle("is-drop-after", isTarget && placement === "after");
  });
}

function setAccountDropIndicator(targetRow, placement) {
  if (!nodes.accounts) return;
  nodes.accounts.querySelectorAll(".row-card.account").forEach((row) => {
    const isTarget = row === targetRow;
    row.classList.toggle("is-drop-before", isTarget && placement === "before");
    row.classList.toggle("is-drop-after", isTarget && placement === "after");
  });
}

function reorderAccounts(environment, sourceId, targetId, placement) {
  const accounts = environment?.accounts || [];
  const sourceIndex = accounts.findIndex((account) => account.id === sourceId);
  const targetIndex = accounts.findIndex((account) => account.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return false;

  const [movedAccount] = accounts.splice(sourceIndex, 1);
  const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  const insertIndex = placement === "after" ? adjustedTargetIndex + 1 : adjustedTargetIndex;
  accounts.splice(insertIndex, 0, movedAccount);
  return true;
}

function moveEnvironmentToGroup(environmentId, groupId) {
  const environment = settings.environments.find((item) => item.id === environmentId);
  if (!environment || environment.groupId === groupId) return false;
  environment.groupId = ensureGroupId(groupId, settings.groups);
  return true;
}

function reorderEnvironments(sourceId, targetId, placement, nextGroupId) {
  const environments = settings.environments || [];
  const sourceIndex = environments.findIndex((environment) => environment.id === sourceId);
  const targetIndex = environments.findIndex((environment) => environment.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceId === targetId) return false;

  const [movedEnvironment] = environments.splice(sourceIndex, 1);
  movedEnvironment.groupId = ensureGroupId(nextGroupId || movedEnvironment.groupId, settings.groups);
  const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  const insertIndex = placement === "after" ? adjustedTargetIndex + 1 : adjustedTargetIndex;
  environments.splice(insertIndex, 0, movedEnvironment);
  return true;
}

function findEnvironmentByPrefixRule(prefixValue) {
  if (!prefixValue) return null;
  return settings.environments.find((environment) =>
    (environment.rules || []).some((rule) => rule.type === "prefix" && rule.value === prefixValue)
  ) || null;
}

function environmentSearchText(environment, group) {
  return [
    group?.name,
    environment.name,
    environment.badge,
    environment.watermarkText,
    environment.homepageUrl,
    ...(environment.rules || []).map((rule) => `${rule.type || "wildcard"} ${rule.value || ""}`)
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function environmentMatchesSearch(environment, group, query) {
  if (!query) return true;
  return environmentSearchText(environment, group).includes(query);
}

function accountHasInput(account) {
  return Boolean(
    String(account?.label || "").trim() ||
      String(account?.username || "").trim() ||
      String(account?.password || "").trim()
  );
}

function normalizeHomepageUrl(value) {
  return String(value || "").trim();
}

function normalizeQuickAccessTimestamp(value) {
  const nextValue = Number(value ?? 0);
  return Number.isFinite(nextValue) && nextValue > 0 ? nextValue : 0;
}

function isValidHomepageUrl(value) {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function homepageUrlFromSource(sourceUrl, fallbackUrl = "") {
  const candidates = [sourceUrl, fallbackUrl];
  for (const candidate of candidates) {
    const nextValue = String(candidate || "").trim();
    if (!nextValue) continue;
    try {
      const parsed = new URL(nextValue);
      if (!["http:", "https:"].includes(parsed.protocol)) continue;
      return `${parsed.origin}/`;
    } catch (_) {
      continue;
    }
  }
  return "";
}

function findInvalidHomepageEnvironment() {
  for (const environment of settings.environments) {
    const homepageUrl = normalizeHomepageUrl(environment.homepageUrl);
    if (homepageUrl && !isValidHomepageUrl(homepageUrl)) {
      return environment;
    }
  }
  return null;
}

function findEmptyAccount() {
  for (const environment of settings.environments) {
    const accountIndex = (environment.accounts || []).findIndex((account) => !accountHasInput(account));
    if (accountIndex !== -1) {
      return { environment, accountIndex };
    }
  }
  return null;
}

function findEmptyCustomField() {
  for (const environment of settings.environments) {
    for (const account of environment.accounts || []) {
      for (const field of account.customFields || []) {
        if (!String(field.key || "").trim() || !String(field.value || "").trim()) {
          return { environment, account, field };
        }
      }
    }
  }
  return null;
}

function showAccountsValidationError(message) {
  if (nodes.accountsValidation) {
    nodes.accountsValidation.hidden = false;
    nodes.accountsValidation.textContent = message;
  }
  const accountsSection = document.getElementById("section-accounts");
  if (accountsSection) {
    activeSectionId = "section-accounts";
    syncRailNav();
    scrollSectionIntoView(accountsSection);
  }
}

function clearBasicValidationError() {
  if (!nodes.basicValidation) return;
  nodes.basicValidation.hidden = true;
  nodes.basicValidation.textContent = "";
}

function showBasicValidationError(message) {
  if (nodes.basicValidation) {
    nodes.basicValidation.hidden = false;
    nodes.basicValidation.textContent = message;
  }
  const basicSection = document.getElementById("section-basic");
  if (basicSection) {
    activeSectionId = "section-basic";
    syncRailNav();
    scrollSectionIntoView(basicSection);
  }
}

function bindNodeEvent(node, eventName, handler) {
  if (!node) return;
  node.addEventListener(eventName, handler);
}

function syncRailNav() {
  nodes.sectionNavButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scrollTarget === activeSectionId);
  });
}

function navSections() {
  return nodes.sectionNavButtons
    .map((button) => document.getElementById(button.dataset.scrollTarget))
    .filter(Boolean);
}

function sectionAnchorOffset() {
  return 112;
}

function scrollSectionIntoView(section) {
  const top = window.scrollY + section.getBoundingClientRect().top - sectionAnchorOffset();
  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth"
  });
}

function currentSectionFromScroll() {
  const sections = navSections();
  if (!sections.length) return null;

  const anchor = sectionAnchorOffset();
  let current = sections[0];

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= anchor) {
      current = section;
    }
    if (rect.top <= anchor && rect.bottom >= anchor) {
      return section;
    }
  }

  return current;
}

function clearScrollSettleTimer() {
  if (!scrollSettleTimer) return;
  window.clearTimeout(scrollSettleTimer);
  scrollSettleTimer = 0;
}

function scheduleScrollSettle() {
  clearScrollSettleTimer();
  scrollSettleTimer = window.setTimeout(() => {
    scrollSettleTimer = 0;
    const current = currentSectionFromScroll();
    if (scrollTargetLockId) {
      activeSectionId = scrollTargetLockId;
      scrollTargetLockId = "";
      syncRailNav();
      return;
    }
    if (current?.id && current.id !== activeSectionId) {
      activeSectionId = current.id;
      syncRailNav();
    }
  }, 140);
}

function positionToolbox() {
  if (!nodes.workspaceShell || !nodes.toolbox) return;
  if (window.innerWidth <= 1280) {
    nodes.toolbox.style.left = "";
    nodes.toolbox.style.top = "";
    return;
  }

  const shellRect = nodes.workspaceShell.getBoundingClientRect();
  const firstSectionRect =
    nodes.form?.querySelector(".form-section")?.getBoundingClientRect() ||
    shellRect;
  const toolboxRect = nodes.toolbox.getBoundingClientRect();
  const gap = 18;
  const maxLeft = window.innerWidth - toolboxRect.width - 12;
  const left = Math.min(maxLeft, shellRect.right + gap);
  const minTop = 16;
  const maxTop = Math.max(minTop, shellRect.bottom - toolboxRect.height - 16);
  const desiredTop = Math.max(minTop, firstSectionRect.top);
  const top = Math.min(desiredTop, maxTop);

  nodes.toolbox.style.left = `${Math.max(12, left)}px`;
  nodes.toolbox.style.top = `${top}px`;
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

function selectedEnvironment() {
  return settings.environments.find((environment) => environment.id === selectedId) || null;
}

function selectedGroup() {
  return settings.groups.find((group) => group.id === selectedGroupId) || null;
}

function defaultGroupName() {
  return settings.groups.find((group) => group.id === DEFAULT_GROUP_ID)?.name || t("defaultGroup");
}

function normalizeGroupName(value) {
  const nextValue = typeof value === "string" ? value.trim() : "";
  return nextValue || t("defaultGroup");
}

function normalizeTemplateGroupName(value) {
  const nextValue = typeof value === "string" ? value.trim() : "";
  return nextValue || t("defaultTemplateGroup");
}

function slug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildLocalizedSampleGroup() {
  const groupId = SAMPLE_GROUP_ID;
  const groupName = t("sampleGroupName");
  const prodName = t("sampleEnvironmentProd");
  const devName = t("sampleEnvironmentDev");

  return {
    group: { id: groupId, name: groupName },
    environments: [
      {
        id: uid("env"),
        groupId,
        name: prodName,
        homepageUrl: "https://prod.example.com/",
        lastQuickAccessAt: 0,
        enabled: true,
        badge: "PROD",
        badgeEnabled: true,
        badgeColor: "#dc2626",
        badgeTextColor: "#ffffff",
        badgeStyle: "slanted",
        badgePosition: "top-right",
        badgeScale: 1,
        badgeSize: 14,
        badgeOffset: 12,
        badgeOpacity: 1,
        watermarkText: prodName,
        watermarkEnabled: true,
        watermarkColor: "#dc2626",
        watermarkOpacity: 0.08,
        watermarkAngle: -24,
        watermarkSize: 42,
        watermarkGap: 80,
        titlePrefix: true,
        markerMode: "badge-watermark",
        rules: [{ type: "wildcard", value: "https://prod.example.com/*" }],
        accounts: [
          {
            id: uid("account"),
            label: "管理员",
            username: "prod_admin",
            password: "Prod@123456",
            defaultFill: true,
            customFields: [
              {
                id: uid("field"),
                key: t("sampleCustomFieldKey"),
                value: "88800001",
                selector: ""
              }
            ]
          },
          {
            id: uid("account"),
            label: "测试账号",
            username: "prod_tester",
            password: "Prod@Test123",
            defaultFill: false
          }
        ]
      },
      {
        id: uid("env"),
        groupId,
        name: devName,
        homepageUrl: "https://dev.example.com/",
        lastQuickAccessAt: 0,
        enabled: true,
        badge: "DEV",
        badgeEnabled: true,
        badgeColor: "#2563eb",
        badgeTextColor: "#ffffff",
        badgeStyle: "slanted",
        badgePosition: "top-right",
        badgeScale: 1,
        badgeSize: 14,
        badgeOffset: 12,
        badgeOpacity: 1,
        watermarkText: devName,
        watermarkEnabled: false,
        watermarkColor: "#2563eb",
        watermarkOpacity: 0.08,
        watermarkAngle: -24,
        watermarkSize: 42,
        watermarkGap: 80,
        titlePrefix: true,
        markerMode: "badge",
        rules: [{ type: "wildcard", value: "https://dev.example.com/*" }],
        accounts: [
          {
            id: uid("account"),
            label: "开发管理员",
            username: "dev_admin",
            password: "Dev@123456",
            defaultFill: true
          },
          {
            id: uid("account"),
            label: "联调账号",
            username: "dev_tester",
            password: "Dev@Test123",
            defaultFill: false
          }
        ]
      }
    ]
  };
}

function findSampleGroup() {
  const group = settings.groups.find((item) => item.id === SAMPLE_GROUP_ID);
  if (!group) return null;
  const environments = settings.environments.filter((environment) => environment.groupId === SAMPLE_GROUP_ID);
  return { group, environments };
}

function applyLocalizedSampleGroup() {
  const sampleGroup = buildLocalizedSampleGroup();
  const existingGroupIndex = settings.groups.findIndex((group) => group.id === SAMPLE_GROUP_ID);
  if (existingGroupIndex >= 0) {
    settings.groups[existingGroupIndex] = sampleGroup.group;
  } else {
    settings.groups.push(sampleGroup.group);
  }

  settings.environments = settings.environments.filter((environment) => environment.groupId !== SAMPLE_GROUP_ID);
  settings.environments.push(...sampleGroup.environments);
  return sampleGroup;
}

function buildGroups(rawGroups, rawEnvironments) {
  const groups = [];
  const nameToId = new Map();

  groups.push({ id: DEFAULT_GROUP_ID, name: t("defaultGroup") });
  nameToId.set(groups[0].name, DEFAULT_GROUP_ID);

  if (Array.isArray(rawGroups)) {
    rawGroups.forEach((group) => {
      if (!group || !group.name) return;
      const name = normalizeGroupName(group.name);
      const id = group.id || (name === t("defaultGroup") ? DEFAULT_GROUP_ID : slug(name) || uid("group"));
      if (groups.some((item) => item.id === id) || nameToId.has(name)) return;
      groups.push({ id, name });
      nameToId.set(name, id);
    });
  }

  (rawEnvironments || []).forEach((environment) => {
    const legacyName = typeof environment.group === "string" ? normalizeGroupName(environment.group) : "";
    if (!legacyName || nameToId.has(legacyName)) return;
    const id = slug(legacyName) || uid("group");
    groups.push({ id, name: legacyName });
    nameToId.set(legacyName, id);
  });

  return groups;
}

function ensureGroupId(groupId, groups) {
  return groups.some((group) => group.id === groupId) ? groupId : DEFAULT_GROUP_ID;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
    position: validPositions.includes(source.position) ? source.position : "top-right",
    color: typeof source.color === "string" ? source.color : "#0f172a",
    size: clamp(Number(source.size) || 28, 16, 48),
    textSize: clamp(Number(source.textSize) || 16, 8, 24),
    opacity: clamp(Number(source.opacity ?? 1), 0, 1),
    bodyWidth: clamp(Number(source.bodyWidth ?? 240), 180, 400),
    bodyMaxHeight: clamp(Number(source.bodyMaxHeight ?? 280), 100, 600)
  };
}

function normalizeNavSettings(value) {
  const source = (typeof value === "object" && value) || {};
  return { enabled: source.enabled !== false };
}

function normalizeCustomField(field) {
  return {
    id: field.id || uid("field"),
    key: String(field.key || ""),
    value: String(field.value || ""),
    selector: String(field.selector || "")
  };
}

function markerTemplateFromEnvironment(environment, templateName = "") {
  const name = String(templateName || environment?.name || t("settingsTemplate")).trim() || t("settingsTemplate");
  return {
    id: uid("template"),
    name,
    badge: typeof environment?.badge === "string" ? environment.badge : "",
    badgeEnabled: environment?.badgeEnabled !== false,
    badgeColor: environment?.badgeColor || "#2563eb",
    badgeTextColor: environment?.badgeTextColor || "#ffffff",
    badgeStyle: environment?.badgeStyle || "slanted",
    badgePosition: environment?.badgePosition || "top-right",
    badgeScale: Number(environment?.badgeScale ?? 1),
    badgeSize: Number(environment?.badgeSize ?? 14),
    badgeOffset: Number(environment?.badgeOffset ?? 12),
    badgeOpacity: Number(environment?.badgeOpacity ?? 1),
    watermarkText:
      typeof environment?.watermarkText === "string"
        ? environment.watermarkText
        : typeof environment?.name === "string"
          ? environment.name
          : "",
    watermarkEnabled: environment?.watermarkEnabled === true,
    watermarkColor: environment?.watermarkColor || environment?.badgeColor || "#2563eb",
    watermarkOpacity: Number(environment?.watermarkOpacity ?? 0.08),
    watermarkAngle: Number(environment?.watermarkAngle ?? -24),
    watermarkSize: Number(environment?.watermarkSize ?? 42),
    watermarkGap: Number(environment?.watermarkGap ?? 80),
    titlePrefix: environment?.titlePrefix !== false,
    captureSettings: normalizeCaptureSettings(environment?.captureSettings),
    navSettings: normalizeNavSettings(environment?.navSettings)
  };
}

function normalizeTemplate(template) {
  const source = (typeof template === "object" && template) || {};
  const normalized = markerTemplateFromEnvironment(source, source.name || t("settingsTemplate"));
  normalized.id = source.id || uid("template");
  return normalized;
}

function normalizeTemplateGroups(value) {
  const sourceGroups = Array.isArray(value) ? value : [];
  const groups = sourceGroups
    .map((group) => {
      const name = typeof group?.name === "string" && group.name.trim()
        ? group.name.trim()
        : t("defaultTemplateGroup");
      return {
        id: group?.id || uid("template-group"),
        name,
        templates: Array.isArray(group?.templates) ? group.templates.map(normalizeTemplate) : []
      };
    })
    .filter((group) => group.id);

  if (!groups.length) {
    groups.push({ id: DEFAULT_TEMPLATE_GROUP_ID, name: t("defaultTemplateGroup"), templates: [] });
  } else if (!groups.some((group) => group.id === DEFAULT_TEMPLATE_GROUP_ID)) {
    groups.unshift({ id: DEFAULT_TEMPLATE_GROUP_ID, name: t("defaultTemplateGroup"), templates: [] });
  }

  return groups;
}

function findTemplate(templateId) {
  const id = String(templateId || "");
  if (!id) return null;
  for (const group of settings.templateGroups || []) {
    const template = (group.templates || []).find((item) => item.id === id);
    if (template) return { group, template };
  }
  return null;
}

function applyTemplateToEnvironment(environment, template) {
  if (!environment || !template) return;
  Object.assign(environment, {
    badge: template.badge || environment.badge || environment.name || "",
    badgeEnabled: template.badgeEnabled !== false,
    badgeColor: template.badgeColor || "#2563eb",
    badgeTextColor: template.badgeTextColor || "#ffffff",
    badgeStyle: template.badgeStyle || "slanted",
    badgePosition: template.badgePosition || "top-right",
    badgeScale: Number(template.badgeScale ?? 1),
    badgeSize: Number(template.badgeSize ?? 14),
    badgeOffset: Number(template.badgeOffset ?? 12),
    badgeOpacity: Number(template.badgeOpacity ?? 1),
    watermarkText: template.watermarkText || environment.watermarkText || environment.name || "",
    watermarkEnabled: template.watermarkEnabled === true,
    watermarkColor: template.watermarkColor || template.badgeColor || "#2563eb",
    watermarkOpacity: Number(template.watermarkOpacity ?? 0.08),
    watermarkAngle: Number(template.watermarkAngle ?? -24),
    watermarkSize: Number(template.watermarkSize ?? 42),
    watermarkGap: Number(template.watermarkGap ?? 80),
    titlePrefix: template.titlePrefix !== false,
    captureSettings: normalizeCaptureSettings(template.captureSettings)
  });
}

function normalizeSettings(value) {
  const next = {
    groups: [],
    environments: Array.isArray(value.environments) ? value.environments : [],
    templateGroups: normalizeTemplateGroups(value.templateGroups)
  };

  next.groups = buildGroups(value.groups, next.environments);
  const legacyGroupMap = new Map(next.groups.map((group) => [group.name, group.id]));

  next.environments = next.environments.map((environment) => {
    let hasDefaultAccount = false;
    const legacyGroupName = typeof environment.group === "string" ? normalizeGroupName(environment.group) : "";
    const resolvedGroupId =
      environment.groupId ||
      legacyGroupMap.get(legacyGroupName) ||
      DEFAULT_GROUP_ID;

    const legacyMarkerMode = environment.markerMode || "badge";
    const badgeEnabled =
      typeof environment.badgeEnabled === "boolean"
        ? environment.badgeEnabled
        : legacyMarkerMode !== "watermark";
    const watermarkEnabled =
      typeof environment.watermarkEnabled === "boolean"
        ? environment.watermarkEnabled
        : legacyMarkerMode === "watermark" || legacyMarkerMode === "badge-watermark";

    return {
      id: environment.id || uid("env"),
      groupId: ensureGroupId(resolvedGroupId, next.groups),
      name: environment.name || t("newEnvironment"),
      homepageUrl: normalizeHomepageUrl(environment.homepageUrl),
      lastQuickAccessAt: normalizeQuickAccessTimestamp(environment.lastQuickAccessAt),
      enabled: environment.enabled !== false,
      badge: typeof environment.badge === "string" ? environment.badge : "",
      badgeEnabled,
      badgeColor: environment.badgeColor || environment.color || "#2563eb",
      badgeTextColor: environment.badgeTextColor || environment.textColor || "#ffffff",
      badgeStyle: environment.badgeStyle || value.appearance?.badgeStyle || "slanted",
      badgePosition: environment.badgePosition || value.appearance?.badgePosition || "top-right",
      badgeScale: Number(environment.badgeScale ?? 1),
      badgeSize: Number(environment.badgeSize ?? 14),
      badgeOffset: Number(environment.badgeOffset ?? value.appearance?.badgeOffset ?? 12),
      badgeOpacity: Number(environment.badgeOpacity ?? value.appearance?.badgeOpacity ?? 1),
      watermarkText:
        typeof environment.watermarkText === "string"
          ? environment.watermarkText
          : environment.name || t("newEnvironment"),
      watermarkEnabled,
      watermarkColor: environment.watermarkColor || environment.color || "#2563eb",
      watermarkOpacity: Number(environment.watermarkOpacity ?? value.appearance?.watermarkOpacity ?? 0.08),
      watermarkAngle: Number(environment.watermarkAngle ?? value.appearance?.watermarkAngle ?? -24),
      watermarkSize: Number(environment.watermarkSize ?? value.appearance?.watermarkSize ?? 42),
      watermarkGap: Number(environment.watermarkGap ?? value.appearance?.watermarkGap ?? 80),
      titlePrefix: environment.titlePrefix !== false,
      rules: Array.isArray(environment.rules) ? environment.rules : [],
      accounts: Array.isArray(environment.accounts)
        ? environment.accounts.map((account) => {
            const defaultFill = Boolean(account.defaultFill && !hasDefaultAccount);
            if (defaultFill) hasDefaultAccount = true;
            return {
              id: account.id || uid("account"),
              label: account.label || "",
              username: account.username || "",
              password: account.password || "",
              defaultFill,
              customFields: Array.isArray(account.customFields)
                ? account.customFields.map(normalizeCustomField)
                : []
            };
          })
        : [],
      captureSettings: environment.captureSettings
        ? normalizeCaptureSettings(environment.captureSettings)
        : undefined,
      navSettings: environment.navSettings
        ? normalizeNavSettings(environment.navSettings)
        : undefined
  };
  });

  return next;
}

function groupNameById(groupId) {
  return settings.groups.find((group) => group.id === groupId)?.name || defaultGroupName();
}

function ruleTypeLabel(type) {
  if (type === "prefix") return t("ruleTypePrefix");
  if (type === "regex") return t("ruleTypeRegex");
  return t("ruleTypeWildcard");
}

function createLucideIcon(name, className = "group-icon") {
  const namespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(namespace, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add(className);

  (LUCIDE_ICON_NODES[name] || []).forEach(([tagName, attrs]) => {
    const node = document.createElementNS(namespace, tagName);
    Object.entries(LUCIDE_ICON_ATTRS).forEach(([key, value]) => node.setAttribute(key, value));
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    svg.append(node);
  });

  return svg;
}

function createGroupIconButton(iconName, className, title, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.title = title;
  button.append(createLucideIcon(iconName));
  button.addEventListener("click", onClick);
  return button;
}

function applyButtonIcon(button, iconName, label) {
  if (!button) return;
  button.textContent = "";
  button.classList.add("button-with-icon");
  button.append(createLucideIcon(iconName, "button-icon"));

  const text = document.createElement("span");
  text.className = "button-label";
  text.textContent = label;
  button.append(text);
}

function applyIconOnlyButton(button, iconName) {
  if (!button) return;
  button.textContent = "";
  button.append(createLucideIcon(iconName));
}

function applyInlineStatusIcon(container, iconName, label) {
  if (!container) return;
  container.textContent = "";
  container.classList.add("inline-status");
  container.append(createLucideIcon(iconName, "inline-status__icon"));
  const text = document.createElement("span");
  text.className = "inline-status__label";
  text.textContent = label;
  container.append(text);
}

function decorateStaticButtons() {
  applyButtonIcon(nodes.loadSample, "flaskConical", t("loadSample"));
  applyButtonIcon(nodes.exportConfig, "upload", t("export"));
  applyButtonIcon(nodes.importConfigTrigger, "download", t("import"));
  applyButtonIcon(nodes.aboutTrigger, "badgeHelp", t("about"));
  applyButtonIcon(nodes.addGroup, "plus", t("addGroup"));
  applyButtonIcon(nodes.addTemplateGroup, "plus", t("addTemplateGroup"));
  applyButtonIcon(nodes.saveTemplateFromEnv, "save", t("saveAsTemplate"));
  applyButtonIcon(nodes.addRule, "plus", t("addRule"));
  applyButtonIcon(nodes.addAccount, "plus", t("addAccount"));
  applyButtonIcon(nodes.save, "save", t("save"));
  applyButtonIcon(nodes.deleteEnvironment, "trash", t("deleteEnvironment"));
  applyIconOnlyButton(nodes.exportModalClose, "x");
  applyIconOnlyButton(nodes.importModalClose, "x");
  applyIconOnlyButton(nodes.aboutModalClose, "x");
}

function markChanged() {
  if (!isRendering) {
    hasUnsavedChanges = settingsDifferFromSavedSnapshot();
    syncSaveButtonState();
    setStatus(hasUnsavedChanges ? t("unsavedChanges") : t("ready"));
  }
}

const QUICK_BADGE_LABELS = new Map([
  ["local", "LOCAL"],
  ["dev", "DEV"],
  ["develop", "DEV"],
  ["development", "DEV"],
  ["test", "TEST"],
  ["testing", "TEST"],
  ["qa", "QA"],
  ["sit", "SIT"],
  ["uat", "UAT"],
  ["stage", "STAGE"],
  ["staging", "STAGE"],
  ["pre", "PRE"],
  ["preprod", "PRE"],
  ["pre-release", "PRE"],
  ["preview", "PREVIEW"],
  ["beta", "BETA"],
  ["demo", "DEMO"],
  ["sandbox", "SANDBOX"],
  ["gray", "GRAY"],
  ["canary", "CANARY"],
  ["perf", "PERF"],
  ["performance", "PERF"],
  ["prod", "PROD"],
  ["production", "PROD"],
  ["online", "PROD"]
]);

function tokenizeQuickBadgeSource(value) {
  return String(value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function detectQuickBadge(url, title) {
  const tryKnownLabel = (tokens) => {
    for (const token of tokens) {
      const label = QUICK_BADGE_LABELS.get(token);
      if (label) return label;
    }
    return "";
  };

  try {
    const parsed = new URL(url);
    const hostTokens = tokenizeQuickBadgeSource(parsed.hostname);
    const pathTokens = tokenizeQuickBadgeSource(`${parsed.pathname} ${parsed.search}`);
    const titleTokens = tokenizeQuickBadgeSource(title);
    const matchedKnownLabel = tryKnownLabel([...hostTokens, ...pathTokens, ...titleTokens]);
    if (matchedKnownLabel) return matchedKnownLabel;

    const hostParts = parsed.hostname.split(".").filter(Boolean);
    const subdomainParts = hostParts.length > 2 ? hostParts.slice(0, -2) : hostParts.slice(0, -1);
    const fallbackLabel = subdomainParts
      .flatMap((part) => tokenizeQuickBadgeSource(part))
      .find((token) => token && !["www", "m"].includes(token));
    if (fallbackLabel) return fallbackLabel.slice(0, 12).toUpperCase();

    const hostFallback = tokenizeQuickBadgeSource(parsed.hostname).find((token) => token && !["www", "m"].includes(token));
    if (hostFallback) return hostFallback.slice(0, 12).toUpperCase();
  } catch (_) {
    const titleFallback = tryKnownLabel(tokenizeQuickBadgeSource(title));
    if (titleFallback) return titleFallback;
  }

  return "ENV";
}

function buildQuickEnvironmentName(title, sourceUrl, badge) {
  const cleanTitle = String(title || "").trim();
  try {
    const parsed = new URL(sourceUrl);
    const host = parsed.hostname;
    if (!cleanTitle) return host || t("newEnvironment");
    const normalizedTitle = cleanTitle.toLowerCase();
    if (host && !normalizedTitle.includes(host.toLowerCase())) {
      return `${cleanTitle} (${host})`;
    }
    if (badge && !normalizedTitle.includes(badge.toLowerCase())) {
      return `${cleanTitle} (${badge})`;
    }
    return cleanTitle;
  } catch (_) {
    if (!cleanTitle) return t("newEnvironment");
    if (badge && !cleanTitle.toLowerCase().includes(badge.toLowerCase())) {
      return `${cleanTitle} (${badge})`;
    }
    return cleanTitle;
  }
}

function buildQuickEnvironment(title, prefixValue, sourceUrl = "") {
  const color = pickEnvironmentColor();
  const badge = detectQuickBadge(sourceUrl || prefixValue, title);
  const name = buildQuickEnvironmentName(title, sourceUrl || prefixValue, badge);
  const homepageUrl = homepageUrlFromSource(sourceUrl, prefixValue);
  return {
    id: uid("env"),
    groupId: DEFAULT_GROUP_ID,
    name,
    homepageUrl,
    lastQuickAccessAt: 0,
    enabled: true,
    badge,
    badgeEnabled: true,
    badgeColor: color,
    badgeTextColor: "#ffffff",
    badgeStyle: "slanted",
    badgePosition: "top-right",
    badgeScale: 1,
    badgeSize: 14,
    badgeOffset: 12,
    badgeOpacity: 1,
    watermarkText: name,
    watermarkEnabled: false,
    watermarkColor: color,
    watermarkOpacity: 0.08,
    watermarkAngle: -24,
    watermarkSize: 42,
    watermarkGap: 80,
    titlePrefix: true,
    markerMode: "badge",
    rules: [{ type: "prefix", value: prefixValue }],
    accounts: []
  };
}

function selectEnvironmentFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const environmentId = String(params.get("environmentId") || "").trim();
  if (!environmentId) return false;
  const environment = settings.environments.find((item) => item.id === environmentId);
  if (!environment) return false;
  selectedGroupId = environment.groupId || DEFAULT_GROUP_ID;
  selectedId = environment.id;
  return true;
}

function renderGroupOptions() {
  const environment = selectedEnvironment();
  nodes.group.innerHTML = "";
  settings.groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.name;
    nodes.group.append(option);
  });
  if (environment) {
    nodes.group.value = ensureGroupId(environment.groupId, settings.groups);
  }
}

function renderColorSwatches(node, colors, value, onSelect) {
  node.innerHTML = "";
  colors.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "color-swatch";
    button.classList.toggle("is-active", color.toLowerCase() === String(value || "").toLowerCase());
    button.style.setProperty("--swatch-color", color);
    button.title = color;
    button.addEventListener("click", () => onSelect(color));
    node.append(button);
  });
}

function syncColorControls(environment = selectedEnvironment()) {
  if (!environment) return;

  nodes.badgeColor.value = environment.badgeColor;
  nodes.badgeTextColor.value = environment.badgeTextColor;
  nodes.watermarkColor.value = environment.watermarkColor;

  renderColorSwatches(nodes.badgeColorSwatches, ENVIRONMENT_COLOR_PRESETS, environment.badgeColor, (color) => {
    updateSelectedEnvironment({ badgeColor: color });
  });
  renderColorSwatches(nodes.badgeTextColorSwatches, TEXT_COLOR_PRESETS, environment.badgeTextColor, (color) => {
    updateSelectedEnvironment({ badgeTextColor: color });
  });
  renderColorSwatches(nodes.watermarkColorSwatches, ENVIRONMENT_COLOR_PRESETS, environment.watermarkColor, (color) => {
    updateSelectedEnvironment({ watermarkColor: color });
  });
}

function renderEnvironmentList() {
  nodes.list.innerHTML = "";
  const searchQuery = environmentSearchQuery.trim().toLowerCase();
  let renderedGroups = 0;

  if (!settings.groups.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = t("noEnvironments");
    nodes.list.append(empty);
    return;
  }

  settings.groups.forEach((group) => {
    const allGroupEnvironments = settings.environments.filter((environment) => environment.groupId === group.id);
    const groupEnvironments = allGroupEnvironments.filter((environment) => environmentMatchesSearch(environment, group, searchQuery));
    const isCollapsed = !searchQuery && collapsedGroupIds.has(group.id);

    if (searchQuery && !groupEnvironments.length) return;
    renderedGroups += 1;

    const wrap = document.createElement("section");
    wrap.className = "environment-group";
    wrap.classList.toggle("is-active", group.id === selectedGroupId);
    wrap.classList.toggle("is-collapsed", isCollapsed);
    wrap.dataset.groupId = group.id;

    const header = document.createElement("div");
    header.className = "environment-group__title";
    header.addEventListener("click", () => {
      const nextSelectedId = settings.environments.some((environment) => environment.id === selectedId && environment.groupId === group.id)
        ? selectedId
        : settings.environments.find((environment) => environment.groupId === group.id)?.id || null;
      selectEnvironment(group.id, nextSelectedId);
    });

    const titleWrap = document.createElement("div");
    titleWrap.className = "environment-group__title-main";

    const collapse = document.createElement("button");
    collapse.type = "button";
    collapse.className = "group-icon-button environment-group__collapse";
    collapse.title = isCollapsed ? t("expandGroup") : t("collapseGroup");
    collapse.setAttribute("aria-label", collapse.title);
    collapse.setAttribute("aria-expanded", String(!isCollapsed));
    collapse.textContent = "›";
    collapse.addEventListener("click", (event) => {
      event.stopPropagation();
      if (isCollapsed) {
        collapsedGroupIds.delete(group.id);
      } else {
        collapsedGroupIds.add(group.id);
      }
      renderEnvironmentList();
    });
    titleWrap.append(collapse);

    const title = document.createElement("span");
    title.className = "environment-group__name";
    title.textContent = group.name;
    titleWrap.append(title);

    const count = document.createElement("span");
    count.className = "environment-group__count";
    count.textContent = `${groupEnvironments.length}/${allGroupEnvironments.length}`;
    titleWrap.append(count);

    const tools = document.createElement("div");
    tools.className = "environment-group__tools";

    const actions = document.createElement("div");
    actions.className = "environment-group__actions";

    const rename = createGroupIconButton("edit", "group-icon-button group-icon-button--edit", t("renameGroup"), (event) => {
      event.stopPropagation();
      renameGroup(group.id);
    });
    tools.append(rename);

    if (group.id !== DEFAULT_GROUP_ID) {
      const remove = createGroupIconButton("trash", "group-icon-button group-icon-button--danger", t("deleteGroup"), (event) => {
        event.stopPropagation();
        deleteGroup(group.id);
      });
      tools.append(remove);
    }

    const addEnvironmentButton = document.createElement("button");
    addEnvironmentButton.type = "button";
    addEnvironmentButton.className = "group-action button-with-icon";
    addEnvironmentButton.append(createLucideIcon("plus", "button-icon"));
    const addEnvironmentLabel = document.createElement("span");
    addEnvironmentLabel.className = "button-label";
    addEnvironmentLabel.textContent = t("addEnvironment");
    addEnvironmentButton.append(addEnvironmentLabel);
    addEnvironmentButton.addEventListener("click", (event) => {
      event.stopPropagation();
      addEnvironment(group.id);
    });
    actions.append(addEnvironmentButton);

    const duplicate = document.createElement("button");
    duplicate.type = "button";
    duplicate.className = "group-action button-with-icon";
    duplicate.append(createLucideIcon("copy", "button-icon"));
    const duplicateLabel = document.createElement("span");
    duplicateLabel.className = "button-label";
    duplicateLabel.textContent = t("duplicate");
    duplicate.append(duplicateLabel);
    duplicate.disabled = !settings.environments.some((environment) => environment.groupId === group.id);
    duplicate.addEventListener("click", (event) => {
      event.stopPropagation();
      duplicateEnvironment(group.id);
    });
    actions.append(duplicate);

    const enableGroup = document.createElement("button");
    enableGroup.type = "button";
    enableGroup.className = "group-action";
    enableGroup.textContent = t("enableGroup");
    enableGroup.disabled = !allGroupEnvironments.length || allGroupEnvironments.every((environment) => environment.enabled !== false);
    enableGroup.addEventListener("click", (event) => {
      event.stopPropagation();
      setGroupEnvironmentsEnabled(group.id, true).catch(() => {});
    });
    actions.append(enableGroup);

    const disableGroup = document.createElement("button");
    disableGroup.type = "button";
    disableGroup.className = "group-action group-action--danger";
    disableGroup.textContent = t("disableGroup");
    disableGroup.disabled = !allGroupEnvironments.length || allGroupEnvironments.every((environment) => environment.enabled === false);
    disableGroup.addEventListener("click", (event) => {
      event.stopPropagation();
      setGroupEnvironmentsEnabled(group.id, false).catch(() => {});
    });
    actions.append(disableGroup);

    const headerTop = document.createElement("div");
    headerTop.className = "environment-group__top";
    headerTop.append(titleWrap, tools);

    header.append(headerTop, actions);
    wrap.append(header);

    const stack = document.createElement("div");
    stack.className = "environment-group__list";

    const persistEnvironmentMove = async (movedEnvironmentId) => {
      draggingEnvironmentId = "";
      clearEnvironmentDropIndicators();
      selectedGroupId = group.id;
      selectedId = movedEnvironmentId;
      await persistSettingsSnapshot();
      render();
      setStatus(t("saved"));
    };

    const inferGroupEdgeDropTarget = (clientY) => {
      if (!groupEnvironments.length) return null;
      const firstItem = stack.querySelector(".environment-item");
      const lastItem = stack.querySelector(".environment-item:last-of-type");
      if (!firstItem || !lastItem) return null;
      const firstRect = firstItem.getBoundingClientRect();
      const lastRect = lastItem.getBoundingClientRect();
      if (clientY <= firstRect.top + firstRect.height / 2) {
        return { targetId: groupEnvironments[0].id, placement: "before", targetItem: firstItem };
      }
      if (clientY >= lastRect.top + lastRect.height / 2) {
        return {
          targetId: groupEnvironments[groupEnvironments.length - 1].id,
          placement: "after",
          targetItem: lastItem
        };
      }
      return null;
    };

    const inferActiveEnvironmentDropTarget = () => {
      const activeBefore = stack.querySelector(".environment-item.is-drop-before");
      if (activeBefore?.dataset.environmentId) {
        return {
          targetId: activeBefore.dataset.environmentId,
          placement: "before",
          targetItem: activeBefore
        };
      }
      const activeAfter = stack.querySelector(".environment-item.is-drop-after");
      if (activeAfter?.dataset.environmentId) {
        return {
          targetId: activeAfter.dataset.environmentId,
          placement: "after",
          targetItem: activeAfter
        };
      }
      return null;
    };

    const acceptEnvironmentDrop = async (event) => {
      if (!draggingEnvironmentId) return;
      event.preventDefault();
      event.stopPropagation();
      const movedEnvironmentId = draggingEnvironmentId;
      const draggedEnvironment = settings.environments.find((environment) => environment.id === movedEnvironmentId);
      const sameGroup = draggedEnvironment?.groupId === group.id;
      if (sameGroup) {
        const target = inferActiveEnvironmentDropTarget() || inferGroupEdgeDropTarget(event.clientY);
        if (!target) return;
        const didReorder = reorderEnvironments(movedEnvironmentId, target.targetId, target.placement, group.id);
        if (!didReorder) return;
        await persistEnvironmentMove(movedEnvironmentId);
        return;
      }
      const didMove = moveEnvironmentToGroup(movedEnvironmentId, group.id);
      if (!didMove) return;
      await persistEnvironmentMove(movedEnvironmentId);
    };

    wrap.addEventListener("dragover", (event) => {
      if (isCollapsed || searchQuery) return;
      if (!draggingEnvironmentId) return;
      const draggedEnvironment = settings.environments.find((environment) => environment.id === draggingEnvironmentId);
      if (!draggedEnvironment) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
      if (draggedEnvironment.groupId === group.id) {
        const edgeTarget = inferGroupEdgeDropTarget(event.clientY);
        if (!edgeTarget) return;
        wrap.classList.remove("is-drop-target");
        setEnvironmentDropIndicator(edgeTarget.targetItem, edgeTarget.placement);
        return;
      }
      clearEnvironmentDropIndicators();
      wrap.classList.add("is-drop-target");
    });

    wrap.addEventListener("dragleave", (event) => {
      if (!draggingEnvironmentId) return;
      if (wrap.contains(event.relatedTarget)) return;
      wrap.classList.remove("is-drop-target");
    });

    if (!isCollapsed && !searchQuery) {
      wrap.addEventListener("drop", acceptEnvironmentDrop);
      stack.addEventListener("drop", acceptEnvironmentDrop);
    }

    if (isCollapsed) {
      const collapsed = document.createElement("div");
      collapsed.className = "environment-group__collapsed";
      collapsed.textContent = t("collapsedGroupSummary", [String(allGroupEnvironments.length)]);
      stack.append(collapsed);
    } else if (!groupEnvironments.length) {
      const empty = document.createElement("div");
      empty.className = "empty empty--compact";
      empty.textContent = searchQuery ? t("noSearchResults") : t("emptyGroup");
      stack.append(empty);
    } else {
      groupEnvironments.forEach((environment) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "environment-item";
        button.dataset.environmentId = environment.id;
        button.draggable = !searchQuery;
        button.classList.toggle("is-active", environment.id === selectedId);
        button.classList.toggle("is-disabled", environment.enabled === false);
        button.style.setProperty("--item-color", environment.badgeColor || "#2563eb");
        button.style.setProperty("--badge-text", environment.badgeTextColor || "#ffffff");

        const name = document.createElement("div");
        name.className = "environment-item__name";
        const nameText = document.createElement("span");
        nameText.textContent = environment.name || t("environmentFallback");
        name.append(nameText);

        if (environment.enabled === false) {
          const status = document.createElement("span");
          status.className = "environment-item__status";
          status.textContent = t("disabled");
          name.append(status);
        }

        const badge = document.createElement("span");
        badge.className = "environment-item__badge";
        badge.textContent = markerLabel(environment);
        name.append(badge);

        const meta = document.createElement("div");
        meta.className = "environment-item__meta";
        meta.textContent = environment.homepageUrl || environment.rules?.[0]?.value || t("noUrlRules");

        button.append(name, meta);
        button.addEventListener("click", () => selectEnvironment(group.id, environment.id));
        button.addEventListener("dragstart", (event) => {
          draggingEnvironmentId = environment.id;
          clearEnvironmentDropIndicators();
          button.classList.add("is-drag-source");
          if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", environment.id);
          }
        });
        button.addEventListener("dragend", () => {
          draggingEnvironmentId = "";
          clearEnvironmentDropIndicators();
        });
        button.addEventListener("dragover", (event) => {
          if (!draggingEnvironmentId || draggingEnvironmentId === environment.id) return;
          event.preventDefault();
          event.stopPropagation();
          wrap.classList.remove("is-drop-target");
          const rect = button.getBoundingClientRect();
          const placement = event.clientY < rect.top + rect.height / 2 ? "before" : "after";
          setEnvironmentDropIndicator(button, placement);
          if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
        });
        button.addEventListener("drop", async (event) => {
          if (!draggingEnvironmentId || draggingEnvironmentId === environment.id) return;
          event.preventDefault();
          event.stopPropagation();
          const movedEnvironmentId = draggingEnvironmentId;
          const placement = button.classList.contains("is-drop-after") ? "after" : "before";
          const didMove = reorderEnvironments(movedEnvironmentId, environment.id, placement, group.id);
          if (!didMove) return;
          await persistEnvironmentMove(movedEnvironmentId);
        });
        stack.append(button);
      });
    }

    wrap.append(stack);
    nodes.list.append(wrap);
  });

  if (!renderedGroups) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = t("noSearchResults");
    nodes.list.append(empty);
  }
}

function renderTemplateGroupList() {
  if (!nodes.templateGroupList) return;
  nodes.templateGroupList.innerHTML = "";

  (settings.templateGroups || []).forEach((group) => {
    const wrap = document.createElement("section");
    wrap.className = "template-group";

    const header = document.createElement("div");
    header.className = "template-group__head";

    const title = document.createElement("div");
    title.className = "template-group__title";
    const name = document.createElement("span");
    name.textContent = group.name;
    const count = document.createElement("span");
    count.className = "template-group__count";
    count.textContent = String((group.templates || []).length);
    title.append(name, count);

    const tools = document.createElement("div");
    tools.className = "template-group__tools";

    const addTemplate = createGroupIconButton("plus", "group-icon-button", t("saveAsTemplate"), () => {
      saveSelectedEnvironmentAsTemplate(group.id);
    });
    addTemplate.disabled = !selectedEnvironment();
    tools.append(addTemplate);

    const rename = createGroupIconButton("edit", "group-icon-button group-icon-button--edit", t("renameTemplateGroup"), () => {
      renameTemplateGroup(group.id);
    });
    tools.append(rename);

    if (group.id !== DEFAULT_TEMPLATE_GROUP_ID) {
      const removeGroup = createGroupIconButton("trash", "group-icon-button group-icon-button--danger", t("deleteTemplateGroup"), () => {
        deleteTemplateGroup(group.id);
      });
      tools.append(removeGroup);
    }

    header.append(title, tools);
    wrap.append(header);

    const list = document.createElement("div");
    list.className = "template-list";

    if (!group.templates?.length) {
      const empty = document.createElement("div");
      empty.className = "empty empty--compact";
      empty.textContent = t("noTemplates");
      list.append(empty);
    } else {
      group.templates.forEach((template) => {
        const row = document.createElement("div");
        row.className = "template-item";
        row.style.setProperty("--template-color", template.badgeColor || "#2563eb");
        row.style.setProperty("--template-text-color", template.badgeTextColor || "#ffffff");

        const summary = document.createElement("button");
        summary.type = "button";
        summary.className = "template-item__summary";
        summary.title = t("applyTemplate");
        summary.addEventListener("click", () => applyTemplateById(template.id));

        const badge = document.createElement("span");
        badge.className = "template-item__badge";
        badge.textContent = template.badge || template.name;

        const body = document.createElement("span");
        body.className = "template-item__body";
        const templateName = document.createElement("span");
        templateName.className = "template-item__name";
        templateName.textContent = template.name;
        const meta = document.createElement("span");
        meta.className = "template-item__meta";
        meta.textContent = [
          template.badgeEnabled !== false ? t("badgeConfig") : "",
          template.watermarkEnabled === true ? t("watermarkConfig") : "",
          template.captureSettings?.enabled !== false ? t("captureSettings") : ""
        ].filter(Boolean).join(" / ");
        body.append(templateName, meta);
        summary.append(badge, body);

        const remove = createGroupIconButton("trash", "group-icon-button group-icon-button--danger", t("deleteTemplate"), () => {
          deleteTemplate(group.id, template.id);
        });

        row.append(summary, remove);
        list.append(row);
      });
    }

    wrap.append(list);
    nodes.templateGroupList.append(wrap);
  });
}

function createRuleRow(rule, index) {
  const row = document.createElement("div");
  row.className = "row-card";

  const type = document.createElement("select");
  ["wildcard", "prefix", "regex"].forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = ruleTypeLabel(optionValue);
    type.append(option);
  });
  type.value = rule.type || "wildcard";

  const value = document.createElement("input");
  value.type = "text";
  value.placeholder = "https://test.example.com/*";
  value.value = rule.value || "";

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove-button";
  remove.title = t("removeRule");
  remove.append(createLucideIcon("x", "remove-button__icon"));

  const copy = document.createElement("button");
  copy.type = "button";
  copy.className = "remove-button remove-button--copy";
  copy.title = t("copyRule");
  copy.append(createLucideIcon("copy", "remove-button__icon"));

  type.addEventListener("change", () => {
    const environment = selectedEnvironment();
    environment.rules[index].type = type.value;
    markChanged();
  });

  value.addEventListener("input", () => {
    const environment = selectedEnvironment();
    environment.rules[index].value = value.value;
    renderEnvironmentList();
    markChanged();
  });

  copy.addEventListener("click", () => {
    const environment = selectedEnvironment();
    const source = environment.rules[index] || { type: "wildcard", value: "" };
    environment.rules.splice(index + 1, 0, { type: source.type || "wildcard", value: source.value || "" });
    render();
    markChanged();
  });

  remove.addEventListener("click", () => {
    const environment = selectedEnvironment();
    environment.rules.splice(index, 1);
    render();
    markChanged();
  });

  row.append(type, value, copy, remove);
  return row;
}

function createCustomFieldsSection(account) {
  const section = document.createElement("div");
  section.className = "custom-fields-section";

  const header = document.createElement("div");
  header.className = "custom-fields-section__header";
  header.textContent = t("customFields");

  const list = document.createElement("div");
  list.className = "custom-fields-section__list";

  if (!Array.isArray(account.customFields) || !account.customFields.length) {
    const empty = document.createElement("div");
    empty.className = "empty empty--compact";
    empty.textContent = t("noCustomFields");
    list.append(empty);
  } else {
    account.customFields.forEach((field) => {
      list.append(createCustomFieldRow(account, field));
    });
  }

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "custom-fields-section__add";
  applyButtonIcon(addButton, "plus", t("addCustomField"));
  addButton.addEventListener("click", () => {
    if (!Array.isArray(account.customFields)) account.customFields = [];
    account.customFields.push({ id: uid("field"), key: "", value: "", selector: "" });
    expandedCustomFieldsAccountId = account.id;
    render();
    markChanged();
  });

  section.append(header, list, addButton);
  return section;
}

function createCustomFieldRow(account, field) {
  const row = document.createElement("div");
  row.className = "custom-field-row";
  row.dataset.fieldId = field.id;

  const keyInput = document.createElement("input");
  keyInput.type = "text";
  keyInput.className = "custom-field-row__key";
  keyInput.placeholder = t("customFieldKeyPlaceholder");
  keyInput.value = field.key || "";

  const valueInput = document.createElement("input");
  valueInput.type = "text";
  valueInput.className = "custom-field-row__value";
  valueInput.placeholder = t("customFieldValuePlaceholder");
  valueInput.value = field.value || "";

  const advancedToggle = document.createElement("button");
  advancedToggle.type = "button";
  advancedToggle.className = "custom-field-row__advanced-toggle";
  advancedToggle.textContent = t("customFieldAdvanced");

  const advancedSection = document.createElement("div");
  advancedSection.className = "custom-field-row__advanced";
  advancedSection.hidden = true;

  const selectorInput = document.createElement("input");
  selectorInput.type = "text";
  selectorInput.className = "custom-field-row__selector";
  selectorInput.placeholder = "input[name=\"merchantId\"]";
  selectorInput.value = field.selector || "";

  const selectorHint = document.createElement("div");
  selectorHint.className = "custom-field-row__hint";
  selectorHint.textContent = t("customFieldSelectorHint");

  advancedSection.append(selectorInput, selectorHint);

  advancedToggle.addEventListener("click", () => {
    advancedSection.hidden = !advancedSection.hidden;
  });

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove-button";
  remove.title = t("removeCustomField");
  remove.append(createLucideIcon("x", "remove-button__icon"));

  const sync = () => {
    field.key = keyInput.value;
    field.value = valueInput.value;
    field.selector = selectorInput.value;
    markChanged();
  };
  keyInput.addEventListener("input", sync);
  valueInput.addEventListener("input", sync);
  selectorInput.addEventListener("input", sync);

  remove.addEventListener("click", () => {
    const idx = account.customFields.findIndex((f) => f.id === field.id);
    if (idx >= 0) account.customFields.splice(idx, 1);
    if (autofocusCustomFieldId === field.id) autofocusCustomFieldId = "";
    render();
    markChanged();
  });

  // Autofocus on the offending field after a validation error
  if (autofocusCustomFieldId === field.id) {
    autofocusCustomFieldId = "";
    requestAnimationFrame(() => keyInput.focus());
  }

  row.append(keyInput, valueInput, advancedToggle, advancedSection, remove);
  return row;
}

function buildCapturePreviewCanvas(cs) {
  const canvas = document.createElement("div");
  canvas.className = "capture-preview__canvas";

  const chrome = document.createElement("div");
  chrome.className = "capture-preview__chrome";
  chrome.innerHTML = "<span></span><span></span><span></span>";

  const header = document.createElement("div");
  header.className = "capture-preview__header";
  header.textContent = "Example Login";

  const body = document.createElement("div");
  body.className = "capture-preview__body";

  const button = document.createElement("div");
  button.className = "capture-preview__button";
  button.textContent = "+";
  button.dataset.position = cs.position;
  button.style.setProperty("--preview-button-color", cs.color);
  button.style.setProperty("--preview-button-size", `${cs.size}px`);
  button.style.setProperty("--preview-button-text-size", `${cs.textSize}px`);
  button.style.setProperty("--preview-button-opacity", String(cs.opacity));
  body.append(button);

  canvas.append(chrome, header, body);
  return canvas;
}

function createCaptureSettingsEditor(source, options = {}) {
  const onChange = options.onChange || (() => {});
  const container = document.createElement("div");
  container.className = "capture-settings-editor";

  const enabledWrap = document.createElement("label");
  enabledWrap.className = "toggle-control section-title__toggle capture-enabled-toggle";
  const enabledInput = document.createElement("input");
  enabledInput.type = "checkbox";
  enabledInput.checked = source.enabled !== false;
  const enabledSwitch = document.createElement("span");
  enabledSwitch.className = "toggle-control__switch";
  enabledSwitch.setAttribute("aria-hidden", "true");
  const enabledText = document.createElement("span");
  enabledText.textContent = t("captureEnabled");
  enabledWrap.append(enabledInput, enabledSwitch, enabledText);
  container.append(enabledWrap);

  const positionControl = document.createElement("div");
  positionControl.className = "capture-body-control";
  const positionLabel = document.createElement("label");
  positionLabel.textContent = t("capturePosition");
  const positionSelect = document.createElement("select");
  const positionOptions = [
    "top-left", "top-center", "top-right",
    "middle-left", "middle-right",
    "bottom-left", "bottom-center", "bottom-right"
  ];
  positionOptions.forEach((value) => {
    const opt = document.createElement("option");
    opt.value = value;
    const key = value.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    opt.textContent = t(key);
    positionSelect.append(opt);
  });
  positionSelect.value = source.position;
  positionControl.append(positionLabel, positionSelect);
  container.append(positionControl);

  const colorTextRow = document.createElement("div");
  colorTextRow.className = "capture-row";

  const colorControl = document.createElement("label");
  colorControl.className = "field color-field capture-color-field";
  const colorLabel = document.createElement("span");
  colorLabel.textContent = t("captureColor");
  const colorBody = document.createElement("div");
  colorBody.className = "color-field__body";
  const colorSwatches = document.createElement("div");
  colorSwatches.className = "color-swatches";
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = /^#[0-9a-f]{6}$/i.test(source.color) ? source.color : "#0f172a";
  colorBody.append(colorSwatches, colorInput);
  colorControl.append(colorLabel, colorBody);

  const textSizeControl = document.createElement("div");
  textSizeControl.className = "capture-size-control";
  const textSizeLabel = document.createElement("label");
  textSizeLabel.textContent = t("captureTextSize");
  const textSizeInput = document.createElement("input");
  textSizeInput.type = "range";
  textSizeInput.min = "8";
  textSizeInput.max = "24";
  textSizeInput.step = "1";
  textSizeInput.value = String(source.textSize);
  const textSizeValue = document.createElement("span");
  textSizeValue.className = "capture-size-control__value";
  textSizeValue.textContent = String(source.textSize);
  const textSizeUnit = document.createElement("span");
  textSizeUnit.className = "unit";
  textSizeUnit.textContent = "px";
  textSizeControl.append(textSizeLabel, textSizeInput, textSizeValue, textSizeUnit);

  colorTextRow.append(colorControl, textSizeControl);
  container.append(colorTextRow);

  const sizeOpacityRow = document.createElement("div");
  sizeOpacityRow.className = "capture-row";

  const sizeControl = document.createElement("div");
  sizeControl.className = "capture-size-control";
  const sizeLabel = document.createElement("label");
  sizeLabel.textContent = t("captureSize");
  const sizeInput = document.createElement("input");
  sizeInput.type = "range";
  sizeInput.min = "16";
  sizeInput.max = "48";
  sizeInput.step = "1";
  sizeInput.value = String(source.size);
  const sizeValue = document.createElement("span");
  sizeValue.className = "capture-size-control__value";
  sizeValue.textContent = String(source.size);
  const sizeUnit = document.createElement("span");
  sizeUnit.className = "unit";
  sizeUnit.textContent = "px";
  sizeControl.append(sizeLabel, sizeInput, sizeValue, sizeUnit);

  const opacityControl = document.createElement("div");
  opacityControl.className = "capture-size-control";
  const opacityLabel = document.createElement("label");
  opacityLabel.textContent = t("captureOpacity");
  const opacityInput = document.createElement("input");
  opacityInput.type = "range";
  opacityInput.min = "0";
  opacityInput.max = "1";
  opacityInput.step = "0.05";
  opacityInput.value = String(source.opacity);
  const opacityValue = document.createElement("span");
  opacityValue.className = "capture-size-control__value";
  opacityValue.textContent = String(source.opacity);
  opacityControl.append(opacityLabel, opacityInput, opacityValue);

  sizeOpacityRow.append(sizeControl, opacityControl);
  container.append(sizeOpacityRow);

  const bodyControl = document.createElement("div");
  bodyControl.className = "capture-body-control";
  const widthLabel = document.createElement("label");
  widthLabel.textContent = t("captureBodyWidth");
  const widthInput = document.createElement("input");
  widthInput.type = "number";
  widthInput.min = "180";
  widthInput.max = "400";
  widthInput.step = "10";
  widthInput.value = String(source.bodyWidth);
  const widthUnit = document.createElement("span");
  widthUnit.className = "unit";
  widthUnit.textContent = "px";
  const heightLabel = document.createElement("label");
  heightLabel.textContent = t("captureBodyMaxHeight");
  const heightInput = document.createElement("input");
  heightInput.type = "number";
  heightInput.min = "100";
  heightInput.max = "600";
  heightInput.step = "20";
  heightInput.value = String(source.bodyMaxHeight);
  const heightUnit = document.createElement("span");
  heightUnit.className = "unit";
  heightUnit.textContent = "px";
  bodyControl.append(widthLabel, widthInput, widthUnit, heightLabel, heightInput, heightUnit);
  container.append(bodyControl);

  const previewWrap = document.createElement("div");
  previewWrap.className = "capture-preview";
  let previewCanvas = buildCapturePreviewCanvas(source);
  previewWrap.append(previewCanvas);
  container.append(previewWrap);

  function refreshPreview() {
    const newCanvas = buildCapturePreviewCanvas(source);
    previewCanvas.replaceWith(newCanvas);
    previewCanvas = newCanvas;
  }

  function syncCaptureColorSwatches() {
    renderColorSwatches(colorSwatches, ENVIRONMENT_COLOR_PRESETS, source.color, (color) => {
      source.color = color;
      colorInput.value = color;
      syncCaptureColorSwatches();
      refreshPreview();
      onChange();
    });
  }

  syncCaptureColorSwatches();

  enabledInput.addEventListener("change", () => {
    source.enabled = enabledInput.checked;
    onChange();
  });

  positionSelect.addEventListener("change", () => {
    source.position = positionSelect.value;
    refreshPreview();
    onChange();
  });

  colorInput.addEventListener("input", () => {
    source.color = colorInput.value;
    syncCaptureColorSwatches();
    refreshPreview();
    onChange();
  });

  textSizeInput.addEventListener("input", () => {
    source.textSize = Number(textSizeInput.value);
    textSizeValue.textContent = textSizeInput.value;
    refreshPreview();
    onChange();
  });

  sizeInput.addEventListener("input", () => {
    source.size = Number(sizeInput.value);
    sizeValue.textContent = sizeInput.value;
    refreshPreview();
    onChange();
  });

  opacityInput.addEventListener("input", () => {
    source.opacity = Number(opacityInput.value);
    opacityValue.textContent = opacityInput.value;
    refreshPreview();
    onChange();
  });

  widthInput.addEventListener("input", () => {
    source.bodyWidth = clamp(Number(widthInput.value) || 240, 180, 400);
    onChange();
  });
  widthInput.addEventListener("change", () => {
    widthInput.value = String(source.bodyWidth);
  });

  heightInput.addEventListener("input", () => {
    source.bodyMaxHeight = clamp(Number(heightInput.value) || 280, 100, 600);
    onChange();
  });
  heightInput.addEventListener("change", () => {
    heightInput.value = String(source.bodyMaxHeight);
  });

  return container;
}

function createNavSettingsEditor(source, options = {}) {
  const onChange = options.onChange || (() => {});
  const container = document.createElement("div");
  container.className = "capture-settings-editor";

  const enabledWrap = document.createElement("label");
  enabledWrap.className = "toggle-control section-title__toggle capture-enabled-toggle";
  const enabledInput = document.createElement("input");
  enabledInput.type = "checkbox";
  enabledInput.checked = source.enabled !== false;
  const enabledSwitch = document.createElement("span");
  enabledSwitch.className = "toggle-control__switch";
  enabledSwitch.setAttribute("aria-hidden", "true");
  const enabledText = document.createElement("span");
  enabledText.textContent = t("navSettingsLabel");
  enabledWrap.append(enabledInput, enabledSwitch, enabledText);
  container.append(enabledWrap);

  enabledInput.addEventListener("change", () => {
    source.enabled = enabledInput.checked;
    onChange();
  });

  return container;
}

function createAccountRow(account, index) {
  const row = document.createElement("div");
  row.className = "row-card account";
  row.dataset.accountId = account.id;

  const dragHandle = document.createElement("button");
  dragHandle.type = "button";
  dragHandle.className = "account-drag-handle";
  dragHandle.title = t("dragToReorder");
  dragHandle.draggable = true;
  dragHandle.textContent = String(index + 1);

  const username = document.createElement("input");
  username.type = "text";
  username.placeholder = t("usernamePlaceholder");
  username.value = account.username || "";

  const password = document.createElement("input");
  password.type = "password";
  password.placeholder = t("passwordPlaceholder");
  password.value = account.password || "";

  const passwordWrap = document.createElement("div");
  passwordWrap.className = "password-field";
  const togglePassword = document.createElement("button");
  togglePassword.type = "button";
  togglePassword.className = "password-toggle";
  togglePassword.title = t("showPassword");
  togglePassword.setAttribute("aria-label", t("showPassword"));
  togglePassword.append(createLucideIcon("eyeOff", "password-toggle__icon"));
  passwordWrap.append(password, togglePassword);

  const label = document.createElement("input");
  label.type = "text";
  label.placeholder = t("accountLabelPlaceholder");
  label.value = account.label || "";

  const defaultWrap = document.createElement("label");
  defaultWrap.className = "row-check";
  const defaultFill = document.createElement("input");
  defaultFill.type = "checkbox";
  defaultFill.checked = Boolean(account.defaultFill);
  const defaultText = document.createElement("span");
  defaultText.textContent = t("defaultFill");
  defaultWrap.append(defaultFill, defaultText);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove-button";
  remove.title = t("removeAccount");
  remove.append(createLucideIcon("x", "remove-button__icon"));

  dragHandle.addEventListener("dragstart", (event) => {
    document.body.classList.add("is-dragging-account");
    draggingAccountId = account.id;
    clearAccountDropIndicators();
    row.classList.add("is-drag-source");
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", account.id);
    }
  });

  dragHandle.addEventListener("dragend", () => {
    document.body.classList.remove("is-dragging-account");
    draggingAccountId = "";
    clearAccountDropIndicators();
  });

  row.addEventListener("dragover", (event) => {
    if (!draggingAccountId || draggingAccountId === account.id) return;
    event.preventDefault();
    const rect = row.getBoundingClientRect();
    const placement = event.clientY < rect.top + rect.height / 2 ? "before" : "after";
    setAccountDropIndicator(row, placement);
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  });

  row.addEventListener("drop", (event) => {
    if (!draggingAccountId || draggingAccountId === account.id) return;
    event.preventDefault();
    const placement = row.classList.contains("is-drop-after") ? "after" : "before";
    const environment = selectedEnvironment();
    const didMove = reorderAccounts(environment, draggingAccountId, account.id, placement);
    draggingAccountId = "";
    clearAccountDropIndicators();
    if (!didMove) return;
    render();
    markChanged();
  });

  const update = () => {
    const environment = selectedEnvironment();
    clearAccountsValidationError();
    environment.accounts[index] = {
      ...environment.accounts[index],
      label: label.value,
      username: username.value,
      password: password.value,
      defaultFill: defaultFill.checked
    };
    markChanged();
  };

  label.addEventListener("input", update);
  username.addEventListener("input", update);
  password.addEventListener("input", update);
  togglePassword.addEventListener("click", () => {
    const shouldShowPassword = password.type === "password";
    password.type = shouldShowPassword ? "text" : "password";
    const nextTitle = shouldShowPassword ? t("hidePassword") : t("showPassword");
    togglePassword.title = nextTitle;
    togglePassword.setAttribute("aria-label", nextTitle);
    togglePassword.textContent = "";
    togglePassword.append(createLucideIcon(shouldShowPassword ? "eye" : "eyeOff", "password-toggle__icon"));
  });
  defaultFill.addEventListener("change", () => {
    const environment = selectedEnvironment();
    if (defaultFill.checked) {
      environment.accounts.forEach((item, itemIndex) => {
        item.defaultFill = itemIndex === index;
      });
      render();
    } else {
      environment.accounts[index].defaultFill = false;
    }
    markChanged();
  });

  remove.addEventListener("click", () => {
    const environment = selectedEnvironment();
    clearAccountsValidationError();
    environment.accounts.splice(index, 1);
    render();
    markChanged();
  });

  const customFieldsCount = (account.customFields || []).length;
  const customFieldsToggle = document.createElement("button");
  customFieldsToggle.type = "button";
  customFieldsToggle.className = "custom-fields-toggle";
  customFieldsToggle.title = t("customFields");
  customFieldsToggle.classList.toggle("is-empty", customFieldsCount === 0);

  const toggleBadge = document.createElement("span");
  toggleBadge.className = "custom-fields-toggle__badge";
  toggleBadge.textContent = String(customFieldsCount);
  customFieldsToggle.append(toggleBadge);

  customFieldsToggle.addEventListener("click", () => {
    expandedCustomFieldsAccountId =
      expandedCustomFieldsAccountId === account.id ? "" : account.id;
    render();
  });

  row.append(dragHandle, username, passwordWrap, label, defaultWrap, customFieldsToggle, remove);

  const wrapper = document.createElement("div");
  wrapper.className = "account-row-wrapper";
  wrapper.dataset.accountId = account.id;
  wrapper.append(row);

  if (expandedCustomFieldsAccountId === account.id) {
    wrapper.append(createCustomFieldsSection(account));
  }

  return wrapper;
}

function renderRows() {
  const environment = selectedEnvironment();
  nodes.rules.innerHTML = "";
  nodes.accounts.innerHTML = "";

  if (!environment.rules.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = t("noRulesHint");
    nodes.rules.append(empty);
  } else {
    environment.rules.forEach((rule, index) => nodes.rules.append(createRuleRow(rule, index)));
  }

  if (!environment.accounts.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = t("noAccountsHint");
    nodes.accounts.append(empty);
  } else {
    environment.accounts.forEach((account, index) => nodes.accounts.append(createAccountRow(account, index)));
  }
}

function previewStyleLabel(environment) {
  return environment.badgeStyle === "slanted" ? t("badgeStyleSlanted") : t("badgeStylePill");
}

function renderPreviewWatermark(surface, label, environment) {
  const watermark = document.createElement("div");
  watermark.className = "marker-preview__watermark";
  watermark.style.setProperty("--preview-watermark-color", environment.watermarkColor || "#2563eb");
  watermark.style.setProperty("--preview-watermark-opacity", String(environment.watermarkOpacity ?? 0.08));
  watermark.style.setProperty("--preview-watermark-angle", `${environment.watermarkAngle ?? -24}deg`);
  watermark.style.setProperty("--preview-watermark-size", `${environment.watermarkSize ?? 42}px`);
  watermark.style.setProperty("--preview-watermark-gap", `${environment.watermarkGap ?? 80}px`);

  const grid = document.createElement("div");
  grid.className = "marker-preview__watermark-grid";
  for (let index = 0; index < 16; index += 1) {
    const item = document.createElement("span");
    item.className = "marker-preview__watermark-item";
    item.textContent = label;
    grid.append(item);
  }

  watermark.append(grid);
  surface.append(watermark);
}

function renderPreviewBadge(surface, label, environment) {
  const badge = document.createElement("div");
  badge.className = "marker-preview__badge";
  badge.dataset.position = environment.badgePosition || "top-right";
  badge.dataset.style = environment.badgeStyle || "slanted";
  badge.style.setProperty("--preview-badge-color", environment.badgeColor || "#2563eb");
  badge.style.setProperty("--preview-badge-text", environment.badgeTextColor || "#ffffff");
  badge.style.setProperty("--preview-badge-offset", "12px");
  badge.style.setProperty("--preview-badge-opacity", String(environment.badgeOpacity ?? 1));
  badge.style.setProperty("--preview-badge-scale", String(environment.badgeScale ?? 1));
  badge.style.setProperty("--preview-badge-size", `${environment.badgeSize ?? 14}px`);
  badge.textContent = label;
  surface.append(badge);
}

function buildPreviewCanvas(environment, label, previewType) {
  const canvas = document.createElement("div");
  canvas.className = "marker-preview__canvas";

  const chromeBar = document.createElement("div");
  chromeBar.className = "marker-preview__chrome";
  chromeBar.innerHTML = '<span></span><span></span><span></span>';

  const header = document.createElement("div");
  header.className = "marker-preview__header";
  const title = document.createElement("div");
  title.className = "marker-preview__title";
  title.textContent = environment.titlePrefix ? `[${label}] Example Console` : "Example Console";
  const meta = document.createElement("div");
  meta.className = "marker-preview__meta";
  if (previewType === "badge") {
    meta.textContent = environment.badgeEnabled !== false ? t("badgeConfig") : "";
  } else if (previewType === "watermark") {
    meta.textContent = environment.watermarkEnabled === true ? t("watermarkConfig") : "";
  } else {
    meta.textContent = "";
  }
  header.append(title, meta);

  const body = document.createElement("div");
  body.className = "marker-preview__body";
  body.innerHTML = `
    <div class="marker-preview__panel marker-preview__panel--side"></div>
    <div class="marker-preview__panel marker-preview__panel--main">
      <div class="marker-preview__metric"></div>
      <div class="marker-preview__metric marker-preview__metric--wide"></div>
      <div class="marker-preview__metric"></div>
      <div class="marker-preview__metric"></div>
    </div>
  `;

  canvas.append(chromeBar, header, body);
  return canvas;
}

function renderMarkerPreviews() {
  const environment = selectedEnvironment();
  if (!nodes.badgePreviewSurface || !nodes.watermarkPreviewSurface) return;
  nodes.badgePreviewSurface.innerHTML = "";
  nodes.watermarkPreviewSurface.innerHTML = "";
  if (!environment) return;

  const label = markerLabel(environment);
  const watermarkText = watermarkLabel(environment);
  const badgeCanvas = buildPreviewCanvas(environment, label, "badge");
  if (environment.badgeEnabled !== false) {
    renderPreviewBadge(badgeCanvas, label, environment);
  }
  nodes.badgePreviewSurface.append(badgeCanvas);

  const watermarkCanvas = buildPreviewCanvas(environment, label, "watermark");
  if (environment.watermarkEnabled === true) {
    renderPreviewWatermark(watermarkCanvas, watermarkText, environment);
  }
  nodes.watermarkPreviewSurface.append(watermarkCanvas);
}

function renderEnvCaptureSettings() {
  if (!nodes.envCaptureEditor) return;
  const environment = selectedEnvironment();
  nodes.envCaptureEditor.innerHTML = "";
  if (!environment) return;
  const captureSettings = normalizeCaptureSettings(environment.captureSettings);
  const editor = createCaptureSettingsEditor(captureSettings, {
    onChange: () => {
      environment.captureSettings = normalizeCaptureSettings(captureSettings);
      markChanged();
    }
  });
  nodes.envCaptureEditor.append(editor);
}

function renderEnvNavSettings() {
  if (!nodes.envNavEditor) return;
  const environment = selectedEnvironment();
  nodes.envNavEditor.innerHTML = "";
  if (!environment) return;
  const navSettings = normalizeNavSettings(environment.navSettings);
  const editor = createNavSettingsEditor(navSettings, {
    onChange: () => {
      environment.navSettings = normalizeNavSettings(navSettings);
      markChanged();
    }
  });
  nodes.envNavEditor.append(editor);
}

function renderForm() {
  const environment = selectedEnvironment();
  const hasEnvironment = Boolean(environment);
  nodes.form.hidden = !hasEnvironment;
  if (nodes.toolbox) {
    nodes.toolbox.hidden = !hasEnvironment;
  }
  nodes.deleteEnvironment.disabled = !hasEnvironment;
  nodes.addRule.disabled = !hasEnvironment;
  nodes.addAccount.disabled = !hasEnvironment;
  nodes.enabled.disabled = !hasEnvironment;
  nodes.save.disabled = !hasEnvironment;
  if (nodes.saveTemplateFromEnv) nodes.saveTemplateFromEnv.disabled = !hasEnvironment;
  nodes.sectionNavButtons.forEach((button) => {
    button.disabled = !hasEnvironment;
  });

  if (!environment) return;

  isRendering = true;
  clearBasicValidationError();
  renderGroupOptions();
  nodes.name.value = environment.name;
  nodes.group.value = ensureGroupId(environment.groupId, settings.groups);
  nodes.homepageUrl.value = environment.homepageUrl || "";
  nodes.badge.value = environment.badge || environment.name || "";
  nodes.badgeEnabled.checked = environment.badgeEnabled !== false;
  nodes.watermarkEnabled.checked = environment.watermarkEnabled === true;
  nodes.watermarkText.value = watermarkLabel(environment);
  syncColorControls(environment);
  nodes.enabled.checked = environment.enabled !== false;
  syncEnabledLabel();
  nodes.titlePrefix.checked = environment.titlePrefix;
  syncBadgeStyleOptions(environment.badgeStyle);
  nodes.badgePosition.value = environment.badgePosition;
  nodes.badgeScale.value = environment.badgeScale;
  nodes.badgeSize.value = environment.badgeSize;
  nodes.badgeOpacity.value = environment.badgeOpacity;
  nodes.watermarkOpacity.value = environment.watermarkOpacity;
  nodes.watermarkAngle.value = environment.watermarkAngle;
  nodes.watermarkSize.value = environment.watermarkSize;
  nodes.watermarkGap.value = environment.watermarkGap;
  renderRows();
  renderMarkerPreviews();
  renderEnvCaptureSettings();
  renderEnvNavSettings();
  isRendering = false;
}

function render() {
  if (!settings.groups.some((group) => group.id === selectedGroupId)) {
    selectedGroupId = DEFAULT_GROUP_ID;
  }
  if (!selectedEnvironment() && settings.environments.length) {
    selectedId = settings.environments.find((environment) => environment.groupId === selectedGroupId)?.id || settings.environments[0].id;
  }
  decorateStaticButtons();
  renderEnvironmentList();
  renderTemplateGroupList();
  renderForm();
  syncRailNav();
  positionToolbox();
}

function updateSelectedEnvironment(patch) {
  const environment = selectedEnvironment();
  if (!environment) return;
  Object.assign(environment, patch);
  if (patch.groupId) selectedGroupId = patch.groupId;
  renderEnvironmentList();
  if ("badgeColor" in patch || "badgeTextColor" in patch || "watermarkColor" in patch) {
    syncColorControls(environment);
  }
  renderMarkerPreviews();
  markChanged();
}

async function setSelectedEnvironmentEnabled(enabled) {
  const environment = selectedEnvironment();
  if (!environment) return;
  environment.enabled = enabled;
  renderEnvironmentList();
  await persistSettingsSnapshot();
  syncEnabledLabel();
  setStatus(t("saved"));
}

async function setGroupEnvironmentsEnabled(groupId, enabled) {
  settings.environments = settings.environments.map((environment) =>
    environment.groupId === groupId ? { ...environment, enabled } : environment
  );
  await persistSettingsSnapshot();
  render();
  setStatus(t("saved"));
}

function addGroup() {
  const value = window.prompt(t("promptGroupName"), "");
  if (value === null) return;
  const name = normalizeGroupName(value);
  if (settings.groups.some((group) => group.name === name)) {
    setStatus(t("groupExists"), true);
    return;
  }
  const group = { id: uid("group"), name };
  settings.groups.push(group);
  selectedGroupId = group.id;
  render();
  markChanged();
}

function addTemplateGroup() {
  const value = window.prompt(t("promptTemplateGroupName"), "");
  if (value === null) return;
  const name = normalizeTemplateGroupName(value);
  if ((settings.templateGroups || []).some((group) => group.name === name)) {
    setStatus(t("templateGroupExists"), true);
    return;
  }
  settings.templateGroups = settings.templateGroups || [];
  settings.templateGroups.push({ id: uid("template-group"), name, templates: [] });
  renderTemplateGroupList();
  markChanged();
}

function renameTemplateGroup(groupId) {
  const group = (settings.templateGroups || []).find((item) => item.id === groupId);
  if (!group) return;
  const value = window.prompt(t("promptRenameTemplateGroup"), group.name);
  if (value === null) return;
  const name = normalizeTemplateGroupName(value);
  if ((settings.templateGroups || []).some((item) => item.id !== groupId && item.name === name)) {
    setStatus(t("templateGroupExists"), true);
    return;
  }
  group.name = name;
  renderTemplateGroupList();
  markChanged();
}

function deleteTemplateGroup(groupId) {
  const group = (settings.templateGroups || []).find((item) => item.id === groupId);
  if (!group || group.id === DEFAULT_TEMPLATE_GROUP_ID) return;
  if (!window.confirm(t("confirmDeleteTemplateGroup", [group.name]))) return;
  settings.templateGroups = (settings.templateGroups || []).filter((item) => item.id !== groupId);
  renderTemplateGroupList();
  markChanged();
}

function saveSelectedEnvironmentAsTemplate(groupId = DEFAULT_TEMPLATE_GROUP_ID) {
  const environment = selectedEnvironment();
  if (!environment) return;
  settings.templateGroups = normalizeTemplateGroups(settings.templateGroups);
  const group =
    settings.templateGroups.find((item) => item.id === groupId) ||
    settings.templateGroups.find((item) => item.id === DEFAULT_TEMPLATE_GROUP_ID) ||
    settings.templateGroups[0];
  if (!group) return;
  const value = window.prompt(t("promptTemplateName"), environment.name || t("settingsTemplate"));
  if (value === null) return;
  const name = String(value || "").trim() || environment.name || t("settingsTemplate");
  group.templates = group.templates || [];
  group.templates.push(markerTemplateFromEnvironment(environment, name));
  renderTemplateGroupList();
  markChanged();
  setStatus(t("templateSaved"));
}

function deleteTemplate(groupId, templateId) {
  const group = (settings.templateGroups || []).find((item) => item.id === groupId);
  if (!group) return;
  group.templates = (group.templates || []).filter((template) => template.id !== templateId);
  renderTemplateGroupList();
  markChanged();
}

function applyTemplateById(templateId) {
  const environment = selectedEnvironment();
  const found = findTemplate(templateId);
  if (!environment || !found) return;
  applyTemplateToEnvironment(environment, found.template);
  clearBasicValidationError();
  render();
  markChanged();
  setStatus(t("templateApplied"));
}

function renameGroup(groupId) {
  const group = settings.groups.find((item) => item.id === groupId);
  if (!group) return;
  const value = window.prompt(t("promptRenameGroup"), group.name);
  if (value === null) return;
  const name = normalizeGroupName(value);
  if (settings.groups.some((item) => item.id !== groupId && item.name === name)) {
    setStatus(t("groupExists"), true);
    return;
  }
  group.name = name;
  render();
  markChanged();
}

async function deleteGroup(groupId) {
  const group = settings.groups.find((item) => item.id === groupId);
  if (!group || group.id === DEFAULT_GROUP_ID) return;
  if (!window.confirm(t("confirmDeleteGroup", [group.name, defaultGroupName()]))) return;
  settings.environments = settings.environments.map((environment) =>
    environment.groupId === groupId ? { ...environment, groupId: DEFAULT_GROUP_ID } : environment
  );
  settings.groups = settings.groups.filter((item) => item.id !== groupId);
  selectedGroupId = DEFAULT_GROUP_ID;
  if (selectedEnvironment()?.groupId === groupId) {
    selectedId = settings.environments.find((environment) => environment.groupId === DEFAULT_GROUP_ID)?.id || null;
  }
  await persistSettingsSnapshot();
  render();
  setStatus(t("saved"));
}

function addEnvironment(groupId = selectedGroupId || DEFAULT_GROUP_ID) {
  if (!confirmDiscardUnsavedChanges()) return;
  const targetGroupId = groupId || DEFAULT_GROUP_ID;
  const color = pickEnvironmentColor();
  const name = t("newEnvironment");
  const environment = {
    id: uid("env"),
    groupId: ensureGroupId(targetGroupId, settings.groups),
    name,
    homepageUrl: "",
    lastQuickAccessAt: 0,
    enabled: true,
    badge: name,
    badgeEnabled: true,
    badgeColor: color,
    badgeTextColor: "#ffffff",
    badgeStyle: "slanted",
    badgePosition: "top-right",
    badgeScale: 1,
    badgeSize: 14,
    badgeOffset: 12,
    badgeOpacity: 1,
    watermarkText: name,
    watermarkEnabled: false,
    watermarkColor: color,
    watermarkOpacity: 0.08,
    watermarkAngle: -24,
    watermarkSize: 42,
    watermarkGap: 80,
    titlePrefix: true,
    markerMode: "badge",
    rules: [{ type: "wildcard", value: "https://example.com/*" }],
    accounts: []
  };
  settings.environments.push(environment);
  selectedGroupId = environment.groupId;
  selectedId = environment.id;
  render();
  markChanged();
}

function duplicateEnvironment(groupId) {
  if (!confirmDiscardUnsavedChanges()) return;
  const source =
    (selectedEnvironment() && selectedEnvironment().groupId === groupId ? selectedEnvironment() : null) ||
    settings.environments.find((environment) => environment.groupId === groupId);
  if (!source) return;
  const copy = clone(source);
  copy.id = uid("env");
  copy.name = t("newEnvironmentCopy", [copy.name]);
  copy.groupId = groupId;
  settings.environments.push(copy);
  selectedGroupId = copy.groupId;
  selectedId = copy.id;
  render();
  markChanged();
}

async function deleteEnvironment() {
  const environment = selectedEnvironment();
  if (!environment) return;
  const name = typeof environment.name === "string" && environment.name.trim() ? environment.name.trim() : t("environmentFallback");
  if (!window.confirm(t("confirmDeleteEnvironment", [name]))) return;
  const currentGroupId = environment.groupId;
  settings.environments = settings.environments.filter((item) => item.id !== environment.id);
  selectedGroupId = currentGroupId;
  selectedId = settings.environments.find((item) => item.groupId === currentGroupId)?.id || null;
  await persistSettingsSnapshot();
  render();
  setStatus(t("saved"));
}

async function saveSettings() {
  clearBasicValidationError();
  const emptyAccount = findEmptyAccount();
  if (emptyAccount) {
    selectedGroupId = emptyAccount.environment.groupId;
    selectedId = emptyAccount.environment.id;
    render();
    showAccountsValidationError(t("emptyAccountError"));
    return;
  }
  const emptyCustomField = findEmptyCustomField();
  if (emptyCustomField) {
    selectedGroupId = emptyCustomField.environment.groupId;
    selectedId = emptyCustomField.environment.id;
    expandedCustomFieldsAccountId = emptyCustomField.account.id;
    autofocusCustomFieldId = emptyCustomField.field.id;
    render();
    showAccountsValidationError(t("emptyCustomFieldError"));
    return;
  }
  const invalidHomepageEnvironment = findInvalidHomepageEnvironment();
  if (invalidHomepageEnvironment) {
    selectedGroupId = invalidHomepageEnvironment.groupId;
    selectedId = invalidHomepageEnvironment.id;
    render();
    showBasicValidationError(t("invalidEnvironmentUrl"));
    return;
  }
  settings = normalizeSettings(settings);
  await persistSettingsSnapshot();
  clearBasicValidationError();
  clearAccountsValidationError();
  render();
  setStatus(t("saved"));
}

function exportSettings() {
  settings = normalizeSettings(settings);
  const exportSettingsSubset = buildSelectedSettings(settings, exportSelectionState);
  const blob = new Blob([JSON.stringify(buildExportSettings(exportSettingsSubset), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "envmark-config.json";
  link.click();
  URL.revokeObjectURL(url);
  closeExportModal();
  setStatus(t("exported"));
}

function applySettings(nextSettings, message) {
  clearBasicValidationError();
  clearAccountsValidationError();
  settings = normalizeSettings(nextSettings);
  hasUnsavedChanges = message === t("importedSaveToApply") || message === t("sampleLoadedSaveToApply");
  if (!hasUnsavedChanges) {
    savedSettingsSnapshot = clone(settings);
  }
  selectedGroupId = settings.groups[0]?.id || DEFAULT_GROUP_ID;
  selectedId = settings.environments.find((environment) => environment.groupId === selectedGroupId)?.id || settings.environments[0]?.id || null;
  render();
  syncSaveButtonState();
  setStatus(message);
}

async function handleQuickAddFromQuery() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("quickAdd") !== "1") return;

  const title = String(params.get("title") || "").trim();
  const prefixValue = String(params.get("prefix") || "").trim();
  const sourceUrl = String(params.get("url") || "").trim();
  if (!prefixValue) {
    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }

  const existingEnvironment = findEnvironmentByPrefixRule(prefixValue);
  if (existingEnvironment) {
    selectedGroupId = existingEnvironment.groupId || DEFAULT_GROUP_ID;
    selectedId = existingEnvironment.id;
    render();
    setStatus(t("quickAddEnvironmentExists"));
    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }

  const environment = buildQuickEnvironment(title, prefixValue, sourceUrl);
  settings.environments.push(environment);
  selectedGroupId = DEFAULT_GROUP_ID;
  selectedId = environment.id;
  render();
  markChanged();
  setStatus(t("quickAddEnvironmentCreated"));
  window.history.replaceState({}, document.title, window.location.pathname);
}

bindNodeEvent(nodes.name, "input", () => {
  const environment = selectedEnvironment();
  if (!environment) return;
  const nextName = nodes.name.value;
  const previousName = environment.name || "";
  const shouldSyncBadge = !environment.badge || environment.badge === previousName;
  const shouldSyncWatermark = !environment.watermarkText || environment.watermarkText === previousName;
  updateSelectedEnvironment({
    name: nextName,
    ...(shouldSyncBadge ? { badge: nextName } : {}),
    ...(shouldSyncWatermark ? { watermarkText: nextName } : {})
  });
});
bindNodeEvent(nodes.group, "change", () => updateSelectedEnvironment({ groupId: nodes.group.value }));
bindNodeEvent(nodes.homepageUrl, "input", () => {
  clearBasicValidationError();
  updateSelectedEnvironment({ homepageUrl: normalizeHomepageUrl(nodes.homepageUrl.value) });
});
bindNodeEvent(nodes.badge, "input", () => updateSelectedEnvironment({ badge: nodes.badge.value }));
bindNodeEvent(nodes.badgeEnabled, "change", () => updateSelectedEnvironment({ badgeEnabled: nodes.badgeEnabled.checked }));
bindNodeEvent(nodes.watermarkText, "input", () => updateSelectedEnvironment({ watermarkText: nodes.watermarkText.value }));
bindNodeEvent(nodes.badgeColor, "input", () => {
  updateSelectedEnvironment({ badgeColor: nodes.badgeColor.value });
});
bindNodeEvent(nodes.badgeTextColor, "input", () => {
  updateSelectedEnvironment({ badgeTextColor: nodes.badgeTextColor.value });
});
bindNodeEvent(nodes.watermarkColor, "input", () => {
  updateSelectedEnvironment({ watermarkColor: nodes.watermarkColor.value });
});
bindNodeEvent(nodes.watermarkEnabled, "change", () => updateSelectedEnvironment({ watermarkEnabled: nodes.watermarkEnabled.checked }));
bindNodeEvent(nodes.enabled, "change", async () => {
  syncEnabledLabel();
  await setSelectedEnvironmentEnabled(nodes.enabled.checked);
});
bindNodeEvent(nodes.titlePrefix, "change", () => updateSelectedEnvironment({ titlePrefix: nodes.titlePrefix.checked }));

bindNodeEvent(nodes.badgePosition, "change", () => {
  updateSelectedEnvironment({ badgePosition: nodes.badgePosition.value });
});

nodes.badgeStyleOptions.forEach((option) => {
  bindNodeEvent(option, "change", () => {
    const nextStyle = selectedBadgeStyle();
    updateSelectedEnvironment({ badgeStyle: nextStyle });
  });
});

bindNodeEvent(nodes.badgeSize, "input", () => {
  updateSelectedEnvironment({ badgeSize: Number(nodes.badgeSize.value) });
});

bindNodeEvent(nodes.badgeScale, "input", () => {
  updateSelectedEnvironment({ badgeScale: Number(nodes.badgeScale.value) });
});

bindNodeEvent(nodes.badgeOpacity, "input", () => {
  updateSelectedEnvironment({ badgeOpacity: Number(nodes.badgeOpacity.value) });
});

bindNodeEvent(nodes.watermarkOpacity, "input", () => {
  updateSelectedEnvironment({ watermarkOpacity: Number(nodes.watermarkOpacity.value) });
});

bindNodeEvent(nodes.watermarkAngle, "input", () => {
  updateSelectedEnvironment({ watermarkAngle: Number(nodes.watermarkAngle.value) });
});

bindNodeEvent(nodes.watermarkSize, "input", () => {
  updateSelectedEnvironment({ watermarkSize: Number(nodes.watermarkSize.value) });
});

bindNodeEvent(nodes.watermarkGap, "input", () => {
  updateSelectedEnvironment({ watermarkGap: Number(nodes.watermarkGap.value) });
});

nodes.sectionNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scrollTarget);
    if (!target) return;
    clearScrollSettleTimer();
    activeSectionId = button.dataset.scrollTarget;
    scrollTargetLockId = button.dataset.scrollTarget;
    syncRailNav();
    scrollSectionIntoView(target);
  });
});

window.addEventListener(
  "scroll",
  () => {
    const current = currentSectionFromScroll();
    if (!current) return;

    if (!scrollTargetLockId && current.id !== activeSectionId) {
      activeSectionId = current.id;
      syncRailNav();
    }
    scheduleScrollSettle();
    positionToolbox();
  },
  { passive: true }
);

window.addEventListener("resize", positionToolbox, { passive: true });
window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (activeModalName === "export") closeExportModal();
  if (activeModalName === "import") closeImportModal();
  if (activeModalName === "about") closeAboutModal();
});

window.addEventListener("beforeunload", (event) => {
  if (!hasUnsavedChanges) return;
  event.preventDefault();
  event.returnValue = "";
});

bindNodeEvent(nodes.addRule, "click", () => {
  const environment = selectedEnvironment();
  if (!environment) return;
  environment.rules.push({ type: "wildcard", value: "" });
  render();
  markChanged();
});

bindNodeEvent(nodes.environmentSearch, "input", () => {
  environmentSearchQuery = nodes.environmentSearch.value || "";
  renderEnvironmentList();
});

bindNodeEvent(nodes.addAccount, "click", () => {
  const environment = selectedEnvironment();
  if (!environment) return;
  clearAccountsValidationError();
  environment.accounts.push({ id: uid("account"), label: "", username: "", password: "", defaultFill: false });
  render();
  markChanged();
});

bindNodeEvent(nodes.addGroup, "click", addGroup);
bindNodeEvent(nodes.addTemplateGroup, "click", addTemplateGroup);
bindNodeEvent(nodes.saveTemplateFromEnv, "click", () => saveSelectedEnvironmentAsTemplate(DEFAULT_TEMPLATE_GROUP_ID));
bindNodeEvent(nodes.deleteEnvironment, "click", deleteEnvironment);
bindNodeEvent(nodes.save, "click", saveSettings);
bindNodeEvent(nodes.localeSwitcher, "change", async () => {
  await handleLocaleChange(nodes.localeSwitcher.value);
});
bindNodeEvent(nodes.exportConfig, "click", openExportModal);
bindNodeEvent(nodes.aboutTrigger, "click", openAboutModal);
bindNodeEvent(nodes.exportModalClose, "click", closeExportModal);
bindNodeEvent(nodes.exportModalCancel, "click", closeExportModal);
bindNodeEvent(nodes.exportModalConfirm, "click", exportSettings);

bindNodeEvent(nodes.importConfigTrigger, "click", openImportModal);
bindNodeEvent(nodes.importModalClose, "click", closeImportModal);
bindNodeEvent(nodes.importModalCancel, "click", closeImportModal);
bindNodeEvent(nodes.importDropzone, "click", () => nodes.importConfig.click());
bindNodeEvent(nodes.importConfig, "change", async () => {
  const file = nodes.importConfig.files?.[0];
  if (!file) return;
  await readImportFile(file);
  nodes.importConfig.value = "";
});
bindNodeEvent(nodes.importDropzone, "dragover", (event) => {
  event.preventDefault();
  nodes.importDropzone.classList.add("is-dragover");
});
bindNodeEvent(nodes.importDropzone, "dragleave", () => {
  nodes.importDropzone.classList.remove("is-dragover");
});
bindNodeEvent(nodes.importDropzone, "drop", async (event) => {
  event.preventDefault();
  nodes.importDropzone.classList.remove("is-dragover");
  const file = event.dataTransfer?.files?.[0];
  await readImportFile(file);
});
bindNodeEvent(nodes.importModalConfirm, "click", async () => {
  if (!importPreviewSettings || !importSelectionState) return;
  const selectedImportSettings = buildSelectedSettings(importPreviewSettings, importSelectionState);
  const merged = mergeImportedSettings(settings, selectedImportSettings);
  clearBasicValidationError();
  clearAccountsValidationError();
  settings = normalizeSettings(merged);
  const invalidHomepageEnvironment = findInvalidHomepageEnvironment();
  if (invalidHomepageEnvironment) {
    selectedGroupId = invalidHomepageEnvironment.groupId;
    selectedId = invalidHomepageEnvironment.id;
    render();
    showBasicValidationError(t("invalidEnvironmentUrl"));
    closeImportModal();
    return;
  }
  selectedGroupId = settings.groups[0]?.id || DEFAULT_GROUP_ID;
  selectedId = settings.environments.find((environment) => environment.groupId === selectedGroupId)?.id || settings.environments[0]?.id || null;
  await persistSettingsSnapshot();
  render();
  setStatus(t("importedApplied"));
  closeImportModal();
});
bindNodeEvent(nodes.aboutModalClose, "click", closeAboutModal);
bindNodeEvent(nodes.aboutModalConfirm, "click", closeAboutModal);
bindNodeEvent(nodes.modalBackdrop, "click", () => {
  if (activeModalName === "export") closeExportModal();
  if (activeModalName === "import") closeImportModal();
  if (activeModalName === "about") closeAboutModal();
});

bindNodeEvent(nodes.loadSample, "click", async () => {
  const sampleGroup = applyLocalizedSampleGroup();
  await chrome.storage.local.set({ [STORAGE_KEY]: settings });
  savedSettingsSnapshot = clone(settings);
  setStatus(t("sampleLoaded"));

  selectedGroupId = sampleGroup.group.id;
  selectedId = sampleGroup.environments[0]?.id || null;
  clearAccountsValidationError();
  hasUnsavedChanges = false;
  syncSaveButtonState();
  render();
});

async function loadSettings() {
  if (window.envmarkI18n?.setLocaleChoice && window.envmarkI18n?.getLocaleChoice) {
    await window.envmarkI18n.setLocaleChoice(window.envmarkI18n.getLocaleChoice(), { persist: false });
  }
  syncLocaleSwitcher();
  syncAboutModalState();
  const result = await chrome.storage.local.get([STORAGE_KEY]);
  applySettings(result[STORAGE_KEY] || createSampleSettings(), t("ready"));
  selectEnvironmentFromQuery();
  render();
  await handleQuickAddFromQuery();
}

loadSettings();
