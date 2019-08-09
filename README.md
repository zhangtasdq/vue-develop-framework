# es6 开发框架

## 项目结构
```
├── vue-develop-framework/                        (项目名字)
├    ├── build/                                   (项目构建目录)
├    ├    ├── config.js                           (项目打包的配置)
├    ├    ├── helper.js                           (项目打包的帮助)
├    ├    ├── webpack-analyzer-config.js          (打包分析的配置文件)
├    ├    ├── webpack-base-config.js              (打包的基础配置文件)
├    ├    ├── webpack-develop-config.js           (打包的开发环境配置文件)
├    ├    ├── webpack-production-config.js        (打包的生产环境配置文件)
├    ├── devPkg/                                  (项目开发目录)
├    ├    ├── components/                         (项目组件)
├    ├    ├── config/                             (项目配置文件目录)
├    ├    ├    ├── const.config.js                (项目常量配置文件)
├    ├    ├── config/                             (项目指令目录)
├    ├    ├    ├── global-directive.js            (项目全局指令)
├    ├    ├── images/                             (项目图片目录)
├    ├    ├── pages/                              (项目页面目录)
├    ├    ├    ├── home/                          (首页)
├    ├    ├    ├── layout/                        (布局文件)
├    ├    ├    ├── mixins/                        (页面中的扩展, 包含统一的消息显示和错误处理)
├    ├    ├    ├── BaseView.js                    (页面的基类, 所有页面是其子类, 继承后拥有统一的消息显示和错误处理)
├    ├    ├    ├── Index.vue                      (所有界面的入口)
├    ├    ├── router/                             (项目路由目录)
├    ├    ├    ├── home.js                        (首页路由)
├    ├    ├    ├── index.js                       (路由入口)
├    ├    ├── store/                              (项目后端数据请求的目录)
├    ├    ├── styles/                             (项目样式目录)
├    ├    ├    ├── base/                          (页面的基本样式)
├    ├    ├    ├── components/                    (组件样式)
├    ├    ├    ├── functions/                     (less 函数)
├    ├    ├    ├── structural/                    (结构布局样式)
├    ├    ├    ├── variable/                      (样式变量)
├    ├    ├    ├── main.less                      (样式入口)
├    ├    ├── util/                               (项目通用工具方法目录)
├    ├    ├── vuex/                               (vuex目录)
├    ├    └── main.js                             (项目入口文件)
├    ├    └── vue-extend.js                       (Vue 的扩展, 如定义全局指令, 引入 element-ui 组件)
├    ├── .babelrc                                 (babel 配置文件)
├    ├── .browserslistrc                          (browserslist 配置文件, 如需调整打包后浏览器的支持, 需修改这个文件)
├    ├── .editorconfig                            (编辑器配置文件)
├    ├── .eslintrc.js                             (eslint文件检查规则配置文件)
├    ├── .gitignore                               (git提交忽略文件)
├    ├── .stylelintrc                             (样式eslint检查规则配置文件)
├    ├── index-template.html                      (项目首页模版文件)
```

## 打包
1. 运行 `npm run build`
2. 将生成的 `dist` 目录下的所有文件, 提交到对应的分支即可,不用手动删除 `dist` 目录, 该目录会每次打包的时候自动更新

## 调整打包后浏览器支持的版本
> 修改项目根目录下的 `.browserslistrc`, 具体配置方法可参考 [BrowsersList](https://github.com/browserslist/browserslist)

## 个人配置
> 为适应多个开发者需要不同的配置, 因此增加了个人配置
1. 在 `build` 目录下新建文件 `personal-config.json` 文件
2. 在其中填入对应的配置
3. 配置格式如下
```json
{
    "dev": { // 开发环境
        "openBrowser": "chrome" // 默认打开的浏览器 
    }
}
```
