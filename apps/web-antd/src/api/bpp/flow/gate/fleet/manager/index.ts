import type { PageParam, PageResult } from '@vben/request';
import dayjs from 'dayjs';
import { requestClient } from '#/api/request';

export namespace FleetApi {
  // 车队信息VO
  export interface fleetVO {
    id?: number; // 车队信息表唯一主键
    fltGkey?: string; // 车队全局唯一业务主键
    fltCd?: string; // 车队代码
    fltNm?: string; // 车队中文名(全称)
    fltShortNm?: string; // 车队缩写
    fltAddr?: string; // 车队详细地址
    rstrCnt?: number; // 已限制次数
    isRstr?: number; // 是否限制
    rstrReason?: string; // 限制原因代码及描述
    rstrDataSrc?: string; // 限制信息来源
    rstrStartDt?: Date; // 限制开始时间
    rstrEndDt?: Date; // 限制结束时间
    lastRstrDt?: string; // 最近一次限制时间
    legalNm?: string; // 企业法人姓名
    legalPh?: string; // 企业法人联系电话
    safetyNm?: string; // 安全负责人姓名
    safetyPh?: string; // 安全负责人联系电话
    bizNm?: string; // 业务对接人姓名
    bizPh?: string; // 业务对接人联系电话
    bizRegNo?: string; // 社会信用代码
    otrAuditNo?: string; // OTR审核编号（外集卡年审编号）
    portRm?: string; // 码头备注
    dataSrc?: string; // 数据来源
    createTime?: Date; // 创建时间
    updateTime?: Date; // 更新时间
    enableFlg?: number; // 是否有效
  }

  // 创建和修改操作返回消息体
  export interface fleetSaveRespVO {
    id?: string; // 车队信息表唯一主键
    message?: string; // 处理结果消息
  }
}

/** 创建车队 */
export function createFleet(data: FleetApi.fleetVO) {
  return requestClient.post('/bpp/flow/gate/fleet/create', data);
}

/** 更新车队信息 */
export function updateFleet(data: FleetApi.fleetVO) {
  return requestClient.put('/bpp/flow/gate/fleet/update', data);
}

/** 删除车队 */
export function deleteFleet(id: number) {
  return requestClient.delete(`/bpp/flow/gate/fleet/delete?id=${id}`);
}

/** 批量删除车队信息 */
export function deleteFleetList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/gate/fleet/delete-list?ids=${ids.join(',')}`,
  );
}

/** 查询车队详情 */
export function getFleetById(id: number) {
  // return requestClient.get<FleetApi.fleetVO>(
  //   `/bpp/flow/gate/fleet/get?id=${id}`,
  // );
  const mock: Record<number, FleetApi.fleetVO> = {
    1: { id: 1, fltGkey: 'FLT000001', fltCd: 'FLT001', fltNm: '顺达物流有限公司', fltShortNm: '顺达物流', fltAddr: '深圳市南山区科技园路100号', enableFlg: 1, rstrCnt: 2, isRstr: 1, rstrReason: 'A001：违规超载', rstrDataSrc: '北港网', rstrStartDt: dayjs('2024-03-01 00:00:00').valueOf() as any, rstrEndDt: dayjs('2024-06-01 00:00:00').valueOf() as any, lastRstrDt: '92', legalNm: '陈伟', legalPh: '13800138001', safetyNm: '李明', safetyPh: '13900139001', bizNm: '张华', bizPh: '13700137001', bizRegNo: '91440300MA5DABCDE1', otrAuditNo: 'OTR20240001', portRm: '码头备注信息', dataSrc: '业务处理平台', createTime: dayjs('2024-01-15 10:30:00').valueOf() as any, updateTime: dayjs('2024-05-20 14:00:00').valueOf() as any },
    2: { id: 2, fltGkey: 'FLT000002', fltCd: 'FLT002', fltNm: '通达运输有限公司', fltShortNm: '通达运输', fltAddr: '广州市黄埔区港前路200号', enableFlg: 1, rstrCnt: 0, isRstr: 0, rstrReason: '', rstrDataSrc: '', rstrStartDt: undefined, rstrEndDt: undefined, lastRstrDt: '', legalNm: '赵刚', legalPh: '13600136002', safetyNm: '王磊', safetyPh: '13500135002', bizNm: '刘洋', bizPh: '13400134002', bizRegNo: '91440100MA5DABCDE2', otrAuditNo: 'OTR20240002', portRm: '', dataSrc: '北港网', createTime: dayjs('2024-02-20 09:00:00').valueOf() as any, updateTime: dayjs('2024-06-10 11:30:00').valueOf() as any },
    3: { id: 3, fltGkey: 'FLT000003', fltCd: 'FLT003', fltNm: '恒通国际物流有限公司', fltShortNm: '恒通物流', fltAddr: '上海市浦东新区保税区888号', enableFlg: 0, rstrCnt: 3, isRstr: 1, rstrReason: 'B002：超时未完成作业', rstrDataSrc: '智慧安防', rstrStartDt: dayjs('2024-02-15 00:00:00').valueOf() as any, rstrEndDt: dayjs('2024-05-15 00:00:00').valueOf() as any, lastRstrDt: '89', legalNm: '孙建', legalPh: '13300133003', safetyNm: '周涛', safetyPh: '13200132003', bizNm: '黄磊', bizPh: '13100131003', bizRegNo: '91310115MA5DABCDE3', otrAuditNo: 'OTR20240003', portRm: '需注意安全规范', dataSrc: '业务处理平台', createTime: dayjs('2024-03-05 08:30:00').valueOf() as any, updateTime: dayjs('2024-04-18 16:00:00').valueOf() as any },
  };
  if (mock[id]) return Promise.resolve(mock[id]);
}

/** 查询车队管理列表 */
export function getFleetPage(params: PageParam) {
  // return requestClient.get<PageResult<FleetApi.fleetVO>>(
  //   '/bpp/flow/gate/fleet/page',
  //   { params },
  // );
  const list: FleetApi.fleetVO[] = [
    { id: 1, fltGkey: 'FLT000001', fltCd: 'FLT001', fltNm: '顺达物流有限公司', fltShortNm: '顺达物流', fltAddr: '深圳市南山区科技园路100号', enableFlg: 1, rstrCnt: 2, isRstr: 1, rstrReason: 'A001：违规超载', rstrDataSrc: '北港网', rstrStartDt: dayjs('2024-03-01 00:00:00').valueOf() as any, rstrEndDt: dayjs('2024-06-01 00:00:00').valueOf() as any, lastRstrDt: '92', legalNm: '陈伟', legalPh: '13800138001', safetyNm: '李明', safetyPh: '13900139001', bizNm: '张华', bizPh: '13700137001', bizRegNo: '91440300MA5DABCDE1', otrAuditNo: 'OTR20240001', portRm: '码头备注信息', dataSrc: '业务处理平台', createTime: dayjs('2024-01-15 10:30:00').valueOf() as any, updateTime: dayjs('2024-05-20 14:00:00').valueOf() as any },
    { id: 2, fltGkey: 'FLT000002', fltCd: 'FLT002', fltNm: '通达运输有限公司', fltShortNm: '通达运输', fltAddr: '广州市黄埔区港前路200号', enableFlg: 1, rstrCnt: 0, isRstr: 0, rstrReason: '', rstrDataSrc: '', rstrStartDt: undefined, rstrEndDt: undefined, lastRstrDt: '', legalNm: '赵刚', legalPh: '13600136002', safetyNm: '王磊', safetyPh: '13500135002', bizNm: '刘洋', bizPh: '13400134002', bizRegNo: '91440100MA5DABCDE2', otrAuditNo: 'OTR20240002', portRm: '', dataSrc: '北港网', createTime: dayjs('2024-02-20 09:00:00').valueOf() as any, updateTime: dayjs('2024-06-10 11:30:00').valueOf() as any },
    { id: 3, fltGkey: 'FLT000003', fltCd: 'FLT003', fltNm: '恒通国际物流有限公司', fltShortNm: '恒通物流', fltAddr: '上海市浦东新区保税区888号', enableFlg: 0, rstrCnt: 3, isRstr: 1, rstrReason: 'B002：超时未完成作业', rstrDataSrc: '智慧安防', rstrStartDt: dayjs('2024-02-15 00:00:00').valueOf() as any, rstrEndDt: dayjs('2024-05-15 00:00:00').valueOf() as any, lastRstrDt: '89', legalNm: '孙建', legalPh: '13300133003', safetyNm: '周涛', safetyPh: '13200132003', bizNm: '黄磊', bizPh: '13100131003', bizRegNo: '91310115MA5DABCDE3', otrAuditNo: 'OTR20240003', portRm: '需注意安全规范', dataSrc: '业务处理平台', createTime: dayjs('2024-03-05 08:30:00').valueOf() as any, updateTime: dayjs('2024-04-18 16:00:00').valueOf() as any },
  ];
  return Promise.resolve({ list, total: list.length } as PageResult<FleetApi.fleetVO>);
}

/** 导出用户 */
export function exportFleet(params: any) {
  return requestClient.download('/bpp/flow/gate/fleet/export-excel', { params });
}

/** 获取可选车队列表 */
export function getSelectableList() {
  return requestClient.get('/bpp/flow/gate/fleet/selectable');
}
