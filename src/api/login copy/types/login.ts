export interface LoginRequestData {
  /** admin 或 editor */
  username: "admin" | "editor"
  /** 密码 */
  password: string
  /** 验证码 */
  code: string
}
export interface AuthLoginRequestData {
  /** admin 或 editor */
  account: string
  /** 密码 */
  password: string
}

export type LoginCodeResponseData = ApiResponseData<string>

export type LoginResponseData = ApiResponseData<{ token: string }>

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>

export type AuthLoginResponseData = ResponseData<{
  account: string
  empNo: string
  name: string
  needUpdatePassword: string
  tokenTimeout: string
  tokenValue: string
  userId: string
}>
