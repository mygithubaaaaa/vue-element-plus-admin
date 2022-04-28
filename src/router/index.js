import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'
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
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    meta: { icon: 'dashboard', affix: true },
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ '../views/Index'),
      meta: { title: 'Home', icon: 'dashboard' }
    }]
  },
  {
    path: '/info',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Info',
        component: () => import('@/views/userinfo/index'),
        meta: { title: '个人信息', icon: 'example' }
      }
    ]
  },

  {
    path: '/notice',
    component: Layout,
    name: 'notice',
    meta: { title: '通知', icon: 'table' },
    children: [
      {
        path: 'send',
        name: 'Send',
        component: () => import('@/views/notice/send/index'),
        meta: { title: '我创建的通知', icon: 'table' }
      },
      {
        path: 'receive',
        name: 'Receive',
        component: () => import('@/views/notice/receive/index'),
        meta: { title: '我收到的通知', icon: 'table' }
      }
    ]
  },

  {
    path: '/group',
    component: Layout,
    name: 'group',
    meta: { title: '组织', icon: 'tree' },
    children: [
      {
        path: 'groupTree',
        name: 'GroupTree',
        component: () => import('@/views/group/grouptree/index'),
        meta: { title: '组织树', icon: 'tree' }
      },
      {
        path: 'mygroup',
        name: 'MyGroup',
        component: () => import('@/views/group/mygroup/index'),
        meta: { title: '我管理的组织', icon: 'tree' }
      }
    ]
  },
  { path: '/:catchAll(.*)', redirect: '/404', hidden: true }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export default router
