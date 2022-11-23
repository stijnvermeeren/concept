<template>
  <v-container>
    <v-row justify="start">
      <v-col v-for="(subConcept, index) in conceptWithEmptySubConcept" :key="index" class="subConcept">
        <sub-concept
            :iconKeys="subConcept"
            :index="index"
            @update="$store.dispatch('update', {newSubConcept: $event, index})"
        />
      </v-col>
    </v-row>
  </v-container>
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
