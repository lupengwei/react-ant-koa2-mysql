/**
 * Qiniu API
 * ZXY@live.com - jasonzeng
 */

var qiniu = require('qiniu');

var _config = {
  ACCESS_KEY: 'h7Xh_XnIO4fUPBGOxiv-7UYvttIu8Y30VNvjNLjm',
  SECRET_KEY: 'aq1YYfiKEWhjNBxMDgEauZxFs2qBSBNoH5klyP72'
};

exports.getQiniuToken = function *(params) {

  qiniu.conf.ACCESS_KEY = _config.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = _config.SECRET_KEY;

  var bucket = params;
  //设置上传策略
  function PutPolicy(scope) {
    this.scope   = scope || null;
    this.expires = 3600;
  }
  //生成token
  var uptoken = new qiniu.rs.PutPolicy(bucket).token();
  console.log("qiniuToken => ", uptoken);
  
  return uptoken;

};

function cb(err, ret){
  if(err){
    datas = err;
  }else {
    datas = ret;
  }
  return datas;
}

exports.copyFile = function *(bucket, key, dstbucket, dstkey){

  qiniu.conf.ACCESS_KEY = _config.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = _config.SECRET_KEY;

  //构建bucketmanager对象
  var client = new qiniu.rs.Client();

  //复制资源

  var qiniuStat = function() {
    try{
      return new Promise(function(resolve, reject) {
        client.copy(bucket, key, dstbucket, dstkey, function(err, ret) {
          if(err){
            reject(err);
          }else {
            resolve("ok");
          }
        });
      });
    }catch(e){
      return "error"
    }
  };

  return yield qiniuStat();

};

exports.deleteFile = function *(bucket, key){

  qiniu.conf.ACCESS_KEY = _config.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = _config.SECRET_KEY;

  //构建bucketmanager对象
  var client = new qiniu.rs.Client();

  //删除资源
  var qiniuStat = function() {
    return new Promise(function(resolve, reject) {
      client.remove(bucket, key, function(err, ret) {
        if(err){
          reject(err);
        }else {
          resolve('ok');
        }
      });
    });
  };

  return yield qiniuStat();

};


exports.getFileInfo = function* (bucket, key){

  qiniu.conf.ACCESS_KEY = _config.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = _config.SECRET_KEY;

  //构建bucketmanager对象
  var client = new qiniu.rs.Client();

  //获取文件信息
  var qiniuStat = function() {
    return new Promise(function(resolve, reject) {
      client.stat(bucket, key, function(err, ret) {
        if(err){
          reject(err);
        }else {
          resolve(ret);
        }
      });
    });
  };

  return yield qiniuStat();

};