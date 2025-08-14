### 安装使用步骤 📔

- **Install：**

```text
pnpm install
```

- **Run：**

```text
pnpm dev
```

- **Build：**

```text
# 开发环境
pnpm build:dev

# 测试环境
pnpm build:test

# 生产环境
pnpm build:pro
```

### 文件资源目录 📚

```text
├─ .vscode                 # VSCode 推荐配置
├─ build                   # Vite 配置项
├─ public                  # 静态资源文件（该文件夹不会被打包）
├─ src
│  ├─ api                  # API 接口管理
│  ├─ assets               # 静态资源文件
│  ├─ components           # 全局组件
│  ├─ config               # 全局配置项
│  ├─ directives           # 全局指令文件
│  ├─ enums                # 项目常用枚举
│  ├─ hooks                # 常用 Hooks 封装
│  ├─ languages            # 语言国际化 i18n
│  ├─ layouts              # 框架布局模块
│  ├─ routers              # 路由管理
│  ├─ stores               # pinia store
│  ├─ styles               # 全局样式文件
│  ├─ typings              # 全局 ts 声明
│  ├─ utils                # 常用工具库
│  ├─ views                # 项目所有页面
│  ├─ App.vue              # 项目主组件
│  ├─ main.ts              # 项目入口文件
│  └─ vite-env.d.ts        # 指定 ts 识别 vue
├─ .editorconfig           # 统一不同编辑器的编码风格
├─ .env                    # vite 常用配置
├─ .env.development        # 开发环境配置
├─ .env.production         # 生产环境配置
├─ .env.test               # 测试环境配置
├─ .eslintignore           # 忽略 Eslint 校验
├─ .eslintrc.cjs           # Eslint 校验配置文件
├─ .gitignore              # 忽略 git 提交
├─ .prettierignore         # 忽略 Prettier 格式化
├─ .prettierrc.cjs         # Prettier 格式化配置
├─ index.html              # 入口 html
├─ package-lock.json       # 依赖包包版本锁
├─ package.json            # 依赖包管理
├─ postcss.config.cjs      # postcss 配置
├─ README.md               # README 介绍
├─ tsconfig.json           # typescript 全局配置
└─ vite.config.ts          # vite 全局配置文件
```
