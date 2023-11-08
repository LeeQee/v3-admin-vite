import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import router, { resetRouter } from "@/router"
import { loginApi, getUserInfoApi, authLoginApi } from "@/api/login"
import { AuthLoginRequestData, type LoginRequestData } from "@/api/login/types/login"
import { type RouteRecordRaw } from "vue-router"
import routeSettings from "@/config/route"
import JSEncrypt from "jsencrypt"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])
  const username = ref<string>("")

  const permissionStore = usePermissionStore()
  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = async ({ username, password, code }: LoginRequestData) => {
    const { data } = await loginApi({ username, password, code })
    setToken(data.token)
    token.value = data.token
  }
  /** 登录 */
  const authLogin = async ({ account, password }: AuthLoginRequestData) => {
    const Encry = new JSEncrypt()
    const publicKey =
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn0wChlUP05g7gBc31xml8lM3wyCsbLL7PEl/aC86IaMGv19w+D4+04RwHwyoFxK7A2xGaX8gR5CZ8eZjnn8UJySgKN6p18Zko/n2S3PhjlOt/aya/HHZvl+pAi82hJnq2VDMuTN4weLmhL108N4zj+aHLt6YnJuNn/xwfuYvCvb0j5tikeRrO+MIMc488ndDXSGA3BLK2choSOhRpsfCs8DGQPJLKgndPjitpaTkDjuGhFE/W0yPhVPx9CYtT7L/TiVkyha+ut+b0mkgvD8QLBaP530BiF78r3Fb4c4WfwUu5hn2i1IPcuEAeql+xoV5MNhqVteRUJzFmQ438OcUCQIDAQAB"
    Encry.setPublicKey(publicKey)
    const { data } = await authLoginApi({ account, password: <string>Encry.encrypt(password) })
    window.sessionStorage.setItem("authLogin", data.tokenValue)
    // setToken(data.tokenValue)
    // token.value = data.tokenValue
    setToken("token-admin")
    token.value = "token-admin"
    /** 获取当前用户的菜单 */
    await permissionStore.getMenuTreeData("001")
  }
  /** 获取用户详情 */
  const getInfo = async () => {
    const { data } = await getUserInfoApi()
    username.value = data.username
    // 验证返回的 roles 是否为一个非空数组，否则塞入一个没有任何作用的默认角色，防止路由守卫逻辑进入无限循环
    roles.value = data.roles?.length > 0 ? data.roles : routeSettings.defaultRoles
  }
  /** 切换角色 */
  const changeRoles = async (role: string) => {
    const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    await getInfo()
    permissionStore.setRoutes(roles.value)
    resetRouter()
    permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
    _resetTagsView()
  }
  /** 登出 */
  const logout = () => {
    removeToken()
    token.value = ""
    roles.value = []
    resetRouter()
    _resetTagsView()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }
  /** 重置 Visited Views 和 Cached Views */
  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { token, roles, username, setRoles, login, getInfo, changeRoles, logout, resetToken, authLogin }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
