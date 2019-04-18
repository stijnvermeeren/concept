<template>
  <div>
    <div class="icon" @click="$emit('click', $event)">
      <div v-for="label in labels" :key="label">{{label}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Concept',
    props: ['labels']
  }
</script>

<style scoped>
  .icon {
    border: 1px solid gray;
    margin: 5px 10px;
    padding: 5px;
    height: 50px;
    width: 100px;
    font-size: 12px;
    text-align: center;
  }
</style>
