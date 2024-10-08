01.编写routes.ts文件引入并使用路由

```tsx
import Layout from "@/layout/index.vue";

export const constantRoute = [
  {
    path: '/home',
    component: Layout,
    children: [{
      path: '',
      name: 'Home',
      component: () => import("@/views/home/index.vue"),
    }]
  },
```

2.根据布局和菜单编写layout.vue文件

```vue
<template>
  <div class="layout-page">
    <el-container>
      <el-header class="header-info">
        <div>分布式文件存储系统</div>
      </el-header>

      <el-container>
        <el-aside class="aside">
          <el-menu default-active="2" class="aside-menu">
            <el-menu-item index="1">
              <el-icon><setting /></el-icon>
              <span>Navigator Four</span>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon><setting /></el-icon>
              <span>Navigator Four</span>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><setting /></el-icon>
              <span>Navigator Four</span>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon><setting /></el-icon>
              <span>Navigator Four</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.layout-page {
  width: 100vw;
  height: 100vh;
  .aside {
    .aside-menu {
      height: calc(100vh - 80px);
    }
  }

  .header-info {
    height: 40px;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #333;
  }
}
</style>
```

3.处理style.css文件

```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}


body {
  margin: 0;
  display: flex;
  place-items: center;
}

#app {
  margin: 0 auto;
  text-align: center;
}

:focus {
  outline: none;
}


@media (prefers-color-scheme: light) {
  a:hover {
    color: #3883fa;
  }
}

/* 滚动条的样式设置 */
/* 滚动条的宽度 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/* 滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background: #EBEBEB;
  border-radius: 3px;
}

/* 滚动条的轨道 */
::-webkit-scrollbar-track {
  background: #f8fbff;
  border-radius: 6px;
}

/* 当鼠标悬停在滑块上时 */
::-webkit-scrollbar-thumb:hover {
  background: #3883fa;
}
```

###### 使用anti-design-vue搭建layout

```vue
<template>
  <a-layout>
    <a-layout-sider :style="siderStyle">
      <a-menu theme="dark" mode="inline">
        <a-menu-item key="1">
          <user-outlined />
          <span class="nav-text">nav 1</span>
        </a-menu-item>
        <a-menu-item key="2">
          <video-camera-outlined />
          <span class="nav-text">nav 2</span>
        </a-menu-item>
        <a-menu-item key="3">
          <upload-outlined />
          <span class="nav-text">nav 3</span>
        </a-menu-item>
        <a-menu-item key="4">
          <user-outlined />
          <span class="nav-text">nav 4</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="headerStyle">MRO后台管理系统</a-layout-header>
      <a-layout-content :style="contentStyle">
        <router-view />
      </a-layout-content>
      <a-layout-footer :style="footerStyle"
        >Manst Mro ©2024 Created by SZXXYJY</a-layout-footer
      >
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
const headerStyle: CSSProperties = {
  height: '60px',
  width: '100vw- 200px',
  background: '#fff',
  textAlign: 'center',
  lineHeight: '60px',
}

const contentStyle: CSSProperties = {
  height: '100vh - 120px',
  width: '100vw- 200px',
}

const siderStyle: CSSProperties = {
  height: '100vh',
  width: '200px',
}

const footerStyle: CSSProperties = {
  width: '100vw- 200px',
  height: '60px',
  textAlign: 'center',
}
</script>
<style lang="scss" scoped></style>
```

