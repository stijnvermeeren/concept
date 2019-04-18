<template>
  <span :class="type">{{symbol}}</span>
</template>

<script>
  export default {
    name: 'Pawn',
    props: ['type'],
    computed: {
      symbol() {
        switch (this.type) {
          case 'question':
            return '?'
          case 'exclamation':
            return '!'
          default:
            return '.'
        }
      }
    }
  }
</script>

<style scoped>
  .question {
    font-size: 64px;
  }

  .exclamation {
    font-size: 64px;
  }

  .pawn {
    font-size: 48px;
  }
</style>
