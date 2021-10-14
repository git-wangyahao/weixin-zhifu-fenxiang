// 微信接口统一处理
var requestAjax = require('request');
let c = require('./../pay/config')
let util = require('./../../utils/utils')
const config = c.wx
exports.getAccessToken = function(code) {
  let token_url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.appId}&secret=${config.appSec}&code=${code}&grant_type=authorization_code`

  // 获取code后，请求以下链接获取access_token： https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
  return new Promise((resolve,reject) => {
    requestAjax.get(token_url,function(err, response, body) {

      let result =  util.handleRespones(err, response, body)
      resolve(result)
    })
  })
} 



/**
 * 根据openid 和 access_token获取用户信息
 */

 exports.getUserInfo = function(access_token,openid) {
  let userinfo = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
  // 获取code后，请求以下链接获取access_token： https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
  return new Promise((resolve,reject) => {
    requestAjax.get(userinfo,function(err, response, body) {
      let result =  util.handleRespones(err, response, body)
      resolve(result)
    })
  })
 }


//  获取基础token
exports.getToken = function() {
   let token = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSec}`
   console.log("tokenURL",token)
   return new Promise( (resolve,reject) => {
    requestAjax.get(token,function(err, response, body) {
      let result =  util.handleRespones(err, response, body)
      resolve(result)
    })
  })
}

// 根据token获取ticket 

exports.getTicket = function(ACCESS_TOKEN) {
   let tokenURL = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${ACCESS_TOKEN}&type=jsapi`
   
   return new Promise( (resolve,reject) => {
    requestAjax.get(tokenURL,function(err, response, body) {
      let result =  util.handleRespones(err, response, body)
      resolve(result)
    })
  })
}













