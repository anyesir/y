# 美洽 PC 工作台

## 开始

#### 安装依赖

```shell
yarn install
```

#### 运行

```shell
yarn start
```

## 发布

使用  [electron.build](https://github.com/electron-userland/electron-builder) 打包

#### 安装打包依赖

```shell
yarn add electron-builder --dev
```

#### 打包 Win

```shell
yarn buildWin
```

#### 打包 Mac

```shell
yarn buildMac
```

### 可能会遇到的问题

- 卡在 node.js install

  解决方法：翻墙 或者 使用淘宝源：https://npm.taobao.org/mirrors/electron/

## 其它

#### main.js

应用入口

#### app-manager.js

管理应用各种功能：

- 保存用户设置
- 管理键盘快捷键
- 管理全局鼠标右键菜单
- PC 左上角菜单
- PC 右下角菜单

#### preload.js

用来与工作台跨进程通讯，由工作台实现控制 **气泡提示**、**图标闪烁**、**激活窗口** 功能

