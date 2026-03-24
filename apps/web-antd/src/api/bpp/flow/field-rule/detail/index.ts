import type {PageParam, PageResult} from '@vben/request';
import type {Dayjs} from 'dayjs';

import {requestClient} from '#/api/request';

export namespace FieldEditRuleDetailApi {
  /** 业务字段规则校验明细信息 */
  export interface EditRuleDetail {
    id: number; // 主键
    ruleTableId?: number; // 业务字段规则表单ID
    propName: string; // 字段名
    value: string; // 字段值
    rowIndex: number; // 行号
    deletedTime: string | Dayjs; // 删除时间
  }
}

/** 查询业务字段规则校验明细分页 */
export function getEditRuleDetailPage(params: PageParam) {
  return requestClient.get<PageResult<FieldEditRuleDetailApi.EditRuleDetail>>(
    '/bpp/common/field-edit-rule-detail/page',
    { params },
  );
}
/** 查询行数据 */
export function getEditRuleDetailByRuleTableId(ruleTableId: number) {
  return requestClient.get<PageResult<FieldEditRuleDetailApi.EditRuleDetail>>(
    '/bpp/common/field-edit-rule-detail/getEditRuleDetailByRuleTableId?ruleTableId=' + ruleTableId,
  );
}

/** 查询业务字段规则校验明细详情 */
export function getEditRuleDetail(id: number) {
  return requestClient.get<FieldEditRuleDetailApi.EditRuleDetail>(
    `/bpp/common/field-edit-rule-detail/get?id=${id}`,
  );
}

/** 新增业务字段规则校验明细 */
export function createEditRuleDetail(data: FieldEditRuleDetailApi.EditRuleDetail) {
  return requestClient.post('/bpp/common/field-edit-rule-detail/create', data);
}

/** 修改业务字段规则校验明细 */
export function updateEditRuleDetail(data: FieldEditRuleDetailApi.EditRuleDetail) {
  return requestClient.put('/bpp/common/field-edit-rule-detail/update', data);
}

/** 删除业务字段规则校验明细 */
export function deleteEditRuleDetail(id: number) {
  return requestClient.delete(`/bpp/common/field-edit-rule-detail/delete?id=${id}`);
}

/** 批量删除业务字段规则校验明细 */
export function deleteEditRuleDetailList(ids: number[]) {
  return requestClient.delete(
    `/bpp/common/field-edit-rule-detail/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出业务字段规则校验明细 */
export function exportEditRuleDetail(params: any) {
  return requestClient.download('/bpp/common/field-edit-rule-detail/export-excel', { params });
}


