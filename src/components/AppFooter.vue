<template>
  <footer class="app-footer">
    <span>
      Created
      <a
        href="https://github.com/archejk/daily-chirp/commit/ce399f269b2e642a8f1a4faa585bdb1d356d3f79"
        target="_blank"
        rel="noopener"
      >
        Jun 22, 2024
      </a>
    </span>
    <a
      href="https://github.com/archejk/daily-chirp"
      target="_blank"
      rel="noopener"
    >
      GitHub repository
    </a>
    <span>
      © {{ currentYear }} daily-chirp by
      <a href="https://jkdevfolio.netlify.app/" target="_blank" rel="noopener">
        JK
      </a>
    </span>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  props: {
    currentYear: {
      type: Number,
      required: true
    }
  }
}
</script>
