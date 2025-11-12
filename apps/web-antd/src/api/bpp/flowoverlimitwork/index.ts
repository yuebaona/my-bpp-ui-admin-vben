import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** 超限作业申请信息 */
export interface FlowOverlimitWork {
          id: number; // ID
          applicationNo: string; // 申请编号
          applicationCompany: string; // 申请单位代码
          applicant: string; // 申请人代码
          shipCode: string; // 船舶代码
          voyageCode: string; // 航次代码
          billNo: string; // 提单号
          cargoName: string; // 货名
          impExpType: string; // 进出口类别
          processId: string; // 申请工作流id
  }

// 超限作业申请 API
export const FlowOverlimitWorkApi = {
  // 查询超限作业申请分页
  getFlowOverlimitWorkPage: async (params: any) => {
    return await request.get({ url: `/bpp/flow-overlimit-work/page`, params })
  },

  // 查询超限作业申请详情
  getFlowOverlimitWork: async (id: number) => {
    return await request.get({ url: `/bpp/flow-overlimit-work/get?id=` + id })
  },

  // 新增超限作业申请
  createFlowOverlimitWork: async (data: FlowOverlimitWork) => {
    return await request.post({ url: `/bpp/flow-overlimit-work/create`, data })
  },

  // 修改超限作业申请
  updateFlowOverlimitWork: async (data: FlowOverlimitWork) => {
    return await request.put({ url: `/bpp/flow-overlimit-work/update`, data })
  },

  // 删除超限作业申请
  deleteFlowOverlimitWork: async (id: number) => {
    return await request.delete({ url: `/bpp/flow-overlimit-work/delete?id=` + id })
  },

  /** 批量删除超限作业申请 */
  deleteFlowOverlimitWorkList: async (ids: number[]) => {
    return await request.delete({ url: `/bpp/flow-overlimit-work/delete-list?ids=${ids.join(',')}` })
  },

  // 导出超限作业申请 Excel
  exportFlowOverlimitWork: async (params) => {
    return await request.download({ url: `/bpp/flow-overlimit-work/export-excel`, params })
  }
}