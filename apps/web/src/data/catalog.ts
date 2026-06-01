/** Realistic value pools the generators sample from. */

export const REPO_NAMES = [
  "payments-api", "web-app", "auth-service", "billing-worker", "design-system",
  "mobile-ios", "mobile-android", "data-pipeline", "ml-platform", "infra-terraform",
  "ci-pipelines", "docs-site", "marketing-site", "notifications-svc", "search-index",
  "gateway", "admin-dashboard", "analytics-events", "feature-flags", "edge-functions",
  "graphql-api", "user-service", "inventory-svc", "checkout-ui", "image-resizer",
  "cron-jobs", "webhooks-relay", "sdk-js", "sdk-python", "cli-tools",
  "kafka-consumers", "report-builder", "audit-log-svc", "email-templates", "pricing-engine",
  "internal-tools", "status-page", "load-tests", "chaos-suite", "secrets-rotator",
];

export const LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Go", "Rust", "Ruby", "Java", "PHP", "Shell", "HCL", "Dockerfile",
];

export const TOPICS = [
  "api", "frontend", "backend", "infra", "internal", "library", "service",
  "deprecated", "experimental", "core", "data", "security", "mobile",
];

export const SECRET_PROVIDERS: { provider: string; type: string }[] = [
  { provider: "aws", type: "AWS Access Key ID" },
  { provider: "aws", type: "AWS Secret Access Key" },
  { provider: "github", type: "GitHub Personal Access Token" },
  { provider: "openai", type: "OpenAI API Key" },
  { provider: "stripe", type: "Stripe Live Secret Key" },
  { provider: "google", type: "Google Cloud Service Account" },
  { provider: "slack", type: "Slack Bot Token" },
  { provider: "postgres", type: "PostgreSQL Connection URI" },
  { provider: "twilio", type: "Twilio Auth Token" },
  { provider: "jwt", type: "JWT Signing Secret" },
  { provider: "ssh", type: "SSH Private Key" },
];

export const SECRET_FILES = [
  ".env", ".env.production", "config/secrets.yml", "docker-compose.yml",
  "src/config.ts", "terraform/main.tf", "scripts/deploy.sh", "k8s/secret.yaml",
  ".github/workflows/deploy.yml", "settings.py", "application.properties", "credentials.json",
];

export const PACKAGES: Record<string, string[]> = {
  npm: ["lodash", "axios", "react", "next", "express", "minimist", "node-fetch", "ws", "tar", "semver", "jsonwebtoken", "moment", "ejs", "qs", "follow-redirects"],
  pypi: ["requests", "django", "flask", "pyyaml", "urllib3", "jinja2", "cryptography", "pillow", "numpy", "werkzeug"],
  go: ["golang.org/x/net", "github.com/gin-gonic/gin", "gopkg.in/yaml.v2", "github.com/dgrijalva/jwt-go"],
  maven: ["log4j-core", "spring-core", "jackson-databind", "commons-collections"],
  rubygems: ["rails", "nokogiri", "rack", "devise"],
};

export const VULN_TITLES = [
  "Prototype pollution", "Remote code execution", "Cross-site scripting (XSS)",
  "SQL injection", "Denial of service via ReDoS", "Arbitrary file write",
  "Server-side request forgery", "Improper certificate validation",
  "Path traversal", "Deserialization of untrusted data", "Authentication bypass",
  "Information exposure", "Command injection",
];

export const CWES = [
  "CWE-79", "CWE-89", "CWE-94", "CWE-1321", "CWE-400", "CWE-22", "CWE-918", "CWE-502", "CWE-287", "CWE-78",
];

export const CODE_RULES: { rule: string; ruleId: string; desc: string }[] = [
  { rule: "SQL query built from user-controlled sources", ruleId: "js/sql-injection", desc: "Untrusted input flows into a SQL query without sanitization." },
  { rule: "Reflected cross-site scripting", ruleId: "js/reflected-xss", desc: "User input is written to the page without escaping." },
  { rule: "Hard-coded credentials", ruleId: "js/hardcoded-credentials", desc: "Credentials are embedded directly in source code." },
  { rule: "Uncontrolled command line", ruleId: "js/command-line-injection", desc: "A shell command is built from untrusted input." },
  { rule: "Insecure randomness", ruleId: "js/insecure-randomness", desc: "A weak PRNG is used in a security-sensitive context." },
  { rule: "Missing rate limiting", ruleId: "js/missing-rate-limiting", desc: "An expensive route has no rate limiting." },
  { rule: "Clear-text logging of sensitive data", ruleId: "py/clear-text-logging", desc: "Sensitive data is written to logs in clear text." },
  { rule: "Path injection", ruleId: "py/path-injection", desc: "A file path is constructed from untrusted input." },
];

export const ACTIONS: { name: string; popular: boolean }[] = [
  { name: "actions/checkout", popular: true },
  { name: "actions/setup-node", popular: true },
  { name: "actions/cache", popular: true },
  { name: "actions/upload-artifact", popular: true },
  { name: "docker/build-push-action", popular: true },
  { name: "aws-actions/configure-aws-credentials", popular: true },
  { name: "tj-actions/changed-files", popular: false },
  { name: "reviewdog/action-eslint", popular: false },
  { name: "peter-evans/create-pull-request", popular: false },
  { name: "some-org/custom-deploy", popular: false },
  { name: "codecov/codecov-action", popular: true },
  { name: "google-github-actions/auth", popular: true },
];

export const WORKFLOW_FILES = [
  "ci.yml", "deploy.yml", "release.yml", "test.yml", "build.yml", "codeql.yml", "publish.yml", "nightly.yml",
];

export const FIRST_NAMES = [
  "Alex", "Sam", "Jordan", "Taylor", "Casey", "Riley", "Morgan", "Jamie", "Drew", "Quinn",
  "Avery", "Parker", "Reese", "Cameron", "Hayden", "Emerson", "Devin", "Skyler", "Noah", "Maya",
  "Leo", "Ivy", "Omar", "Priya", "Wei", "Sofia", "Diego", "Hana", "Ravi", "Elena",
];

export const LAST_NAMES = [
  "Chen", "Patel", "Kim", "Garcia", "Nguyen", "Smith", "Johnson", "Müller", "Rossi", "Silva",
  "Kowalski", "Andersson", "Okafor", "Yamamoto", "Costa", "Novak", "Ahmed", "Petrov", "Reyes", "Walsh",
];

export const TEAMS = ["platform", "security", "frontend", "backend", "infra", "data", "mobile", "design", "sre", "growth"];

export const OAUTH_APPS: { name: string; kind: "oauth" | "github-app"; perms: string[] }[] = [
  { name: "Vercel", kind: "github-app", perms: ["contents:read", "deployments:write", "checks:write"] },
  { name: "Netlify", kind: "github-app", perms: ["contents:read", "statuses:write"] },
  { name: "CircleCI", kind: "oauth", perms: ["repo", "admin:repo_hook"] },
  { name: "Codecov", kind: "github-app", perms: ["contents:read", "pull_requests:write"] },
  { name: "Sentry", kind: "github-app", perms: ["contents:read", "issues:write"] },
  { name: "Linear", kind: "oauth", perms: ["repo", "read:org"] },
  { name: "Snyk", kind: "github-app", perms: ["contents:read", "security_events:read"] },
  { name: "Dependabot", kind: "github-app", perms: ["contents:write", "pull_requests:write"] },
  { name: "Slack", kind: "github-app", perms: ["contents:read"] },
  { name: "Old Heroku Pipeline", kind: "oauth", perms: ["repo", "admin:org", "delete_repo"] },
  { name: "Personal Script (deploy)", kind: "oauth", perms: ["repo", "workflow", "admin:repo_hook"] },
];

export const WEBHOOK_EVENTS = ["push", "pull_request", "release", "issues", "deployment", "workflow_run", "member", "*"];

export const PAT_SCOPES = ["repo", "workflow", "read:org", "admin:org", "delete_repo", "write:packages", "admin:repo_hook", "gist", "user"];
