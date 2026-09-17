<template>
  <div class="iconContainer">
    <div class="icon">
      <icon :icon-key="iconKey" />
      <v-btn
          @click="$emit('add')"
          title="Add another marker"
          icon="mdi-plus-box-outline"
          style="position: absolute; top: -10px; right: -10px;"
          color="primary"
          variant="plain"
      >
      </v-btn>
      <v-btn
          :title="removeTitle"
          @click="$emit('remove')"
          :icon="removeIconName"
          style="position: absolute; top: -10px; left: -10px;"
          color="primary"
          variant="plain"
      >
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
