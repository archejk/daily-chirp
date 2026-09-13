<template>
  <div class="actions-row">
    <button type="button" :disabled="disabled" @click="$emit('refresh')">
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
</template>

<script>
export default {
  name: 'ActionLinks',
  props: {
    disabled: {
      type: Boolean,
      required: true
    }
  },
  emits: ['refresh']
}
</script>
