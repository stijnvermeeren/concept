<template>
  <v-sheet :class="[colorClass, 'container', 'pa-1', 'ma-0']">
    <div
      v-for="{key, count}, iconIndex in summarize"
      :key="iconIndex"
      :class="['subConceptItem', {mainIcon: iconIndex === 0}]"
    >
      <div class="icon">
        <icon :icon-key="key" />
        <v-btn
          @click="$emit('add', key)"
          title="Add another marker"
          icon
          small
          absolute
          top
          right
          color="primary"
        >
          <v-icon>add_box</v-icon>
        </v-btn>
        <v-btn
          title="Remove marker"
          @click="$emit('remove', key)"
          icon
          small
          absolute
          top
          left
          color="primary"
        >
          <v-icon>remove_circle_outline</v-icon>
        </v-btn>
      </div>
      <div :class="['pawns']">
        <pawn
          v-for="(pawnType, index) in pawns(iconIndex, count)"
          :key="index"
          :type="pawnType"
        />
      </div>
    </div>
  </v-sheet>
</template>

<script>
  import Icon from './Icon.vue'
  import Pawn from './Pawn.vue'

  export default {
    name: 'SubConcept',
    components: {
      Icon,
      Pawn
    },
    props: ['index', 'iconKeys'],
    computed: {
      myGame() {
        return this.$store.getters.myGame
      },
      colorClass() {
        switch (this.index) {
          case 0:
            return 'green lighten-3'
          case 1:
            return 'blue lighten-3'
          case 2:
            return 'red lighten-3'
          case 3:
            return 'deep-orange lighten-3'
          default:
            return 'blue-grey lighten-3'
        }
      },
      summarize() {
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
      }
    },
    methods: {
      pawns(iconIndex, count) {
        const pawns = Array(count).fill('pawn')
        if (iconIndex === 0) {
          if (this.index === 0) {
            pawns[0] = 'question'
          } else {
            pawns[0] = 'exclamation'
          }
        }
        return pawns
      }
    }
  }
</script>

<style scoped>
  .container {
    display: flex;
  }

  .subConceptItem {
    display: flex;
    align-items: center;
    margin-right: 25px;
  }

  .icon {
    position: relative;
    padding-top: 12px;
    padding-right: 12px;
    padding-left: 12px;
  }

  .v-btn--absolute.v-btn--right {
    right: 0;
  }
  .v-btn--absolute.v-btn--top {
    top: 0;
  }
  .v-btn--absolute.v-btn--left {
    left: 0;
  }

  .mainIcon {
    font-weight: bold;
  }

</style>
