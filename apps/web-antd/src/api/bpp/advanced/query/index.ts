import { requestClient } from '#/api/request';
export namespace advancedQueryApi{
  /**
   * 数据库字段信息响应VO
   */
  export interface DatabaseColumnVO {
    /** 创建时间 */
    createTime: string;
    /** 更新时间 */
    updateTime: string;
    /** 创建者 */
    creator: string;
    /** 更新者 */
    updater: string;
    /** 是否已删除 */
    deleted: boolean;
    /** 租户ID */
    tenantId: number;
    /** 主键ID */
    id: number;
    /** 表名 */
    tableName: string;
    /** 字段名 */
    columnName: string;
    /** 数据类型 */
    dataType: string;
    /** 字段注释 */
    columnComment: string;
    /** 是否可为空 */
    isNullable: boolean;
    /** 是否为主键 */
    primaryKey: boolean;
    /** 字段位置序号 */
    ordinalPosition: number;
    /** Java类型 */
    javaType: string;
    /** Java字段名 */
    javaField: string;
    /** 字典类型 */
    dictType: string;
    /** 示例值 */
    example: string;
    /** HTML组件类型 */
    htmlType: string;
    /** 删除时间 */
    deleteTime: string;
  }
}
// 获取高级查询列表
export const getTableColumnList = (params: any) => {
  return requestClient.get(
    `/bpp/common/search/table-column/list`,
    { params },
  );
};
// 生成高级查询
export const searchGenerated = (
  data: any
) => {
  return requestClient.post(
    '/bpp/common/search/generated',
    data,
  );
};
// 创建高级查询条件
export const searchConditionCreate= (
  data: any
) => {
  return requestClient.post(
    '/bpp/common/search/condition/create',
    data,
  );
};
export const getByCondition = (params: any) => {
  return requestClient.get(
    `/bpp/common/search/condition/getByCondition`,
    { params },
  );
};
export const searchConditionUpdate = (
  data: any
) => {
  return requestClient.put(
    '/bpp/common/search/condition/update',
    data,
  );
};
