//发送ajax异步请求函数模块
//封装axios库
//函数的返回值是promise对象
import axios from "axios";
import message from "antd";

export default function ajax(url,data={},type='GET'){
    return new Promise((resolve,reject)=>{
        let promise
        if(type==='GET'){
            promise=axios.get(url,{
                params:data
            })
        }else{
            promise=axios.post(url,data)
        }
        promise.then(response=>{
            resolve(response.data)
        }).catch(error=>{
            console.log('请求出错：',error.message)
        })
    })
}

ajax('/login',{username:'tom',password:'12345'},'POST').then()
ajax('/manage/user/add',{username:'tom',password:'12345',phone:'123'},'POST').then()