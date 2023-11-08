import { request } from "@/utils/service"
import type * as Login from "./types/login"

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "/api/v1/login/code",
    method: "get"
  })
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "/api/v1/users/login",
    method: "post",
    data
  })
}
/** 登录并返回 Token */
export function authLoginApi(data: Login.AuthLoginRequestData) {
  return request<Login.AuthLoginResponseData>({
    url: "/hs/system/auth/login",
    method: "post",
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "/api/v1/users/info",
    method: "get"
  })
}