'use strict';

var Wx = require('../lib/wx_api');
var WxConfig = require('../lib/wx_config');
var pinyinLib = require('pinyin');
var db = require('../../models');
var moment = require('moment');
var url = require('url');
var crypto = require('crypto');

const env = process.env.NODE_ENV || 'development';

exports.index = async (ctx,next)=> {
  ctx.body = {
    msg: 'ok'
  };
}

exports.demo = async (ctx,next)=> {
  ctx.body = {
    errmsg: 0,
    data: [
      {
        id: 1,
        text: 'Learn antd123',
        isComplete: true,
      },
      {
        id: 2,
        text: 'Learn ant-tool',
      },
      {
        id: 3,
        text: 'Learn dora',
      },
    ],
  }
}

// exports.pagesAuth = function *() {
//   await ctx.render('home/index');
// };

exports.loginByWx = async (ctx,next)=> {
  console.log(ctx.headers);

  var url;

  switch(env) {
    case 'production':

      // 生产环境（PC端）
      url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbb540168cba600af&redirect_uri=http://des.56cto.net/auth/wx-auth/pc&response_type=code&scope=snsapi_userinfo&agentid=39&state=STATE11234#wechat_redirect';

    break;
    case 'staging':

      // 开发机（PC端）
      url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbb540168cba600af&redirect_uri=http://staging.des.56cto.net/auth/wx-auth/pc&response_type=code&scope=snsapi_userinfo&agentid=1000036&state=STATE11234#wechat_redirect';

    break;
    case 'development':

      // 本地
      url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbb540168cba600af&redirect_uri=http://127.0.0.1:3002/auth/wx-auth/pc&response_type=code&scope=snsapi_userinfo&agentid=1000003&state=STATE11234#wechat_redirect';

    break;
  }

  ctx.redirect(url);

}

exports.loginByWxFromMobile = async (ctx,next)=> {
  ctx.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbb540168cba600af&redirect_uri=http://des.56cto.net&response_type=code&scope=snsapi_userinfo&agentid=48&state=STATE11234#wechat_redirect');
}

exports.wxAuth = async (ctx,next)=> {
  var type = ctx.params.type;
  console.log(type);
  var ticket = await Wx.getUserTicket(ctx.query.code, type);
  if(!ticket.user_ticket) {
    ctx.status = 402;
    ctx.body = {
      error: '非法code!'
    }
  }else {
    var userinfo = await Wx.getUserInfo(ticket.user_ticket, type);
    var user = await db.User.findOne({
      where: {
        wxid: userinfo.userid
      }
    });
    //假如通过wxid找不到，就通过名字找
    if(!user){
      user = await db.User.findOne({
        where: {
          name: userinfo.name
        }
      });
    }
    //假如通过名字和wxid都找不到，创建新的
    if(!user) {
      user = await db.User.create({
        wxid: userinfo.userid,
        name: userinfo.name,
        pinyin: (pinyinLib(userinfo.name, {
          style: pinyinLib.STYLE_NORMAL
        }) + '').replace(/,/g, ''),
        suoxie: (pinyinLib(userinfo.name, {
          style: pinyinLib.STYLE_FIRST_LETTER
        }) + '').replace(/,/g, '')
      })
    }
    //这里仅仅是通过名字找到的情况，处理原来dingding登录过，企业微信没有登录过的情况，补上wxid
    if(!user.wxid){
      await db.User.update({
        wxid: userinfo.userid
      }, {
        where: {
          id: user.id
        }
      });
    }

    var userInfoDatas = await user.reload();

    console.log(userInfoDatas.dataValues);
    await db.UserLogin.create({
      name: userInfoDatas.name,
      loginTime: moment().toDate()
    });
    if(type == 'pc') {
      ctx.status = 200;
      await ctx.render('home/login', {
        body: {
          datas: userInfoDatas,
          env: env || 'development',
          type: type
        }
      });
    }else {
      ctx.status = 200;
      ctx.body = userInfoDatas;
    }

  }


  //for develop
  // var user = await db.User.findOne({
  //   where: {
  //     id: 62
  //   }
  // });

  // ctx.body = user;
}

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

exports.wxJsapiTicket = async (ctx,next)=>{
  let datas = ctx.request.body;

  let nonceStr = 'abcdefg';
  let timeStamp = new Date().getTime();
  let ticket = await Wx.getAuthTicket('pc');

  let signature = sign({
    nonceStr: nonceStr,
    timeStamp: timeStamp,
    url: datas.signedUrl,
    ticket: ticket
  });

  ctx.body = {
    agentId: WxConfig[env].AgentId,
    corpId: WxConfig[env].CorpID,
    nonceStr: nonceStr,
    timeStamp: timeStamp,
    signature: signature
  }

}