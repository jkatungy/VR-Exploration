var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.io.emit("message", "hello, world!");
  res.render('index', { title: 'Cardboard' });
});

module.exports = router;
