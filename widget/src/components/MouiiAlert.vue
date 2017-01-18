<template>
  <transition name="mouii-swipe">
    <div class="mouii-alert" v-if="show" v-bind:class="'mouii-alert--' + alert.type">
        <div class="mouii-alert__content" v-for="content in alert.content" v-bind:key="content">{{ content }}</div>
      <a class="mouii-alert__close fa fa-times" v-on:click="close"><!--<i class="fa fa-times"></i>--></a>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'mouii-alert',
  props: ['alert', 'show'],
  data () {
    return {
      timer: null
    }
  },
  methods: {
    close () {
      this.$emit('show', false)
    },
    open () {
      this.$emit('show', true)
    },
    checkTimer () {
      if (this.timer !== null) {
        clearTimeout(this.timer)
        this.timer = 0
      }
      if (this.show === true && this.alert.autoClose) {
        this.timer = setTimeout(() => {
          this.close()
        }, this.alert.autoClose || 5000)
      }
    }
  },
  watch: {
    show (val) {
      this.checkTimer()
    },
    alert (val) {
      this.checkTimer()
    }
  }
}
</script>
