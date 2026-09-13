<template>
  <main class="manager-shell">
    <section class="manager-panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Daily Chirp Manager</p>
          <h1>Schedule control</h1>
        </div>
        <span class="status-pill" :class="{ active: enabled }">
          {{ enabled ? 'Enabled' : 'Disabled' }}
        </span>
      </div>

      <div class="toggle-row">
        <div>
          <h2>Automated commits</h2>
          <p>
            Toggle the GitHub Actions variable that controls whether the scheduled
            workflow can create commits.
          </p>
        </div>

        <label class="switch" :class="{ loading: saving }">
          <input
            type="checkbox"
            :checked="enabled"
            :disabled="loading || saving"
            @change="setEnabled($event.target.checked)"
          >
          <span class="slider"></span>
        </label>
      </div>

      <dl class="details-grid">
        <div>
          <dt>Repository</dt>
          <dd>{{ repositoryLabel }}</dd>
        </div>
        <div>
          <dt>Variable</dt>
          <dd>{{ variableName }}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{{ updatedAtLabel }}</dd>
        </div>
      </dl>

      <p v-if="message" class="message" :class="messageType">{{ message }}</p>

      <div class="actions-row">
        <button type="button" :disabled="loading || saving" @click="loadStatus">
          Refresh
        </button>
        <a
          href="https://github.com/archejk/daily-chirp/actions/workflows/daily-commit.yml"
          target="_blank"
          rel="noopener"
        >
          Open workflow
        </a>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      enabled: false,
      loading: true,
      message: '',
      messageType: 'neutral',
      owner: 'archejk',
      repo: 'daily-chirp',
      saving: false,
      updatedAt: null,
      variableName: 'COMMIT_ENABLED'
    }
  },
  computed: {
    repositoryLabel() {
      return `${this.owner}/${this.repo}`
    },
    updatedAtLabel() {
      if (!this.updatedAt) {
        return 'Not available yet'
      }

      return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(this.updatedAt))
    }
  },
  mounted() {
    this.loadStatus()
  },
  methods: {
    async loadStatus() {
      this.loading = true
      this.message = ''

      try {
        const status = await this.request('/api/commit-toggle')

        this.applyStatus(status)
        this.message = status.missing
          ? 'COMMIT_ENABLED does not exist yet. Use the switch to create it.'
          : 'Current schedule setting loaded.'
        this.messageType = 'success'
      } catch (error) {
        this.message = error.message
        this.messageType = 'error'
      } finally {
        this.loading = false
      }
    },
    async setEnabled(enabled) {
      const previousValue = this.enabled
      this.enabled = enabled
      this.saving = true
      this.message = enabled ? 'Enabling scheduled commits...' : 'Disabling scheduled commits...'
      this.messageType = 'neutral'

      try {
        const status = await this.request('/api/commit-toggle', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ enabled })
        })

        this.applyStatus(status)
        this.message = enabled
          ? 'Scheduled commits are enabled.'
          : 'Scheduled commits are disabled.'
        this.messageType = 'success'
      } catch (error) {
        this.enabled = previousValue
        this.message = error.message
        this.messageType = 'error'
      } finally {
        this.saving = false
      }
    },
    applyStatus(status) {
      this.enabled = status.enabled
      this.owner = status.owner
      this.repo = status.repo
      this.variableName = status.name
      this.updatedAt = status.updatedAt
    },
    async request(url, options) {
      const response = await fetch(url, options)
      const body = await response.json()

      if (!response.ok) {
        throw new Error(body.error || 'Request failed')
      }

      return body
    }
  }
}
</script>

<style>
:root {
  --background: #f5f7fb;
  --border: #d9e1ec;
  --danger: #b42318;
  --danger-bg: #fff2f0;
  --ink: #1d2733;
  --muted: #637083;
  --panel: #ffffff;
  --success: #16794f;
  --success-bg: #eaf8f1;
  --track: #b8c2d1;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--background);
}

button,
input {
  font: inherit;
}

#app {
  min-height: 100vh;
  color: var(--ink);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.manager-shell {
  align-items: center;
  display: flex;
  min-height: 100vh;
  padding: 32px;
}

.manager-panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(29, 39, 51, 0.08);
  margin: 0 auto;
  max-width: 760px;
  padding: 32px;
  width: 100%;
}

.panel-header,
.toggle-row,
.actions-row {
  align-items: center;
  display: flex;
  gap: 24px;
  justify-content: space-between;
}

.eyebrow {
  color: var(--success);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 6px;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  font-size: 36px;
  line-height: 1.1;
  margin-bottom: 0;
}

h2 {
  font-size: 20px;
  margin-bottom: 8px;
}

p {
  color: var(--muted);
  line-height: 1.55;
  margin-bottom: 0;
}

.status-pill {
  background: #edf1f6;
  border-radius: 999px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
  padding: 8px 14px;
}

.status-pill.active {
  background: var(--success-bg);
  color: var(--success);
}

.toggle-row {
  border-bottom: 1px solid var(--border);
  border-top: 1px solid var(--border);
  margin: 32px 0;
  padding: 28px 0;
}

.switch {
  display: inline-flex;
  flex: 0 0 auto;
  height: 34px;
  position: relative;
  width: 62px;
}

.switch input {
  height: 0;
  opacity: 0;
  width: 0;
}

.slider {
  background: var(--track);
  border-radius: 999px;
  cursor: pointer;
  inset: 0;
  position: absolute;
  transition: background 0.2s ease;
}

.slider::before {
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(29, 39, 51, 0.24);
  content: '';
  height: 26px;
  left: 4px;
  position: absolute;
  top: 4px;
  transition: transform 0.2s ease;
  width: 26px;
}

.switch input:checked + .slider {
  background: var(--success);
}

.switch input:checked + .slider::before {
  transform: translateX(28px);
}

.switch.loading {
  opacity: 0.64;
}

.details-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
}

.details-grid div {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
}

dt {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
  text-transform: uppercase;
}

dd {
  font-weight: 700;
  margin: 0;
  overflow-wrap: anywhere;
}

.message {
  border-radius: 8px;
  font-weight: 700;
  margin-top: 24px;
  padding: 14px 16px;
}

.message.success {
  background: var(--success-bg);
  color: var(--success);
}

.message.error {
  background: var(--danger-bg);
  color: var(--danger);
}

.message.neutral {
  background: #edf1f6;
  color: var(--ink);
}

.actions-row {
  margin-top: 24px;
}

button,
.actions-row a {
  align-items: center;
  border-radius: 8px;
  display: inline-flex;
  font-weight: 700;
  min-height: 42px;
  padding: 0 16px;
  text-decoration: none;
}

button {
  background: var(--ink);
  border: 0;
  color: #ffffff;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.actions-row a {
  color: var(--success);
}

@media (max-width: 720px) {
  .manager-shell {
    align-items: stretch;
    padding: 16px;
  }

  .manager-panel {
    padding: 24px;
  }

  .panel-header,
  .toggle-row,
  .actions-row {
    align-items: flex-start;
    flex-direction: column;
  }

  h1 {
    font-size: 30px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
