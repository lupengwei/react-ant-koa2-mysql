'use strict';
var _ =require('lodash')
var db = require('../../models');
// const koaBody = require('koa-body');

exports.create = async (ctx,next)=> {
  let question= await db.Question.create({
      content: ctx.request.body.content,
      title: ctx.request.body.title,
      projectId: ctx.request.body.projectId,
      flag: ctx.request.body.flag,  
      type: ctx.request.body.type, 
      projectId: ctx.request.body.projectId,
      projectName: ctx.request.body.projectName, 
  })
  ctx.body = {
    question: question,
    errcode:0,
    msg:null
  };
}
exports.searctTitle = async (ctx,next)=> {
  var flag=ctx.params.flag;
  var  question= await db.Question.findAll({ 
    where:
    {
      $or: [
        {
          title: {
            $like: `%${flag}%`
          },
        },
        {
          flag: {
            $like: `%${flag}%`
          }
        }
      ]
    }
  })
  ctx.body = {
    question: question,
    errcode:0,
    msg:null
  };
}
exports.index = async (ctx,next)=> {
  var  question= await db.Question.findAll({ })
  ctx.body = {
    question: question,
    errcode:0,
    msg:null
  };
}
exports.destroy = async(ctx, next) => {
  var Id = ctx.params.id;
  var question = await db.Question.destroy({
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
  var question = await db.Question.findById(id);
  await question.update(params);

  ctx.body = {
    question: await question.reload()
  }
}
exports.filter = async (ctx,next)=>{
  var params = ctx.params.id;
  var allUPDATE = await db.Question.findAll({});
  var question = allUPDATE;
  // console.log(question);
   console.log(params);
  if(params){
    question = _.filter(question, function(question){
      return  params == question.projectId 
    })
  }
  // console.log(question)
  ctx.body = {
    question: question,
    msg: 'ok',
    errcode:0,
  }
}
exports.filteritem = async (ctx,next)=>{
  var params = ctx.params.id;
  var allUPDATE = await db.Question.findAll({});
  var question = allUPDATE;
  // console.log(question);
   console.log(params);
  if(params){
    question = _.filter(question, function(question){
      return  params == question.id 
    })
  }
  // console.log(question)
  ctx.body = {
    question: question,
    msg: 'ok',
    errcode:0,
  }
}
exports.qusetionItem = async (ctx,next)=>{
  var params = ctx.request.query.type;
  console.log(params);
  var allUPDATE = await db.Question.findAll({});
  var question = allUPDATE;
  // console.log(question);
   console.log(params);
  if(params){
    question = _.filter(question, function(question){
      return  params == question.type 
    })
  }
  // console.log(question)
  ctx.body = {
    question: question,
    msg: 'ok',
    errcode:0,
  }
}
exports.destroy = async(ctx, next) => {
  var Id = ctx.params.id;
  var question = await db.Question.destroy({
    where: {
      id: Id
    }
  });
   ctx.body = {
    msg: 'ok',
    errcode:0,

  }
}