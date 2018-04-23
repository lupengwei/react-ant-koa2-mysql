'use strict';

var _ = require('lodash');
var moment = require('moment');
var url = require('url');
var jwt    = require('koa-jwt');
var crypto = require('crypto');
var querystring = require('querystring');
var pinyinLib = require('pinyin');
var DingtalkApi = require('../lib/dingtalk_api');
var DingtalkConfig = require('../dingtalk_config');
var db = require('../../models');
const SERVER_ENV = process.env.NODE_ENV || 'development';
const wxConfig = require('../lib/wx_config')[SERVER_ENV];
const wxApi = require('../lib/wx_api');
function sign(params) {
  var origUrl = params.url;
  var origUrlObj =  url.parse(origUrl);
  delete origUrlObj['hash'];
  var newUrl = url.format(origUrlObj);
  var plain = 'jsapi_ticket=' + params.ticket +
      '&noncestr=' + params.nonceStr +
      '&timestamp=' + params.timeStamp +
      '&url=' + newUrl;
  var sha1 = crypto.createHash('sha1');
  sha1.update(plain, 'utf8');
  var signature = sha1.digest('hex');
  return signature;
}

exports.login = function* () {

  console.log(this.url);
  var userAgent = this.headers['user-agent'].toLowerCase();
  var agentID = userAgent.match(/(iphone|ipod|ipad|android)/);
  var currentAgentId;

  if(process.env.NODE_ENV == 'production'){
    if(agentID) {
      var signedUrl = 'http://des.56cto.net';
      currentAgentId = DingtalkConfig.MOBILE_PRODUCTION_AGENT_ID;
    }else {
      var signedUrl = 'http://api.des.56cto.net/dingtalk/auth';
      currentAgentId = DingtalkConfig.PC_PRODUCTION_AGENT_ID;
    }
  }else {
    if(process.env.NODE_ENV == 'staging'){
      //staging环境只有PC端
      if(agentID) {
        var signedUrl = 'http://staging.des.56cto.net';
        currentAgentId = DingtalkConfig.MOBILE_STAGING_AGENT_ID;
      }else {
        var signedUrl = 'http://api.staging.des.56cto.net/dingtalk/auth';
        currentAgentId = DingtalkConfig.PC_STAGING_AGENT_ID;
      }
    }else {
      //只能是入口地址
      if(agentID) {
        var signedUrl = 'http://127.0.0.1:3002/dingtalk/auth';
        currentAgentId = DingtalkConfig.MOBILE_DEV_AGENT_ID;
      }else {
        var signedUrl = 'http://127.0.0.1:3002/dingtalk/auth';
        currentAgentId = DingtalkConfig.PC_DEV_AGENT_ID;
      }
    }
  }

  var nonceStr = 'abcdefg';
  var timeStamp = new Date().getTime();

  var tokenJson = yield DingtalkApi.getToken();

  var ticketJson = yield DingtalkApi.getJsapiTicket(tokenJson);

  console.log({
    nonceStr: nonceStr,
    timeStamp: timeStamp,
    url: signedUrl,
    ticket: ticketJson.ticket
  });

  var signature = sign({
    nonceStr: nonceStr,
    timeStamp: timeStamp,
    url: signedUrl,
    ticket: ticketJson.ticket
  });

  var clientConfig = {
    agentId: currentAgentId,
    corpId: DingtalkConfig.CORP_ID,
    nonceStr: 'abcdefg',
    timeStamp: timeStamp,
    signature: signature
  }

  this.body = {
    errmsg: 0,
    config: clientConfig,
    token: tokenJson,
    env: process.env.NODE_ENV
  };
};

exports.getuserinfo = function* () {

  var code = this.request.body.code;
  var tokenJson = yield DingtalkApi.getToken();
  var userInfoJson = yield DingtalkApi.getUserInfo(tokenJson, code);

  var user = yield db.User.findOne({
    where: {
      userid: userInfoJson.userid
    }
  });

  var token = jwt.sign({ userid: userInfoJson.userid }, 'asdfhiushdfiuh');

  yield this.body = {
    userInfo: user || userInfoJson,
    token: token
  };
};

exports.mockUser = function* () {
  var userid = this.request.body.userid
  this.body = {
    token: jwt.sign({ userid: userid }, 'asdfhiushdfiuh')
  };
}

// 根据wxId获取用户信息
exports.getuserInfoByWxId = function* () {
  let wxId = this.params.wxId;
  let user = yield db.User.findOne({
    where: {
      wxid: wxId
    }
  });

  this.body = {
    errcode: 0,
    msg: 'success',
    user: user
  };
}

// 根据不同的平台登录处理免登入口
exports.loginByOrginType = function* () {
  let orginType = this.params.type;

  // 企业微信入口
  if(orginType == 'wxwork') {

    let userAgent = this.headers['user-agent'].toLowerCase();
    let isMobile = userAgent.match(/(iphone|ipod|ipad|android)/igm);
    let des_redirect_uri = this.request.query.des_redirect_uri; // 若带有参数请先编码
    let deviceType = isMobile ? 'mobile' : 'pc';
    let signedUrl;

    switch (SERVER_ENV) {
      case 'production':
        signedUrl = 'http://des.56cto.net';
        break;
      case 'staging':
        signedUrl = 'http://staging.des.56cto.net';
        break;
    }

    let redirect_uri = `${signedUrl}/auth/redirect/${orginType}?deviceType=${deviceType}`;
    let des_redirect_uri_str = `?des_redirect_uri=${des_redirect_uri}`;
    if (des_redirect_uri) redirect_uri += des_redirect_uri_str;
    let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wxConfig.CorpID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&agentid=${wxConfig.AgentId}&state=STATE11234#wechat_redirect`;

    this.redirect(url);
  }
}

// 根据不同的平台登录处理免登入口（获取用户信息）
exports.loginRedirectByOrginType = function* () {
  let orginType = this.params.type;

  if(orginType == 'wxwork') {

    let code = this.request.query.code;
    let deviceType = this.request.query.deviceType;
    let des_redirect_uri = this.request.query.des_redirect_uri;
    let signedUrl;

    let ticket = yield wxApi.getUserTicket(code, 'pc');

    switch (SERVER_ENV) {
      case 'production':
        signedUrl = (deviceType == 'mobile') ? 'http://des.56cto.net' : 'http://des.56cto.net';
        break;
      case 'staging':
        signedUrl = (deviceType == 'mobile') ? 'http://staging.des.56cto.net' : 'http://staging.des.56cto.net';
        break;
    }

    if(!ticket.user_ticket) {
      this.status = 402;
      return this.body = {
        errcode: -1,
        msg: "code非法，获取ticket失败！"
      }
    }else {
      let userInfo = yield wxApi.getUserInfo(ticket.user_ticket, 'pc');
      console.log("wechatInfo：", userInfo)

      // 登录记录
      yield db.UserLogin.create({
        name: userInfo.name,
        loginTime: moment().toDate()
      });

      let user = yield db.User.findOne({
        where: {
          wxid: userInfo.userid
        }
      });

      if(!user) {
        user = yield db.User.create({
          wxid: userInfo.userid,
          name: userInfo.name,
          pinyin: (pinyinLib(userInfo.name, {
            style: pinyinLib.STYLE_NORMAL
          }) + '').replace(/,/g, ''),
          suoxie: (pinyinLib(userInfo.name, {
            style: pinyinLib.STYLE_FIRST_LETTER
          }) + '').replace(/,/g, ''),
          active: 1
        })
      }

      let url = `${signedUrl}/login/wx/${user.wxid}`;
      if(des_redirect_uri) url += `&des_redirect_uri=${des_redirect_uri}`;

      if(deviceType == 'pc') {
        yield this.render('login/wxwork', {
          body: {
            userInfo: userInfo,
            signedUrl: signedUrl,
            deviceType: deviceType,
            env: SERVER_ENV
          }
        });
      }else {
        return this.redirect(url);
      }

    }
  }
}