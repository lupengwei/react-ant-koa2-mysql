'use strict';
var moment = require('moment');
var url = require('url');
var crypto = require('crypto');
var db = require('../../models');
exports.getUserInfo = async( ctx,next)=> {
  console.log(ctx.user)
  ctx.body = {
    user: ctx.user
  };
};

exports.all = async (ctx,next)=> {
  ctx.body = {
    users: await db.User.findAll({})
  }
};

exports.myTasksAsActive = async (ctx,next)=> {

};
exports.update = async (ctx,next)=> {
  var params = ctx.request.body;
  var user = ctx.user;
  user = await user.updateAttributes(params);
  ctx.body = {
    user: user
  }
}

exports.updateProfile = async(ctx,next)=> {
  var params = ctx.request.body;
  var user = await db.User.findOne({
    where: {
      id: params.id
    }
  });
  if(params.administrator){
    params.administrator = params.administrator == 'true' ? true : false;
  }
  if(params.dimission){
    params.dimission = params.dimission;
  }

  await db.User.update(params, {
    where: {
      id: user.id
    }
  });

  this.body = {
    user: await user.reload()
  }
}

exports.updateProjectRole = async (ctx,next)=> {
  var canCreateProject = this.request.body.canCreateProject == 'true' ? true : false
  var flag = await db.User.update({
    canCreateProject: canCreateProject
  },{
    where: {
      id: this.params.id
    }
  });

  this.body = {
    msg: 'ok',
    flag: flag[0]
  }
}

exports.show = async (ctx,next)=> {
  var user = await db.User.findOne({
    where: {
      id: params.id
    },
    include:[{
      model: db.Role
    }],
    attributes: ['name', 'canCreateProject']
  });

  ctx.body = {
    user: user
  }
}