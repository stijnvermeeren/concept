<template>
  <v-sheet :class="[colorClass, 'pl-3', 'pr-3', 'pt-2', 'pb-2', 'mt-3', 'mb-3', 'ml-4', 'mr-4']" :shaped="true" :elevation="5">
    <v-container>
      <v-row>
        <draggable
            v-model="summarize"
            :group="{name: 'icons', put: ['icons', 'allIcons']}"
            handle=".icon"
            class="subConceptContainer"
        >
          <v-col v-show="!summarize.length" slot="header" class="subConceptPlaceholder" align-self="center">
            Drag an icon here to start a new <span class="nowrap">sub-concept</span>.
          </v-col>
          <v-col
              v-for="{key, count}, iconIndex in summarize"
              :key="key"
              :class="['subConceptItem', {mainIcon: iconIndex === 0}]"
          >
            <sub-concept-icon
                :icon-key="key"
                :count="count"
                :is-main-icon="iconIndex === 0"
                :is-main-concept="index === 0"
                @add="add(key)"
                @remove="remove(key)"
            />
          </v-col>
        </draggable>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
  import {addToSubConcept, removeFromSubConcept} from './util/subconcept.js'

  import SubConceptIcon from './SubConceptIcon.vue'
  import Draggable from "vuedraggable";

  export default {
    name: 'SubConcept',
    components: {
      SubConceptIcon,
      Draggable
    },
    props: ['index', 'iconKeys'],
    computed: {
      summarize: {
        get() {
          const result = []
          this.iconKeys.map(key => {
            const match = result.find(item => {
              return item.key === key
            })
            if (match) {
              match.count++
            } else {
              result.push({key: key, count: 1})
            }
          })

          return result;
        },
        set(value) {
          let subConcept = []
          for (let {key, count} of value) {
            subConcept = subConcept.concat(Array(count).fill(key))
          }
          this.$emit('update', subConcept)
        }
      },
      colorClass() {
        switch (this.index) {
          case 0:
            return 'green lighten-4'
          case 1:
            return 'blue lighten-4'
          case 2:
            return 'red lighten-4'
          case 3:
            return 'deep-orange lighten-4'
          case 4:
            return 'amber lighten-4'
          default:
            return 'blue-grey lighten-4'
        }
      }
    },
    methods: {
      add(key) {
        this.$emit('update', addToSubConcept(this.iconKeys, key))
      },
      remove(key) {
        this.$emit('update', removeFromSubConcept(this.iconKeys, key))
      }
    }
  }
</script>

<style scoped>
  .subConceptItem {
    display: flex;
    align-items: center;
    margin-right: 25px;
  }

  .subConceptPlaceholder {
    text-align: center;
  }

  .subConceptPlaceholder .nowrap {
    display: inline;
    hyphens: none;
  }

  .mainIcon {
    font-weight: bold;
  }

</style>
