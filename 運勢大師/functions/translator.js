
var chineseConv = require('chinese-conv');
var request=require('request');

function input(data) {

   return new Promise(
    function(resolve,reject){
      request.post(
        { 
        url:'https://yue.micblo.com/api/v2/translate',
        form: {
          'type':0,
          'text':data,
          't':''
        } },
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
           resolve(chineseConv.tify(JSON.parse(body).content));
        }
        else{reject(error)}
       });
  })
}


module.exports = { input }