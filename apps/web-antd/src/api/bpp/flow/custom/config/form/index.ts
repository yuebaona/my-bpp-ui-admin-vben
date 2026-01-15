import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace CustomConfigFormApi {
  /** 自定义表单配置信息信息 */
  export interface ConfigForm {
    id: number; // 主键ID
    formKey?: string; // 表单唯一标识
    formName: string; // 表单名称
    formPath: string; // 表单实际组件路径
    menuId: string; // 对应的菜单ID
    formSchema: string; // 表单项的每一项配置信息
    formType: string; // 表单类型
  }
}

/** 查询自定义表单配置信息分页 */
export function getConfigFormPage(params: PageParam) {
  return requestClient.get<PageResult<CustomConfigFormApi.ConfigForm>>(
    '/bpp/flow/custom/config/form/page',
    { params },
  );
}

/** 查询自定义表单配置信息详情 */
export function getConfigForm(id: number) {
  return requestClient.get<CustomConfigFormApi.ConfigForm>(
    `/bpp/flow/custom/config/form/get?id=${id}`,
  );
}

/** 新增自定义表单配置信息 */
export function createConfigForm(data: CustomConfigFormApi.ConfigForm) {
  return requestClient.post('/bpp/flow/custom/config/form/create', data);
}

/** 修改自定义表单配置信息 */
export function updateConfigForm(data: CustomConfigFormApi.ConfigForm) {
  return requestClient.put('/bpp/flow/custom/config/form/update', data);
}

/** 删除自定义表单配置信息 */
export function deleteConfigForm(id: number) {
  return requestClient.delete(`/bpp/flow/custom/config/form/delete?id=${id}`);
}

/** 批量删除自定义表单配置信息 */
export function deleteConfigFormList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/custom/config/form/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出自定义表单配置信息 */
export function exportConfigForm(params: any) {
  return requestClient.download(
    '/bpp/flow/custom/config/form/export-excel',
    {
    params,
  });
}

/** 查询根据表单key、name、type查询表单配置信息 */
export function selectByFormKeyNameType(params: any) {
  return requestClient.get<CustomConfigFormApi.ConfigForm>(
    '/bpp/flow/custom/config/form/select-by-form-key-name-type',
    { params },
  );
}
