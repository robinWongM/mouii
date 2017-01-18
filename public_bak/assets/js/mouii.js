Parse.initialize("mouii");
Parse.serverURL = 'http://192.168.0.104:1337/mouii'

var PostClass = Parse.Object.extend("Post");
var CommentClass = Parse.Object.extend("Comment");

Vue.component('mouii-alert', {
  props: ['alert','show'],
  data (){
    return {
      timer: null
    }
  },
  template: '#mouii-alert-template',
  methods: {
    close (){
      this.$emit('show', false);
    },
    open (){
      this.$emit('show', true);
    },
    checkTimer (){
      if (this.timer != 0) {
        clearTimeout(this.timer)
        this.timer = 0
      }
      if (this.show == true && this.alert.autoClose) {
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
})

Vue.component('mouii-comment', {
  props: ['comment','post'],
  data (){
    return {
      isReplyOpen: false
    }
  },
  template: '#mouii-comment-template',
  computed: {
    formatTime: function() {
      return formatTime(this.comment.time)
    }
  },
  methods: {
    toggleReply (){
      this.isReplyOpen = !this.isReplyOpen
    },
    closeNewComment (){
      this.isReplyOpen = false;
      console.log('hehe?')
    }
  }
})

Vue.component('mouii-new-comment', {
  template: '#mouii-new-comment-template',
  props: ['post','parent','show','auto-hide'],
  data: function(){
    return {
      nickname: "Robin Wong",
      email: "chaowang0313@gmail.com",
      website: "https://rwong.cc/",
      content: "Test",
      focus: {
        content: false,
        nickname: false,
        email: false,
        website: false
      }
    }
  },
  computed: {
    focusStatus (){
      if (this.focus.content || this.focus.nickname || this.focus.email || this.focus.website) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    check: function() {
      // Ugly
      var required = /\S+/;

      var protocol = '(?:(?:[a-z]+:)?//)';
      var auth = '(?:\\S+(?::\\S*)?@)?';
      var ip = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}';
      var host = '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)';
      var domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
      var tld = '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?';
      var port = '(?::\\d{2,5})?';
      var path = '(?:[/?#][^\\s"]*)?';
      var regex = `(?:${protocol}|www\\.)${auth}(?:localhost|${ip}|${host}${domain}${tld})${port}${path}`;
      var url = new RegExp(`(?:^${regex}$)`, 'i');

      var errors = [];
      if (!required.test(this.nickname) || !required.test(this.email) || !required.test(this.content)) {
        errors.push("用户名、邮箱以及评论内容都是必填的喔。")
      }
      if (required.test(this.website) && !url.test(this.website)) {
        errors.push("请输入一个正常的 URL（不要省略开头的 http(s):// 喔）")
      }
      return errors;
    },
    submitNewComment: function(event) {
      var errors = this.check();
      if (errors.length == 0) {
        mouii.alertShow = false;
        mouii.alert = ({
          type: "info",
          content: ["发表中..."]
        })
        mouii.alertShow = true;
        //var newCommentData = new CommentClass();

        Parse.Cloud.run("new", { 
          post: this.post.id,
          nickname: this.nickname,
          email: this.email,
          website: this.website,
          content: this.content,
          parent: this.parent
        }).then((res) => {
          if (res.status == "error") {
            return Parse.Promise.error(res.error)
          } else {
            this.content = "";
            return Parse.Cloud.run("list", { 
              url: document.location.pathname
            })
          }
        }).then((res) => {
          mouii.alertShow = false;
          mouii.alert = ({
            type: "success",
            content: ["发表成功√"],
            autoClose: 3000
          })
          mouii.alertShow = true;
          mouii.comments = res.comments;
          mouii.count = res.count;
          this.$emit('submitted');
        }).catch(function(comment, error) {
          mouii.alert = ({
            type: "warning",
            content: ["Failed to save a new comment, with error code: " + error.message],
            autoClose: 8000
          })
          mouii.alertShow = true;
        });
      } else {
        console.log(errors)
        mouii.alertShow = false;
        mouii.alert = {
          type: "warning",
          content: errors
        }
        mouii.alertShow = true
      }
    }
  }
})

var mouii = new Vue({
  el: '#mouii',
  data: {
    post: {},
    comments: [],
    count: null,
    alert: {},
    alertShow: false
  },
  methods: {
    setAlertShow: function(val) {
      this.alertShow = val;
    }
  },
  watch: {
    comments (val){
      for (var i = 0; i <= val.length - 1; i++) {
        val[i].sequence = val[i].thread.split('.').length - 1;
      }
    }
  },
  created (){
    this.alert = ({
      type: "info",
      content: ["Loading..."]
    })
    this.alertShow = true;

    Parse.Cloud.run("list", { 
      url: document.location.pathname
    })
    .then((res) => {
      this.post = res.post;
      this.comments = res.comments;
      this.count = res.count;
      this.alertShow = false;
    }, (error) => {
      this.alert = ({
        type: "warning",
        content: ["Failed to fetch comment list, with error code: " + error.message]
      })
      this.alertShow = true;
    });
  }
})

function addComment() {
	var comment = new CommentClass();
	comment.set("post", window.post);
	comment.set("nickname", "Robin Wong");
	comment.set("email", "chaowang0313@gmail.com");
	comment.set("website", "https://rwong.cc/");
	comment.set("content", "测试评论" + Math.random() + "你可能复习了假书");

	comment.save(null, {
		success: function(comment) {
			console.log("New comment saved: " + comment.id);
		},
		error: function(comment, error) {
			console.log("Failed to save a new comment, with error code: " + error.message)
		}
	})
}

function formatTime(time) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var now = new Date();
  var elapsed = now - time;

  if (elapsed < msPerMinute) {
       return Math.round(elapsed/1000) + ' second(s) ago';   
  }

  else if (elapsed < msPerHour) {
       return Math.round(elapsed/msPerMinute) + ' minutes ago';   
  }

  else {
      var output = "";
      if (now.getFullYear() != time.getFullYear()) {
        output = time.getFullYear() + "." + ( time.getMonth() + 1 ) + "." + time.getDate()
      } else {
        output = ( time.getMonth() + 1 ) + "月" + time.getDate() + "日"
      }
      return output;
  }
}