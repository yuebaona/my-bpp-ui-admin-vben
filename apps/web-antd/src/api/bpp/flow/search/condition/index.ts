import type { PageParam, PageResult } from '@vben/request';
import type { Dayjs } from 'dayjs';

import { requestClient } from '#/api/request';

export namespace SearchConditionApi {
  /** 高级查询条件信息 */
  export interface Condition {
    id: number; // 编号
    formSource: string; // 归属页面
    condition: string; // 查询条件
    remark?: string; // 备注
    deleteTime?: string | Dayjs; // 删除时间
  }
}

/** 查询高级查询条件分页 */
export function getConditionPage(params: PageParam) {
  return requestClient.get<PageResult<SearchConditionApi.Condition>>(
    '/bpp/flow/search/condition/page',
    { params },
  );
}

/** 查询高级查询条件详情 */
export function getCondition(id: number) {
  return requestClient.get<SearchConditionApi.Condition>(
    `/bpp/flow/search/condition/get?id=${id}`,
  );
}

/** 查询高级查询条件详情 */
export function getByCondition(params: any) {
  return requestClient.get<SearchConditionApi.Condition>(
    `/bpp/flow/search/condition/getByCondition`,
    params,
  );
}

/** 新增高级查询条件 */
export function createCondition(data: SearchConditionApi.Condition) {
  return requestClient.post('/bpp/flow/search/condition/create', data);
}

/** 修改高级查询条件 */
export function updateCondition(data: SearchConditionApi.Condition) {
  return requestClient.put('/bpp/flow/search/condition/update', data);
}

/** 删除高级查询条件 */
export function deleteCondition(id: number) {
  return requestClient.delete(`/bpp/flow/search/condition/delete?id=${id}`);
}

/** 批量删除高级查询条件 */
export function deleteConditionList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/search/condition/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出高级查询条件 */
export function exportCondition(params: any) {
  return requestClient.download('/bpp/flow/search/condition/export-excel', {
    params,
  });
}
