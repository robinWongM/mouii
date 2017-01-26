<template>
  <div class="mouii-list">
    <p v-if="count == null">Loading...</p>
    <p v-else-if="count != 0">We now have {{ count }} comment(s).</p>
    <p v-else>There are no comment.</p>
    <transition-group name="mouii-swipe">
      <mouii-comment v-if="comments.length != 0" v-for="(comment, index) in comments" v-bind:comment="comment" v-bind:index="index" v-bind:key="comment.id"></mouii-comment>
    </transition-group>
  </div>
</template>

<script>
import MouiiComment from './MouiiComment'
import { mapState } from 'vuex'

export default {
  name: 'mouii',
  components: {
    MouiiComment
  },
  computed: mapState([
    'post',
    'count',
    'comments'
  ])
}
</script>

<style>
.mouii-list {
	margin: 4rem 0;
}
</style>
