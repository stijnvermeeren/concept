<template>
  <div class="gameContainer">
    <div v-for="(subConcept, index) in conceptWithEmptySubConcept" :key="index" class="subConcept">
      <sub-concept
          :iconKeys="subConcept"
          :index="index"
          @update="$store.dispatch('update', {newSubConcept: $event, index})"
      />
    </div>
  </div>
</template>

<script>
import SubConcept from './SubConcept'

export default {
  name: 'game',
  components: {
    SubConcept
  },
  computed: {
    concept() {
      return this.$store.state.localConcept
    },
    conceptWithEmptySubConcept() {
      return this.concept.concat([[]])
    }
  }
}
</script>

<style scoped>
  .gameContainer {
  }

  .gameContainer > div {
    vertical-align: top;
    display: inline-block;
  }
</style>
