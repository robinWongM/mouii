<template>
  <svg class="mouii-icon" v-bind:class="'mouii-icon-' + name" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path v-bind:d="icons[name]"></path>
  </svg>
</template>

<script>
export default {
  name: 'mouii-icon',
  props: ['name'],
  data () {
    return {
      icons: {
        email: 'M12 11.016l8.016-5.016h-16.031zM20.016 18v-9.984l-8.016 4.969-8.016-4.969v9.984h16.031zM20.016 3.984c1.078 0 1.969 0.938 1.969 2.016v12c0 1.078-0.891 2.016-1.969 2.016h-16.031c-1.078 0-1.969-0.938-1.969-2.016v-12c0-1.078 0.891-2.016 1.969-2.016h16.031z',
        user: 'M12 14.016c2.672 0 8.016 1.313 8.016 3.984v2.016h-16.031v-2.016c0-2.672 5.344-3.984 8.016-3.984zM12 12c-2.203 0-3.984-1.781-3.984-3.984s1.781-4.031 3.984-4.031 3.984 1.828 3.984 4.031-1.781 3.984-3.984 3.984z',
        website: 'M20.016 18v-9h-4.031v9h4.031zM15 12.984v-3.984h-11.016v3.984h11.016zM15 18v-3.984h-11.016v3.984h11.016zM20.016 3.984c1.078 0 1.969 0.938 1.969 2.016v12c0 1.078-0.891 2.016-1.969 2.016h-16.031c-1.078 0-1.969-0.938-1.969-2.016v-12c0-1.078 0.891-2.016 1.969-2.016h16.031z',
        arrow_forward: 'M12 3.984l8.016 8.016-8.016 8.016-1.406-1.406 5.578-5.625h-12.188v-1.969h12.188l-5.578-5.625z'
      }
    }
  }
}
</script>

<style>
.mouii-icon {
  display: block;
  width: 1rem;
  height: 1rem;
  line-height: 1rem;
  margin: 0 auto;
  vertical-align: middle;
  stroke-width: 0;
  color: inherit;
  stroke: currentColor;
  fill: currentColor;
}
.mouii-icon-with-input {
  position: absolute;
  left: .65rem;
  top: .75rem;
  line-height: 1.5rem;
  text-align: center;
}
</style>
