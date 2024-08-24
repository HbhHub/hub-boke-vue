###### 参考地址官网:[快速开始 | Element Plus (element-plus.org)](https://element-plus.org/zh-CN/guide/quickstart.html)

1.安装依赖

```
npm install element-plus --save
```

2.按需引入

安装自动引入插件

```
npm install -D unplugin-vue-components unplugin-auto-import
```

3.配置vite.config.ts 文件

```tsx
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

4.国际化配置

```vue
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
 <el-config-provider :locale="zhCn">
            <router-view></router-view>
 </el-config-provider>
```

