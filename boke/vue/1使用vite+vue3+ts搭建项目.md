##### 使用vite+vue3+ts搭建项目

###### csdn参考地址：[Vue3 + Vite + TypeScript 项目完整搭建流程-CSDN博客](https://blog.csdn.net/qq_35221977/article/details/137171497)

1. 创建存放工程的文件夹执行命令

```js
npm init vite@latest
```

2.安装vue-router@4xx

```
npm install vue-router@4
```

3.设置@符号快捷访问src以及跨域问题

```
npm install @types/node --save-dev
```

```tsx
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      // 关键代码
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 9018,
    proxy: {
      "/api": {
        target: "xxxx",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

});
```

4.在项目src目录下创建src/router/routes.ts和src/router/index.ts文件,并写入路由配置

```tsx
//对外暴露所有路由
import Layout from "@/layout/index.vue";
export const constantRoute = [
  {
    path: "/",
    redirect: "/login",
    name: "index", //命名路由
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/views/login/index.vue"),
  },
......
];
```

```tsx
//通过vr插件实现模板路由配置
import { createRouter, createWebHashHistory } from "vue-router";
import { constantRoute } from "./routes";

//创建路由器
let router = createRouter({
  //路由模式
  history: createWebHashHistory(),
  routes: constantRoute,
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});
export default router;

```

5.main.ts中引入路由文件router/index.ts

```tsx
import router from "./router";

const app = createApp(App);
app.use(router);
app.mount("#app");
```

6.设置模块类型导入vue文件时解决类型声明报错在`vite-env.d.ts`文件中增加以下代码：

```tsx
declare module '*.vue' {
  import { Component } from 'vue'
  const component: Component
  export default component
}
```

7.编写tsconfig.node.json和tsconfig.json文件

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}

```

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "allowJs": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": {
      //路径映射，相对于baseUrl
      "@/*": ["src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.ts",
    "src/**/*.js",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ],
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ]
}
```

