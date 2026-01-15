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
    `/bpp/flow/search/table-column/list`,
    { params },
  );
};
