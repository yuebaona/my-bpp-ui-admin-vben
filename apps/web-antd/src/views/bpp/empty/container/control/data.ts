import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DescriptionItemSchema } from '#/components/description';

import { getDictDataPage } from '#/api/system/dict/data';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
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
  'empty_container_control_main_operation_type',
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
      title: '最低准存天数',
      field: 'minDays',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
      },
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '最高准存天数',
      field: 'maxDays',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
      },
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
      fieldName: 'planNo',
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
        onInput: (e: Event) => {
          setTimeout(() => {
            const target = e.target as HTMLInputElement;
            target.value = target.value
              .toUpperCase()
              .replaceAll(/[^A-Z0-9]/g, '');
          }, 10);
        },
      },
    },
    {
      fieldName: 'ownerCodeList',
      label: '持箱人',
      component: 'Select',
      // renderComponentContent: () => {
      //   return {
      //     default: () => null,
      //   };
      // },
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
      fieldName: 'containerIsoList',
      label: 'ISO',
      component: 'Select',
      // renderComponentContent: () => {
      //   return {
      //     default: () => null,
      //   };
      // },
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
      disabled: true,
    },
    {
      fieldName: 'pickupPlanNo',
      label: '提箱受理计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入提箱受理计划号',
        allowClear: true,
        onInput: (e: Event) => {
          setTimeout(() => {
            const target = e.target as HTMLInputElement;
            target.value = target.value
              .toUpperCase()
              .replaceAll(/[^A-Z0-9]/g, '');
          }, 10);
        },
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
      fieldName: 'ownerCodeList',
      label: '持箱人',
      component: 'Select',
      // renderComponentContent: () => {
      //   return {
      //     default: () => null,
      //   };
      // },
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
      disabled: true,
    },
    {
      fieldName: 'containerIsoList',
      label: 'ISO',
      component: 'Select',
      // renderComponentContent: () => {
      //   return {
      //     default: () => null,
      //   };
      // },
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
export function subPlanDetailSchema(): VbenFormSchema[] {
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
      fieldName: 'ownerCodeList',
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
      fieldName: 'containerIsoList',
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
      label: '计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入计划号',
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
      fieldName: 'createTime',
      label: '创建时间',
      component: 'TimeRangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'ownerCodeList',
      label: '持箱人',
      component: 'Select',
      componentProps: {
        placeholder: '请选择持箱人',
        allowClear: true,
      },
      slot: 'form-ownerCodeList',
    },
    {
      fieldName: 'containerIsoList',
      label: 'ISO',
      component: 'Select',
      componentProps: {
        placeholder: '请选择ISO号',
        allowClear: true,
      },
      slot: 'form-containerIsoList',
    },
    {
      fieldName: 'dischargeVesselSchedule',
      label: '卸船船期',
      component: 'Select',
      componentProps: {
        placeholder: '请输入船名或航次号',
        allowClear: true,
      },
      slot: 'form-vesselUnloadDate',
    },
    {
      fieldName: 'pickupPlanNo',
      label: '受理计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入受理计划号',
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
      minWidth: 150,
      fixed: 'left',
    },
    {
      field: 'planStatus',
      title: '状态',
      minWidth: 100,
      cellRender: {
        name: 'CellTagDict',
        props: 'empty_container_control_main_status',
      },
    },
    {
      field: 'isRelease',
      title: '是否放箱(Y/N)',
      minWidth: 150,
      formatter: ({ cellValue }) => {
        return cellValue ? 'Y' : 'N';
      },
    },
    {
      field: 'pickupPlanNo',
      title: '提箱受理计划号',
      minWidth: 120,
    },
    {
      field: 'ownerCodeList',
      title: '持箱人',
      minWidth: 120,
    },
    {
      field: 'tradeType',
      title: '贸易类型',
      minWidth: 100,
      cellRender: {
        name: 'CellTagDict',
        props: 'trade_type',
      },
    },
    {
      field: 'containerIsoList',
      title: 'ISO',
      minWidth: 120,
    },
    {
      field: 'bayRanges',
      title: '箱区范围',
      minWidth: 200,
      showOverflow: false,
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
      minWidth: 150,
      formatter: 'formatDateTime',
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
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 150,
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
      minWidth: 150,
      fixed: 'left',
    },
    {
      field: 'planStatus',
      title: '状态',
      minWidth: 100,
      cellRender: {
        name: 'CellTagDict',
        props: 'empty_container_control_sub_status',
      },
    },
    {
      field: 'isRelease',
      title: '是否放箱(Y/N)',
      minWidth: 150,
      formatter: ({ cellValue }) => {
        return cellValue ? 'Y' : 'N';
      },
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
        props: 'trade_type',
      },
    },
    {
      field: 'ownerCodeList',
      title: '持箱人',
      minWidth: 120,
    },
    {
      field: 'containerIsoList',
      title: 'ISO',
      minWidth: 120,
    },
    {
      field: 'bayRanges',
      title: '箱区范围',
      minWidth: 200,
      showOverflow: false,
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
      formatter: 'formatDateTime',
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
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 150,
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
    {
      field: 'isRelease',
      label: '是否放箱',
      render: (value) => {
        return `${value ? '是' : '否'}`;
      },
    },
    { field: 'pickupPlanNo', label: '提箱受理计划号' },
    { field: 'ownerCodeList', label: '持箱人' },
    { field: 'tradeType', label: '贸易类型' },
    // 确保数据中 tradeType 字段的值正确
    {
      field: 'tradeType',
      label: '贸易类型',
      render: (value) => {
        return value === 'FOREIGN' ? '外贸' : '内贸';
      },
    },
    { field: 'containerIsoList', label: 'ISO' },
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
      fieldName: 'owner',
      label: '持箱人',
      component: 'Select',
      componentProps: {
        placeholder: '请输入持箱人',
        allowClear: true,
      },
    },
    {
      fieldName: 'iso',
      label: 'ISO',
      component: 'Select',
      componentProps: {
        placeholder: '请输入ISO',
        allowClear: true,
      },
    },
    {
      fieldName: 'yardBay',
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
      field: 'mainIsRelease',
      title: '是否放箱(Y/N)',
      minWidth: 120,
      formatter: ({ cellValue }) => {
        return cellValue ? 'Y' : 'N';
      },
    },
    {
      field: 'mainPickupPlanNo',
      title: '提箱受理计划号',
      minWidth: 150,
    },
    {
      field: 'owner',
      title: '持箱人',
      minWidth: 120,
    },
    {
      field: 'mainTradeType',
      title: '贸易类型',
      minWidth: 100,
      cellRender: {
        name: 'CellTagDict',
        props: 'trade_type',
      },
    },
    {
      field: 'iso',
      title: 'ISO',
      minWidth: 100,
    },
    {
      field: 'yardBay',
      title: '箱区范围',
      minWidth: 120,
    },
    {
      field: 'mainGateAvailableQuantity',
      title: '主闸可放箱量',
      minWidth: 120,
    },
    {
      field: 'operator',
      title: '修改人',
      minWidth: 100,
    },
    {
      field: 'operationTimestamp',
      title: '修改时间',
      minWidth: 150,
    },
    {
      field: 'operationType',
      title: '修改类型',
      minWidth: 100,
      cellRender: {
        name: 'CellTagDict',
        props: 'empty_container_control_main_operation_type',
      },
    },
  ];
}

export function gatePlanColumns(): VxeTableGridOptions['columns'] {
  return [
    {type: 'seq', width: 50, align: 'center'},
    {
      field: 'planNo',
      title: '计划号',
      minWidth: 100,
    },
    {
      field: 'isRelease',
      title: '是否放箱',
      minWidth: 100,
      formatter: (value) => {
        return `${value ? '是' : '否'}`;
      }
    },
    {
      field: 'bayRanges',
      title: '箱区范围',
      minWidth: 120
    },
    {
      field: 'availableQuantity',
      title: '可放总箱量',
      minWidth: 100
    },
  ]
}
