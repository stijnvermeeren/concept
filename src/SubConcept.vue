<template>
  <div class="container">
    <div
      v-for="{key, count}, iconIndex in summarize"
      :class="['icon', {mainIcon: iconIndex === 0}]"
    >
      <icon :labels="concepts[key]" />
      <div :class="['pawns', colorClass]">
        <pawn v-for="pawnType in pawns(iconIndex, count)" :type="pawnType" />
      </div>
      <div v-if="myGame" class="edit">
        <button @click="$emit('add', key)">+</button>
        <button @click="$emit('remove', key)">-</button>
      </div>
    </div>
  </div>
</template>

<script>
  import concepts from './game.js'
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
      concepts() {
        return concepts
      },
      colorClass() {
        switch (this.index) {
          case 0:
            return 'green'
          case 1:
            return 'blue'
          case 2:
            return 'red'
          case 3:
            return 'yellow'
          default:
            return 'black'
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

  .icon {
    display: flex;
    align-items: center;
    margin-right: 25px;
  }

  .edit {
    display: flex;
    flex-direction: column;
    margin: 10px;
  }

  .mainIcon {
    font-weight: bold;
  }

  .green {
    color: green;
  }

  .blue {
    color: blue;
  }

  .red {
    color: red;
  }

  .yellow {
    color: saddlebrown;
  }

  .black {
    color: black;
  }
</style>
