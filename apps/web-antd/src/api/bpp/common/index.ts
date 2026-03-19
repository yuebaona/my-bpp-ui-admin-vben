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

  export interface isoVO {
    id?: number;
    contIso?: string;
    isSpecial?: string;
    containerType?: string;
    containerTypeName?: string;
    containerLength?: string;
    containerHeight?: string;
    isoCode?: string;
  }

  export interface ContainerVO {
    id?: number;
    vvd?: string;
    isSpecial?: string;
    containerType?: string;
    containerTypeName?: string;
    containerLength?: string;
    containerHeight?: string;
    isoCode?: string;
  }
}
// 获取客户基础信息
export const getCustomerList = (params: PageParam) => {
  return requestClient.get<PageResult<CommonApi.CustomerVO>>(
    '/bpp/base/customer/get-customer-list',
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
    `/bpp/comb/vessel-voyage/get-vvd-split-list?queryType=${queryType}&condition=${condition}&inOutFlag=${inOutFlag}`,
  );
};

// 获取船名航次（联合查询）
export const getVesselAndVoyage = (params: { condition: string }) => {
  return requestClient.get<EmptyContainerControlApi.ContainerVO>(
    '/bpp/comb/vessel-voyage/get-vvd-union',
    {
      params,
    },
  );
};

// 获取集装箱ISO信息
export const getContainerIsoList = (queryType: string) => {
  return requestClient.get(
    `/bpp/flow/common/get-container-iso-list?queryType=${queryType}`,
  );
};
// 分页获取集装箱ISO信息
export const getContainerIsoListPage = (params: {
  contHeight?: string;
  contIso?: string;
  contLength?: string;
  contType?: string;
  pageNo: number;
  pageSize: number;
  queryType: string;
}) => {
  return requestClient.get<PageResult<CommonApi.isoVO>>(
    `/bpp/flow/common/get-container-iso-list`,
    { params },
  );
};
// 分页获取集装箱持箱人信息
export const getContainerOwnerListPage = (params: {
  ownerCode: string;
  pageNo: number;
  pageSize: number;
}) => {
  return requestClient.get<PageResult<CommonApi.ContainerOwnerVO>>(
    '/bpp/base/container-owner/get-container-owner-list',
    { params },
  );
};
