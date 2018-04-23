'use strict';

var rp = require('request-promise');
var redis = require('./redis').Redis;
var env = process.env.NODE_ENV || 'development';

var invoke = function* (method, uri, qs, body) {
  var result = yield rp({
    method: method,
    uri: uri,
    qs: qs,
    body: body,
    headers: {
      'Content-Type': 'application/json',
      'cache-control': 'no-cache'
    },
    json: true
  });
  return result;
}

exports.getUserTicket = function* (code, type='pc') {
  var token = yield getToken(type);
  var uri = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${token}&code=${code}`;
  var result = yield invoke('GET', uri, null, null);
  return result
}

// JS-SDK获取jsapi_ticket
exports.getAuthTicket = function* (type='pc') {

  var redisTicketName = (env == 'production') ? 'wx-js-ticket-39' : 'wx-js-ticket-1000036';

  var ticket = yield redis.get(redisTicketName);
  if(ticket) {
    return ticket;
  }else {
    var token = yield getToken(type);
    var uri = `https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=${token}`;
    var result = yield invoke('GET', uri, null, null);
    yield redis.set(redisTicketName, ticket);
    yield redis.expire(redisTicketName, 7000);
    return result.ticket;
  }
}

exports.getUserInfo = function* (ticket, type='pc') {
  var token = yield getToken(type);
  var uri = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserdetail?access_token=${token}`;
  var result = yield invoke('POST', uri, null, {
    user_ticket: ticket
  });
  return result
}

var getToken = function* (type='pc') {

  if(type == 'pc') {

    // 生产环境
    if(env == 'production') {
      var config = {
        CorpID: 'wxbb540168cba600af',
        Secret: 'DkS_CjbWnGz3q4C5f5BsmFJDYYjdegBPayh0kfaGAqQ'
      }
      var token = yield redis.get('wx-token-39');
      if (token) {
        return token;
      } else {
        var uri = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${config.CorpID}&corpsecret=${config.Secret}`;
        var newToken = yield invoke('GET', uri, null, null);
        yield redis.set('wx-token-39', newToken.access_token);
        yield redis.expire('wx-token-39', 7000);
        return newToken.access_token;
      }
    }

  

  }else {

    // 移动端
    var config = {
      CorpID: 'wxbb540168cba600af',
      Secret: '0bh3hux7o-Ogbq5lXy0xZIy9oV2-UCQN3EkhlwMonOA'
    }
    var token = yield redis.get('wx-token-48');
    if (token) {
      return token;
    } else {
      var uri = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${config.CorpID}&corpsecret=${config.Secret}`;
      var newToken = yield invoke('GET', uri, null, null);
      yield redis.set('wx-token-48', newToken.access_token);
      yield redis.expire('wx-token-48', 7000);
      return newToken.access_token;
    }

  }

}

exports.sendTextMessage = function* (content, userid) {

  var token = yield getToken('mobile');

  if(env == 'development') {
    var userid = '7942723639704109317';
  }
  var uri = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${token}`;
  var body = {
    touser: userid,
    msgtype : "text",
    agentid: '48',
    "text" : {
       "content" : content
    },
    "safe":0
  }
  var result = yield invoke('POST', uri, null, body);
  console.log(result);
  if (result.errcode == 0) {
    return { success: '发送成功' };
  } else {
    return { info: result };
  }
}



exports.getToken = getToken;