<template>
  <v-navigation-drawer
      :class="['allIconsPanel']"
      app
      permanent
      width="550"
      right
  >
    <template v-slot:prepend>
      <v-card class="pa-3">
        <h2>Add icons to the concept</h2>
        <div>
          <v-radio-group
              v-model="filter"
              mandatory
              row
              light
              hide-details
              class="px-3 my-2"
          >
            <v-radio
                v-for="(filter, index) in filters"
                :key="index"
                :label="filter.name"
                :value="index"
            />
          </v-radio-group>
        </div>
        <div>
          <v-text-field
              v-model="query"
              label="Search concepts by query"
              placeholder="Query"
              filled
              clearable
              class="my-2"
              hide-details
          />
        </div>
      </v-card>
    </template>

    <v-list v-if="filteredConceptIds.length === 0">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>No icons matching the query</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list v-else>
      <draggable
          :list="Object.keys(concepts)"
          :group="{name: 'allIcons', pull: 'clone', put: false}"
          :sort="false"
          :clone="cloneIcon"
          handle=".icon"
      >
        <v-list-group
            v-for="key in Object.keys(concepts)"
            v-show="filteredConceptIds.includes(key)"
            :key="key"
        >

          <v-list-item slot="activator">
            <v-list-item-icon class="icon mt-0 mb-0">
              <icon :icon-key="key"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ concepts[key].join(', ') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
              v-for="option in contextOptions"
              :key="option.index"
              @click="add(key, option.index)"
              class="iconContextMenu"
              dense
          >
            <v-list-item-content>
              <v-list-item-title class="text-body-2">
                {{option.name}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </draggable>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import concepts, { filters } from './util/game.js'
import Draggable from 'vuedraggable'

import Icon from './Icon.vue'

export default {
  name: 'AllIconsPanel',
  components: {
    Icon,
    Draggable
  },
  data() {
    return {
      filter: 0,
      query: ''
    }
  },
  computed: {
    concept() {
      return this.$store.state.localConcept
    },
    filters() {
      return filters
    },
    concepts() {
      return concepts
    },
    filteredConceptIds() {
      return filters[this.filter].keys.filter(conceptId => {
        return !! concepts[conceptId].join('/').split('/').find(label => {
          const lowerCaseQuery = this.query ? this.query.toLowerCase() : ''
          return label.toLowerCase().startsWith(lowerCaseQuery)
        })
      })
    },
    contextOptions() {
      if (this.concept.length === 0) {
        return [{ name: 'Add as main concept', index: 0 }]
      }

      const options = this.concept.map((concept, i) => {
        const name = this.subConceptName(i)
        const iconName = concepts[concept[0]][0]
        return { name: `Add to ${name} (${iconName})`, index: i }
      })

      options.push({ name: 'Add as new sub-concept', index: this.concept.length });
      return options
    }
  },
  methods: {
    subConceptName(index) {
      return index === 0 ? 'main concept' : `sub-concept ${index}`
    },
    cloneIcon(key) {
      return {key, count: 1}
    },
    add(key, index) {
      this.query = ''
      this.$store.dispatch('add', {key, index})
    }
  }
}
</script>

<style scoped>
  .icon {
    cursor: move;
  }

  .iconContextMenu {
    margin-left: 110px;
  }
</style>
