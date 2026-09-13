<template>
  <div class="chirp-strip">
    <span aria-hidden="true">DC</span>
    <p>
      Daily Chirp is {{ enabled ? 'ready to keep the streak alive' : 'paused until you enable it' }}.
    </p>
  </div>
</template>

<script>
export default {
  name: 'ChirpStatus',
  props: {
    enabled: {
      type: Boolean,
      required: true
    }
  }
}
</script>
