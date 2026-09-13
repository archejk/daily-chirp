<template>
  <form class="auth-row" @submit.prevent="$emit('unlock')">
    <div class="auth-heading">
      <label for="manager-password">Manager password</label>
      <span class="auth-chip" :class="{ unlocked: password }">
        {{ password ? 'Unlocked' : 'Locked' }}
      </span>
    </div>
    <div class="auth-controls">
      <div class="password-field">
        <input
          id="manager-password"
          :value="passwordInput"
          autocomplete="current-password"
          placeholder="Enter password"
          :type="showPassword ? 'text' : 'password'"
          @input="$emit('update:password-input', $event.target.value)"
        >
        <button
          class="password-toggle"
          type="button"
          :aria-label="showPassword ? 'Hide manager password' : 'Show manager password'"
          :disabled="!passwordInput"
          @click="showPassword = !showPassword"
        >
          <svg v-if="showPassword" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m3 3 18 18"/>
            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/>
            <path d="M9.9 4.2A9.4 9.4 0 0 1 12 4c5 0 8.6 3.1 10 8a12.4 12.4 0 0 1-2.2 4"/>
            <path d="M6.7 6.8A12.2 12.2 0 0 0 2 12c1.4 4.9 5 8 10 8 1.8 0 3.5-.4 4.9-1.2"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 12c1.4-4.9 5-8 10-8s8.6 3.1 10 8c-1.4 4.9-5 8-10 8s-8.6-3.1-10-8Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
      <button type="submit" :disabled="!canSubmit">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.7 5.2c-.8 1.2-2 2-3.6 2.4 0-1.7-1.3-3-3.4-3.4C8.4 3.5 5 5.9 4.4 9.3c-.6 3.9 2.1 7.2 6 7.7 3.5.4 6.7-1.7 7.5-5l2.8-1.2-2.8-1.1c.4-1.4.8-2.8.8-4.5Z"/>
          <circle cx="12.3" cy="7.5" r="1.1"/>
        </svg>
        {{ actionLabel }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'AuthForm',
  data() {
    return {
      showPassword: false
    }
  },
  computed: {
    actionLabel() {
      if (!this.password) {
        return 'Unlock'
      }

      return this.passwordInput === this.password ? 'Unlocked' : 'Update'
    },
    canSubmit() {
      return Boolean(this.passwordInput) &&
        !this.loading &&
        !this.saving &&
        this.passwordInput !== this.password
    }
  },
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    passwordInput: {
      type: String,
      required: true
    },
    saving: {
      type: Boolean,
      required: true
    }
  },
  emits: ['unlock', 'update:password-input']
}
</script>
