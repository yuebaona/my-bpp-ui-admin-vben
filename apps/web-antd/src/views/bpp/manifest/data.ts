import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getRangePickerDefaultProps } from '#/utils';

/** 卸船清单行数据（本轮无接口，本地类型定义） */
export interface DischargeManifest {
  id: number;
  /** 船舶呼号IMO */
  shipCallSign: string;
  /** 船舶中文名字 */
  shipNameCn: string;
  /** 进口航次 */
  importVoyage: string;
  /** 提交时间 */
  submitTime: string;
  /** 提交状态：1 已提交，0 未提交 */
  submitStatus: 0 | 1;
  /** 回执状态：success 成功，error 出错，none 未回执 */
  receiptStatus: 'error' | 'none' | 'success';
  /** 最后操作人 */
  lastOperator: string;
  /** 最后操作时间 */
  lastOperateTime: string;
}

/** 提交状态色值：已提交(绿)/未提交(灰) */
export const SUBMIT_STATUS_COLOR: Record<number, string> = {
  1: '#0c8918',
  0: '#c9cdd4',
};

/** 回执状态色值：成功(绿)/出错(红)/未回执(灰) */
export const RECEIPT_STATUS_COLOR: Record<string, string> = {
  success: '#0c8918',
  error: '#f53f3f',
  none: '#c9cdd4',
};

/** 船舶中文名称下拉假选项 */
const SHIP_NAME_OPTIONS = [
  { label: '华信长荣', value: '华信长荣' },
  { label: '惠金桥', value: '惠金桥' },
  { label: '海丰', value: '海丰' },
  { label: '穗港航5001', value: '穗港航5001' },
  { label: '海丰神龙', value: '海丰神龙' },
];

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'shipCallSign',
      label: '船舶呼号',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入船舶呼号',
      },
    },
    {
      fieldName: 'importVoyage',
      label: '进口航次',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '进口航次',
      },
    },
    {
      fieldName: 'shipNameCn',
      label: '船舶中文名称',
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        maxTagCount: 3,
        placeholder: '请选择船舶中文名称',
        options: SHIP_NAME_OPTIONS,
      },
    },
    {
      fieldName: 'submitStatus',
      label: '提交状态',
      component: 'Select',
      defaultValue: '',
      componentProps: {
        allowClear: false,
        options: [
          { label: '全部', value: '' },
          { label: '已提交', value: 1 },
          { label: '未提交', value: 0 },
        ],
      },
    },
    {
      fieldName: 'submitTime',
      label: '提交时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<DischargeManifest>['columns'] {
  return [
    { type: 'radio', width: 40 },
    { type: 'seq', title: '序号', width: 60 },
    {
      field: 'shipCallSign',
      title: '船舶呼号IMO',
      minWidth: 140,
    },
    {
      field: 'shipNameCn',
      title: '船舶中文名字',
      minWidth: 120,
    },
    {
      field: 'importVoyage',
      title: '进口航次',
      minWidth: 100,
    },
    {
      field: 'submitTime',
      title: '提交时间',
      minWidth: 170,
      formatter: 'formatDateTime',
    },
    {
      field: 'submitStatus',
      title: '提交状态',
      minWidth: 100,
      slots: { default: 'submitStatus' },
    },
    {
      field: 'receiptStatus',
      title: '回执状态',
      minWidth: 100,
      slots: { default: 'receiptStatus' },
    },
    {
      field: 'lastOperator',
      title: '最后操作人',
      minWidth: 120,
    },
    {
      field: 'lastOperateTime',
      title: '最后操作时间',
      minWidth: 170,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 160,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 装船清单行数据（本轮无接口，本地类型定义） */
export interface LoadingManifest {
  id: number;
  /** 船舶呼号IMO */
  shipCallSign: string;
  /** 船舶中文名字 */
  shipNameCn: string;
  /** 出口航次 */
  exportVoyage: string;
  /** 提交时间 */
  submitTime: string;
  /** 提交状态：1 已提交，0 未提交 */
  submitStatus: 0 | 1;
  /** 回执状态：success 成功，error 出错，none 未回执 */
  receiptStatus: 'error' | 'none' | 'success';
  /** 最后操作人 */
  lastOperator: string;
  /** 最后操作时间 */
  lastOperateTime: string;
}

/** 装船清单的搜索表单 */
export function useLoadingGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'shipCallSign',
      label: '船舶呼号',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入船舶呼号',
      },
    },
    {
      fieldName: 'exportVoyage',
      label: '出口航次',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '出口航次',
      },
    },
    {
      fieldName: 'shipNameCn',
      label: '船舶中文名称',
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        maxTagCount: 3,
        placeholder: '请选择船舶中文名称',
        options: SHIP_NAME_OPTIONS,
      },
    },
    {
      fieldName: 'submitStatus',
      label: '提交状态',
      component: 'Select',
      defaultValue: '',
      componentProps: {
        allowClear: false,
        options: [
          { label: '全部', value: '' },
          { label: '已提交', value: 1 },
          { label: '未提交', value: 0 },
        ],
      },
    },
    {
      fieldName: 'submitTime',
      label: '提交时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 装船清单的字段 */
export function useLoadingGridColumns(): VxeTableGridOptions<LoadingManifest>['columns'] {
  return [
    { type: 'radio', width: 40 },
    { type: 'seq', title: '序号', width: 60 },
    {
      field: 'shipCallSign',
      title: '船舶呼号IMO',
      minWidth: 140,
    },
    {
      field: 'shipNameCn',
      title: '船舶中文名字',
      minWidth: 120,
    },
    {
      field: 'exportVoyage',
      title: '出口航次',
      minWidth: 100,
    },
    {
      field: 'submitTime',
      title: '提交时间',
      minWidth: 170,
      formatter: 'formatDateTime',
    },
    {
      field: 'submitStatus',
      title: '提交状态',
      minWidth: 100,
      slots: { default: 'submitStatus' },
    },
    {
      field: 'receiptStatus',
      title: '回执状态',
      minWidth: 100,
      slots: { default: 'receiptStatus' },
    },
    {
      field: 'lastOperator',
      title: '最后操作人',
      minWidth: 120,
    },
    {
      field: 'lastOperateTime',
      title: '最后操作时间',
      minWidth: 170,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 160,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 装船清单假数据：17 条，对齐参考图，覆盖提交状态 2 色 + 回执状态 3 色 */
export const MOCK_LOADING: LoadingManifest[] = [
  {
    id: 1,
    shipCallSign: 'CN2020276074',
    shipNameCn: '华信长荣',
    exportVoyage: '2601N',
    submitTime: '2026-02-11 09:21:00',
    submitStatus: 1,
    receiptStatus: 'none',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-11 08:49:18',
  },
  {
    id: 2,
    shipCallSign: 'SUIGANGHANG',
    shipNameCn: '穗港航5001',
    exportVoyage: '2601N',
    submitTime: '2026-02-11 09:21:00',
    submitStatus: 1,
    receiptStatus: 'error',
    lastOperator: 'bgwl',
    lastOperateTime: '2026-02-11 08:49:18',
  },
  {
    id: 3,
    shipCallSign: 'UN9384899',
    shipNameCn: '海丰神龙',
    exportVoyage: '2601N',
    submitTime: '2026-02-10 09:21:00',
    submitStatus: 0,
    receiptStatus: 'none',
    lastOperator: 'xhf1',
    lastOperateTime: '2026-02-10 08:49:18',
  },
  {
    id: 4,
    shipCallSign: 'UN8356405',
    shipNameCn: '恒辉',
    exportVoyage: '2601N',
    submitTime: '2026-02-10 08:21:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-10 08:49:18',
  },
  {
    id: 5,
    shipCallSign: 'UN9445007',
    shipNameCn: '海安德尔',
    exportVoyage: '2601N',
    submitTime: '2026-02-10 08:21:00',
    submitStatus: 1,
    receiptStatus: 'none',
    lastOperator: 'bgwl',
    lastOperateTime: '2026-02-10 08:49:18',
  },
  {
    id: 6,
    shipCallSign: 'HJQ888',
    shipNameCn: '惠金桥888',
    exportVoyage: '2601N',
    submitTime: '2026-02-09 09:21:00',
    submitStatus: 0,
    receiptStatus: 'success',
    lastOperator: 'xhf2',
    lastOperateTime: '2026-02-10 08:49:18',
  },
  {
    id: 7,
    shipCallSign: 'UN9220304',
    shipNameCn: '海丰邦卡',
    exportVoyage: '2601N',
    submitTime: '2026-02-09 09:21:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 8,
    shipCallSign: 'CN20257012106',
    shipNameCn: '安洋188',
    exportVoyage: '2601N',
    submitTime: '2026-02-09 09:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'bgwl',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 9,
    shipCallSign: 'UN9149823',
    shipNameCn: '海陆菲尼克斯',
    exportVoyage: '2601N',
    submitTime: '2026-02-09 09:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'xhf3',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 10,
    shipCallSign: 'UN9943683',
    shipNameCn: '海丰同和',
    exportVoyage: '2601N',
    submitTime: '2026-02-09 09:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 11,
    shipCallSign: 'CN20173469167',
    shipNameCn: '惠金桥289',
    exportVoyage: '2601N',
    submitTime: '2026-02-07 07:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'bgwl',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 12,
    shipCallSign: 'UN9159309',
    shipNameCn: '东宏号',
    exportVoyage: '2601N',
    submitTime: '2026-02-07 07:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'xhf4',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 13,
    shipCallSign: 'NONE',
    shipNameCn: '华锦润洋',
    exportVoyage: '2601N',
    submitTime: '2026-02-07 07:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 14,
    shipCallSign: 'UN9948865',
    shipNameCn: '德翔连云港',
    exportVoyage: '2601N',
    submitTime: '2026-02-07 07:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'bgwl',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 15,
    shipCallSign: 'CN2020276074',
    shipNameCn: '华信长荣',
    exportVoyage: '2554N',
    submitTime: '2026-02-07 07:21:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'xhf5',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 16,
    shipCallSign: 'CN2015386367',
    shipNameCn: '新明州76',
    exportVoyage: '2509N',
    submitTime: '2026-02-07 07:21:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 17,
    shipCallSign: 'CN20206749264',
    shipNameCn: '惠金桥293',
    exportVoyage: '2511N',
    submitTime: '2026-02-07 07:21:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'bgwl',
    lastOperateTime: '2026-02-19 08:49:18',
  },
];

/** 船期查询行数据（新增弹窗-船舶信息，本轮无接口） */
export interface ShipSchedule {
  id: number;
  /** 中文船名 */
  shipNameCn: string;
  /** 出口航次 */
  exportVoyage: string;
  /** 英文船名 */
  shipNameEn: string;
  /** 挂靠码头 */
  berthTerminal: string;
  /** 进出口：I 进口 / E 出口 */
  ioType: 'E' | 'I';
  /** 船舶IMO号 */
  imo: string;
  /** 计划抵港时间 */
  planArrivalTime: string;
  /** 实际抵港时间 */
  actualArrivalTime: string;
  /** 抵港状态 */
  arrivalStatus: string;
  /** 靠泊泊位 */
  berth: string;
  /** 贸易类型 */
  tradeType: string;
}

/** 进出口文案映射 */
const IO_TYPE_TEXT: Record<string, string> = {
  I: '进口',
  E: '出口',
};

/** 新增弹窗-船期查询表单 */
export function useScheduleFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'arrivalStatus',
      label: '抵港状态',
      component: 'Select',
      defaultValue: '',
      componentProps: {
        allowClear: false,
        options: [
          { label: '全部', value: '' },
          { label: '预抵(P)', value: 'P' },
          { label: '已抵(A)', value: 'A' },
        ],
      },
    },
    {
      fieldName: 'planArrivalTime',
      label: '计划抵港时间',
      component: 'RangePicker',
      rules: 'required',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'shipNameCn',
      label: '中文船名',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入中文船名',
      },
    },
    {
      fieldName: 'shipNameEn',
      label: '英文船名',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入英文船名',
      },
    },
    {
      fieldName: 'importVoyage',
      label: '进口航次',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '进口航次',
      },
    },
    {
      fieldName: 'tradeType',
      label: '贸易类型',
      component: 'Select',
      defaultValue: '',
      componentProps: {
        allowClear: false,
        options: [
          { label: '全部', value: '' },
          { label: '内贸', value: 'domestic' },
          { label: '外贸', value: 'foreign' },
        ],
      },
    },
  ];
}

/** 装船新增弹窗-船期查询表单（出口航次） */
export function useLoadingScheduleFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'arrivalStatus',
      label: '抵港状态',
      component: 'Select',
      defaultValue: '',
      componentProps: {
        allowClear: false,
        options: [
          { label: '全部', value: '' },
          { label: '预抵(P)', value: 'P' },
          { label: '已抵(A)', value: 'A' },
        ],
      },
    },
    {
      fieldName: 'planArrivalTime',
      label: '计划抵港时间',
      component: 'RangePicker',
      rules: 'required',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'shipNameCn',
      label: '中文船名',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入中文船名',
      },
    },
    {
      fieldName: 'shipNameEn',
      label: '英文船名',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入英文船名',
      },
    },
    {
      fieldName: 'exportVoyage',
      label: '出口航次',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '出口航次',
      },
    },
    {
      fieldName: 'tradeType',
      label: '贸易类型',
      component: 'Select',
      defaultValue: '',
      componentProps: {
        allowClear: false,
        options: [
          { label: '全部', value: '' },
          { label: '内贸', value: 'domestic' },
          { label: '外贸', value: 'foreign' },
        ],
      },
    },
  ];
}

/** 卸船EDI新增弹窗-船期查询表单（通用航次） */
export function useEdiScheduleFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'arrivalStatus',
      label: '抵港状态',
      component: 'Select',
      defaultValue: '',
      componentProps: {
        allowClear: false,
        options: [
          { label: '全部', value: '' },
          { label: '预抵(P)', value: 'P' },
          { label: '已抵(A)', value: 'A' },
        ],
      },
    },
    {
      fieldName: 'planArrivalTime',
      label: '计划抵港时间',
      component: 'RangePicker',
      rules: 'required',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'shipNameCn',
      label: '中文船名',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入中文船名',
      },
    },
    {
      fieldName: 'shipNameEn',
      label: '英文船名',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入英文船名',
      },
    },
    {
      fieldName: 'voyage',
      label: '航次',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '航次',
      },
    },
    {
      fieldName: 'tradeType',
      label: '贸易类型',
      component: 'Select',
      defaultValue: '',
      componentProps: {
        allowClear: false,
        options: [
          { label: '全部', value: '' },
          { label: '内贸', value: 'domestic' },
          { label: '外贸', value: 'foreign' },
        ],
      },
    },
  ];
}

/** 卸船EDI船期查询假数据：2 条，进出口分别为进口/出口，对齐参考图 */
export const MOCK_EDI_SCHEDULE: ShipSchedule[] = [
  {
    id: 1,
    shipNameCn: '海安德尔',
    exportVoyage: '032S',
    shipNameEn: 'HAIAN DELL',
    berthTerminal: '',
    ioType: 'I',
    imo: 'UN9445007',
    planArrivalTime: '2026-02-11 08:49:18',
    actualArrivalTime: '2026-02-13 18:00:00',
    arrivalStatus: 'P',
    berth: '09',
    tradeType: '',
  },
  {
    id: 2,
    shipNameCn: '海安德尔',
    exportVoyage: '032N',
    shipNameEn: 'HAIAN DELL',
    berthTerminal: '',
    ioType: 'E',
    imo: 'UN9445007',
    planArrivalTime: '2026-02-11 08:49:18',
    actualArrivalTime: '2026-02-13 18:00:00',
    arrivalStatus: 'P',
    berth: '09',
    tradeType: '',
  },
];

/** 新增弹窗-船期查询表格列 */
export function useScheduleColumns(): VxeTableGridOptions<ShipSchedule>['columns'] {
  return [
    { type: 'radio', width: 40 },
    { type: 'seq', title: '序号', width: 60 },
    { field: 'shipNameCn', title: '中文船名', minWidth: 120 },
    { field: 'exportVoyage', title: '出口航次', minWidth: 100 },
    { field: 'shipNameEn', title: '英文船名', minWidth: 120 },
    { field: 'berthTerminal', title: '挂靠码头', minWidth: 100 },
    {
      field: 'ioType',
      title: '进出口',
      minWidth: 80,
      formatter: ({ cellValue }) => IO_TYPE_TEXT[cellValue] ?? cellValue,
    },
    { field: 'imo', title: '船舶IMO号', minWidth: 130 },
    {
      field: 'planArrivalTime',
      title: '计划抵港时间',
      minWidth: 170,
      formatter: 'formatDateTime',
    },
    {
      field: 'actualArrivalTime',
      title: '实际抵港时间',
      minWidth: 170,
      formatter: 'formatDateTime',
    },
    { field: 'arrivalStatus', title: '抵港状态', minWidth: 90 },
    { field: 'berth', title: '靠泊泊位', minWidth: 90 },
    { field: 'tradeType', title: '贸易类型', minWidth: 100 },
  ];
}

/** 船期查询假数据：2 条，对齐参考图 */
export const MOCK_SCHEDULE: ShipSchedule[] = [
  {
    id: 1,
    shipNameCn: '海安德尔',
    exportVoyage: '032S',
    shipNameEn: 'HAIAN DELL',
    berthTerminal: '',
    ioType: 'I',
    imo: 'UN9445007',
    planArrivalTime: '2026-02-11 08:49:18',
    actualArrivalTime: '2026-02-13 18:00:00',
    arrivalStatus: 'P',
    berth: '09',
    tradeType: '',
  },
  {
    id: 2,
    shipNameCn: '海安德尔',
    exportVoyage: '032N',
    shipNameEn: 'HAIAN DELL',
    berthTerminal: '',
    ioType: 'I',
    imo: 'UN9445007',
    planArrivalTime: '2026-02-11 08:49:18',
    actualArrivalTime: '2026-02-13 18:00:00',
    arrivalStatus: 'P',
    berth: '09',
    tradeType: '',
  },
];

/** 装船船期查询假数据：2 条，进出口为出口，对齐参考图 */
export const MOCK_LOADING_SCHEDULE: ShipSchedule[] = [
  {
    id: 1,
    shipNameCn: '海安德尔',
    exportVoyage: '032S',
    shipNameEn: 'HAIAN DELL',
    berthTerminal: '',
    ioType: 'E',
    imo: 'UN9445007',
    planArrivalTime: '2026-02-11 08:49:18',
    actualArrivalTime: '2026-02-13 18:00:00',
    arrivalStatus: 'P',
    berth: '09',
    tradeType: '',
  },
  {
    id: 2,
    shipNameCn: '海安德尔',
    exportVoyage: '032N',
    shipNameEn: 'HAIAN DELL',
    berthTerminal: '',
    ioType: 'E',
    imo: 'UN9445007',
    planArrivalTime: '2026-02-11 08:49:18',
    actualArrivalTime: '2026-02-13 18:00:00',
    arrivalStatus: 'P',
    berth: '09',
    tradeType: '',
  },
];

/** 卸货信息行数据（新增弹窗-卸货信息，本轮无接口） */
export interface CargoItem {
  id: number;
  /** 提运单号 */
  billNo: string;
  /** 集装箱总数 */
  containerCount: number;
  /** 货物名称 */
  cargoName: string;
  /** 总重 */
  totalWeight: number;
  /** 报关方式 */
  customsMode: string;
  /** 贸易类型 */
  tradeType: string;
}

/** 新增弹窗-卸货信息-提单号查询表单 */
export function useCargoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'billNo',
      label: '提单号',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入提单号',
      },
    },
  ];
}

/** 新增弹窗-卸货信息-表格列 */
export function useCargoColumns(): VxeTableGridOptions<CargoItem>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    { type: 'seq', title: '序号', width: 60 },
    { field: 'billNo', title: '提运单号', minWidth: 160 },
    { field: 'containerCount', title: '集装箱总数', minWidth: 100 },
    { field: 'cargoName', title: '货物名称', minWidth: 120 },
    { field: 'totalWeight', title: '总重', minWidth: 100 },
    { field: 'customsMode', title: '报关方式', minWidth: 120 },
    { field: 'tradeType', title: '贸易类型', minWidth: 100 },
  ];
}

/** 卸货信息前 5 条（对齐参考图） */
const CARGO_BASE: Omit<CargoItem, 'id'>[] = [
  {
    billNo: 'ZGSE26013006XM',
    containerCount: 4,
    cargoName: '纸卷',
    totalWeight: 29_880,
    customsMode: '钦州报关',
    tradeType: '外贸',
  },
  {
    billNo: 'ZGSE26020301XM_A',
    containerCount: 5,
    cargoName: '光伏玻璃',
    totalWeight: 30_000,
    customsMode: '钦州报关',
    tradeType: '外贸',
  },
  {
    billNo: 'NUCTSGJYG26X0077',
    containerCount: 2,
    cargoName: '陶土',
    totalWeight: 26_800,
    customsMode: '钦州报关',
    tradeType: '外贸',
  },
  {
    billNo: 'AJUJQCN260099420',
    containerCount: 3,
    cargoName: '豆油',
    totalWeight: 31_520,
    customsMode: '钦州报关',
    tradeType: '外贸',
  },
  {
    billNo: 'NLSCCQ260200377',
    containerCount: 1,
    cargoName: '钢砂',
    totalWeight: 26_487,
    customsMode: '舱单分流',
    tradeType: '外贸',
  },
];

/** 卸货信息假数据：55 条，前 5 条与参考图一致，其余循环填充以演示分页 */
export const MOCK_CARGO: CargoItem[] = Array.from({ length: 55 }, (_, i) => {
  const base = CARGO_BASE[i % CARGO_BASE.length]!;
  return {
    ...base,
    id: i + 1,
    billNo: i < 5 ? base.billNo : `${base.billNo}-${i + 1}`,
  };
});

/** 回执记录行数据（查看回执弹窗，本轮无接口） */
export interface ReceiptRecord {
  id: number;
  /** 回执编号 */
  receiptNo: string;
  /** 回执结果状态：success 新增成功 / error 新增失败 */
  resultStatus: 'error' | 'success';
  /** 回执时间 */
  receiptTime: string;
  /** 成功数量 */
  successCount: number;
  /** 总数量 */
  totalCount: number;
  /** 回执内容（失败时为详细错误说明） */
  content: string;
  /** 备注信息 */
  remark: string;
}

/** 回执结果状态色值：新增成功(绿)/新增失败(红) */
export const RECEIPT_RESULT_COLOR: Record<string, string> = {
  success: '#0c8918',
  error: '#f53f3f',
};

/** 回执结果状态文案 */
export const RECEIPT_RESULT_TEXT: Record<string, string> = {
  success: '新增成功',
  error: '新增失败',
};

/** 查看回执弹窗-表格列 */
export function useReceiptColumns(): VxeTableGridOptions<ReceiptRecord>['columns'] {
  return [
    { type: 'seq', title: '序号', width: 60 },
    { field: 'receiptNo', title: '回执编号', minWidth: 180 },
    {
      field: 'resultStatus',
      title: '回执状态',
      width: 100,
      slots: { default: 'resultStatus' },
    },
    {
      field: 'receiptTime',
      title: '回执时间',
      width: 170,
      formatter: 'formatDateTime',
    },
    {
      field: 'successTotal',
      title: '成功/总数',
      width: 100,
      formatter: ({ row }) => `${row.successCount}/${row.totalCount}`,
    },
    {
      field: 'content',
      title: '回执内容',
      minWidth: 420,
      showOverflow: false,
      slots: { default: 'content' },
    },
    { field: 'remark', title: '备注信息', minWidth: 120 },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 查看回执假数据：2 条，对齐参考图（成功 + 失败） */
export const MOCK_RECEIPT: ReceiptRecord[] = [
  {
    id: 1,
    receiptNo: '2021390507170664449',
    resultStatus: 'success',
    receiptTime: '2026-02-11 09:07:17',
    successCount: 400,
    totalCount: 400,
    content: '',
    remark: '',
  },
  {
    id: 2,
    receiptNo: '2021386108289486849',
    resultStatus: 'error',
    receiptTime: '2026-02-11 08:49:50',
    successCount: 393,
    totalCount: 400,
    content:
      'UETU2845230-ERR-53: 未找到二程船名/航次, CAAU2177000-ERR-53: 未找到二程船名/航次, SITU2795990-ERR-53: 未找到二程船名/航次, SEGU3337798-ERR-68: 该箱号的二程船名航次没有绑定这个卸货港, 请检查卸货港与该航次是否匹配, SEGU3341294-ERR-68: 该箱号的二程船名航次没有绑定这个卸货港, 请检查卸货港与该航次是否匹配, KKTU8174320-ERR-68: 该箱号的二程船名航次没有绑定这个卸货港, 请检查卸货港与该航次是否匹配, SITU2779957-ERR-68: 该箱号的二程船名航次没有绑定这个卸货港, 请检查卸货港与该航次是否匹配。',
    remark: '',
  },
];

/** 卸船 EDI 回执行数据（查看回执弹窗，本轮无接口） */
export interface EdiReceiptRecord {
  id: number;
  /** EDI 文件 ID */
  ediFileId: string;
  /** TOS 系统生成的内部文件名 */
  tosFileName: string;
  /** 回执时间 */
  receiptTime: string;
  /** 备注 */
  remark: string;
  /** 成功数量 */
  successCount: number;
  /** 总数量 */
  totalCount: number;
  /** 回执处理状态 */
  status: 'allFailed' | 'allSuccess' | 'fileError' | 'partialSuccess';
}

/** 卸船 EDI 回执状态色值 */
export const EDI_RECEIPT_STATUS_COLOR: Record<
  EdiReceiptRecord['status'],
  string
> = {
  allSuccess: '#00b42a',
  partialSuccess: '#ff7d00',
  allFailed: '#f53f3f',
  fileError: '#f53f3f',
};

/** 卸船 EDI 回执状态文案 */
export const EDI_RECEIPT_STATUS_TEXT: Record<
  EdiReceiptRecord['status'],
  string
> = {
  allSuccess: '全部成功',
  partialSuccess: '部分成功',
  allFailed: '全部失败',
  fileError: 'EDI文件错误',
};

/** 卸船 EDI 查看回执弹窗-表格列 */
export function useEdiReceiptColumns(): VxeTableGridOptions<EdiReceiptRecord>['columns'] {
  return [
    { field: 'ediFileId', title: 'EDI文件id', minWidth: 180 },
    { field: 'tosFileName', title: 'TOS内部的文件名', minWidth: 380 },
    { field: 'receiptTime', title: '回执时间', minWidth: 190 },
    { field: 'remark', title: '备注', minWidth: 200 },
    {
      field: 'successTotal',
      title: '成功/总数',
      width: 120,
      formatter: ({ row }) => `${row.successCount}/${row.totalCount}`,
    },
    {
      field: 'status',
      title: '状态',
      width: 120,
      slots: { default: 'status' },
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 卸船 EDI 查看回执假数据：5 条，对齐参考图 */
export const MOCK_EDI_RECEIPT: EdiReceiptRecord[] = [
  {
    id: 1,
    ediFileId: '1770717321338',
    tosFileName: 'D2602100000036447_MSC_LAX_BAPLI.txt',
    receiptTime: '2026/02/10 17:57:18',
    remark: '',
    successCount: 439,
    totalCount: 439,
    status: 'allSuccess',
  },
  {
    id: 2,
    ediFileId: '1770717321338',
    tosFileName: 'D2602100000036447_MSC_LAX_BAPLI.txt',
    receiptTime: '2026/02/10 16:57:18',
    remark: '',
    successCount: 438,
    totalCount: 439,
    status: 'partialSuccess',
  },
  {
    id: 3,
    ediFileId: '1770717321338',
    tosFileName: 'D2602100000036447_MSC_LAX_BAPLI.txt',
    receiptTime: '2026/02/10 15:57:18',
    remark: '',
    successCount: 438,
    totalCount: 439,
    status: 'partialSuccess',
  },
  {
    id: 4,
    ediFileId: '1770717321338',
    tosFileName: 'D2602100000036447_MSC_LAX_BAPLI.txt',
    receiptTime: '2026/02/10 14:57:18',
    remark: '',
    successCount: 438,
    totalCount: 439,
    status: 'allFailed',
  },
  {
    id: 5,
    ediFileId: '1770717321338',
    tosFileName: 'D2602100000036447_MSC_LAX_BAPLI.txt',
    receiptTime: '2026/02/10 13:57:18',
    remark: '',
    successCount: 438,
    totalCount: 439,
    status: 'fileError',
  },
];

/** 卸船 EDI 单次回执详情行数据 */
export interface EdiReceiptDetailRecord {
  id: number;
  /** 箱号 */
  containerNo: string;
  /** 报错详情 */
  errorDetail: string;
  /** 报错在 EDI 原文中的位置 */
  errorPosition: string;
}

/** 卸船 EDI 回执详情弹窗-表格列 */
export function useEdiReceiptDetailColumns(): VxeTableGridOptions<EdiReceiptDetailRecord>['columns'] {
  return [
    { field: 'containerNo', title: '箱号', minWidth: 180 },
    { field: 'errorDetail', title: '报错详情', minWidth: 420 },
    { field: 'errorPosition', title: '报错位置', minWidth: 190 },
  ];
}

/** 卸船 EDI 回执详情假数据：对齐参考图中的 5 条箱记录 */
export const MOCK_EDI_RECEIPT_DETAIL: EdiReceiptDetailRecord[] = [
  'CAIU4538125',
  'CAIU4547678',
  'CICU6299359',
  'CICU6300974',
  'CAIU4736938',
].map((containerNo, index) => ({
  id: index + 1,
  containerNo,
  errorDetail: '持箱人不匹配，请核实后联系计划',
  errorPosition: '+++++++ZGL+',
}));

/** 前端假数据：6 条，覆盖提交状态 2 色 + 回执状态 3 色 */
export const MOCK_DISCHARGE: DischargeManifest[] = [
  {
    id: 1,
    shipCallSign: 'CN2020276074',
    shipNameCn: '华信长荣',
    importVoyage: '2601S',
    submitTime: '2026-02-11 09:21:00',
    submitStatus: 1,
    receiptStatus: 'none',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-11 08:49:18',
  },
  {
    id: 2,
    shipCallSign: 'SUIGANGHANG',
    shipNameCn: '穗港航5001',
    importVoyage: '2601S',
    submitTime: '2026-02-11 09:21:00',
    submitStatus: 1,
    receiptStatus: 'error',
    lastOperator: 'bgwl',
    lastOperateTime: '2026-02-11 08:49:18',
  },
  {
    id: 3,
    shipCallSign: 'UN9384899',
    shipNameCn: '海丰神龙',
    importVoyage: '2601S',
    submitTime: '2026-02-10 09:21:00',
    submitStatus: 1,
    receiptStatus: 'none',
    lastOperator: 'xhf1',
    lastOperateTime: '2026-02-10 08:49:18',
  },
  {
    id: 4,
    shipCallSign: 'UN8356405',
    shipNameCn: '恒辉',
    importVoyage: '2601S',
    submitTime: '2026-02-10 08:21:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-10 08:49:18',
  },
  {
    id: 5,
    shipCallSign: 'HJQ888',
    shipNameCn: '惠金桥888',
    importVoyage: '2601S',
    submitTime: '2026-02-09 09:21:00',
    submitStatus: 0,
    receiptStatus: 'success',
    lastOperator: 'xhf2',
    lastOperateTime: '2026-02-10 08:49:18',
  },
  {
    id: 6,
    shipCallSign: 'UN9220304',
    shipNameCn: '海丰邦卡',
    importVoyage: '2601S',
    submitTime: '2026-02-09 09:21:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-19 08:49:18',
  },
];

/** 卸船EDI假数据：17 条，对齐参考图，覆盖提交状态 2 色 + 回执状态 3 色 */
export const MOCK_EDI: DischargeManifest[] = [
  {
    id: 1,
    shipCallSign: 'CN2020276074',
    shipNameCn: '华信长荣',
    importVoyage: '2601S',
    submitTime: '2026-02-11 09:21:00',
    submitStatus: 1,
    receiptStatus: 'none',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-11 08:49:18',
  },
  {
    id: 2,
    shipCallSign: 'SUIGANGHANG',
    shipNameCn: '穗港航5001',
    importVoyage: '2601S',
    submitTime: '2026-02-11 09:21:00',
    submitStatus: 1,
    receiptStatus: 'error',
    lastOperator: 'bgwl',
    lastOperateTime: '2026-02-11 08:49:18',
  },
  {
    id: 3,
    shipCallSign: 'UN9384899',
    shipNameCn: '海丰神龙',
    importVoyage: '2601S',
    submitTime: '2026-02-10 09:21:00',
    submitStatus: 0,
    receiptStatus: 'none',
    lastOperator: 'xhf1',
    lastOperateTime: '2026-02-10 08:49:18',
  },
  {
    id: 4,
    shipCallSign: 'UN8356405',
    shipNameCn: '恒辉',
    importVoyage: '2601S',
    submitTime: '2026-02-10 08:21:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-10 08:49:18',
  },
  {
    id: 5,
    shipCallSign: 'UN9445007',
    shipNameCn: '海安德尔',
    importVoyage: '2601S',
    submitTime: '2026-02-10 08:21:00',
    submitStatus: 1,
    receiptStatus: 'none',
    lastOperator: 'bgwl',
    lastOperateTime: '2026-02-10 08:49:18',
  },
  {
    id: 6,
    shipCallSign: 'HJQ888',
    shipNameCn: '惠金桥888',
    importVoyage: '2601S',
    submitTime: '2026-02-09 09:21:00',
    submitStatus: 0,
    receiptStatus: 'success',
    lastOperator: 'xhf2',
    lastOperateTime: '2026-02-10 08:49:18',
  },
  {
    id: 7,
    shipCallSign: 'UN9220304',
    shipNameCn: '海丰邦卡',
    importVoyage: '2601S',
    submitTime: '2026-02-09 09:21:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 8,
    shipCallSign: 'CN20257012106',
    shipNameCn: '安洋188',
    importVoyage: '2601S',
    submitTime: '2026-02-09 09:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'bgwl',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 9,
    shipCallSign: 'UN9149823',
    shipNameCn: '海陆菲尼克斯',
    importVoyage: '2601S',
    submitTime: '2026-02-09 09:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'xhf3',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 10,
    shipCallSign: 'UN9943683',
    shipNameCn: '海丰同和',
    importVoyage: '2601S',
    submitTime: '2026-02-09 09:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 11,
    shipCallSign: 'CN20173469167',
    shipNameCn: '惠金桥289',
    importVoyage: '2601S',
    submitTime: '2026-02-07 07:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'bgwl',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 12,
    shipCallSign: 'UN9159309',
    shipNameCn: '东宏号',
    importVoyage: '2601S',
    submitTime: '2026-02-07 07:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'xhf4',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 13,
    shipCallSign: 'NONE',
    shipNameCn: '华锦润洋',
    importVoyage: '2601S',
    submitTime: '2026-02-07 07:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 14,
    shipCallSign: 'UN9948865',
    shipNameCn: '德翔连云港',
    importVoyage: '2601S',
    submitTime: '2026-02-07 07:30:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'bgwl',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 15,
    shipCallSign: 'CN2020276074',
    shipNameCn: '华信长荣',
    importVoyage: '2554S',
    submitTime: '2026-02-07 07:21:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'xhf5',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 16,
    shipCallSign: 'CN2015386367',
    shipNameCn: '新明州76',
    importVoyage: '2509S',
    submitTime: '2026-02-07 07:21:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'mahaiyang',
    lastOperateTime: '2026-02-19 08:49:18',
  },
  {
    id: 17,
    shipCallSign: 'CN20206749264',
    shipNameCn: '惠金桥293',
    importVoyage: '2511S',
    submitTime: '2026-02-07 07:21:00',
    submitStatus: 1,
    receiptStatus: 'success',
    lastOperator: 'bgwl',
    lastOperateTime: '2026-02-19 08:49:18',
  },
];
