import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace LaneConfigApi {
  // 配置信息VO
  export interface configVO {
    laneCode?: string;
    gateAccessType?: string;
    laneDesc?: string;
    tradeType?: string;
    customsCheckCode?: string;
    customsCheckSwitch?: string;
    gateType?: string;
    containerRuleList?: string;
    tosLaneCode?: string;
  }
}
// 配置信息分页查询
export const getLaneConfigPage = (params: PageParam) => {
  // return requestClient.get<PageResult<LaneWeightConfigApi.configVO>>(
  //   '/bpp/sea/acceptance-plan-over-operation/page',
  //   { params },
  // );
  const mockData = [
    {
      id: 1,
      laneCode: 'A01',
      gateAccessType: '进',
      laneDesc: '1号进闸车道',
      tradeType: '内贸',
      customsCheckCode: 'CC001',
      customsCheckSwitch: '普通箱',
      gateType: '外闸主闸',
      containerRuleList: '主闸规则',
      tosLaneCode: 'TOS-A01',
    },
    {
      id: 2,
      laneCode: 'A02',
      gateAccessType: '出',
      laneDesc: '2号出闸车道',
      tradeType: '外贸',
      customsCheckCode: 'CC002',
      customsCheckSwitch: '冷藏箱',
      gateType: '外闸控制闸',
      containerRuleList: '互拖规则',
      tosLaneCode: 'TOS-A02',
    },
    {
      id: 3,
      laneCode: 'B01',
      gateAccessType: '进',
      laneDesc: '3号互拖车道',
      tradeType: '内贸',
      customsCheckCode: 'CC003',
      customsCheckSwitch: '普通箱',
      gateType: '互拖闸',
      containerRuleList: '海铁规则',
      tosLaneCode: 'TOS-B01',
    },
    {
      id: 4,
      laneCode: 'B02',
      gateAccessType: '出',
      laneDesc: '4号海铁车道',
      tradeType: '内贸',
      customsCheckCode: 'CC004',
      customsCheckSwitch: '开顶箱',
      gateType: '海铁闸',
      containerRuleList: '公铁规则',
      tosLaneCode: 'TOS-B02',
    },
  ];

  return Promise.resolve({
    list: mockData,
    total: mockData.length,
  });
};

/** 新增配置信息 */
export const createConfig = (data: LaneConfigApi.configVO) => {
  return requestClient.post(
    '/bpp/gate/empty/container-control-main/create',
    data,
  );
};

/** 修改配置信息 */
export const updateConfig = (data: LaneConfigApi.configVO) => {
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
