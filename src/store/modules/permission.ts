import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { type RouteRecordRaw } from "vue-router"
import { constantRoutes, asyncRoutes } from "@/router"
import { flatMultiLevelRoutes } from "@/router/helper"
import routeSettings from "@/config/route"
import { getMenuTreeInfoApi } from "@/api/system/menu"
import { Menu } from "@/api/system/types/menu"
const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  const routeRoles = route.meta?.roles
  return routeRoles ? roles.some((role) => routeRoles.includes(role)) : true
}

const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tempRoute = { ...route }
    if (hasPermission(roles, tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterAsyncRoutes(tempRoute.children, roles)
      }
      res.push(tempRoute)
    }
  })
  return res
}

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([])
  const dynamicRoutes = ref<RouteRecordRaw[]>([])
  const systemType = ref<string>("")
  const menuTree = ref<Menu[]>([])
  const getMenuTreeData = async (systemType: string) => {
    const { data } = await getMenuTreeInfoApi(systemType)
    console.log(data)
    menuTree.value = data
  }
  const setRoutes = (roles: string[]) => {
    const accessedRoutes = routeSettings.async ? filterAsyncRoutes(asyncRoutes, roles) : asyncRoutes
    routes.value = constantRoutes.concat(accessedRoutes)
    dynamicRoutes.value = routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(accessedRoutes) : accessedRoutes
  }
  const convertApiDataToLocalRoutes = (apiData: Menu[]) => {
    const localRoutes: RouteRecordRaw[] = []
    for (const item of apiData) {
      const localRoute = {
        path: item.path || "/",
        name: item.name,
        component: () => import(`@/views/${item.path}/index.vue`), // 根据path生成对应的组件路径
        meta: {
          title: item.name,
          icon: item.icon, // 根据接口数据中的字段设置图标
          permission: item.permission // 根据接口数据中的字段设置权限
          // 其它自定义meta属性
        }
      }

      // if (item.childMenuList && item.childMenuList.length > 0) {
      //   localRoute.children = convertApiDataToLocalRoutes(item.childMenuList)
      // }

      localRoutes.push(localRoute)
    }

    return localRoutes
  }
  return { routes, dynamicRoutes, setRoutes, systemType, getMenuTreeData, menuTree, convertApiDataToLocalRoutes }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
