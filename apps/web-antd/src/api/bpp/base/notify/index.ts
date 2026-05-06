import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace BaseNotifyApi {
  /** 钉钉通知管理信息 */
  export interface Notify {
    id: number; // 主键ID
    userId?: number; // 系统用户唯一标识
    notifyName: string; // 通知人姓名
    businessLabel: string; // 业务标签
    status?: string; // 是否启用
  }

  export interface AdminUser {
    id: number;
    nickname: string;
  }
}

/** 查询钉钉通知管理分页 */
export function getNotifyPage(params: PageParam) {
  return requestClient.get<PageResult<BaseNotifyApi.Notify>>(
    '/bpp/base/notify/page',
    { params },
  );
}

/** 查询钉钉通知管理详情 */
export function getNotify(id: number) {
  return requestClient.get<BaseNotifyApi.Notify>(
    `/bpp/base/notify/get?id=${id}`,
  );
}

/** 新增钉钉通知管理 */
export function createNotify(data: BaseNotifyApi.Notify) {
  return requestClient.post('/bpp/base/notify/create', data);
}

/** 修改钉钉通知管理 */
export function updateNotify(data: BaseNotifyApi.Notify) {
  return requestClient.put('/bpp/base/notify/update', data);
}

/** 删除钉钉通知管理 */
export function deleteNotify(id: number) {
  return requestClient.delete(`/bpp/base/notify/delete?id=${id}`);
}

/** 批量删除钉钉通知管理 */
export function deleteNotifyList(ids: number[]) {
  return requestClient.delete(
    `/bpp/base/notify/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出钉钉通知管理 */
export function exportNotify(params: any) {
  return requestClient.download('/bpp/base/notify/export-excel', { params });
}

/** 获取可选通知人员清单 */
export function getUserByExcludeIdsPage(params: PageParam) {
  return requestClient.get<PageResult<BaseNotifyApi.AdminUser>>(
    '/bpp/base/notify/page-user-by-exclude-users',
    { params },
  );
}

/** 用户状态修改 */
export function updateStatus(id: number, status: number) {
  return requestClient.put('/bpp/base/notify/update-status', { id, status });
}
