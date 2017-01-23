<template>
  <div id="mouii">
    <mouii-loading v-if="!loaded"></mouii-loading>
    <div v-else class="mouii-loaded">
      <mouii-new-comment v-bind:show="true" v-bind:style="{ marginTop: '4rem' }"></mouii-new-comment>
      <mouii-comment-list></mouii-comment-list>
    </div>
    <!-- <mouii-new-comment v-bind:style="{ marginTop: '4rem' }" v-bind:post="post" v-bind:show="true"></mouii-new-comment> -->
    <!-- <mouii-alert v-bind:alert="alert" v-bind:show="alertShow" v-on:show="setAlertShow"></mouii-alert> -->
  </div>
</template>

<script>
import MouiiLoading from './components/MouiiLoading'
import MouiiCommentList from './components/MouiiCommentList'
import MouiiNewComment from './components/MouiiNewComment'

export default {
  name: 'mouii',
  components: {
    MouiiLoading,
    MouiiCommentList,
    MouiiNewComment
  },
  mounted () {
    this.$store.dispatch('fetchComments')
  },
  computed: {
    loaded () {
      return this.$store.state.loaded
    }
  }
}
</script>

<style lang="scss" src="./assets/scss/base.scss"></style>

<style>
#mouii {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #324057;
  width: 90%;
	max-width: 760px; /* For development */
	margin: 2.5rem auto;
}
#mouii ::-moz-placeholder {
	opacity: 1;
	color: #99A9BF;
}
.mouii-button {
	-moz-appearance: none;
	-webkit-appearance: none;
	text-transform: none;
	text-decoration: none;
	overflow: hidden;
	display: inline-block;
	-moz-user-select: none;
	-webkit-user-select: none;
	background-image: none;
	background-color: transparent;
	border: none;
	cursor: pointer;
}
.mouii-button:active::-moz-focus-inner {
	padding: 0;
	border: 0;
}
.mouii-button:active {
	border-style: outset;
	border: none;
}

.mouii-fade-enter-active, .mouii-fade-leave-active {
  transition: .5s;
}
.mouii-fade-enter, .mouii-fade-leave-active {
  opacity: 0;
}
.mouii-swipe-enter-active, .mouii-swipe-leave-active {
  transition: .5s;
  transform: translateY(0);
}
.mouii-swipe-enter, .mouii-swipe-leave-active {
  opacity: 0;
  transform: translateY(100%);
  box-shadow: none;
}
</style>
