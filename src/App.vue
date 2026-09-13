<template>
  <main class="manager-shell" :data-theme="theme">
    <section class="manager-panel">
      <BrandHeader :theme="theme" @toggle-theme="toggleTheme" />
      <PanelHeader :enabled="enabled" />
      <ChirpStatus :enabled="enabled" />
      <ScheduleToggle
        :enabled="enabled"
        :loading="loading"
        :password="password"
        :saving="saving"
        @set-enabled="setEnabled"
      />
      <AuthForm
        :loading="loading"
        :password="password"
        :password-input="passwordInput"
        :saving="saving"
        @unlock="unlockManager"
        @update:password-input="passwordInput = $event"
      />
      <DetailsGrid
        :repository-label="repositoryLabel"
        :updated-at-label="updatedAtLabel"
        :variable-name="variableName"
      />
      <MessageBanner
        :message="message"
        :message-type="messageType"
      />
      <ActionLinks
        :disabled="!password || loading || saving"
        @refresh="loadStatus"
      />
      <AppFooter :current-year="currentYear" />
    </section>
  </main>
</template>

<script>
import ActionLinks from './components/ActionLinks.vue'
import AppFooter from './components/AppFooter.vue'
import AuthForm from './components/AuthForm.vue'
import BrandHeader from './components/BrandHeader.vue'
import ChirpStatus from './components/ChirpStatus.vue'
import DetailsGrid from './components/DetailsGrid.vue'
import MessageBanner from './components/MessageBanner.vue'
import PanelHeader from './components/PanelHeader.vue'
import ScheduleToggle from './components/ScheduleToggle.vue'

function getInitialTheme() {
  const savedTheme = localStorage.getItem('dailyChirpTheme')

  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme
  }

  return 'light'
}

export default {
  name: 'App',
  components: {
    ActionLinks,
    AppFooter,
    AuthForm,
    BrandHeader,
    ChirpStatus,
    DetailsGrid,
    MessageBanner,
    PanelHeader,
    ScheduleToggle
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      enabled: false,
      loading: true,
      message: '',
      messageType: 'neutral',
      owner: 'archejk',
      password: sessionStorage.getItem('managerPassword') || '',
      passwordInput: sessionStorage.getItem('managerPassword') || '',
      repo: 'daily-chirp',
      saving: false,
      theme: getInitialTheme(),
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
    this.applyTheme()

    if (this.password) {
      this.loadStatus()
      return
    }

    this.loading = false
    this.message = 'Enter the manager password to load the schedule setting.'
    this.messageType = 'neutral'
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('dailyChirpTheme', this.theme)
      this.applyTheme()
    },
    applyTheme() {
      document.documentElement.dataset.theme = this.theme
    },
    unlockManager() {
      this.password = this.passwordInput
      sessionStorage.setItem('managerPassword', this.password)
      this.loadStatus()
    },
    async loadStatus() {
      this.loading = true
      this.message = ''

      try {
        const status = await this.request('/api/commit-toggle')

        this.applyStatus(status)
        this.setStatusMessage(status)
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
          headers: this.authHeaders({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ enabled })
        })

        this.applyStatus(status)
        this.message = enabled
          ? 'Scheduled commits are enabled.'
          : 'Scheduled commits are disabled.'
        this.messageType = enabled ? 'success' : 'neutral'
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
    setStatusMessage(status) {
      if (status.missing) {
        this.message = 'COMMIT_ENABLED does not exist yet. Use the switch to create it.'
        this.messageType = 'neutral'
        return
      }

      this.message = status.enabled
        ? 'Scheduled commits are currently enabled.'
        : 'Scheduled commits are currently disabled.'
      this.messageType = status.enabled ? 'success' : 'neutral'
    },
    async request(url, options) {
      const requestOptions = {
        ...options,
        headers: this.authHeaders(options && options.headers)
      }
      const response = await fetch(url, requestOptions)
      const text = await response.text()
      let body = {}

      try {
        body = text ? JSON.parse(text) : {}
      } catch (error) {
        body = {
          error: text || 'The API returned an invalid response.'
        }
      }

      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem('managerPassword')
          this.password = ''
        }

        throw new Error(body.error || 'Request failed')
      }

      return body
    },
    authHeaders(extraHeaders) {
      return {
        'X-Manager-Password': this.password,
        ...extraHeaders
      }
    }
  }
}
</script>
