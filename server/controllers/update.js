'use strict';
var _ = require('lodash');
var db = require('../../models');
exports.create = async (ctx,next)=> {
  let update= await db.Update.create({
      content: ctx.request.body.content,
      people: ctx.request.body.people,
      date: ctx.request.body.date,
      version: ctx.request.body.version,
      projectId: ctx.request.body.projectId,
      projectName: ctx.request.body.projectName,  
  })
  ctx.body = {
    update: update,
    errcode:0,
    msg:null
  };
}
exports.index = async (ctx,next)=> {
  var  update= await db.Update.findAll({ })
  ctx.body = {
    update: update,
    errcode:0,
    msg:null
  };
}
exports.destroy = async(ctx, next) => {
  var Id = ctx.params.id;
  var update = await db.Update.destroy({
    where: {
      id: Id
    }
  });
   ctx.body = {
    msg: 'ok',
    errcode:0,

  }
}

exports.filter = async (ctx,next)=>{
    var params = ctx.params.id;
    var allUPDATE = await db.Update.findAll({});
    var update = allUPDATE;
    console.log(update);
    console.log(params);
    if(params){
      update = _.filter(update, function(update){
        return   params == update.projectId 
      })
    }
    console.log(update)
    ctx.body = {
      update: update,
      msg: 'ok',
      errcode:0,
    }
  }