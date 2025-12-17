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

  export interface ContainerOwnerVO {
    id?: number;
    ownerCode?: string;
    ownerName?: string;
    ownerCountry?: string;
    ownerMaster?: string;
    ownerLocalNm?: string;
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
}: {
  condition: string;
  queryType?: string;
}) => {
  return requestClient.get(
    `/bpp/flow/common/get-vvd?queryType=${queryType}&condition=${condition}`,
  );
};
// 获取集装箱ISO信息
export const getContainerIsoList = (queryType: string) => {
  return requestClient.get(
    `/bpp/flow/common/get-container-iso-list?queryType=${queryType}`,
  );
};
// 获取集装箱持箱人信息
export const getContainerOwnerList = (params: string) => {
  return requestClient.get<PageResult<CommonApi.ContainerOwnerVO>>(
    '/bpp/flow/common/get-container-owner-list',
    { params },
  );
};
