<template>
  <span :class="[type, 'text--secondary']">{{symbol}}</span>
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
            return '■'
        }
      }
    }
  }
</script>

<style scoped>
  .question {
    font-size: 48px;
  }

  .exclamation {
    font-size: 48px;
  }

  .pawn {
    font-size: 36px;
  }
</style>
