import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace LaneWeightConfigApi {
  // 配置信息VO
  export interface configVO {
    gateType?: string; // 闸口类型
    gateAccessType?: string; // 进出闸模式
    size?: boolean; // 尺寸
    isEmpty?: string; // 空重
    containerType?: string; // 集装箱类型
    maxWeight?: string; // 最大重量（kg)
  }
}
// 配置信息分页查询
export const getLaneWeightConfigPage = (params: PageParam) => {
  // return requestClient.get<PageResult<LaneWeightConfigApi.configVO>>(
  //   '/bpp/sea/acceptance-plan-over-operation/page',
  //   { params },
  // );
  const mockData = [
    {
      id: 1,
      gateType: '是',
      gateAccessType: '进',
      size: 20,
      isEmpty: '重',
      containerType: '普通箱',
      maxWeight: 30480,
    },
    {
      id: 2,
      gateType: '是',
      gateAccessType: '出',
      size: 40,
      isEmpty: '空',
      containerType: '冷藏箱',
      maxWeight: 32500,
    },
    {
      id: 3,
      gateType: '否',
      gateAccessType: '进',
      size: 40,
      isEmpty: '重',
      containerType: '普通箱',
      maxWeight: 28000,
    },
    {
      id: 4,
      gateType: '是',
      gateAccessType: '出',
      size: 45,
      isEmpty: '重',
      containerType: '开顶箱',
      maxWeight: 34000,
    },
    {
      id: 5,
      gateType: '否',
      gateAccessType: '出',
      size: 20,
      isEmpty: '空',
      containerType: '普通箱',
      maxWeight: 24000,
    },
    {
      id: 6,
      gateType: '是',
      gateAccessType: '进',
      size: 53,
      isEmpty: '重',
      containerType: '框架箱',
      maxWeight: 36000,
    },
    {
      id: 7,
      gateType: '是',
      gateAccessType: '进',
      size: '通用',
      isEmpty: '空',
      containerType: '罐箱',
      maxWeight: 30000,
    },
    {
      id: 8,
      gateType: '否',
      gateAccessType: '出',
      size: 48,
      isEmpty: '重',
      containerType: '普通箱',
      maxWeight: 35000,
    },
  ];

  return Promise.resolve({
    list: mockData,
    total: mockData.length,
  });
};

/** 新增配置信息 */
export const createConfig = (data: LaneWeightConfigApi.configVO) => {
  return requestClient.post(
    '/bpp/gate/empty/container-control-main/create',
    data,
  );
};

/** 修改配置信息 */
export const updateConfig = (data: LaneWeightConfigApi.configVO) => {
  return requestClient.put(
    '/bpp/gate/empty/container-control-main/update',
    data,
  );
};

/** 删除配置信息 */
export function deleteConfig(id: number) {
  return requestClient.delete(`/bpp/flow/gate/fleet/delete?id=${id}`);
}

/** 批量删除配置信息 */
export function deleteConfigList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/gate/fleet/delete-list?ids=${ids.join(',')}`,
  );
}
