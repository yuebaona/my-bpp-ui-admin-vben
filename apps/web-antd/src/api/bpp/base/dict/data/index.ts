import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace BaseDictDataApi {
  /** 字典数据 */
  export type DictData = {
    colorType: string;
    createTime: Date;
    cssClass: string;
    dictType: string;
    id?: number;
    label: string;
    remark: string;
    sort?: number;
    status: number;
    value: string;
    classType: string;
  };
}

// 查询字典数据（精简)列表
export function getSimpleDictDataList() {
  return requestClient.get<BaseDictDataApi.DictData[]>(
    '/bpp/base/dict-data/simple-list',
  );
}

// 查询字典数据列表
export function getDictDataPage(params: PageParam) {
  return requestClient.get<PageResult<BaseDictDataApi.DictData>>(
    '/bpp/base/dict-data/page',
    { params },
  );
}

// 查询字典数据详情
export function getDictData(id: number) {
  return requestClient.get<BaseDictDataApi.DictData>(
    `/bpp/base/dict-data/get?id=${id}`,
  );
}

// 新增字典数据
export function createDictData(data: BaseDictDataApi.DictData) {
  return requestClient.post('/bpp/base/dict-data/create', data);
}

// 修改字典数据
export function updateDictData(data: BaseDictDataApi.DictData) {
  return requestClient.put('/bpp/base/dict-data/update', data);
}

// 删除字典数据
export function deleteDictData(id: number) {
  return requestClient.delete(`/bpp/base/dict-data/delete?id=${id}`);
}

// 批量删除字典数据
export function deleteDictDataList(ids: number[]) {
  return requestClient.delete(
    `/bpp/base/dict-data/delete-list?ids=${ids.join(',')}`,
  );
}

// 导出字典类型数据
export function exportDictData(params: any) {
  return requestClient.download('/bpp/base/dict-data/export-excel', { params });
}
