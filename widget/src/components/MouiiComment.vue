<template>
  <div class="mouii-comment" v-bind:style="{ marginLeft: sequence + 'rem' }">
    <div class="mouii-comment__avatar">
      <a v-bind:href="comment.website ? comment.website : null">
        <img v-bind:src="'https://g.shansing.net/' + comment.email" />
      </a>
    </div>
    <div class="mouii-comment__info">
      <span class="mouii-comment__author">{{ comment.name }}</span>
      <span class="mouii-comment__time" v-bind:title="comment.time.toLocaleString()">{{ formatTime() }}</span>
      <a class="mouii-comment__reply" v-on:click="toggleReply">Reply</a>
    </div>
    <div class="mouii-comment__content" v-bind:class="{ 'mouii-comment__content--line': !isReplyOpen }">{{ comment.content }}</div>
    <mouii-new-comment v-bind:parent="{id: comment.id, index: index}" v-bind:show="isReplyOpen" v-on:submitted="closeNewComment"></mouii-new-comment>
  </div>
</template>

<script>
import MouiiNewComment from './MouiiNewComment'

function formatTime (time) {
  var msPerMinute = 60 * 1000
  var msPerHour = msPerMinute * 60
  var now = new Date()
  time = new Date(time)
  var elapsed = now - time

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' second(s) ago'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago'
  } else {
    var output = ''
    if (now.getFullYear() !== time.getFullYear()) {
      output = time.getFullYear() + '.' + (time.getMonth() + 1) + '.' + time.getDate()
    } else {
      output = (time.getMonth() + 1) + '月' + time.getDate() + '日'
    }
    return output
  }
}

export default {
  name: 'mouii-comment',
  components: {
    MouiiNewComment
  },
  props: ['comment', 'index'],
  data () {
    return {
      isReplyOpen: false
    }
  },
  computed: {
    sequence () {
      return this.comment.thread.split('.').length - 1
    }
  },
  methods: {
    formatTime () {
      return formatTime(this.comment.time)
    },
    toggleReply () {
      this.isReplyOpen = !this.isReplyOpen
    },
    closeNewComment () {
      this.isReplyOpen = false
      console.log('hehe?')
    }
  }
}
</script>

<style>
.mouii-comment {
	position: relative;
	padding: 1rem .5rem 0 4.5rem;
}

.mouii-comment__avatar {
	position: absolute;
	top: 1.25rem;
	left: .5rem;
}
.mouii-comment__avatar img {
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
}

.mouii-comment__info {
	margin-bottom: .25rem;
}
.mouii-comment__info span, .mouii-comment__info a {
	display: inline-block;
	margin-right: .75rem;
}
.mouii-comment__author {
	font-weight: bold;
}
.mouii-comment__time {
	font-size: .75rem;
	color: #99A9BF;
}
.mouii-comment__reply {
	font-size: .75rem;
	cursor: pointer;
}

.mouii-comment__content {
	padding: 0 0 1rem 0;
	border-bottom: 1px solid transparent;
  white-space: pre-line;
	transition: .5s;
}
.mouii-comment__content--line {
	border-bottom: 1px solid #D3DCE6;
}
</style>
