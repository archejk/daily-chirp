<template>
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
        :disabled="!password || loading || saving"
        @change="$emit('set-enabled', $event.target.checked)"
      >
      <span class="slider"></span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'ScheduleToggle',
  props: {
    enabled: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    saving: {
      type: Boolean,
      required: true
    }
  },
  emits: ['set-enabled']
}
</script>
