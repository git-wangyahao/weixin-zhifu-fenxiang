/**
 * 公共函数定义
 */

module.exports = {

  // 生成随机数
  createNoncestr() {
   return  Math.random().toString(36).substring(2,15)
  },

  // 生成时间戳

  createTimeStamp() {
    return new Date().getTime() / 1000 + ''
  },

  // Object 转换成JSON并排序
  raw(args) {
    let keys = Object.keys(args).sort();
    let obj = { };
    keys.forEach((key) => {
      obj[key] = args[key]
    })
    // 将对象转换为& 分割的参数

    let val = '';
    for(let k in obj) {
      val += '&' + k + '=' + obj[k];
    }

    return val.substring(0,1)
  },




    // 对请求结果统一封装处理
    handleRespones(err,response,body){
  
      if(!err && response.statusCode == 200) {
        let data = JSON.parse(body)
        console.log("data.errcode", data.errcode)

        if(data && !data.errcode) {
     
          return this.handleSuc(data)
        }else {
          return this.handleFail(data.errmsg,data.errcode);
        }
      }else {
        return this.handleFail(err,10000)
      }
    },
    handleSuc(data = '') {
      return {
        code: 0,
        data,
        massage:''
      }
    },
    handleFail(massage = '',data = null, code =10001) {
      return {
        code: 0,
        data,
        massage:''
      }
    }
}