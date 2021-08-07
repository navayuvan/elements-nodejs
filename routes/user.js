var express = require('express')
var router = express.Router()

router.post('/', function (req, res) {
  res.send('user/post');
})

router.get('/', function (req, res) {
  res.send('user/get');
})

router.update('/', function (req, res) {
  res.send('user/update');
})

router.delete('/', function (req, res) {
  res.send('user/delete');
})

router.delete('/index', function (req, res) {
  res.send('user/index');
})

module.exports = router