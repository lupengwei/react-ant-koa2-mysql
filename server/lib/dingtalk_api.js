'use strict';

var _ = require('lodash');
var moment = require('moment');
var request = require('co-request');
var config = require('../dingtalk_config');
var redisCli = require('./redis').Redis;
var env = process.env.NODE_ENV || 'development';

var invoke = function* (url, body, qs, method) {
  var headers = {
    'cache-control': 'no-cache',
    'content-type': 'application/json'
  };

  var result = yield request({
    uri: url,
    qs: qs,
    method: method,
    headers: headers,
    body: body,
    json: true
  });

  return result.body;
};

var sendMessage = function* (token, userid, content) {
  var url = config.OAPIHOST + '/message/send';
  var qs = {
    access_token: token,
  };

  var agentid;

  if(env == 'development') {
    var userid = '0134622140940380';
    var agentid = config.PC_DEV_AGENT_ID;
  }

  if(env == 'production') {
    agentid = config.PC_PRODUCTION_AGENT_ID;
  }

  if(env == 'staging') {
    agentid = config.PC_STAGING_AGENT_ID;
  }
  // console.log(config)
  var body = {
    touser: userid,
    agentid: agentid,
    msgtype: 'text',
    text: {
      content: content
    }
  }

  return yield invoke(url, body, qs, 'POST');
}

var getToken = function* () {

  var token = yield redisCli.get('token');

  if(token) {
    return token;
  }else {

    var url = config.OAPIHOST + '/gettoken';
    var qs = {
      corpid: config.CORP_ID,
      corpsecret: config.CORP_SECRET
    };

    var tokenJson = yield invoke(url, null, qs, 'GET');
    yield redisCli.set('token', tokenJson.access_token);
    yield redisCli.expire('token', 6500);
    return tokenJson.access_token;
  }

};


exports.getUsersByDepartment = function* (accessToken, dingdingId) {
  var url = config.OAPIHOST + '/user/list';
  var qs = {
    access_token: accessToken,
    department_id: dingdingId
  };

  return yield invoke(url, null, qs, 'GET');
};

exports.getJsapiTicket = function* (token) {

  var url = config.OAPIHOST + '/get_jsapi_ticket';
  var qs = {
    type: 'jsapi',
    access_token: token
  }

  return yield invoke(url, null, qs, 'GET');
};

exports.getUserInfo = function* (token, code) {
  var url = config.OAPIHOST + '/user/getuserinfo';
  var qs = {
    access_token: token,
    code: code
  }

  return yield invoke(url, null, qs, 'GET');
};
exports.getToken = getToken;