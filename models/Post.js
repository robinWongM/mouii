var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid-nodeps');

var PostSchema = new mongoose.Schema({
  _id: ShortId,
  url: {
    type: String,
    required: [true, '评论框出错啦(990015)：服务异常，请联系客服人员。']
  }
}, {
  timestamps: true
});

// Thanks for https://github.com/beeplove/mongoose-find-one-or-create/blob/develop/index.js
PostSchema.statics.findOneOrCreate = function(condition) {
  return this.findOne(condition).exec().then((result) => {
    if (result) {
      return Promise.resolve(result)
    } else {
      console.log(condition)
      return this.create(condition)
    }
  })
}

module.exports = mongoose.model('Post', PostSchema);
