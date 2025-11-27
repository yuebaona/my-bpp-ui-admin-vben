import type { VbenFormSchema } from '#/adapter/form'
import type { VxeTableGridOptions } from '#/adapter/vxe-table'
import type { DescriptionItemSchema } from '#/components/description'

// import { z } from '#/adapter/form';
import { getRangePickerDefaultProps } from '#/utils';


export function containerAreaRangeColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'checkbox',
      width: 40,
    },
    {
      title: '堆场贝位',
      field: 'yardPosition',
      minWidth: 150,
      editRender: { name: 'input' },
    },
    {
      title: '堆场列',
      field: 'yardColumns',
      minWidth: 200,
      slots: { default: 'yardColumns', edit: 'yardColumns' },
    },
    {
      title: '总数（当前可用量）',
      field: 'totalCount',
      minWidth: 150,
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '最低准存天数 ♦ ▽ ◁',
      field: 'minStorageDays',
      minWidth: 150,
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '最高准存天数 ♦ ▽ ◁',
      field: 'maxStorageDays',
      minWidth: 150,
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '操作',
      minWidth: 100,
      slots: { default: 'actions' },
      fixed: 'right',
    },
  ];
}

export function subPlanFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'subPlanNo',
      label: '子计划号',
      component: 'Input',
      componentProps: {
        placeholder: '系统自动生成',
        allowClear: true,
        disabled: true,
      },
    },
    {
      fieldName: 'placeContainer',
      label: '是否放箱',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: 'Y' },
          { label: '否（N）', value: 'N' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'pickupPlanNo',
      label: '提箱受理计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入提箱受理计划号',
        allowClear: true,
      },
    },
    {
      fieldName: 'unloadingSchedule',
      label: '卸船船期',
      component: 'Input',
      componentProps: {
        placeholder: '请输入卸船船期',
        allowClear: true,
      },
    },
    {
      fieldName: 'containerHolder',
      label: '持箱人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入持箱人，可多条',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'tradeType',
      label: '贸易类型',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '内贸', value: 'neimao' },
          { label: '外贸', value: 'waimao' },
        ],
      },
    },
    {
      fieldName: 'iso',
      label: 'ISO',
      component: 'Input',
      componentProps: {
        placeholder: '请输入ISO，可多条',
      },
      rules: 'required',
    },
    {
      fieldName: 'containerAreaRange',
      label: '箱区范围',
      component: 'Input',
      renderComponentContent: () => {
        return {
          default: () => null,
        };
      },
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'planQuantity',
      label: '计划箱量',
      component: 'Input',
      componentProps: {
        placeholder: '请输入计划箱量',
        allowClear: true,
      },
    },
  ];
}
/** 空箱空箱列表的搜索栏 */
export function acceptancePlanOvrOprFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'acceptancePlanNo',
      label: '主计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入主计划号',
        allowClear: true,
      },
    },
    {
      fieldName: 'vesselName',
      label: '进口航次',
      component: 'Input',
      componentProps: {
        placeholder: '请输入进口航次',
        allowClear: true,
      },
    },
    {
      fieldName: 'vesselVoyage',
      label: '箱区',
      component: 'Input',
      componentProps: {
        placeholder: '请输入箱区',
        allowClear: true,
      },
    },
    {
      fieldName: 'billNo',
      label: '贸易类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入贸易类型',
        allowClear: true,
      },
    },
    {
      fieldName: 'applicantCompanyName',
      label: '持箱人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入持箱人',
        allowClear: true,
      },
    },
    {
      fieldName: 'containerNo',
      label: 'ISO',
      component: 'Input',
      componentProps: {
        placeholder: '请输ISO',
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'TimeRangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'PlanNO',
      label: '受理提箱计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入受理提箱计划号',
        allowClear: true,
      },
    },
  ];
}

/** 子计划列表的字段 */
export function subPlanColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'subPlanNo',
      title: '子计划号',
      minWidth: 120,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 150,
    },
    {
      field: 'placeContainer',
      title: '是否放箱(Y/N)',
      minWidth: 150,
    },
    {
      field: 'pickupPlanNo',
      title: '提箱受理计划号',
      minWidth: 120,
    },
    {
      field: 'unloadingSchedule',
      title: '卸船船期',
      minWidth: 100,
    },
    {
      field: 'tradeType',
      title: '贸易类型',
      minWidth: 100,
    },
    {
      field: 'containerHolder',
      title: '持箱人',
      minWidth: 120,
    },
    {
      field: 'iso',
      title: 'ISO',
      minWidth: 120,
    },
    {
      field: 'containerAreaRange',
      title: '箱区范围',
      minWidth: 120,
    },
    {
      field: 'planQuantity',
      title: '计划箱量',
      minWidth: 120,
    },
    {
      field: 'mainGateAvailableSlot',
      title: '主闸可放箱量',
      minWidth: 120,
    },
    {
      field: 'usedSlots',
      title: '已放箱量',
      minWidth: 120,
    },
    {
      field: 'availableSlots',
      title: '未放箱量',
      minWidth: 120,
    },
    {
      field: 'slotsInOperation',
      title: '作业中占用箱量',
      minWidth: 120,
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 150,
    },
    {
      field: 'updater',
      title: '修改人',
      minWidth: 100,
    },
    {
      field: 'updateTime',
      title: '修改时间',
      minWidth: 150,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
// 子计划详情字段
export function subPlanDetailSchema(): DescriptionItemSchema[] {
  return [
    // 基础信息
    { field: 'acceptancePlanNo', label: '子计划号' },
    { field: 'applicantCompanyName', label: '申请公司名称' },
    { field: 'handlingPerson', label: '经办人' },
    { field: 'handlingPhoneNumber', label: '经办人联系电话' },
    { field: 'paymentTypeSea', label: '缴费方式（海侧）' },
    { field: 'payerCodeSea', label: '缴费方（海侧）' },
    { field: 'paymentTypeGate', label: '缴费方式（陆侧）' },
    { field: 'payerCodeGate', label: '缴费方（陆侧）' },
    { field: 'category', label: '进出口类别' },
    { field: 'vesselName', label: '作业船名（中文名称）' },
    { field: 'vesselVoyage', label: '作业航次' },
    { field: 'plannedOperationTime', label: '预计作业时间' },
  ]
}

/** 日志查询表单 */
export function logQueryFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'mainPlanNo',
      label: '主计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入主计划号',
        allowClear: true,
      },
    },
    {
      fieldName: 'containerHolder',
      label: '持箱人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入持箱人',
        allowClear: true,
      },
    },
    {
      fieldName: 'iso',
      label: 'ISO',
      component: 'Input',
      componentProps: {
        placeholder: '请输入ISO',
        allowClear: true,
      },
    },
    {
      fieldName: 'containerArea',
      label: '箱区',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 日志查询列表字段 */
export function logQueryColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: '序号',
      type: 'seq',
      width: 60,
      align: 'center',
    },
    {
      field: 'mainPlanNo',
      title: '主计划号',
      minWidth: 120,
    },
    {
      field: 'isRelease',
      title: '是否放箱(Y/N)',
      minWidth: 120,
    },
    {
      field: 'acceptancePlanNo',
      title: '提箱受理计划号',
      minWidth: 150,
    },
    {
      field: 'containerHolder',
      title: '持箱人',
      minWidth: 120,
    },
    {
      field: 'tradeType',
      title: '贸易类型',
      minWidth: 100,
    },
    {
      field: 'iso',
      title: 'ISO',
      minWidth: 100,
    },
    {
      field: 'containerAreaRange',
      title: '箱区范围',
      minWidth: 120,
    },
    {
      field: 'mainGateReleaseQty',
      title: '主闸可放箱量',
      minWidth: 120,
    },
    {
      field: 'modifier',
      title: '修改人',
      minWidth: 100,
    },
    {
      field: 'modifyTime',
      title: '修改时间',
      minWidth: 150,
    },
    {
      field: 'modifyType',
      title: '修改类型',
      minWidth: 100,
    },
  ];
}


export const STATIC_SUB_PLAN_LIST_DATA = [
  {
    id: 1,
    subPlanNo: 'SP20230001',
    status: '已提交',
    placeContainer: 'Y',
    pickupPlanNo: 'TXSLJH2023001',
    unloadingSchedule: '2023-12-01',
    tradeType: '内贸',
    containerHolder: '持箱人A',
    iso: 'ISO001',
    containerAreaRange: 'A01-B02',
    planQuantity: '100',
    mainGateAvailableSlot: '80',
    usedSlots: '60',
    availableSlots: '40',
    slotsInOperation: '20',
    creator: '管理员',
    createTime: '2023-11-01 10:00:00',
    updater: '修改人A',
    updateTime: '2023-11-01 15:00:00'
  },
  {
    id: 2,
    subPlanNo: 'SP20230002',
    status: '审核中',
    placeContainer: 'N',
    pickupPlanNo: 'TXSLJH2023002',
    unloadingSchedule: '2023-12-02',
    tradeType: '外贸',
    containerHolder: '持箱人B',
    iso: 'ISO002',
    containerAreaRange: 'C01-D02',
    planQuantity: '200',
    mainGateAvailableSlot: '150',
    usedSlots: '100',
    availableSlots: '50',
    slotsInOperation: '30',
    creator: '操作员',
    createTime: '2023-11-02 10:00:00',
    updater: '修改人B',
    updateTime: '2023-11-02 15:00:00'
  }
];

export const STATIC_SUB_PLAN_DETAIL_DATA = {
  id: 61,
  subPlanNo: 'SP20230001',
  placeContainer: 'Y',
  pickupPlanNo: '测试经办人',
  unloadingSchedule: '13800138000',
  containerHolder: '在线支付',
  tradeType: 'neimao',
  iso: 'ISO003',
  planQuantity: '200',
};

