// 公共信息模块
import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace CommonApi {
  export interface CustomerVO {
    id: number;
    creator: string;
    createTime: string;
    updater: string;
    updateTime: string;
    deleted: boolean;
    tenantId: number;
    customerCode: string;
    customerName: string;
    customerNameEn: string;
    customerNameAbbr: string;
    contactPerson: string;
    contactPhone: string;
    billingMode: string;
    billingMethod: string;
    status: string;
    noticeEmail: string;
    noticePhone: string;
  }
}
// 获取客户基础信息
export const getCustomerList = (params: PageParam) => {
  return requestClient.get<PageResult<CommonApi.CustomerVO>>(
    '/bpp/flow/common/get-customer-list',
    { params },
  );
};
// 获取船名航次
export const getVVd = ({
  queryType = 'VESSEL',
  condition,
  inOutFlag = 'ALL',
}: {
  condition: string;
  queryType?: string;
  inOutFlag?: string;
}) => {
  return requestClient.get(
    `/sgc/bpp/flow/common/get-vvd-split-list?queryType=${queryType}&condition=${condition}&inOutFlag=${inOutFlag}`,
  );
};
// 获取集装箱ISO信息
export const getContainerIsoList = (queryType: string) => {
  return requestClient.get(
    `/bpp/flow/common/get-container-iso-list?queryType=${queryType}`,
  );
};
