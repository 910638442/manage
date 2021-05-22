// import axios from 'axios'
// export function request(config){
//         const instance1=axios.create({
//             baseURL:'http://www.ysqorz.top:8888/api/private/v1/login',
//             method:'post'
//           })
//         // //请求拦截
//         // instance1.interceptors.request.use(config=>{
//         //     console.log(config);
//         //     //可以在此种增加一些动画或者更改一些配置
//         //     //某些网络请求(比如登录(token))，必须携带一些必要信息
//         //     return config;
//         // },err=>{
//         //     console.log(err);
//         // })
//         // // 响应拦截
//         // instance1.interceptors.response.use(config=>{
//         //    return config.data;
//         // },err=>{
//         //     console.log(err);
//         // })
//         return instance1(config);
// }