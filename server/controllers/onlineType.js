
'use strict';
var _ = require ("lodash")
var db = require('../../models');
exports.create = async (ctx,next)=> {
  let onlineType= await db.OnlineType.create({
      projectId: ctx.request.body.projectId,
      projectName: ctx.request.body.projectName,
      name: ctx.request.body.name,   
  })
  ctx.body = {
    onlineType: onlineType,
    errcode:0,
    msg:null
  };
}
exports.index = async (ctx,next)=> {
  var  onlineType= await db.OnlineType.findAll({ })
  ctx.body = {
    onlineType: onlineType,
    errcode:0,
    msg:null
  };
}
exports.destroy = async(ctx, next) => {
  var Id = ctx.params.id;
  var onlineType = await db.OnlineType.destroy({
    where: {
      id: Id
    }
  });
   ctx.body = {
    msg: 'ok',
    errcode:0,

  }
}
exports.update = async(ctx, next) => {
  var id = ctx.params.id;
  var params = ctx.request.body;
  var onlineType = await db.OnlineType.findById(id);
  await onlineType.update(params);

  ctx.body = {
    onlineType: await onlineType.reload()
  }
}
exports.filter = async (ctx,next)=>{
  var params = ctx.params.id;
  var allUPDATE = await db.OnlineType.findAll({});
  var onlineType = allUPDATE;
  // console.log(onlineType);
  // console.log(params);
  if(params){
    onlineType = _.filter(onlineType, function(onlineType){
      return  params == onlineType.projectId 
    })
  }
  // console.log(onlineType)
  ctx.body = {
    onlineType: onlineType,
    msg: 'ok',
    errcode:0,
  }
}

// exports.filter = async (ctx,next)=>{
//   var params = ctx.query;
//   var allHonors = await db.OnlineType.findAll({
//     include: [{
//       model: db.Project
//     },{
//       model: db.User
//     }]
//   });
//   var onlineType = allHonors;

//   console.log(params);
//   if(params.company){
//     onlineType = _.filter(onlineType, function(onlineType){
//       return params.company == onlineType.Project.sszgs;
//     })
//   }
//   if(params.userId){
//     onlineType = _.filter(onlineType, function(onlineType){
//       return params.userId == onlineType.userId;
//     })
//   }
//   if(params.projectId){
//     onlineType = _.filter(onlineType, function(onlineType){
//       return params.projectId == onlineType.projectId;
//     })
//   }
//   if(params.fromDate && params.toDate){
//     onlineType = _.filter(onlineType, function(onlineType){
//       return (moment(params.fromDate) <= moment(onlineType.date) && moment(params.toDate) >= moment(onlineType.date));
//     })
//   }
//   if(params.name){
//     onlineType = _.filter(onlineType, function(onlineType){
//       return params.name == onlineType.name;
//     })
//   }
//   if(params.source){
//     onlineType = _.filter(onlineType, function(onlineType){
//       return params.source == onlineType.source;
//     })
//   }
//   ctx.body = {
//     onlineType: onlineType
//   }
// }