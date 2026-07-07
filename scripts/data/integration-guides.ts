export interface SetupGuide {
  providerName: string
  prerequisiteUrl?: string
  prerequisiteSteps: string[]
  fieldMapping: Record<string, string>
  callbackUrl?: string
  permissions?: Record<string, string>
  notes?: string[]
}

export const integrationGuides: Record<string, SetupGuide> = {
  'github-app': {
    providerName: 'GitHub',
    prerequisiteUrl: 'https://github.com/settings/apps/new',
    prerequisiteSteps: [
      "Go to GitHub → Settings → Developer settings → GitHub Apps → New GitHub App",
      "Set 'GitHub App name' to something like 'PrismaLens - <your org>'",
      "Set 'Homepage URL' to your PrismaLens instance URL",
      "Under 'Webhook', uncheck 'Active' — GitHub webhook support is coming soon. Leave webhooks disabled for now.",
      "Under 'Permissions', grant the permissions listed below",
      "Under 'Where can this GitHub App be installed?', select 'Only on this account' (or 'Any account' for multi-org)",
      "Click 'Create GitHub App'",
      "On the App settings page, note down the 'App ID'",
      "Scroll down and click 'Generate a private key' — save the downloaded .pem file",
      "Go to 'Install App' in the sidebar and install it on the desired organization/account",
    ],
    fieldMapping: {
      appId: 'App ID — found at the top of the GitHub App settings page',
      privateKey: 'Private Key — the .pem file generated in the App settings',
      webhookSecret: 'Webhook Secret — only needed if you enable webhooks (optional)',
      installationId: 'Installation ID — found in the URL after installing the App (github.com/settings/installations/<ID>)',
    },
    permissions: {
      contents: 'read — access repository files and code',
      metadata: 'read — access repository metadata',
      issues: 'read — access issues for investigation context',
      pull_requests: 'read — access PRs for investigation context',
    },
    notes: [
      'GitHub Apps have higher rate limits than PATs (5,000 per hour, per-installation)',
      'The private key is sensitive — store it securely and never commit it to version control',
      'You can restrict the App to specific repositories during installation',
    ],
  },

  'github-token': {
    providerName: 'GitHub',
    prerequisiteUrl: 'https://github.com/settings/tokens?type=beta',
    prerequisiteSteps: [
      "Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens",
      "Click 'Generate new token'",
      "Set a descriptive name like 'PrismaLens'",
      "Set expiration (recommend 90 days, rotate regularly)",
      "Under 'Repository access', select the repositories PrismaLens should access",
      "Under 'Permissions', grant 'Contents: Read-only' and 'Metadata: Read-only'",
      "Click 'Generate token' and copy the token immediately (it won't be shown again)",
    ],
    fieldMapping: {
      apiKey: 'Personal Access Token — the token starting with github_pat_...',
      organization: 'Organization name — the GitHub org whose repos PrismaLens should access',
    },
    permissions: {
      Contents: 'Read-only — access repository files and code',
      Metadata: 'Read-only — access repository metadata',
    },
    notes: [
      'Fine-grained PATs are recommended over classic tokens for better security scoping',
      'Tokens expire — set a calendar reminder to rotate before expiry',
      'Classic tokens (ghp_...) also work but grant broader access than necessary',
    ],
  },

  slack: {
    providerName: 'Slack',
    prerequisiteUrl: 'https://api.slack.com/apps',
    prerequisiteSteps: [
      "Go to api.slack.com/apps and click 'Create New App'",
      "Choose 'From scratch' and name it 'PrismaLens'",
      "Select the workspace to install it in",
      "Go to 'OAuth & Permissions' in the sidebar",
      "Add the required Bot Token Scopes listed below",
      "Set the 'Redirect URL' to your PrismaLens callback URL (see below)",
      "Go to 'Basic Information' and note the Client ID and Client Secret",
    ],
    fieldMapping: {
      clientId: "Client ID — found on the 'Basic Information' page",
      clientSecret: "Client Secret — found on the 'Basic Information' page",
    },
    callbackUrl: '{{origin}}/api/integrations/oauth/callback',
    permissions: {
      'channels:read': 'List channels in the workspace',
      'chat:write': 'Send messages to channels',
      'users:read': 'Read user profiles for incident context',
      'groups:read': 'List private channels the bot is in',
    },
    notes: [
      'The Redirect URL must exactly match your PrismaLens instance URL',
      'The bot must be invited to channels where it should send notifications',
    ],
  },

  'slack-token': {
    providerName: 'Slack',
    prerequisiteUrl: 'https://api.slack.com/apps',
    prerequisiteSteps: [
      "Go to api.slack.com/apps and click 'Create New App'",
      "Choose 'From scratch' and name it 'PrismaLens'",
      "Go to 'OAuth & Permissions' and add Bot Token Scopes: chat:write",
      "Click 'Install to Workspace' and authorize",
      "Copy the 'Bot User OAuth Token' (starts with xoxb-)",
    ],
    fieldMapping: {
      apiKey: "Bot User OAuth Token — starts with xoxb-, found on 'OAuth & Permissions' page after installation",
      defaultChannel: 'Default Channel — the Slack channel name (e.g., #incidents) where PrismaLens sends notifications',
    },
    permissions: {
      'chat:write': 'Send messages to channels',
    },
    notes: [
      'The bot token approach is simpler than OAuth but requires manual token management',
      'Invite the bot to the target channel with /invite @PrismaLens',
    ],
  },

  prometheus: {
    providerName: 'Prometheus',
    prerequisiteSteps: [
      'Ensure your Prometheus server is reachable from the PrismaLens instance',
      'If Prometheus is behind authentication, have your credentials ready',
      'Note the Prometheus server URL (default: http://localhost:9090)',
    ],
    fieldMapping: {
      baseUrl: 'Prometheus URL — the base URL of your Prometheus server (e.g., http://prometheus:9090)',
      username: 'Username — only required if Prometheus has basic auth enabled',
      apiKey: 'Password / API Key — only required if Prometheus has basic auth enabled',
    },
    callbackUrl: '{{origin}}/api/webhooks/prometheus',
    notes: [
      "Many Prometheus setups don't require authentication — leave username and password blank if yours doesn't",
      'If using Prometheus behind a reverse proxy with TLS, use the https:// URL',
      'PrismaLens uses the /api/v1/ query endpoints to fetch metrics during investigations',
      'Configure the callback URL as a webhook receiver in your alertmanager.yml under receivers[].webhook_configs[].url',
    ],
  },

  render: {
    providerName: 'Render',
    prerequisiteUrl: 'https://dashboard.render.com/u/settings#api-keys',
    prerequisiteSteps: [
      "Go to Render Dashboard → Account Settings → API Keys",
      "Click 'Create API Key'",
      "Give it a descriptive name like 'PrismaLens'",
      "Copy the generated key (starts with rnd_)",
    ],
    fieldMapping: {
      apiKey: 'API Key — the key starting with rnd_, found in Account Settings → API Keys',
    },
    notes: [
      'Render API keys have full account access — consider using a team-scoped key if available',
      'PrismaLens uses the Render API to query service status during investigations',
    ],
  },
}
