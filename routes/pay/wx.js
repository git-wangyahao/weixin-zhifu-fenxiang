// 小程序 ，小程序云开发

const { json } = require('express');
var express = require('express');
var requestAjax = require('request');
var router = express.Router();
var common = require('./../common/index')
let createHash = require('create-hash')

// 引入缓存插件
var cache = require('memory-cache')
const c = require('./config')
const config = c.wx
let utils = require('./../../utils/utils')


/* GET home page. */
router.get('/test', function(req, res, next) {
  res.json({
    code: 0,
    data:'test'
  })
});



router.get('/redirectUrl', function(req, res, next) {
  // req.query.url 授权成功的回调地址
  let redirectUrl = req.query.url
  console.log("req.query",req.query)
  let scope = req.query.scope
  let callBack = 'http://wangyahao.wingtech.com:9000/wechat/getOpenId'
  cache.put('redirecturl',redirectUrl)  //使用缓存存储 回调地址
  let redirecturl = cache.get('redirecturl') // 获取缓存回调url
  // console.log("ceshi=======0",cache.exportJson())
  let authorizeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${callBack}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`
  res.redirect(authorizeUrl); //实现访问跳转
  // res.json({
  //   code: 0,
  //   data:'test'
  // })
});
  /**
   * 步骤一： 根据code 获取用户的openId
   */
router.get('/getOpenId', async function(req, res, next) {
  // 用户同意授权后 如果用户同意授权，页面将跳转至 redirect_uri/?code=CODE&state=STATE。
  // code说明 ： code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
  // 愿地址:https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
  let code = req.query.code

  // let token_url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.appId}&secret=${config.appSec}&code=${code}&grant_type=authorization_code`
  if(!code) {
    res.json(utils.handleFail('当前未获取到授权code码'))
  }else {
    let result =  await common.getAccessToken(code)
    console.log("result",result)
    if(result.code === 0) {
      let data = result.data
      let expire_time = 1000*60*2  // 生成过期时间
      cache.put('access_token',data.access_token,expire_time)  // 储存access_token 
      cache.put('openId',data.openid,expire_time)  // openId 
      res.cookie('openid',data.openid,{ maxAge:expire_time })  // 写入cookie
      let redirecturl = cache.get('redirecturl') // 获取缓存回调url
      res.redirect(redirecturl);  //重定向到前端页面
    }else {
      // 失败的情况
      res.json(result)
    }
  }
});

router.get('/getUserInfo',async function(req,res) {
  let access_token =  cache.get('access_token')
  let openId =  cache.get('openId')
  let result =  await common.getUserInfo(access_token,openId)
  res.json(result)
})


// jssdk

router.get('/jssdk', async function(req,res) {
  let url = req.query.url;
  let result = await common.getToken();
  if(result.code === 0) { 
   let token = result.data.access_token;
    cache.put('token', token)  // openId 
    let result2 = await common.getTicket(token);
    if(result2.code === 0) {
      let data = result2.data
      let params =  {
        noncestr: utils.createNoncestr(),
        jsapi_ticket: data.ticket,
        timestamp: utils.createTimeStamp(),
        url
      }
      let str = utils.raw(params)
      let sign =  createHash('sha1').update(str).digest('hex')
   console.log('加密算法',params)
      
      res.json(utils.handleSuc({
        appId: config.appId, // 必填，公众号的唯一标识
        timestamp: params.timestamp, // 必填，生成签名的时间戳
        nonceStr: params.noncestr, // 必填，生成签名的随机串
        signature: sign, // 必填，签名
        jsApiList: [
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareQZone',
          'chooseWXPay'
        ] // 必填，需要使用的JS接口列表  附录2-所有JS接口列表
      }))
    }
  }

})

module.exports = router;