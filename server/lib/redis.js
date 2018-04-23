
var env = process.env.NODE_ENV || 'development';

var options = {};

if(env == 'production' || env == 'staging') {

  options = {
    host: 'localhost',
    port: '6379',
    auth_pass: '!pemywN%qW%$E3miO6OvKuj@*BR&3sX1'
  };
}

var redisClient = require('redis').createClient(options);
var wrapper = require('co-redis');
var Redis = wrapper(redisClient);

Redis.select(9);

exports.Redis = Redis;