<template>
  <div class="brand-row" aria-label="Daily Chirp">
    <div class="brand-lockup">
      <div class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img">
          <path d="M48 16c-2 3-5 5-9 6 0-4-3-7-8-8-8-2-16 4-17 12-1 9 5 17 14 18 8 1 16-4 18-12l7-3-7-3c1-3 2-6 2-10Z"/>
          <path d="M19 29c5-8 14-10 23-7-4 3-8 5-13 5-4 0-7 1-10 2Z"/>
          <circle cx="33" cy="21" r="3"/>
          <path d="M15 42c5 5 14 7 22 3-6 8-17 8-24 1l2-4Z"/>
        </svg>
      </div>
      <div>
        <strong>daily-chirp</strong>
        <span>GitHub schedule manager</span>
      </div>
    </div>

    <button
      class="theme-toggle"
      type="button"
      :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`"
      @click="$emit('toggle-theme')"
    >
      <svg
        v-if="theme === 'light'"
        class="theme-icon theme-icon--moon"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M21 14.5A8.3 8.3 0 0 1 9.5 3a8.8 8.8 0 1 0 11.5 11.5Z"/>
      </svg>
      <svg
        v-else
        class="theme-icon theme-icon--sun"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'BrandHeader',
  props: {
    theme: {
      type: String,
      required: true
    }
  },
  emits: ['toggle-theme']
}
</script>
