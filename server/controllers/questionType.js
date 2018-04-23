
'use strict';
var _ = require ("lodash")
var db = require('../../models');
exports.create = async (ctx,next)=> {
  let questionType= await db.QuestionType.create({
      projectId: ctx.request.body.projectId,
      projectName: ctx.request.body.projectName,
      name: ctx.request.body.name,   
  })
  ctx.body = {
    questionType: questionType,
    errcode:0,
    msg:null
  };
}
exports.index = async (ctx,next)=> {
  var  questionType= await db.QuestionType.findAll({ })
  ctx.body = {
    questionType: questionType,
    errcode:0,
    msg:null
  };
}
exports.destroy = async(ctx, next) => {
  var Id = ctx.params.id;
  var questionType = await db.QuestionType.destroy({
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
  var questionType = await db.QuestionType.findById(id);
  await questionType.update(params);

  ctx.body = {
    questionType: await questionType.reload()
  }
}
exports.filter = async (ctx,next)=>{
  var params = ctx.params.id;
  var allUPDATE = await db.QuestionType.findAll({});
  var questionType = allUPDATE;
  // console.log(questionType);
  // console.log(params);
  if(params){
    questionType = _.filter(questionType, function(questionType){
      return  params == questionType.projectId 
    })
  }
  // console.log(questionType)
  ctx.body = {
    questionType: questionType,
    msg: 'ok',
    errcode:0,
  }
}

// exports.filter = async (ctx,next)=>{
//   var params = ctx.query;
//   var allHonors = await db.QuestionType.findAll({
//     include: [{
//       model: db.Project
//     },{
//       model: db.User
//     }]
//   });
//   var questionType = allHonors;

//   console.log(params);
//   if(params.company){
//     questionType = _.filter(questionType, function(questionType){
//       return params.company == questionType.Project.sszgs;
//     })
//   }
//   if(params.userId){
//     questionType = _.filter(questionType, function(questionType){
//       return params.userId == questionType.userId;
//     })
//   }
//   if(params.projectId){
//     questionType = _.filter(questionType, function(questionType){
//       return params.projectId == questionType.projectId;
//     })
//   }
//   if(params.fromDate && params.toDate){
//     questionType = _.filter(questionType, function(questionType){
//       return (moment(params.fromDate) <= moment(questionType.date) && moment(params.toDate) >= moment(questionType.date));
//     })
//   }
//   if(params.name){
//     questionType = _.filter(questionType, function(questionType){
//       return params.name == questionType.name;
//     })
//   }
//   if(params.source){
//     questionType = _.filter(questionType, function(questionType){
//       return params.source == questionType.source;
//     })
//   }
//   ctx.body = {
//     questionType: questionType
//   }
// }