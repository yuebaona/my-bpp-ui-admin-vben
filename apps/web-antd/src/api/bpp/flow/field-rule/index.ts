import type { PageParam, PageResult } from '@vben/request';
import type { Dayjs } from 'dayjs';

import { requestClient } from '#/api/request';

export namespace FieldEditRuleHeadApi {
  /** 业务字段规则校验信息 */
  export interface EditRuleHead {
    id: number; // 主键
    ruleCode: string; // 规则编号
    ruleName: string; // 规则名称
    type: string; // 类型
    remark: string; // 备注
    deletedTime: string | Dayjs; // 删除时间
  }
}

/** 查询业务字段规则校验分页 */
export function getEditRuleHeadPage(params: PageParam) {
  return requestClient.get<PageResult<FieldEditRuleHeadApi.EditRuleHead>>(
    '/bpp/flow/field/edit-rule-head/page',
    { params },
  );
}

/** 查询列表数据 */
export function getEditRuleHeadList(params: PageParam) {
  return requestClient.get<PageResult<FieldEditRuleHeadApi.EditRuleHead>>(
    '/bpp/flow/field/edit-rule-head/list',
    {params},
  );
}

/** 查询业务字段规则校验详情 */
export function getEditRuleHead(id: number) {
  return requestClient.get<FieldEditRuleHeadApi.EditRuleHead>(
    `/bpp/flow/field/edit-rule-head/get?id=${id}`,
  );
}

/** 新增业务字段规则校验 */
export function createEditRuleHead(data: FieldEditRuleHeadApi.EditRuleHead) {
  return requestClient.post('/bpp/flow/field/edit-rule-head/create', data);
}

/** 修改业务字段规则校验 */
export function updateEditRuleHead(data: FieldEditRuleHeadApi.EditRuleHead) {
  return requestClient.put('/bpp/flow/field/edit-rule-head/update', data);
}

/** 删除业务字段规则校验 */
export function deleteEditRuleHead(id: number) {
  return requestClient.delete(`/bpp/flow/field/edit-rule-head/delete?id=${id}`);
}

/** 批量删除业务字段规则校验 */
export function deleteEditRuleHeadList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/field/edit-rule-head/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出业务字段规则校验 */
export function exportEditRuleHead(params: any) {
  return requestClient.download('/bpp/flow/field/edit-rule-head/export-excel', { params });
}


