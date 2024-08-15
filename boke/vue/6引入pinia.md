1安装pinia

```
npm install pinia@2.1.7
```

2安装持久化

```
npm install pinia-plugin-persistedstate@3.2.1
```

3main.ts中引入插件

```tsx
import pinia from '@/stores/index'
app.use(pinia)
```

3新建文件store/index.ts

```tsx
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// 创建 pinia 实例
const pinia = createPinia()
// 使用持久化存储插件
pinia.use(persist)

// 默认导出，给 main.ts 使用
export default pinia

// 模块统一导出
export * from './modules/user'
```

```tsx
import type { LoginResult } from "@/service/user/user";
import { defineStore } from "pinia";
import { ref } from "vue";

// 定义 Store
export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<LoginResult>();

    const setUserInfo = (val: LoginResult) => {
      user.value = val;
    };

    const clearUserInfo = () => {
      user.value = undefined;
    };

    return { user, setUserInfo, clearUserInfo };
  },
  {
    // 配置持久化
    persist: true,
  }
);
```

