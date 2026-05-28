import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace DriverRstrApi {
  /** 司机限制记录信息 */
  export interface DriverRstr {
    id: number; // 主键ID
    dvrGkey: string; // 司机全局唯一业务主键
    rstrRsn: string; // 限制原因
    rstrStartDt: string | Dayjs; // 限制开始时间
    rstrEndDt: string | Dayjs; // 限制结束时间
    manualRelFlg: number; // 手动解除
    remark: string; // 备注
    dataSrc: string; // 数据来源
  }
}

/** 查询司机限制记录分页 */
export function getDriverRstrPage(params: PageParam) {
  return requestClient.get<PageResult<DriverRstrApi.DriverRstr>>(
    '/bpp/flow/gate/driver/rstr/page',
    { params },
  );
}

/** 查询司机限制记录详情 */
export function getDriverRstr(id: number) {
  return requestClient.get<DriverRstrApi.DriverRstr>(
    `/bpp/flow/gate/driver/rstr/get?id=${id}`,
  );
}

/** 新增司机限制记录 */
export function createDriverRstr(data: DriverRstrApi.DriverRstr) {
  return requestClient.post('/bpp/flow/gate/driver/rstr/create', data);
}

/** 修改司机限制记录 */
export function updateDriverRstr(data: DriverRstrApi.DriverRstr) {
  return requestClient.put('/bpp/flow/gate/driver/rstr/update', data);
}

/** 删除司机限制记录 */
export function deleteDriverRstr(id: number) {
  return requestClient.delete(`/bpp/flow/gate/driver/rstr/delete?id=${id}`);
}

/** 批量删除司机限制记录 */
export function deleteDriverRstrList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/gate/driver/rstr/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出司机限制记录 */
export function exportDriverRstr(params: any) {
  return requestClient.download('/bpp/flow/gate/driver/rstr/export-excel', { params });
}
