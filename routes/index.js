var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get("/test",function(req,res,next){
  var hashErrors = "hoakkd";
  var messages = [];
  messages.push(1);
	res.render('user/signin',{messages:messages, hasErrors: messages.length > 0});
});

module.exports = router;
