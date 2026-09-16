<template>
  <div class="iconContainer">
    <div class="icon">
      <icon :icon-key="iconKey" />
      <v-btn
          @click="$emit('add')"
          title="Add another marker"
          icon
          size="small"
          style="position: absolute; top: 0; right: 0;"
          color="primary"
      >
        <v-icon>mdi-plus-box-outline</v-icon>
      </v-btn>
      <v-btn
          :title="removeTitle"
          @click="$emit('remove')"
          icon
          size="small"
          style="position: absolute; top: 0; left: 0;"
          color="primary"
      >
        <v-icon>{{ removeIconName }}</v-icon>
      </v-btn>
    </div>
    <div class="pawns">
      <pawn
          v-for="(pawnType, index) in pawns"
          :key="index"
          :type="pawnType"
      />
    </div>
  </div>
</template>

<script>
  import Icon from './Icon.vue'
  import Pawn from './Pawn.vue'

  export default {
    name: 'SubConceptIcon',
    components: {
      Icon,
      Pawn
    },
    props: ['iconKey', 'count', 'isMainConcept', 'isMainIcon'],
    computed: {
      canDelete() {
        return this.isMainIcon && this.count === 1
      },
      removeTitle() {
        return this.canDelete ? 'Delete sub-concept' : 'Remove marker'
      },
      removeIconName() {
        return this.canDelete ? 'mdi-delete-circle-outline' : 'mdi-minus-circle-outline'
      },
      pawns() {
        const pawns = Array(this.count).fill('pawn')
        if (this.isMainIcon) {
          if (this.isMainConcept) {
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
  .iconContainer {
    display: flex;
    align-items: center;
  }

  .icon {
    position: relative;
    padding-top: 12px;
    padding-right: 12px;
    padding-left: 12px;
    cursor: move;
  }

  .pawns {
    white-space: nowrap;
  }
</style>
