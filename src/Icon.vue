<template>
  <div>
    <div class="icon" @click="$emit('click', $event)">
      <div
        v-if="iconKey in colours"
        :style="{backgroundColor: colours[iconKey]}"
        class="colour"
      />
      <img
        v-else
        :src="`/icons/${iconKey}.png`"
        :alt="labels.join(', ')"
        :title="labels.join(', ')"
      />
    </div>
  </div>
</template>

<script>
  import concepts, { colours } from './game'

  export default {
    name: 'Concept',
    props: ['iconKey'],
    computed: {
      labels() {
        return concepts[this.iconKey]
      },
      colours() {
        return colours
      }
    }
  }
</script>

<style scoped>
  .icon {
    margin: 5px 10px;
    padding: 5px;
  }

  div.colour {
    width: 50px;
    height: 50px;
    display: inline-block;
    border: 1px solid grey;
    box-sizing: border-box;
  }

  img {
    width: 50px;
    height: 50px;
  }
</style>
