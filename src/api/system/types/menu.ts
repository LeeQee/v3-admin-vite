// interface ChildMenu {
//   childMenuList: ChildMenu[] | string
//   code: string
//   createdBy: string
//   createdTime: string
//   creationPid: string
//   description: string
//   enable: number
//   icon: string
//   id: string
//   name: string
//   parentId: string
//   path: string
//   permission: string
//   plantId: string
//   sort: number
//   systemType: string
//   tenantId: string
//   trxId: string
//   type: string
//   updatePid: string
//   updatedBy: string
//   updatedTime: string
//   useFlag: number
//   version: number
// }

export interface Menu {
  childMenuList: Menu[]
  code: string
  createdBy: string
  createdTime: string
  creationPid: string
  description: string
  enable: number
  icon: string
  id: string
  name: string
  parentId: string
  path: string
  permission: string
  plantId: string
  sort: number
  systemType: string
  tenantId: string
  trxId: string
  type: string
  updatePid: string
  updatedBy: string
  updatedTime: string
  useFlag: number
  version: number
}
export type MenuTreeResponseData = ResponseData<Menu[]>
