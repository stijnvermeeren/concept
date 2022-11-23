<template>
  <div>
    <p v-if="$store.state.socket.isConnected" class="connected">Connected</p>
    <p v-else class="disconnected">Disconnected</p>

    <div>
      <h2>Selected concept
        <v-btn @click="newGame()" class="float-right">Reset (start a new game)</v-btn></h2>
      <div>
        <div v-if="!concept.length">No concept defined.</div>
        <v-container v-else>
          <v-row justify="start">
            <v-col v-for="(subConcept, index) in conceptWithEmptySubConcept" :key="index" class="subConcept">
              <sub-concept :iconKeys="subConcept" :index="index" @update="update($event, index)" />
            </v-col>
          </v-row>
        </v-container>
      </div>

      <div>
        <h2>Add icons to the concept</h2>
        <div>
          <v-radio-group
            v-model="filter"
            mandatory
            row
            light
            label="Quick filter"
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
        <div v-if="filteredConceptIds.length === 0">No icons matching the query</div>
        <div v-else class="iconRow">
          <draggable
              :list="Object.keys(concepts)"
              :group="{name: 'allIcons', pull: 'clone', put: false}"
              :sort="false"
              :clone="cloneIcon"
          >
            <div
              v-for="key in Object.keys(concepts)"
              v-show="filteredConceptIds.includes(key)"
              :key="key"
              class="icon"
            >
              <icon
                :icon-key="key"
              />
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    absolute
                    top
                    right
                    small
                    color="primary"
                    v-on="on"
                  >
                    <v-icon>mdi-plus-box</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-subheader>{{concepts[key].join(', ')}}</v-subheader>
                  <v-list-item
                    v-for="option in contextOptions"
                    :key="option.index"
                    @click="add(key, option.index)"
                    active-class=""
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{option.name}}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import concepts, { filters } from './util/game.js'
import {addToSubConcept, removeFromSubConcept} from './util/subconcept.js'
import { v4 as uuidv4 } from 'uuid';
import Draggable from 'vuedraggable';

import Icon from './Icon.vue'
import SubConcept from './SubConcept'

export default {
  name: 'game',
  components: {
    SubConcept,
    Icon,
    Draggable
  },
  data() {
    return {
      filter: 0,
      query: '',
      concept: _.cloneDeep(this.$store.state.concept),
      needsSending: false
    }
  },
  watch: {
    storeConcept(newConcept) {
      this.concept = _.cloneDeep(newConcept)
    }
  },
  computed: {
    conceptWithEmptySubConcept() {
      return this.concept.concat([[]])
    },
    storeConcept() {
      return this.$store.state.concept;
    },
    concepts() {
      return concepts
    },
    filters() {
      return filters
    },
    filteredConceptIds() {
      return filters[this.filter].keys.filter(conceptId => {
        return !! concepts[conceptId].join('/').split('/').find(label => {
          const lowerCaseQuery = this.query ? this.query.toLowerCase() : ''
          return label.toLowerCase().startsWith(lowerCaseQuery)
        })
      })
    },
    myGame() {
      return this.$store.getters.myGame
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
    ucFirst(value) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    update(newSubConcept, index) {
      if (newSubConcept.length > 0) {
        this.$set(this.concept, index, newSubConcept)
      } else {
        this.concept.splice(index, 1)
      }
      this.scheduleSend()
    },
    add(key, index) {
      const newSubConcept = addToSubConcept(this.concept[index] || [], key)
      this.update(newSubConcept, index)
      this.query = ''
    },
    remove(key, index) {
      const newSubConcept = removeFromSubConcept(this.concept[index] || [], key)
      this.update(newSubConcept, index)
    },
    scheduleSend() {
      this.needsSending = true
      this.$nextTick(this.send)
    },
    send() {
      if (this.needsSending) {
        const stateId = uuidv4()
        this.$store.commit('waitForStateId', stateId)
        this.$socket.sendObj({
          message: 'sendmessage',
          data: {
            action: 'newState',
            state: {
              id: stateId,
              concept: this.concept.filter(subConcept => subConcept.length)
            }
          }
        })
      }
      this.needsSending = false
    },
    cloneIcon(key) {
      return {key, count: 1}
    },
    newGame() {
      this.concept = [];
      this.scheduleSend();
    }
  }
}
</script>

<style scoped>
  .connected {
    color: darkgreen;
  }
  .disconnected {
    color: darkred;
  }

  .icon {
    display: inline-block;
    position: relative;
    padding-top: 12px;
    padding-right: 12px;
    cursor: move;
  }

  .iconRow {
    transition: height 3s;
  }

  .v-btn--absolute.v-btn--right {
    right: 0;
  }
  .v-btn--absolute.v-btn--top {
    top: 0;
  }
  .v-btn--absolute.v-btn--right {
    right: 0;
  }
  .v-btn--absolute.v-btn--top {
    top: 0;
  }

  div.subConcept {
    display: inline-block;
  }
</style>
