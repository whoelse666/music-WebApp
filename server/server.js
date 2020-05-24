/*
 * @Author: RONGWEI PENG
 * @Date: 2020-05-22 14:22:00
 * @LastEditors: Do not edit
 * @LastEditTime: 2020-05-24 14:52:20
 * @FilePath: /网易云音乐/server/server.js
 */

let express = require('express');
let qs = require('qs');
let app = express();
let { readFile, writeFile } = require('./promiseFs.js');

const port = 8888;
app.listen(port, function () {
  console.log('后台服务起于' + port + '端口');
});

app.use((req, res, next) => {
  res.header('access-control-allow-origin', 'http://localhost:8080');

  res.header('Access-Control-Allow-Credentials', true); //

  next();
});

app.use((req, res, next) => {
  let str = '';
  let obj = {};
  req.on('data', function (chunk) {
    str += chunk;
  });
  req.on('end', function () {
    try {
      obj = JSON.parse(str);
    } catch (error) {
      obj = qs.parse(str);
    }
    req.postData = obj;
    next();
  });
});

app.use((req, res, next) => {
  readFile('./json/music.json').then(data => {
    let ary = JSON.parse(data);
    req.musicData = ary;
    next();
  });
});

app.get('/musicInfo', (req, res) => {
  let { id = 1 } = req.query;
  let ary = req.musicData;
  let data = ary.filter(item => item.id == id)[0] || {};
  res.send({
    ...data,
  });
});
