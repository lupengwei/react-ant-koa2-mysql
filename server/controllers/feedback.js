// import { createSecureContext } from 'tls';

'use strict';
var db = require('../../models');

exports.create = async (ctx,next)=> {
  var user = ctx.user;
  let feedback= await db.Feedback.create({
      content: ctx.request.body.content,
      modal: ctx.request.body.modal,
      projectId: ctx.request.body.projectId,
      projectName: ctx.request.body.projectName,
      userName: 2
    })
  ctx.body = {
    feedback: feedback,
    mag:null,
    errcode:0
  };
}
exports.update = async(ctx, next) => {
  var id = ctx.params.id;
  var params = ctx.request.body;
  var feedback = await db.Feedback.findById(id);
  await feedback.update(params);

  ctx.body = {
    feedback: await feedback.reload(),
    mag:null,
    errcode:0
  };
}

exports.index = async (ctx,next)=> {
    var feedback = {
      date: await db.Feedback.findAll({
        include: [{
          model: db.User,
          attributes: ['name']
        }]
      })
    }
    ctx.body = {
      feedback: feedback,
      mag:null,
      errcode:0
    };
}
