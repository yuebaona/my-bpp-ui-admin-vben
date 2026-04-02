import { requestClient } from '#/api/request';

export namespace deliveryApi {
  // 进提箱类型VO
  export interface gateInOutTypeVO {
    id: null | number;
    businessCode: string;
    businessName: string;
    pickupLocation: string;
    deliveryLocation: string;
    plnValidDays: number;
    isValid: boolean;
    mappingCode: string;
    creatorName: string;
    createTime: string;
    updaterName: string;
    updateTime: string;
  }

  // 运输指令类型
  export interface transportInstructionVO {
    id: null | number;
    gateIoTypId: number;
    transportOrderCode: string;
    transportOrderName: string;
    gateInOutType: string;
    contDirection: string;
    emptyFull: string;
    transportOrderValidDays: number;
    mappingCode: string;
    isValid: boolean;
    isUsedForPln: boolean;
    creatorName: string;
    createTime: string;
    updaterName: string;
    updateTime: string;
  }
}

// 创建进提箱类型
export const createGateInOutType = (data: deliveryApi.gateInOutTypeVO) => {
  return requestClient.post('/sgc/bpp/base/gate-io-typ/page', data);
};

// 查询进提箱类型分页
export const getGateInOutTypePage = (data: deliveryApi.gateInOutTypeVO) => {
  return requestClient.get('/sgc/bpp/base/gate-io-typ/page', {
    data,
  });
};
