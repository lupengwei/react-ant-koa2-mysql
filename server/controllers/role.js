'use strict';
var _ = require('lodash');
var moment = require('moment');
var url = require('url');
var crypto = require('crypto');
var querystring = require('querystring');
var db = require('../../models');

exports.create =async (ctx,next)=> {
  var params = this.request.body;
  var role = await db.Role.create(params);
  this.body = {
    role: role
  }
}
exports.index =async(ctx,next) =>{
  var roles = await db.Role.findAll();
  this.body = {
    roles: roles
  }
}
exports.destroy =async(ctx,next) =>{
  var role = await db.Role.findOne({
    where:{
      id: this.params.id
    }
  });
  await role.destroy();
  this.body = {
    msg: 'ok'
  }
}