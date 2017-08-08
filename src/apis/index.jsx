
import request from 'superagent';


//图片上传
export function upload(data,callback){
  // console.log(data,"发送的数据0");
  // debugger;
  request
    .post(`//jsonplaceholder.typicode.com/posts/`)
    // .set('Content-Type', 'application/json')
    .send(data)
    .end((err, res)=>{
      if(err){
        console.log( err )
        return
      }
      return callback(JSON.parse(res.text))
    })
}
