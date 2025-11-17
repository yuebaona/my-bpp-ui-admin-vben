import type { PageParam, PageResult } from '@vben/request';
import type { Dayjs } from 'dayjs';

import { requestClient } from '#/api/request';

export namespace BppBaseContainerApi {
  /** 集装箱基础信息信息 */
  export interface BaseContainer {
    id: number; // ID
    containerNo?: string; // 集装箱箱号（ISO 6346：4字母+6数字+1校验位，共11位）
    containerTypeId?: number; // 关联类型ID（外键 container_type.id）
    containerSizeId?: number; // 关联尺寸ID（外键 container_size.id）
    containerStatusId?: number; // 关联状态ID（外键 container_status.id）
    maxWeightKg: number; // 最大载重
    tareWeightKg: number; // 自重
    productionDate: string | Dayjs; // 生产日期
    manufacturer: string; // 生产厂商
    lastInspectDate: string | Dayjs; // 最近检验日期
    nextInspectDate: string | Dayjs; // 下次检验日期
    imoNumber: string; // IMO编号（危险品集装箱必备，国际海事组织认证）
    cscPlate: string; // CSC安全牌照编号（ISO 1496-1安全认证）
  }
}

/** 查询集装箱基础信息分页 */
export function getBaseContainerPage(params: PageParam) {
  return requestClient.get<PageResult<BppBaseContainerApi.BaseContainer>>(
    '/bpp/base/container/page',
    { params },
  );
}

/** 查询集装箱基础信息详情 */
export function getBaseContainer(id: number) {
  return requestClient.get<BppBaseContainerApi.BaseContainer>(
    `/bpp/base/container/get?id=${id}`,
  );
}

/** 新增集装箱基础信息 */
export function createBaseContainer(data: BppBaseContainerApi.BaseContainer) {
  return requestClient.post('/bpp/base/container/create', data);
}

/** 修改集装箱基础信息 */
export function updateBaseContainer(data: BppBaseContainerApi.BaseContainer) {
  return requestClient.put('/bpp/base/container/update', data);
}

/** 删除集装箱基础信息 */
export function deleteBaseContainer(id: number) {
  return requestClient.delete(`/bpp/base/container/delete?id=${id}`);
}

/** 批量删除集装箱基础信息 */
export function deleteBaseContainerList(ids: number[]) {
  return requestClient.delete(
    `/bpp/base/container/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出集装箱基础信息 */
export function exportBaseContainer(params: any) {
  return requestClient.download('/bpp/base/container/export-excel', { params });
}
