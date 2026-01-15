import type { PageParam, PageResult } from '@vben/request';
import type { Dayjs } from 'dayjs';

import { requestClient } from '#/api/request';

export namespace BppBaseCustomerApi {
/** 客户基础信息信息 */
  export interface Customer {
          id: number; // 主键ID
          customerCode?: string; // 客户代码
          customerName: string; // 客户名称（中文）
          customerNameEn: string; // 客户名称（英文）
          customerNameAbbr: string; // 简称，Abbreviate
          contactPerson: string; // 联系人
          contactPhone: string; // 联系方式
          billingMode: string; // 计费模式，月结，即结
          billingMethod: string; // 结算方式
          status?: string; // 使用状态，INACTIVE 未使用；ACTIVE 使用中；OBSOLETE 已作废
          noticeEmail: string; // 通知邮箱
          noticePhone: string; // 客户通知电话
  }
}

// 客户基础信息url
const PREFIX = '/sgc/bpp/base/customer'


/** 查询客户基础信息分页 */
export function getCustomerPage(params: PageParam) {
  return requestClient.get<PageResult<BppBaseCustomerApi.Customer>>(
    PREFIX + '/page',
    { params },
  );
}

/** 查询客户基础信息详情 */
export function getCustomer(id: number) {
  return requestClient.get<BppBaseCustomerApi.Customer>(
    `${PREFIX}/get?id=${id}`,
  );
}

/** 新增客户基础信息 */
export function createCustomer(data: BppBaseCustomerApi.Customer) {
  return requestClient.post(PREFIX + '/create', data);
}

/** 修改客户基础信息 */
export function updateCustomer(data: BppBaseCustomerApi.Customer) {
  return requestClient.put(PREFIX + '/update', data);
}

/** 删除客户基础信息 */
export function deleteCustomer(id: number) {
  return requestClient.delete(`${PREFIX}/delete?id=${id}`);
}

/** 批量删除客户基础信息 */
export function deleteCustomerList(ids: number[]) {
  return requestClient.delete(
    `${PREFIX}/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出客户基础信息 */
export function exportCustomer(params: any) {
  return requestClient.download(PREFIX + '/export-excel', { params });
}
