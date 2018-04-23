'use strict';
var _ = require('lodash');
var moment = require('moment');
var url = require('url');
var db = require('../../models');

exports.create = async (ctx,next)=> {
  let online= await db.Online.create({
    name: ctx.request.body.title,
    projectId: ctx.request.body.projectId,
    url: ctx.request.body.url,  
    type: ctx.request.body.type, 
    projectId: ctx.request.body.projectId,
    projectName: ctx.request.body.projectName, 
})
  ctx.body = {
    online: online,
    errcode:0,
    msg:null
  };
};
exports.update = async(ctx, next) => {
  var id = ctx.params.id;
  var params = ctx.request.body;
  var online = await db.Online.findById(id);
  await online.update(params);

  ctx.body = {
    online: await online.reload()
  }
}

exports.destroy = async(ctx, next) => {
  var Id = ctx.params.id;
  var online = await db.Online.destroy({
    where: {
      id: Id
    }
  });
   ctx.body = {
    msg: 'ok',
    errcode:0,

  }
}
exports.showFile = async(ctx,next) => {
  var id = ctx.params.id;
  var online = await db.Online.findOne({
    where: {
      id: id
    }
  });

  ctx.body = {
   online:online , // await online.detail(),
    errcode:0,
    msg:null
  }
}

exports.index = async (ctx,next)=> {
  var  online= await db.Online.findAll({ })
  ctx.body = {
    online: online,
    errcode:0,
    msg:null
  };
}

exports.filter = async (ctx,next)=>{
  var params = ctx.params.id;
  var allUPDATE = await db.Online.findAll({});
  var online = allUPDATE;
   console.log(params);
  if(params){
    online = _.filter(online, function(online){
      return  params == online.projectId 
    })
  }
  // console.log(online)
  ctx.body = {
    online: online,
    msg: 'ok',
    errcode:0,
  }
}
exports.onlineItem = async (ctx,next)=>{
  var params = ctx.request.query.type;
  console.log(params);
  var allUPDATE = await db.Online.findAll({});
  var online = allUPDATE;
  //  console.log(online);
   console.log(params);
  if(params){
    online = _.filter(online, function(online){
      return  params == online.type 
    })
  }
  // console.log(online)
  ctx.body = {
    online: online,
    msg: 'ok',
    errcode:0,
  }
}