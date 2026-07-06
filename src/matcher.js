(function (root) {
  const RULE_TYPE_WEIGHT = {
    prefix: 3000,
    wildcard: 2000,
    regex: 1000
  };

  function wildcardToRegExp(pattern) {
    const escaped = String(pattern || "")
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*");
    return new RegExp(`^${escaped}$`);
  }

  function validateRule(rule) {
    if (!rule || !String(rule.value || "").trim()) {
      return { valid: false, error: "empty-rule" };
    }

    try {
      if (rule.type === "regex") {
        new RegExp(rule.value);
      } else if (rule.type === "prefix") {
        String(rule.value);
      } else {
        wildcardToRegExp(rule.value);
      }
      return { valid: true, error: "" };
    } catch (error) {
      return { valid: false, error: error.message || "invalid-rule" };
    }
  }

  function matchesRule(url, rule) {
    if (!rule || !rule.value) return false;
    try {
      if (rule.type === "prefix") return String(url || "").startsWith(rule.value);
      if (rule.type === "regex") return new RegExp(rule.value).test(url);
      return wildcardToRegExp(rule.value).test(url);
    } catch (_) {
      return false;
    }
  }

  function ruleSpecificity(rule) {
    if (!rule?.value) return -1;
    if (rule.type === "prefix") return RULE_TYPE_WEIGHT.prefix + rule.value.length;
    if (rule.type === "wildcard") return RULE_TYPE_WEIGHT.wildcard + rule.value.replace(/\*/g, "").length;
    if (rule.type === "regex") return RULE_TYPE_WEIGHT.regex + rule.value.length;
    return rule.value.length;
  }

  function findRuleMatches(settings, url, options = {}) {
    const resolvedOptions = typeof options === "boolean" ? { includeDisabled: options } : options;
    const includeDisabled = resolvedOptions.includeDisabled === true;
    const matches = [];
    const errors = [];

    (settings?.environments || []).forEach((environment) => {
      if (!includeDisabled && environment.enabled === false) return;
      (environment.rules || []).forEach((rule, ruleIndex) => {
        const validation = validateRule(rule);
        if (!validation.valid) {
          errors.push({ environment, rule, ruleIndex, error: validation.error });
          return;
        }
        if (!matchesRule(url, rule)) return;
        matches.push({
          environment,
          rule,
          ruleIndex,
          specificity: ruleSpecificity(rule)
        });
      });
    });

    matches.sort((left, right) => right.specificity - left.specificity);
    return { matches, errors };
  }

  function inspectUrl(settings, url, options = {}) {
    const { matches, errors } = findRuleMatches(settings, url, options);
    return {
      url,
      matchedEnvironment: matches[0]?.environment || null,
      matchedRule: matches[0]?.rule || null,
      matchedRuleIndex: matches[0]?.ruleIndex ?? -1,
      specificity: matches[0]?.specificity ?? -1,
      matches,
      errors,
      hasOverlap: matches.length > 1
    };
  }

  function findEnvironment(settings, url, options = {}) {
    return inspectUrl(settings, url, options).matchedEnvironment;
  }

  root.EnvMarkMatcher = {
    wildcardToRegExp,
    validateRule,
    matchesRule,
    ruleSpecificity,
    findRuleMatches,
    inspectUrl,
    findEnvironment
  };
})(typeof globalThis !== "undefined" ? globalThis : self);
