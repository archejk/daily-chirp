<template>
  <p v-if="message" class="message" :class="messageType">{{ message }}</p>
</template>

<script>
export default {
  name: 'MessageBanner',
  props: {
    message: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      required: true
    }
  }
}
</script>
