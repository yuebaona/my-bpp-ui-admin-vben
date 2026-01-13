import type { PageParam, PageResult } from '@vben/request';

import dayjs from 'dayjs';

import { requestClient } from '#/api/request';

export namespace SearchTableColumnApi {
  /** 高级查询字段定义信息 */
  export interface TableColumn {
    id: number; // 编号
    tableFieldInfoList?: array; // 数据库字段信息
    tableNameList?: array; // 数据库表名集合
    tableName?: string; // 表名
    columnName?: string; // 字段名
    dataType?: string; // 字段类型
    columnComment?: string; // 字段描述
    isNullable?: boolean; // 是否允许为空
    primaryKey?: boolean; // 是否主键
    ordinalPosition?: number; // 排序
    javaType?: string; // Java 属性类型
    javaField?: string; // Java 属性名
    dictType: string; // 字典类型
    example: string; // 数据示例
    htmlType?: string; // 显示类型
    deleteTime?: dayjs | string; // 删除时间
  }
}

/** 根据表名获取数据库表信息 */
export function getTableByTableName(tableName: string) {
  return requestClient.get<SearchTableColumnApi.TableColumn>(
    `/bpp/flow/search/getTableByTableName?tableName=${tableName}`,
  );
}

/** 根据表名获取字段信息 */
export function getTableFieldInfoByTableName(
  data: SearchTableColumnApi.TableColumn,
) {
  return requestClient.post<SearchTableColumnApi.TableColumn>(
    `/bpp/flow/search/getTableFieldInfoByTableName`,
    data,
  );
}

/** 查询高级查询字段定义分页 */
export function getTableColumnPage(params: PageParam) {
  return requestClient.get<PageResult<SearchTableColumnApi.TableColumn>>(
    '/bpp/flow/search/table-column/page',
    { params },
  );
}

/** 查询高级查询字段定义列表 */
export function getTableColumnList(params: PageParam) {
  return requestClient.get<PageResult<SearchTableColumnApi.TableColumn>>(
    '/bpp/flow/search/table-column/list',
    { params },
  );
}

/** 查询高级查询字段定义详情 */
export function getTableColumn(id: number) {
  return requestClient.get<SearchTableColumnApi.TableColumn>(
    `/bpp/flow/search/table-column/get?id=${id}`,
  );
}

/** 新增高级查询字段定义 */
export function createTableColumn(data: SearchTableColumnApi.TableColumn) {
  return requestClient.post('/bpp/flow/search/table-column/create', data);
}

/** 修改高级查询字段定义 */
export function updateTableColumn(data: SearchTableColumnApi.TableColumn) {
  return requestClient.put('/bpp/flow/search/table-column/update', data);
}

/** 批量修改高级查询字段定义 */
export function updateBatch(data: any[]) {
  return requestClient.post('/bpp/flow/search/table-column/updateBatch', data);
}

/** 删除高级查询字段定义 */
export function deleteTableColumn(id: number) {
  return requestClient.delete(`/bpp/flow/search/table-column/delete?id=${id}`);
}

/** 批量删除高级查询字段定义 */
export function deleteTableColumnList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/search/table-column/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出高级查询字段定义 */
export function exportTableColumn(params: any) {
  return requestClient.download('/bpp/flow/search/table-column/export-excel', {
    params,
  });
}
