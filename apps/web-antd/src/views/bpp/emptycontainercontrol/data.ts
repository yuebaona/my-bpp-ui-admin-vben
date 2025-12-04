import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DescriptionItemSchema } from '#/components/description';

import { getDictDataPage } from '#/api/system/dict/data/index.ts';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
// import { z } from '#/adapter/form';
import { getRangePickerDefaultProps } from '#/utils';

const bppBaseDict = bppBaseDictStore();

// 预加载需要的字典数据
const loadDictData = async (dictTypes: string[]) => {
  for (const dictType of dictTypes) {
    bppBaseDict.setBppBaseDictCacheByData(
      (
        await getDictDataPage({
          dictType,
          pageNo: 1,
          pageSize: 100,
        })
      ).list,
      dictType,
    );
  }
};
loadDictData([
  'empty_container_control_main_status',
  'empty_container_control_sub_status',
  'trade_type',
]);

// 定义受理状态选项配置
function getPlanStatusOptions(type: string) {
  const dictOptions = bppBaseDict.getBppBaseDictOptions(type) || [];

  // 将字典数据转换为 CellTag 需要的格式
  return dictOptions.map((option) => ({
    value: option.value,
    label: option.label,
    color: option.colorType,
  }));
}

/** 箱区范围字段 */
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

export function mainPlanFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'mainId',
      label: '主计划号',
      component: 'Input',
      componentProps: {
        placeholder: '系统自动生成',
        allowClear: true,
        disabled: true,
      },
    },
    {
      fieldName: 'isRelease',
      label: '是否放箱',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
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
      fieldName: 'owners',
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
          { label: '内贸', value: 'DOMESTIC' },
          { label: '外贸', value: 'FOREIGN' },
        ],
      },
    },
    {
      fieldName: 'isoNos',
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

export function subPlanFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'planNo',
      label: '子计划号',
      component: 'Input',
      componentProps: {
        placeholder: '系统自动生成',
        allowClear: true,
        disabled: true,
      },
    },
    {
      fieldName: 'isRelease',
      label: '是否放箱',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
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
      fieldName: 'dischargeVesselSchedule',
      label: '卸船船期',
      component: 'Input',
      componentProps: {
        placeholder: '请输入卸船船期',
        allowClear: true,
      },
    },
    {
      fieldName: 'owners',
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
          { label: '内贸', value: 'DOMESTIC' },
          { label: '外贸', value: 'FOREIGN' },
        ],
      },
    },
    {
      fieldName: 'isoNos',
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
export function PlanSearchFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'planNo',
      label: '主计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入主计划号',
        allowClear: true,
      },
    },
    {
      fieldName: 'importVoyageNo',
      label: '进口航次',
      component: 'Input',
      componentProps: {
        placeholder: '请输入进口航次',
        allowClear: true,
      },
    },
    {
      fieldName: 'bayRangeList',
      label: '箱区',
      component: 'Input',
      componentProps: {
        placeholder: '格式：箱区-排，例如：B1-02',
        allowClear: true,
      },
    },
    {
      fieldName: 'tradeType',
      label: '贸易类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择贸易类型',
        allowClear: true,
        options: [
          { label: '内贸', value: 'DOMESTIC' },
          { label: '外贸', value: 'FOREIGN' },
        ],
      },
    },
    {
      fieldName: 'ownerList',
      label: '持箱人',
      component: 'Input',
      componentProps: {
        placeholder: '多个持箱人用英文逗号分隔',
        allowClear: true,
      },
    },
    {
      fieldName: 'isoNoList',
      label: 'ISO',
      component: 'Input',
      componentProps: {
        placeholder: '多个ISO用英文逗号分隔',
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
      fieldName: 'pickupPlanNo',
      label: '受理提箱计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入受理提箱计划号',
        allowClear: true,
      },
    },
  ];
}

/** 主计划字段 */
export function mainPlanColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    { type: 'checkbox', width: 40, fixed: 'left' },
    {
      field: 'planNo',
      title: '主计划号',
      minWidth: 120,
      fixed: 'left',
    },
    {
      field: 'planStatus',
      title: '状态',
      minWidth: 100,
      cellRender: {
        name: 'CellTagDict',
        options: getPlanStatusOptions('empty_container_control_main_status'),
      },
    },
    {
      field: 'isRelease',
      title: '是否放箱(Y/N)',
      minWidth: 150,
    },
    {
      field: 'pickupPlanNo',
      title: '提箱受理计划号',
      minWidth: 120,
    },
    {
      field: 'owners',
      title: '持箱人',
      minWidth: 120,
    },
    {
      field: 'tradeType',
      title: '贸易类型',
      minWidth: 100,
      cellRender: {
        name: 'CellTagDict',
        options: getPlanStatusOptions('trade_type'),
      },
    },
    {
      field: 'isoNos',
      title: 'ISO',
      minWidth: 120,
    },
    {
      field: 'bayRanges',
      title: '箱区范围',
      minWidth: 120,
    },
    {
      field: 'planQuantity',
      title: '计划箱量',
      minWidth: 120,
    },
    {
      field: 'mainGateReleaseQuantity',
      title: '主闸可放箱量',
      minWidth: 120,
    },
    {
      field: 'completedReleaseQuantity',
      title: '已放箱量',
      minWidth: 120,
    },
    {
      field: 'uncompletedReleaseQuantity',
      title: '未放箱量',
      minWidth: 120,
    },
    {
      field: 'activeOccupiedQuantity',
      title: '作业中占用箱量',
      minWidth: 120,
    },
    {
      field: 'specifiedPickupOccupiedQuantity',
      title: '指定提箱占用箱量',
      minWidth: 120,
    },
    {
      field: 'interGateOccupiedQuantity',
      title: '互拖闸占用箱量',
      minWidth: 120,
    },
    {
      field: 'holdOccupiedQuantity',
      title: '扣留占用箱量',
      minWidth: 100,
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 110,
    },
    {
      field: 'updater',
      title: '修改人',
      minWidth: 100,
    },
    {
      field: 'updateTime',
      title: '修改时间',
      minWidth: 100,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 子计划字段 */
export function subPlanColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    { type: 'checkbox', width: 40, fixed: 'left' },
    {
      field: 'planNo',
      title: '子计划号',
      minWidth: 120,
      fixed: 'left',
    },
    {
      field: 'planStatus',
      title: '状态',
      minWidth: 100,
      cellRender: {
        name: 'CellTagDict',
        options: getPlanStatusOptions('empty_container_control_sub_status'),
      },
    },
    {
      field: 'isRelease',
      title: '是否放箱(Y/N)',
      minWidth: 150,
    },
    {
      field: 'pickupPlanNo',
      title: '提箱受理计划号',
      minWidth: 120,
    },
    {
      field: 'dischargeVesselSchedule',
      title: '卸船船期',
      minWidth: 120,
    },
    {
      field: 'tradeType',
      title: '贸易类型',
      minWidth: 100,
      cellRender: {
        name: 'CellTagDict',
        options: getPlanStatusOptions('trade_type'),
      },
    },
    {
      field: 'owners',
      title: '持箱人',
      minWidth: 120,
    },
    {
      field: 'isoNos',
      title: 'ISO',
      minWidth: 120,
    },
    {
      field: 'bayRanges',
      title: '箱区范围',
      minWidth: 120,
    },
    {
      field: 'planQuantity',
      title: '计划箱量',
      minWidth: 120,
    },
    {
      field: 'mainGateReleaseQuantity',
      title: '主闸可放箱量',
      minWidth: 120,
    },
    {
      field: 'completedReleaseQuantity',
      title: '已放箱量',
      minWidth: 120,
    },
    {
      field: 'uncompletedReleaseQuantity',
      title: '未放箱量',
      minWidth: 120,
    },
    {
      field: 'activeOccupiedQuantity',
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

/** 主计划详情字段 */
export function mainPlanDetailSchema(): DescriptionItemSchema[] {
  return [
    // 基础信息
    { field: 'planNo', label: '主计划号' },
    { field: 'planStatus', label: '状态' },
    { field: 'isRelease', label: '是否放箱' },
    { field: 'pickupPlanNo', label: '提箱受理计划号' },
    { field: 'owners', label: '持箱人' },
    { field: 'tradeType', label: '贸易类型' },
    { field: 'isoNos', label: 'ISO' },
    { field: 'bayRanges', label: '箱区范围' },
    { field: 'planQuantity', label: '计划箱量' },
    { field: 'completedReleaseQuantity', label: '已放箱量' },
    { field: 'mainGateReleaseQuantity', label: '主闸可放箱量' },
    { field: 'uncompletedReleaseQuantity', label: '未放箱量' },
    { field: 'activeOccupiedQuantity', label: '作用中占用箱量' },
    { field: 'specifiedPickupOccupiedQuantity', label: '指定提箱占用箱量' },
    { field: 'interGateOccupiedQuantity', label: '互拖闸占用箱量' },
    { field: 'holdOccupiedQuantity', label: '扣留占用箱量' },
  ];
}

/** 子计划详情字段 */
// export function subPlanDetailSchema(): DescriptionItemSchema[] {
//   return [
//     // 基础信息
//     { field: 'acceptancePlanNo', label: '子计划号' },
//     { field: 'applicantCompanyName', label: '申请公司名称' },
//     { field: 'handlingPerson', label: '经办人' },
//     { field: 'handlingPhoneNumber', label: '经办人联系电话' },
//     { field: 'paymentTypeSea', label: '缴费方式（海侧）' },
//     { field: 'payerCodeSea', label: '缴费方（海侧）' },
//     { field: 'paymentTypeGate', label: '缴费方式（陆侧）' },
//     { field: 'payerCodeGate', label: '缴费方（陆侧）' },
//     { field: 'category', label: '进出口类别' },
//     { field: 'vesselName', label: '作业船名（中文名称）' },
//     { field: 'vesselVoyage', label: '作业航次' },
//     { field: 'plannedOperationTime', label: '预计作业时间' },
//   ]
// }

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
      fieldName: 'owners',
      label: '持箱人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入持箱人',
        allowClear: true,
      },
    },
    {
      fieldName: 'isoNos',
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
      field: 'owners',
      title: '持箱人',
      minWidth: 120,
    },
    {
      field: 'tradeType',
      title: '贸易类型',
      minWidth: 100,
    },
    {
      field: 'isoNos',
      title: 'ISO',
      minWidth: 100,
    },
    {
      field: 'bayRanges',
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
    planNo: 'SP20230001',
    planStatus: '已提交',
    isRelease: true,
    pickupPlanNo: 'TXSLJH2023001',
    dischargeVesselSchedule: '2023-12-01',
    tradeType: 'FOREIGN',
    owners: '持箱人A',
    isoNos: 'ISO001',
    bayRanges: 'A01-B02',
    planQuantity: '100',
    mainGateReleaseQuantity: '80',
    completedReleaseQuantity: '60',
    uncompletedReleaseQuantity: '40',
    activeOccupiedQuantity: '20',
    creator: '管理员',
    createTime: '2023-11-01 10:00:00',
    updater: '修改人A',
    updateTime: '2023-11-01 15:00:00',
  },
  {
    id: 2,
    planNo: 'SP20230002',
    planStatus: '审核中',
    isRelease: false,
    pickupPlanNo: 'TXSLJH2023002',
    dischargeVesselSchedule: '2023-12-02',
    tradeType: 'DOMESTIC',
    owners: '持箱人B',
    isoNos: 'ISO002',
    bayRanges: 'C01-D02',
    planQuantity: '200',
    mainGateReleaseQuantity: '150',
    completedReleaseQuantity: '100',
    uncompletedReleaseQuantity: '50',
    activeOccupiedQuantity: '30',
    creator: '操作员',
    createTime: '2023-11-02 10:00:00',
    updater: '修改人B',
    updateTime: '2023-11-02 15:00:00',
  },
];

export const STATIC_SUB_PLAN_DETAIL_DATA = {
  id: 61,
  planNo: 'SP20230001',
  isRelease: true,
  pickupPlanNo: '测试经办人',
  dischargeVesselSchedule: '13800138000',
  owners: '在线支付',
  tradeType: 'DOMESTIC',
  isoNos: 'ISO003',
  planQuantity: '200',
};

export const STATIC_MASTER_PLAN_QUERY_DATA = [
  {
    id: 1,
    mainPlanNo: 'MP20230001',
    isRelease: true,
    acceptancePlanNo: '137635841765',
    owners: '李三',
    tradeType: 'FOREIGN',
    isoNos: 'ISO001',
    bayRanges: 'A01-B02',
    mainGateReleaseQty: '100',
    modifier: '管理员',
    modifyTime: '2023-11-01 10:00:00',
    modifyType: '修改类型A',
  },
  {
    id: 2,
    mainPlanNo: 'MP20230002',
    isRelease: false,
    acceptancePlanNo: '71326815685',
    owners: '张三',
    tradeType: 'FOREIGN',
    isoNos: 'ISO002',
    bayRanges: 'C01-D02',
    mainGateReleaseQty: '100',
    modifier: '操作员',
    modifyTime: '2023-11-02 10:00:00',
    modifyType: '修改类型B',
  },
];
