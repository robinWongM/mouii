<template>
  <transition name="mouii-new-comment" mode="out-in">
    <div class="mouii-new-comment__wrap" v-if="show">
      <div class="mouii-new-comment" v-bind:class="{ 'mouii-new-comment--flip': status !== 'nothing' }">
        <form class="mouii-new-comment__form" v-bind:class="{ 'mouii-new-comment__focused': focusStatus }"  v-on:submit.prevent="submitNewComment">
          <textarea class="mouii-new-comment__textarea" placeholder="Say something..." rows="4" v-model.trim="content" v-on:focus="focus.content = true" v-on:blur="focus.content = false">
          </textarea><div class="mouii-new-comment__field">
            <div class="mouii-userinfo-input">
              <mouii-icon class="mouii-icon-with-input" name="user"></mouii-icon>
              <input class="mouii-userinfo-field__username" type="text" placeholder="Username" v-model.trim="name" v-on:focus="focus.name = true" v-on:blur="focus.name = false">
            </div>
            <div class="mouii-userinfo-input">
              <mouii-icon class="mouii-icon-with-input" name="email"></mouii-icon>
              <input class="mouii-userinfo-field__email" type="email" placeholder="Email" v-model.trim="email" v-on:focus="focus.email = true" v-on:blur="focus.email = false">
            </div>
            <div class="mouii-userinfo-input">
              <mouii-icon class="mouii-icon-with-input" name="website"></mouii-icon>
              <input class="mouii-userinfo-field__website" type="text" placeholder="Website (optinal)" v-model.trim="website" v-on:focus="focus.website = true" v-on:blur="focus.website = false">
            </div>
            <button type="submit" class="mouii-button mouii-new-comment__submit">
              <mouii-icon class="mouii-icon-with-submit" name="arrow_forward"></mouii-icon>
            </button>
          </div>
        </form>
        <div class="mouii-new-comment__overlay">
          <transition name="mouii-new-comment__status" mode="out-in">
            <div v-if="status !== 'submitted'" class="mouii-new-comment__overlay-container" key="bounce">
              <mouii-loading class="mouii-new-comment__overlay-bounce"></mouii-loading>
            </div>
            <div v-else class="mouii-new-comment__overlay-container" key="tip">
              <p class="mouii-new-comment__overlay-tip">
                <mouii-icon name="check" class="mouii-new-comment__overlay-tip__check"></mouii-icon>
              </p>
            </div>
          </transition>
      </div>
    </div>
  </transition>
</template>

<script>
import MouiiIcon from './MouiiIcon'
import MouiiLoading from './MouiiLoading'

export default {
  name: 'mouii-new-comment',
  components: {
    MouiiIcon,
    MouiiLoading
  },
  props: ['show', 'parent'],
  data () {
    return {
      name: '',
      email: '',
      website: '',
      content: '',
      focus: {
        content: false,
        name: false,
        email: false,
        website: false
      },
      status: 'nothing'
    }
  },
  computed: {
    focusStatus () {
      if (this.focus.content || this.focus.name || this.focus.email || this.focus.website) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    check () {
      // Ugly
      var required = /\S+/

      var protocol = '(?:(?:[a-z]+:)?//)'
      var auth = '(?:\\S+(?::\\S*)?@)?'
      var ip = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}'
      var host = '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)'
      var domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*'
      var tld = '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?'
      var port = '(?::\\d{2,5})?'
      var path = '(?:[/?#][^\\s"]*)?'
      var regex = `(?:${protocol}|www\\.)${auth}(?:localhost|${ip}|${host}${domain}${tld})${port}${path}`
      var url = new RegExp(`(?:^${regex}$)`, 'i')

      if (!required.test(this.name) || !required.test(this.email) || !required.test(this.content)) {
        return '用户名、邮箱以及评论内容都是必填的喔。'
      }
      if (required.test(this.website) && !url.test(this.website)) {
        return '请输入一个正常的 URL（不要省略开头的 http(s):// 喔）'
      }
    },
    submitNewComment (event) {
      var errors = this.check()
      if (!errors) {
        this.status = 'submitting'
        /* mouii.alertShow = false
        mouii.alert = ({
          type: 'info',
          content: ['发表中...']
        })
        mouii.alertShow = true */

        this.$http.post(
          '/mouii/new',
          {
            post: this.$store.state.post,
            name: this.name,
            email: this.email,
            website: this.website,
            content: this.content,
            parent: this.parent ? this.parent.id : null
          }
        ).then((res) => {
          return res.json()
        }).then((res) => {
          if (res.code !== 0) {
            throw res.message
          } else {
            this.content = ''
            this.status = 'submitted'
            this.$store.commit('addComment', [res.message, this.parent ? this.parent.index : -1])
            setTimeout(() => {
              this.status = 'nothing'
              this.$emit('submitted')
            }, 1500)
          }
          // this.$store.dispatch('fetchComments')
        }).catch((comment, error) => {
          /* mouii.alert = ({
            type: 'warning',
            content: ['Failed to save a new comment, with error code: ' + error.message],
            autoClose: 8000
          })
          mouii.alertShow = true */
          console.error(error)
        })
      } else {
        console.log(errors)
        /* mouii.alertShow = false
        mouii.alert = {
          type: 'warning',
          content: errors
        }
        mouii.alertShow = true */
      }
    }
  }
}
</script>

<style>
.mouii-new-comment {
	transition: .5s;
	color: #475669;

  position: relative;
  /* transform-style: preserve-3d;
  transform-origin: 50% 50%;
  backface-visibility: hidden; */
  overflow: hidden;
}
.mouii-new-comment--flip > .mouii-new-comment__overlay {
  transform: translateY(0);
}
.mouii-new-comment__wrap {
  overflow: hidden;
}
.mouii-new-comment__form {
  border: 1px solid #c0ccda;
  background-color: white;
  transition: .25s;
}
.mouii-new-comment__focused {
	border-color: #20A0FF;
}
.mouii-new-comment__textarea {
	display: block;
	width: 100%;
	height: 7.5rem;
	border: none;
	resize: none;
	padding: 1rem .75rem 0 .75rem;
	color: #475669;
	background: none;
}
.mouii-new-comment__textarea:focus {
	border-color: #20A0FF;
}

.mouii-new-comment__field {
	display: flex;
	background: white;
	border-bottom-left-radius: .25rem;
	border-bottom-right-radius: .25rem;
}
.mouii-userinfo-input {
	flex: 1;
	position: relative;
}
.mouii-userinfo-input input {
	min-width: 0;
	border: none;
	display: block;
	padding: .5rem  .25rem .5rem 2.125rem;
	color: #475669;
	width: 100%;
	height: 100%;
	background: transparent;
}
.mouii-userinfo-input:not(:last-child) {
	/* border-right-width: 1px;
	border-right-style: solid;
	border-image: linear-gradient(to bottom, transparent, transparent .25rem, #c0ccda .75rem, #c0ccda 1.75rem, transparent 2.25rem) 1 100%; */
}
.mouii-icon-with-input {
	position: absolute;
	left: .375rem;
	top: .625rem;
	width: 1rem;
	height: 1rem;
	line-height: 1rem;
	color: #475669;
	text-align: center;
}
.mouii-icon-with-submit {
  width: 1rem;
  height: 1rem;
}
#mouii .mouii-new-comment__submit {
	width: 2.5rem;
	height: 2.5rem;
	color: #475669;
	transition: .25s;
	outline: none;
}
#mouii .mouii-new-comment__submit:hover,
#mouii .mouii-new-comment__submit:focus {
	background-color: #475669;
	color: #F9FAFC
}
#mouii .mouii-new-comment__submit:hover {
	width: 5rem;
}
#mouii .mouii-new-comment__submit:active {
	box-shadow: inset 0 3px 5px rgba(0,0,0,.125);
}

.mouii-new-comment__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: #475669;
  text-align: center;
  line-height: 10rem;
  transform: translateY(100%);
  transition: .5s;
}
.mouii-new-comment__overlay-container {
  height: 100%;
}
.mouii-new-comment__overlay-bounce, .mouii-new-comment__overlay-tip {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%)
}
.mouii-new-comment__overlay-tip__check {
  width: 3rem;
  height: 3rem;
}

.mouii-new-comment-enter-active,  .mouii-new-comment-leave-active {
  transition: .5s;
  height: calc(10rem + 2px);
}
.mouii-new-comment-enter,  .mouii-new-comment-leave-to {
  height: 0;
}
.mouii-new-comment-enter-active > .mouii-new-comment,
 .mouii-new-comment-leave-active > .mouii-new-comment {
   transition: .25s;
   transform: translateY(0);
   opacity: 1;
}
.mouii-new-comment-enter > .mouii-new-comment,
.mouii-new-comment-leave-to > .mouii-new-comment {
  transform: translateY(-100%);
  opacity: 0;
}
.mouii-new-comment__status-enter-active, .mouii-new-comment__status-leave-active {
  transition: .25s;
  transform: scale(1);
}
.mouii-new-comment__status-enter-active > .,
 .mouii-new-comment__status-leave-active {
  transition: .25s;
  transform: scale(1);
}
.mouii-new-comment__status-enter, .mouii-new-comment__status-leave-to {
  transform: scale(0);
}
</style>
