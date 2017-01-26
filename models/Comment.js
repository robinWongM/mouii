var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid-nodeps');

const mailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const webSiteValidator = {
  validator: function(v) {
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

    if (!v) {
      return true
    } else {
      return url.test(v)
    }
  },
  message: 'Your website says it is 404 NOT FOUND.'
}

var CommentSchema = new mongoose.Schema({
  _id: ShortId,

  post: {
    type: String,
    required: [true, '请不要脱离材料内容及含意的范围进行作文。']
  },
  parent: String,
  thread: {
    type: String,
    required: [true, '要找准自己的人生定位，不能盲从他人的脚步。']
  },

  name: {
    type: String,
    required: [true, '君の名は。']
  },
  email: {
    type: String,
    validate: {
      validator: function(v) {
        return mailValidator.test(v)
      },
      message: '你输入的可能是假邮箱。'
    },
    required: [true, '你输入的可能是假邮...不对，连一个字儿都没有。']
  },
  website: {
    type: String,
    validate: webSiteValidator
  },

  content: {
    type: String,
    required: [true, '多曰推荐您品味这首歌，以及它的名字。http://music.163.com/song/36198046/']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', CommentSchema);
