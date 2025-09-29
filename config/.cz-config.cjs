module.exports = {
  types: [
    { value: "🎉 init", name: "init:        🎉 Initial commit" },
    { value: "✨ feat", name: "feat:        ✨ New feature" },
    { value: "🐛 fix", name: "fix:         🐛 Bug fix" },
    { value: "📚 docs", name: "docs:        📚 Documentation" },
    { value: "💄 style", name: "style:       💄 Styling (whitespace, formatting, missing semicolons, no code change)" },
    { value: "♻️ refactor", name: "refactor:    ♻️  Refactoring (no feature, no fix)" },
    { value: "⚡ perf", name: "perf:        ⚡ Performance improvements" },
    { value: "🧪 test", name: "test:        🧪 Tests" },
    { value: "🔧 chore", name: "chore:       🔧 Configuration, tooling, maintenance" },
    { value: "🧱 ci", name: "ci:          🧱 CI/CD pipeline" },
    { value: "📦 build", name: "build:       📦 Build system or dependencies" },
    { value: "🗃️ raw", name: "raw:         🗃️  Data, assets, seeds" },
    { value: "🧹 cleanup", name: "cleanup:     🧹 Code cleanup / dead code removal" },
    { value: "🗑️ remove", name: "remove:      🗑️  Removing a file" },
    { value: "🚚 move", name: "move:        🚚 Move/Rename files" },
    { value: "🔒 security", name: "security:    🔒 Security updates" },
    { value: "♿ accessibility", name: "accessibility: ♿ Accessibility (a11y)" },
    { value: "📱 responsive", name: "responsive:  📱 Responsiveness" },
    { value: "🔍 seo", name: "seo:         🔍 SEO" },
    { value: "🔖 release", name: "release:     🔖 Version tag / release" },
    { value: "🚀 deploy", name: "deploy:      🚀 Deployment" },
    { value: "🚧 wip", name: "wip:         🚧 Work in progress" },
    { value: "💥 breaking", name: "breaking:    💥 Reverting or breaking changes" },
    { value: "🏷️ types", name: "types:       🏷️  Types" },
    { value: "🥅 error", name: "error:       🥅 Error handling" },
    { value: "💫 animation", name: "animation:   💫 Animations and transitions" },
    { value: "💡 comments", name: "comments:    💡 Comments" },
    { value: "📝 text", name: "text:        📝 Text/content updates" },
    { value: "🔜 ideas", name: "ideas:       🔜 Ideas backlog (tasks)" },
  ],

  scopes: [
    { name: "api" },
    { name: "auth" },
    { name: "backend" },
    { name: "build" },
    { name: "config" },
    { name: "database" },
    { name: "deps" },
    { name: "docs" },
    { name: "frontend" },
    { name: "hooks" },
    { name: "lint" },
    { name: "organization" }, // tradução de "organização"
    { name: "performance" },
    { name: "security" },
    { name: "tests" },
    { name: "ui" },
    { name: "validation" }, // tradução de "validação"
    { name: "formatting" }, // tradução de "formatação"
    { name: "model" },
    { name: "entity" },
    { name: "service" },
    { name: "utils" },
    // extras úteis
    { name: "routing" },
    { name: "state" },
    { name: "i18n" },
    { name: "logging" },
    { name: "monitoring" },
  ],

  allowCustomScopes: true,
  allowBreakingChanges: ["✨ feat", "🐛 fix", "💥 breaking"],

  messages: {
    type: "Select the commit type:",
    scope: "Select a scope (or leave empty):",
    customScope: "Enter a custom scope:",
    subject:
      "Write a short, imperative description (no period). Example: 'Add login form validation':",
    body:
      "Provide a longer description (optional). Use '|' for new lines. Mention motivation and context:",
    breaking:
      "List breaking changes (optional). Explain what changed and migration steps:",
    footer:
      "Add issue/task IDs or references (e.g., JIRA-123, GH-45). Use commas for multiple:",
    confirmCommit: "Confirm the commit above?",
  },

  // Skip rarely used prompts, you can re-enable anytime
  skipQuestions: ["body", "breaking"],

  // Subject validations
  subjectLimit: 100,
  subjectMinLength: 5,

  // Body line breaks (allows multi-line body via "|")
  breaklineChar: "|",

  // Footer helpers (you can still type custom text)
  footerPrefix: "Refs:",
  issuePrefixes: ["Closes:", "Fixes:", "Refs:"], // just a hint for users

  // Final commit template
  // Ensures clean spacing and consistent output even with empty fields
  format: ({ type, scope, subject, body, breaking, footer }) => {
    const clean = (s) =>
      (s || "")
        .trim()
        .replace(/\s+/g, " ");

    const scopeStr = scope ? `(${clean(scope)})` : "";
    const subjectStr = clean(subject);
    const bodyStr = clean(body).replace(/\|/g, "\n");
    const breakingStr = clean(breaking).replace(/\|/g, "\n");
    const footerStr = clean(footer);

    let msg = `${type}${scopeStr}: ${subjectStr}`;

    if (bodyStr) msg += `\n\n${bodyStr}`;
    if (breakingStr) msg += `\n\nBREAKING CHANGE: ${breakingStr}`;
    if (footerStr) msg += `\n\n${footerStr}`;

    return msg;
  },

  // Optional: enforce lowercase subject and strip trailing period
  subjectLowerCase: true,
  subjectStripPeriod: true,

  // Optional: regex for allowed ticket IDs in footer (e.g., JIRA-123, GH-1)
  footerIssueRegex: /\b([A-Z]+-\d+|GH-\d+)\b/g,
};