var express = require('express');
var router = express.Router();

var crypto = require('crypto');

var mongoose = require('mongoose');
var Comment = require('../models/Comment.js'),
    Post = require('../models/Post.js');

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

router.get('/list', function(req, res, next) {

  // TODO: Validate request

  // Find post
  Post.findOneOrCreate({ url: req.query.url })
  .then(function(post) {
    // Count comments
    return Promise.all([
      Promise.resolve(post),
      Comment.count({ post: post._id }).exec()
    ])
  })
  .then(function([post, count]) {
    // Query comments
    return Promise.all([
      Promise.resolve(post),
      Promise.resolve(count),
      Comment.find({ post: post._id }).select('-post -updatedAt -__v').sort('thread').exec()
    ])
  })
  .then(function([post, count, comments]) {
    var outputComments = []
    for (var i = 0; i < comments.length; i++) {
      var md5 = crypto.createHash('md5');
      outputComments[i] = {}
      outputComments[i].id = comments[i]._id
      outputComments[i].parent = comments[i].parent
      outputComments[i].thread = comments[i].thread
      outputComments[i].name = comments[i].name
      outputComments[i].email = md5.update(comments[i].email).digest('hex')
      outputComments[i].website = comments[i].website
      outputComments[i].content = comments[i].content
      outputComments[i].time = comments[i].createdAt
    }

    res.status(200).send({
      code: 0,
      message: {
        post: post._id,
        count: count,
        comments: outputComments
      }
    })
  })
  .catch(function(error) {
    // TODO: Error Handling
    console.error(error);
    next(error)
  })
})

router.post('/new', function(req, res, next) {
  Post.findById(req.body.post).exec()
  .then(function(post) {
    console.log(post)
    if (req.body.parent) {
      return Promise.all([
        Promise.resolve(post),
        Comment.findById(req.body.parent).exec()
      ])
    } else {
      return Promise.all([
        Promise.resolve(post),
        Promise.resolve(null)
      ])
    }
  })
  .then(function([post, parent]) {
    // 找呀找呀找朋友
    console.log(post)
    return Promise.all([
      Promise.resolve(post),
      Promise.resolve(parent),
      Comment.findOne({ parent: parent }).sort("-thread").exec()
    ])
  })
  .then(function([post, parent, brother]) {
    console.log('NEW COMMENT!!!')
    console.log(post)
    console.log(parent)
    console.log(brother)
    if (!brother) {
      // I am the FIRST child!
      console.log('I am the FIRST child!')
      var level = "00";
      if (!parent) {
        // AND I AM BABA!
        var thread = [];
      } else {
        var thread = parent.thread.slice(0, -1).split(".");
      }
    } else {
      var thread = brother.thread.slice(0, -1).split(".");
      var level = comment_increment_alphadecimal(thread.pop());
    }

    thread[thread.length] = level;

    return Comment.create({
      post: post._id,
      parent: parent ? parent._id : null,
      thread: thread.join(".") + "/",

      name: req.body.name,
      email: req.body.email,
      website: req.body.website,
      content: req.body.content
    })
  })
  .then(function(comment) {
    var md5 = crypto.createHash('md5')
    res.status(200).send({
      code: 0,
      message: {
        id: comment._id,
        parent: comment.parent,
        thread: comment.thread,
        name: comment.name,
        email: md5.update(comment.email).digest('hex'),
        website: comment.website,
        content: comment.content,
        time: comment.createdAt
      }
    })
  })
  .catch(function(error) {
    console.error(error);
    next(error);
  })
})

module.exports = router;
