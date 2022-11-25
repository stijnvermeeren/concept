<template>
  <v-sheet
      :class="['sheet', colorClass, 'pl-3', 'pr-3', 'pt-2', 'pb-2', 'mt-3', 'mb-3', 'ml-4', 'mr-4']"
      :shaped="true"
      :elevation="5"
  >
    <v-container>
      <draggable
          v-model="summarize"
          :group="{name: 'icons', put: ['icons', 'allIcons']}"
          handle=".icon"
          class="subConceptContainer row"
          ghostClass="ghost"
      >
        <v-col v-show="!summarize.length" slot="header" class="subConceptPlaceholder">
          Drag an icon here to start a new sub‑concept.
        </v-col>
        <v-col
            v-for="{key, count}, iconIndex in summarize"
            :key="key"
            :class="['subConceptItem', {mainIcon: iconIndex === 0}]"
        >
          <v-icon v-if="iconIndex === 0" class="insertBeforeGhost" color="secondary" large>mdi-chevron-down</v-icon>
          <sub-concept-icon
              :icon-key="key"
              :count="count"
              :is-main-icon="iconIndex === 0"
              :is-main-concept="index === 0"
              @add="add(key)"
              @remove="remove(key)"
          />
          <v-icon class="insertGhost" color="secondary" large>mdi-chevron-down</v-icon>
        </v-col>
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
      },
      onChange(evt) {
        console.log(evt)
      }
    }
  }
</script>

<style lang="scss">
  @import '~vuetify/src/styles/main.sass';

  .sheet:has(.ghost) {
    @extend .lighten-3;
    @extend .elevation-15;
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

    .subConceptItem:has(+ .ghost) .insertGhost {
      display: block;
    }

    .ghost + .subConceptItem .insertBeforeGhost {
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
