import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace ViolationCfgApi {
  /** 违规规则配置信息 */
  export interface ViolationCfgVO {
    id: number; // 主键ID
    fltGkey: string; // 车队全局唯一业务主键
    ruleCd: string; // 规则编码
    ruleDesc: string; // 规则描述
    ruleTp: string; // 规则类型（truck-车辆/driver-司机/all-通用）
    rstr1Days: number; // 第一次违规限制天数
    rstr2Days: number; // 第二次违规限制天数
    rstr3Days: number; // 第三次违规限制天数
    sortSeq: number; // 排序
    remark: string; // 备注
  }
}

/** 查询违规规则配置分页 */
export function getViolationCfgPage(params: PageParam) {
  return requestClient.get<PageResult<ViolationCfgApi.ViolationCfgVO>>(
    '/bpp/flow/gate/violation/page',
    { params },
  );
}

/** 查询违规规则配置详情 */
export function getViolationCfg(id: number) {
  return requestClient.get<ViolationCfgApi.ViolationCfgVO>(
    `/bpp/flow/gate/violation/get?id=${id}`,
  );
}

/** 新增违规规则配置 */
export function createViolationCfg(data: ViolationCfgApi.ViolationCfgVO) {
  return requestClient.post('/bpp/flow/gate/violation/create', data);
}

/** 修改违规规则配置 */
export function updateViolationCfg(data: ViolationCfgApi.ViolationCfgVO) {
  return requestClient.put('/bpp/flow/gate/violation/update', data);
}

/** 删除违规规则配置 */
export function deleteViolationCfg(id: number) {
  return requestClient.delete(`/bpp/flow/gate/violation/delete?id=${id}`);
}

/** 批量删除违规规则配置 */
export function deleteViolationCfgList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/gate/violation/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出违规规则配置 */
export function exportViolationCfg(params: any) {
  return requestClient.download('/bpp/flow/gate/violation/export-excel', {
    params,
  });
}
