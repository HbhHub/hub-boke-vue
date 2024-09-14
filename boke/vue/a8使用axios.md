###### 安装

```
npm install axios
```

###### 使用

```tsx
//1引入axios
import axios from "axios";
import router from "@/router/index";
import { printError } from "@/utils/common.ts";
import { useUserStore } from "@/stores/index"


//2利用axios对象的create方法创建实例
let request = axios.create({
  //基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API, //携带api
  timeout: 6000,
});

//3给axios实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  //返回配置对象，config内有请求头
  //@ts-ignore
  if (config.url.includes("/login")) {
    return config;
  }
  const userStore = useUserStore();
  if (userStore.user?.token) {
    //@ts-ignore
    config.headers["Token"] = userStore.user.token;
  } else {
    router.push({ path: "/login" });
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    //成功的回调
    let code = response.data.code;
    switch (code) {
      case 0:
        return response.data;
      case 1:
        //@ts-ignore
        printError(response.data.message);
        return Promise.reject(response);
      default:
        //@ts-ignore
        printError(response.data.message);
        return Promise.reject(response);
    }
  },
  (error) => {
    //定义变量，存储服务器响应的错误信息
    if (error.code
      == "ECONNABORTED") {
      printError('网络连接错误')
      return
    }
    let message = "";
    //http状态码
    let status = error.response.status;
    switch (status) {
      case 401:
        message = "登录过期!";
        router.push({ path: "/login" });
        break;
      case 404:
        message = "地址路径错误";
        break;
      case 500:
        message = "服务器出现问题";
        break;
      case 400:
        message = "客户端参数错误";
        break;
      default:
        message = "未知问题!";
        break;
    }
    //提示错误信息
    printError(message);
    //失败的回调
    return Promise.reject(error);
  }
);

//4对外暴露
export default request;
```

