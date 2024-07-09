import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/signup',
    component: () => import('@/views/signup/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '教学概况', icon: 'fa-solid fa-gauge' }
    }]
  },



  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

]

export const asyncRoutes = [
  {
    path: '/judge',
    component: Layout,
    alwaysShow: true,
    meta: { roles: ['editor'], title: '题目评分', icon: 'fa-solid fa-table' },
    children: [
      {
        path: 'index',
        name: 'test',
        component: () => import('@/views/judge/history'),
        meta: { roles: ['editor'], title: '答案列表', icon: 'fa-solid fa-clock' }
      },

      {
        path: 'question',
        name: 'question',
        component: () => import('@/views/judge/question'),
        meta: { roles: ['editor'], title: '题目列表', icon: 'fa-solid fa-cloud-arrow-up' },
      },
      
      {
        // /brand/edit/123
        path: 'addquestion',
        name: 'addquestion',
        // 此路由不需要在页面上显示
        hidden: true,
        component: () =>
          import('@/views/judge/questionInfo'),
        meta: { roles: ['editor'], title: '添加问题' }
      },
      {
        // /brand/edit/123
        path: 'questioninfo/:id',
        name: 'questioninfo',
        // 此路由不需要在页面上显示
        hidden: true,
        component: () =>
          import('@/views/judge/questionInfo'),
        meta: { roles: ['editor'], title: '教师详情' }
      },
      {
        // /brand/edit/123
        path: 'answer/:id',
        name: 'answer',
        // 此路由不需要在页面上显示
        hidden: true,
        component: () =>
          import('@/views/judge/answer'),
        meta: { roles: ['editor'], title: '查看作答' }
      },

      {
        // /brand/edit/123
        path: 'addanswer',
        name: 'addanswer',
        // 此路由不需要在页面上显示
        hidden: true,
        component: () =>
          import('@/views/judge/answerInfo'),
        meta: { roles: ['editor'], title: '添加作答' }
      },
      {
        // /brand/edit/123
        path: 'answerinfo/:id',
        name: 'answerinfo',
        // 此路由不需要在页面上显示
        hidden: true,
        component: () =>
          import('@/views/judge/answerInfo'),
        meta: { roles: ['editor'], title: '作答详情' }
      },
    ]
  },
  {
    path: '/myinfo',
    name: 'myinfo',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/teacher/myinfo'),
        name: '我的信息',
        meta: { roles: ['editor'], title: '我的信息', icon: 'fa-solid fa-file' }  //页面需要的权限
      }]
  },
  {
    path: '/permission',
    component: Layout,
    name: 'permission',
    alwaysShow: true,
    meta: { roles: ['admin'], title: '权限', icon: 'fa-solid fa-check' }, //页面需要的权限
    children: [
      {
        path: 'index',
        component: () => import('@/views/table/index'),
        name: '权限测试页',
        meta: { roles: ['admin'], title: '测试', icon: 'fa-solid fa-file' }  //页面需要的权限
      }]
  },

  {
    path: '/teacher',
    component: Layout,
    name: 'teacher',
    alwaysShow: true,
    meta: { roles: ['admin'], title: '教师管理', icon: 'fa-solid fa-chalkboard-user' }, //页面需要的权限
    children: [{
      path: 'index',
      component: () => import('@/views/teacher/index'),
      name: 'teacherlist',
      meta: { roles: ['admin'], title: '教师名单', icon: 'fa-solid fa-list' }  //页面需要的权限
    },
    {
      // /brand/edit/123
      path: 'add',
      name: 'add',
      // 此路由不需要在页面上显示
      hidden: true,
      component: () =>
        import('@/views/teacher/info'),
      meta: { roles: ['admin'], title: '添加教师' }
    },
    {
      // /brand/edit/123
      path: 'info/:id',
      name: 'info',
      // 此路由不需要在页面上显示
      hidden: true,
      component: () =>
        import('@/views/teacher/info'),
      meta: { roles: ['admin'], title: '教师详情' }
    },]
  },

  {
    path: '/school',
    component: Layout,
    name: 'school',
    alwaysShow: true,
    meta: { roles: ['admin'], title: '学校管理', icon: 'fa-solid fa-school' }, //页面需要的权限
    children: [
      {
        path: 'index',
        component: () => import('@/views/school/index'),
        name: 'schoollist',
        meta: { roles: ['admin'], title: '学校列表', icon: 'fa-solid fa-list' }  //页面需要的权限
      }]
  },

  {
    path: '/subject',
    component: Layout,
    name: 'subject',
    alwaysShow: true,
    meta: { roles: ['admin'], title: '科目管理', icon: 'fa-solid fa-book' }, //页面需要的权限
    children: [
      {
        path: 'index',
        component: () => import('@/views/subject/index'),
        name: 'subjectlist',
        meta: { roles: ['admin'], title: '科目列表', icon: 'fa-solid fa-list' }  //页面需要的权限
      }]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }

];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
