<template>
  <div id="mouii">
    <mouii-comment-list> </mouii-comment-list>
    <mouii-new-comment v-bind:style="{ marginTop: '4rem' }"></mouii-new-comment>
    <!-- <mouii-new-comment v-bind:style="{ marginTop: '4rem' }" v-bind:post="post" v-bind:show="true"></mouii-new-comment> -->
    <!-- <mouii-alert v-bind:alert="alert" v-bind:show="alertShow" v-on:show="setAlertShow"></mouii-alert> -->
  </div>
</template>

<script>
require('font-awesome-webpack')

// import MouiiAlert from './components/MouiiAlert'
import MouiiCommentList from './components/MouiiCommentList'
import MouiiNewComment from './components/MouiiNewComment'

export default {
  name: 'mouii',
  components: {
    // MouiiAlert,
    MouiiCommentList,
    MouiiNewComment
  },
  mounted () {
    this.$store.dispatch('fetchComments')
  }
}
</script>

<style>
@import "./assets/css/bootstrap-reboot.min.css";

#mouii {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #324057;
	font-size: 15px;
  width: 90%;
	max-width: 760px; /* For development */
	margin: 2.5rem auto;
}
#mouii ::-moz-placeholder {
	opacity: 1;
	color: #99A9BF;
}
#mouii button {
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
#mouii button:active::-moz-focus-inner {
	padding: 0;
	border: 0;
}
#mouii button:active {
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
.mouii-new-comment-enter-active, .mouii-new-comment-leave-active {
  transition: .5s;
  height: calc(10rem + 2px)
}
.mouii-new-comment-enter, .mouii-new-comment-leave-active {
  opacity: 0;
  height: 0;
}
</style>
