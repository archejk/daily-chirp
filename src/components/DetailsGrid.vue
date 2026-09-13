<template>
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
</template>

<script>
export default {
  name: 'DetailsGrid',
  props: {
    repositoryLabel: {
      type: String,
      required: true
    },
    updatedAtLabel: {
      type: String,
      required: true
    },
    variableName: {
      type: String,
      required: true
    }
  }
}
</script>
