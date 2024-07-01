# vue-admin-test
### 可以调整的地方

现在只能实现向真实后端发送用户注册请求和向`mockjs`模拟的假后端发送登录请求两个功能的其中一个

#### 向真实后端发送用户注册请求

- 保持项目不变即可

- 具体的页面布局和脚本在`src\views\signup\index.vue`中

- 请求接口定义在`src\api\user.js`中

#### 登录进系统看看

- 将`.env.development`中`VUE_APP_BASE_API`的值改为`''`

- 再将`vue.config.js`中第四十行注释解开

  ~~~js
  before: require('./mock/mock-server.js')
  ~~~

- 每次修改这两个文件需要重新启动node生效

