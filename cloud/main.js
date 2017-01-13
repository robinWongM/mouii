var crypto = require('crypto');

function comment_int_to_alphadecimal(i) {
  var num = i.toString(36);
  return String.fromCharCode(num.length + 47) + num;
}
function comment_alphadecimal_to_int(c) {
  return parseInt(c.substring(1), 36);
}
function comment_increment_alphadecimal(c) {
  return comment_int_to_alphadecimal(comment_alphadecimal_to_int(c) + 1);
}

var PostClass = Parse.Object.extend("Post");
var CommentClass = Parse.Object.extend("Comment");

Parse.Cloud.define('list', function(req, res) {
  var outputResult = {};
  var query = new Parse.Query("Post");
  query.equalTo("url", req.params.url);
  query.first().then(function(post){
    if (!post) {
      // Create it
      post = new PostClass();
      post.set("url", req.params.url);

      post.save(null, { useMasterKey: true}).then(function(post){
        res.success({
          post: post,
          count: 0,
          comments: []
        })
      }, function(error){
        res.error(error);
      })
    } else {
      outputResult.post = post;
      var commentQuery = new Parse.Query("Comment");
      commentQuery.equalTo("post", post);
      commentQuery.ascending("thread");
      commentQuery.count({ useMasterKey: true}).then(function(count) {
        outputResult.count = count;
        return commentQuery.find({ useMasterKey: true })
      }).then(function(results){
        var comments = [];
        for (var i = 0; i <= results.length - 1; i++) {
          // Output result
          var result = results[i];
          var md5 = crypto.createHash('md5');
          var comment = {
            nickname: result.get('nickname'),
            email: md5.update(result.get('email')).digest('hex'),
            website: result.get('website'),
            content: result.get('content'),
            time: result.createdAt,
            id: result.id,
            parent: result.get('parent'),
            thread: result.get('thread')
          }
          comments.push(comment);
        }

        outputResult.comments = comments;
        res.success(outputResult);
      }, function(error) {
        res.error(error);
      });
    }
  });
});

Parse.Cloud.define('new', function(req, res){
  // Check
  var required = /\S+/;
  var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

  var postQuery = new Parse.Query(PostClass);

  var myPost;

  // Check post
  postQuery.get(req.params.post, { useMasterKey: true })
  .then(function(post){
    myPost = post;
    if (!req.params.nickname || !req.params.email || !req.params.content) {
      return Parse.Promise.error("用户名、邮箱以及评论内容都是必填的喔。");
    }
  }).then(function(){
    if (!email.test(req.params.email)) {
      return Parse.Promise.error("请输入一个正常的邮箱地址。");
    }
  }).then(function(){
    if (req.params.website && !url.test(req.params.website)) {
      return Parse.Promise.error("请输入一个正常的 URL（不要省略开头的 http(s):// 喔）")
    }
  }).then(function(){
    if (req.params.parent) {
      var commentQuery = new Parse.Query(CommentClass);
      console.log("here2");
      return commentQuery.get(req.params.parent, { useMasterKey: true })
    } else {
      return Parse.Promise.as(null);
    }
  }).then(function(parent){
    console.log("here1");
    var comment = new CommentClass();

    comment.set("post", myPost);
    comment.set("nickname", req.params.nickname);
    comment.set("email", req.params.email);
    comment.set("website", req.params.website);
    comment.set("content", req.params.content);
    comment.set("parent", parent);

    return Parse.Promise.when(Parse.Promise.as(comment), Parse.Promise.as(parent));
  }).then(function(comment, parent) {
    console.log("here3");
    // Thread
    var commentQuery = new Parse.Query(CommentClass);
    commentQuery.descending("thread");
    commentQuery.equalTo("parent", parent);

    return Parse.Promise.when(commentQuery.first({ useMasterKey: true }), Parse.Promise.as(comment), Parse.Promise.as(parent))
  }).then(function(brother, comment, parent){
    if (!brother) {
      // First child
      console.log("here4");
      if (!parent) {
        var thread = [];
      } else {
        var thread = parent.get("thread").trimRight("/").split(".");
      }
      var level = "00";
    } else {
      console.log("here5");
      var thread = brother.get("thread").trimRight("/").split(".");
      var level = comment_increment_alphadecimal(thread.pop());
    }
    thread[thread.length] = level;
    comment.set("thread", thread.join(".") + "/");

    return comment.save(null, { useMasterKey: true });
  }).then(function(comment){
    res.success({
      status: "ok"
    })
  }).catch(function(error) {
    res.error(error)
  })
})