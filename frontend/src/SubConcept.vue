<template>
  <v-sheet
      :class="['sheet', colorClass, 'pl-3', 'pr-3', 'pt-2', 'pb-2', 'mt-3', 'mb-3', 'ml-4', 'mr-4']"
      :elevation="5"
  >
    <v-container>
      <draggable
          v-model="summarize"
          :group="{name: 'icons', put: ['icons', 'allIcons']}"
          handle=".icon"
          class="subConceptContainer row"
          ghostClass="ghost"
          filter=".v-btn"
          item-key="key"
      >
        <template #header>
          <v-col v-show="!summarize.length" class="subConceptPlaceholder">
            Drag an icon here to start a new sub‑concept.
          </v-col>
        </template>
        <template #item="{ element: {key, count}, index: iconIndex }">
          <v-col
              :key="key"
              :class="['subConceptItem', {mainIcon: iconIndex === 0}]"
          >
            <v-icon v-if="iconIndex === 0" class="insertBeforeGhost" color="secondary" size="large">mdi-chevron-down</v-icon>
            <sub-concept-icon
                :icon-key="key"
                :count="count"
                :is-main-icon="iconIndex === 0"
                :is-main-concept="index === 0"
                @add="add(key)"
                @remove="remove(key)"
            />
            <v-icon class="insertGhost" color="secondary" size="large">mdi-chevron-down</v-icon>
          </v-col>
        </template>
      </draggable>
    </v-container>
  </v-sheet>
</template>

<script>
  import {addToSubConcept, removeFromSubConcept} from './util/subconcept.js'

  import SubConceptIcon from './SubConceptIcon.vue'
  import Draggable from "vuedraggable"

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
            return 'bg-green-lighten-4'
          case 1:
            return 'bg-blue-lighten-4'
          case 2:
            return 'bg-red-lighten-4'
          case 3:
            return 'bg-deep-orange-lighten-4'
          case 4:
            return 'bg-amber-lighten-4'
          default:
            return 'bg-blue-grey-lighten-4'
        }
      }
    },
    methods: {
      add(key) {
        this.$emit('update', addToSubConcept(this.iconKeys, key))
      },
      remove(key) {
        this.$emit('update', removeFromSubConcept(this.iconKeys, key))
      },
      onChange(evt) {
        console.log(evt)
      }
    }
  }
</script>

<style lang="scss">
  .sheet:has(.ghost) {
    filter: brightness(0.94);
    box-shadow: 0px 8px 10px -5px rgba(0,0,0,.2), 0px 16px 24px 2px rgba(0,0,0,.14), 0px 6px 30px 5px rgba(0,0,0,.12) !important;
  }
</style>

<style lang="scss" scoped>
  .sheet {
    min-height: 120px;

    .subConceptItem {
      flex: 0;
      margin-right: 25px;
      position: relative;
    }

    .insertGhost, .insertBeforeGhost {
      position: absolute;
      top: -5px;
      display: none;
    }

    .insertGhost {
      right: -25px;
    }

    .insertBeforeGhost {
      left: -12px;
    }

    .subConceptItem:has(+ .ghost.allIconsPanelIcon) .insertGhost {
      display: block;
    }

    .ghost.allIconsPanelIcons + .subConceptItem .insertBeforeGhost {
      display: block;
    }

    .subConceptPlaceholder {
      max-width: 160px;
      text-align: center;
      hyphens: none;
    }

    .mainIcon {
      font-weight: bold;
    }
  }

</style>
