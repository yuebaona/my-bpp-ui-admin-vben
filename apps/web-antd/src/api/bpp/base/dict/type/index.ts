import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace BaseDictTypeApi {
  /** 字典类型 */
  export type DictType = {
    createTime: Date;
    id?: number;
    name: string;
    remark: string;
    status: number;
    type: string;
  };
}

// 查询字典（精简)列表
export function getSimpleDictTypeList() {
  return requestClient.get<BaseDictTypeApi.DictType[]>(
    '/bpp/base/dict-type/list-all-simple',
  );
}

// 查询字典列表
export function getDictTypePage(params: PageParam) {
  return requestClient.get<PageResult<BaseDictTypeApi.DictType>>(
    '/bpp/base/dict-type/page',
    { params },
  );
}

// 查询字典详情
export function getDictType(id: number) {
  return requestClient.get<BaseDictTypeApi.DictType>(
    `/bpp/base/dict-type/get?id=${id}`,
  );
}

// 新增字典
export function createDictType(data: BaseDictTypeApi.DictType) {
  return requestClient.post('/bpp/base/dict-type/create', data);
}

// 修改字典
export function updateDictType(data: BaseDictTypeApi.DictType) {
  return requestClient.put('/bpp/base/dict-type/update', data);
}

// 删除字典
export function deleteDictType(id: number) {
  return requestClient.delete(`/bpp/base/dict-type/delete?id=${id}`);
}

// 批量删除字典
export function deleteDictTypeList(ids: number[]) {
  return requestClient.delete(
    `/bpp/base/dict-type/delete-list?ids=${ids.join(',')}`,
  );
}

// 导出字典类型
export function exportDictType(params: any) {
  return requestClient.download('/bpp/base/dict-type/export-excel', { params });
}
