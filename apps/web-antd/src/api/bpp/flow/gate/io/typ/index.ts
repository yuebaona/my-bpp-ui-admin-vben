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
    type: string;
  }

  // 运输指令类型
  export interface transportInstructionVO {
    id: null | number;
    gateIoTypId: number;
    gateIoTypIds: number;
    transportOrderCode: string;
    transportOrderName: string;
    gateInOutType: string;
    contDirection: string;
    emptyFull: string;
    transportOrderValidDays: number;
    mappingCode: string;
    isValid: boolean;
    isUsedForPln: boolean;
    type: string;
  }

  export interface gateIOAndTransportVO {
    id: null | number;
    businessCode: string;
    businessName: string;
    pickupLocation: string;
    deliveryLocation: string;
    plnValidDays: number;
    isValid: boolean;
    mappingCode: string;
    deleteTime: string;
    type: string;
    gateIoTransportSaveReqVOList: transportInstructionVO[];
  }
}

// 创建进提箱类型
export const createGateInOutType = (data: deliveryApi.gateInOutTypeVO) => {
  return requestClient.post('/bpp/base/gate-io-typ/create', {
    ...data,
    id: null,
  });
};

// 批量保存进提箱和运输指令
export const batchSaveGateInOutTypeAndTransport = (
  data: deliveryApi.gateIOAndTransportVO[],
) => {
  return requestClient.post('/bpp/base/gate-io-typ/create-list', data);
};

// 查询进提箱类型分页
export const getGateInOutTypePage = (params: deliveryApi.gateInOutTypeVO) => {
  return requestClient.get('/bpp/base/gate-io-typ/page', {
    params,
  });
};

// 更新进提箱类型
export const updateGateInOutType = (data: deliveryApi.gateInOutTypeVO) => {
  return requestClient.put('/bpp/base/gate-io-typ/update', data);
};

// 删除进提箱类型
export const deleteGateInOutType = (id: number) => {
  return requestClient.delete(`/bpp/base/gate-io-typ/delete?id=${id}`);
};

// 批量删除进提箱类型
export const batchDeleteGateInOutType = (ids: number[], type: string) => {
  return requestClient.delete('/bpp/base/gate-io-typ/delete-list', {
    params: { ids: ids.join(','), type },
  });
};

// 获得进提箱类型
export const getGateInOutType = (id: number) => {
  return requestClient.get(`/bpp/base/gate-io-typ/get?id=${id}`);
};

// 创建运输指令类型
export const createTransportInstruction = (
  data: deliveryApi.transportInstructionVO,
) => {
  return requestClient.post('/bpp/base/gate-io-typ-dtl/create', {
    ...data,
    id: null,
  });
};

// 查询运输指令类型分页
export const getTransportInstructionPage = (
  params: deliveryApi.transportInstructionVO,
) => {
  return requestClient.get('/bpp/base/gate-io-typ-dtl/page', {
    params,
  });
};

// 获得运输指令明细
export const getTransportInstruction = (id: number) => {
  return requestClient.get(`/bpp/base/gate-io-typ-dtl/get?id=${id}`);
};

// 更新运输指令类型
export const updateTransportInstruction = (
  data: deliveryApi.transportInstructionVO,
) => {
  return requestClient.put('/bpp/base/gate-io-typ-dtl/update', data);
};

// 删除运输指令类型
export const deleteTransportInstruction = (id: number) => {
  return requestClient.delete(`/bpp/base/gate-io-typ-dtl/delete?id=${id}`);
};

// 批量删除运输指令类型
export const batchDeleteTransportType = (ids: number[]) => {
  return requestClient.delete('/bpp/base/gate-io-typ-dtl/delete-list', {
    params: { ids: ids.join(',') },
  });
};
