<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
        >{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
export default {
  setup () {
    const route = useRoute()
    const router = useRouter()
    const levelList = ref(null)

    const getBreadcrumb = () => {
      const matched = route.matched.filter(item => item.meta && item.meta.title)
      levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    }

    const pathCompile = (path) => {
      const { params } = route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    }
    const handleLink = (item) => {
      const { redirect, path } = item
      if (redirect) {
        router.push(redirect)
        return
      }
      router.push(pathCompile(path))
    }
    getBreadcrumb()
    watch(route, () => {
      getBreadcrumb()
    })
    return {
      levelList,
      getBreadcrumb,
      pathCompile,
      handleLink
    }
  }

}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
