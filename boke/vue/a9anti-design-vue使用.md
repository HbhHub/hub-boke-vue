###### 安装

```
npm install ant-design-vue@4.x --save
npm install unplugin-vue-components -D
```

###### 配置

```
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
在vite.config.ts文件中
 Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
```

###### 工具文件

```tsx
import { message } from 'ant-design-vue';
import { ref } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'



type Post = {
  x: number
  y: number
}
export const post = ref<Post>({ x: 0, y: 0 })
export const showAll = ref(false)
export const showTitleText = ref('')
export const showDesc = (envent: any, title: string) => {
  if (!isEmptyStringFun(title)) {
    post.value.x = envent.clientX + 10
    post.value.y = envent.clientY - 30
    showAll.value = true
    showTitleText.value = title
  }
}


export class QueryParamsBuilder {
  private params: { [key: string]: string | number | undefined } = {};
  public add(key: string, value: string | number | undefined): this {
    if (value !== undefined) {
      this.params[key] = value.toString();
    }
    return this;
  }
  public build(): string {
    const entries = Object.entries(this.params)
      .filter(([_, value]) => value !== '') // 过滤空值  
      .map(([key, value]) => `${key}=${value}`);
    return entries.length > 0 ? '?' + entries.join('&') : '';
  }

  public clear(): void {
    this.params = {};
  }
}

// 验证手机号码
export const checkPhoneFun = (phone: string): boolean => {
  const regExp = /^1[3-9]\d{9}$/
  return regExp.test(phone)
}

export const isEmptyStringFun = (str: string): boolean => {
  return !str || str.trim().length === 0
}

export const maskPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const validatePhone = async (_rule: Rule, value: string) => {
  const reg = /^1[3456789]\d{9}$/
  if (!reg.test(value)) {
    return Promise.reject('请填写11位正确的手机号码！');
  } else {
    return Promise.resolve();
  }
};

export const rules: Record<string, Rule[]> = {
  title: [
    {
      required: true,
      message: '标题不能为空',
      trigger: 'blur',
    },
    { min: 4, max: 25, message: '请输入4到25个字', trigger: 'blur' },
  ],
  saccount: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  contactInfo: [{ required: true, validator: validatePhone, trigger: 'change' }],
}


export const printError = (msg: string) => {
  message.error(msg);
};

export const printSuccess = (msg: string) => {
  message.success(msg);
};


export const strToNumberList = (str: string | undefined) => {
  if (!str) {
    return undefined
  }
  return str.split(',').map(Number);
}



// export const uploadUrl = "http://192.168.1.131:8571/upload"
export const uploadUrl = "http://120.79.139.45:8571/upload"
```

