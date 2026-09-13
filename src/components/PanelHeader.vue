<template>
  <div class="panel-header">
    <div>
      <p class="eyebrow">Commit streak</p>
      <h1>Schedule control</h1>
    </div>
    <span class="status-pill" :class="{ active: enabled }">
      {{ enabled ? 'Enabled' : 'Disabled' }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'PanelHeader',
  props: {
    enabled: {
      type: Boolean,
      required: true
    }
  }
}
</script>
