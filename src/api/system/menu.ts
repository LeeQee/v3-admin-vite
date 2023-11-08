import { request } from "@/utils/service"
import type * as Menu from "./types/menu"
/** 获取用户详情 */
export function getMenuTreeInfoApi(systemType: string) {
  return request<Menu.MenuTreeResponseData>({
    url: `/hs/system/menu/sysMenu/findTreeBySystemType/${systemType}`,
    method: "get"
  })
}
