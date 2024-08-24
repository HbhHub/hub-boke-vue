##### 使用自定义图标

###### 参考csdn地址：[vite2.0-vue3如何快速实现svg图标_virtual:svg-icons-register-CSDN博客](https://blog.csdn.net/weixin_45952652/article/details/116449330)

1.下载依赖

```
npm i vite-plugin-svg-icons -D
```

2.编写SvgIcon.vue文件

```vue
<template>
  <svg
    aria-hidden="true"
    class="svg-icon"
    :width="width"
    :height="height"
    @click="handleRectClick($event)"
  >
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#333',
  },
  width: {
    type: String,
    default: '18px',
  },
  height: {
    type: String,
    default: '18px',
  },
  clickEnable: {
    type: Boolean,
    default: true,
  },
})

const handleRectClick = (event) => {
  if (!props.clickEnable) {
    event.stopImmediatePropagation()
  }
}

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
```

2.配置插件

```tsx
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
plugins: [
    createSvgIconsPlugin({
      // 图标文件夹为src/assets/icons
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]'
    })
  ],
```

3.创建src/assets/svg文件夹导入文件

4.在main.js / main.ts 加入

```tsx
import 'virtual:svg-icons-register';
// 需要全局引入再添加
import svgIcon from './components/SvgIcon/index.vue' // 全局svg图标组件
app.component('svg-icon', svgIcon)
```

