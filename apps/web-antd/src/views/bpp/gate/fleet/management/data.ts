import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DescriptionItemSchema } from '#/components/description';

import { getDictDataPage } from '#/api/bpp/base/dict/data';
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


/** 箱区范围选择字段 */
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

/** 已限制明细表格字段 */
export function restrictionColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 40,
    },
    {
      title: '车队名称',
      field: 'yardPosition',
      minWidth: 150,
      editRender: { name: 'input' },
    },
    {
      title: '限制原因代码及描述',
      field: 'yardColumns',
      minWidth: 200,
    },
    {
      title: '限制开始时间',
      field: 'restrictStartTime',
      minWidth: 150,
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '限制结束时间',
      field: 'restrictEndTime',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
      },
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '限制时间合计',
      field: 'lastRestrictTimeTotal',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
      },
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '创建时间',
      field: 'createTime',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
      },
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '更新时间',
      field: 'updateTime',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
      },
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '限制信息来源',
      field: 'restrictInfoSource',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
      },
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '创建账号',
      field: 'createAccount',
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

/** 箱区范围浮窗展示字段 */
export function containerAreaDisplayColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: '堆场贝位',
      field: 'yardBay',
      minWidth: 80,
      editRender: { name: 'input' },
    },
    {
      title: '堆场列',
      field: 'yardRaw',
      minWidth: 60,
      editRender: { name: 'input' },
    },
    {
      title: '总数（当前可用量）',
      field: 'totalCount',
      minWidth: 100,
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '最低准存天数',
      field: 'minDays',
      minWidth: 100,
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
      minWidth: 100,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
      },
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
  ];
}
/** 车队管理列表的搜索表单 */
export function fleetSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'fleetCode',
      label: '车队代码/名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队代码/名称',
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
      fieldName: 'isRestricted',
      label: '是否限制',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        allowClear: true,
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
      },
    },
    {
      fieldName: 'restrictionReason',
      label: '限制代码/描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入限制代码/描述',
        allowClear: true,
      },
    },
  ];
}

/** 车队新增表单 */
export function newFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'fleetCode',
      label: '车队代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队代码',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fleetCnName',
      label: '车队名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队名称',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fleetShortName',
      label: '车队简称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队简称',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fleetPhone',
      label: '车队电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队电话',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fleetAddress',
      label: '车队地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队地址',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'legalPersonName',
      label: '法人姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入法人姓名',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'legalPersonPhone',
      label: '法人电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入法人电话',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'safetyPersonName',
      label: '安全负责人姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入安全负责人',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'safetyPersonPhone',
      label: '安全负责人电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入安全负责人电话',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'businessPersonName',
      label: '业务员姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务员姓名',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'businessPersonPhone',
      label: '业务员电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务员电话',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'socialCreditCode',
      label: '统一社会信用代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统一社会信用代码',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'outerTruckAnnualReviewNo',
      label: '外集卡年审编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入外集卡年审编号',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'createSource',
      label: '创建源',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
      defaultValue: '业务处理平台',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
  ];
}

/** 车队编辑表单 */
export function editFormSchema(): VbenFormSchema[] {
  return [
    // 基础信息信息
    {
      fieldName: 'divider',
      component: 'Divider',
      formItemClass: 'w-full p-0 md:col-span-2',
    },
    {
      fieldName: 'basicInfo',
      component: 'Space',
      label: '基础信息',
      formItemClass: 'w-full p-0 md:col-span-2',
    },
    {
      fieldName: 'fleetCode',
      label: '车队代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队代码',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fleetCnName',
      label: '车队名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队名称',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fleetShortName',
      label: '车队简称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队简称',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fleetPhone',
      label: '车队电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队电话',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fleetAddress',
      label: '车队地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队地址',
        allowClear: true,
      },
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'legalPersonName',
      label: '法人姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入法人姓名',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'legalPersonPhone',
      label: '法人电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入法人电话',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'safetyPersonName',
      label: '安全负责人姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入安全负责人',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'safetyPersonPhone',
      label: '安全负责人电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入安全负责人电话',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'businessPersonName',
      label: '业务员姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务员姓名',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'businessPersonPhone',
      label: '业务员电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务员电话',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'socialCreditCode',
      label: '统一社会信用代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统一社会信用代码',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'outerTruckAnnualReviewNo',
      label: '外集卡年审编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入外集卡年审编号',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'createSource',
      label: '创建源',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
    // 限制信息
    {
      fieldName: 'divider',
      component: 'Divider',
      formItemClass: 'w-full p-0 md:col-span-2',
    },
    {
      fieldName: 'restrictionInfo',
      component: 'Space',
      label: '限制信息',
      formItemClass: 'w-full p-0 md:col-span-2',
    },
    {
      fieldName: 'restrictedCount',
      label: '已限制次数',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'isRestricted',
      label: '是否限制',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'restrictionReason',
      label: '限制原因代码及描述',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'restrictInfoSource',
      label: '限制信息来源',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'restrictStartTime',
      label: '限制开始时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'restrictEndTime',
      label: '限制结束时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'wharfRemark',
      label: '码头备注',
      component: 'Input',
      formItemClass: 'col-span-2',
      rules: 'required',
    },
    {
      fieldName: 'restrictionDetail',
      label: '',
      component: 'Input',
      renderComponentContent: () => {
        return {
          default: () => null,
        };
      },
      formItemClass: 'col-span-2',
    },
  ];
}

export function restrictionFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'fleetCode',
      label: '车队代码',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'fleetCnName',
      label: '车队名称',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'restrictionReason',
      label: '限制原因代码及描述',
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'restrictStartTime',
      label: '限制开始时间',
      component: 'RangePicker',
      rules: 'required',
      componentProps: {
        zIndex: 6000,
      },
    },
    {
      fieldName: 'restrictEndTime',
      label: '限制结束时间',
      component: 'RangePicker',
      rules: 'required',
      componentProps: {
        zIndex: 6000,
      },
    },
    {
      fieldName: 'lastRestrictTimeTotal',
      label: '限制时间合计',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'releaseTime',
      label: '解除创建时间',
      component: 'RangePicker',
    },
    {
      fieldName: 'restrictInfoSource',
      label: '限制信息来源',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'createAccount',
      label: '创建账号',
      component: 'Input',
      componentProps: {
        disabled: true,
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
      fieldName: 'dischargeVslSchedule',
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
      fieldName: 'contIsoList',
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
      fieldName: 'bayRangeList',
      label: '箱区',
      component: 'Input',
      componentProps: {
        placeholder: '选择箱区',
        allowClear: true,
        readonly: true,
        showSearch: false,
        disabled: true,
        value: '',
      },
      // formItemClass: 'col-span-2',
      slot: true,
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
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
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
      fieldName: 'contIsoList',
      label: 'ISO',
      component: 'Select',
      componentProps: {
        placeholder: '请选择ISO号',
        allowClear: true,
      },
      slot: 'form-contIsoList',
    },
    {
      fieldName: 'dischargeVslSchedule',
      label: '卸船船期',
      component: 'Select',
      componentProps: {
        placeholder: '请输入船名或航次号',
        allowClear: true,
      },
      slot: 'form-dischargeVslSchedule',
    },
    {
      fieldName: 'pickupPlanNo',
      label: '受理计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入受理计划号',
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
  ];
}

/** 车队信息字段 */
export function fleetInfoColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    { type: 'checkbox', width: 40, fixed: 'left' },
    {
      field: 'fleetCode',
      title: '车队代码',
      minWidth: 150,
    },
    {
      field: 'fleetCnName',
      title: '车队中文名',
      minWidth: 100,
    },
    {
      field: 'fleetPhone',
      title: '车队电话',
      minWidth: 150,
    },
    {
      field: 'fleetShortName',
      title: '车队简写',
      minWidth: 120,
    },
    {
      field: 'fleetAddress',
      title: '车队地址',
      minWidth: 120,
    },
    {
      field: 'restrictedCount',
      title: '已限制次数',
      minWidth: 100,
    },
    {
      field: 'isRestricted',
      title: '是否限制',
      minWidth: 120,
      // formatter: ({ cellValue }) => {
      //   return cellValue ? 'Y' : 'N';
      // },
    },
    {
      field: 'restrictionReason',
      title: '限制原因代码及描述',
      minWidth: 200,
    },
    {
      field: 'restrictInfoSource',
      title: '限制信息来源',
      minWidth: 120,
    },
    {
      field: 'restrictStartTime',
      title: '限制开始时间',
      minWidth: 120,
    },
    {
      field: 'restrictEndTime',
      title: '限制结束时间',
      minWidth: 120,
    },
    {
      field: 'lastRestrictTimeTotal',
      title: '最近一次限制时间合计',
      minWidth: 120,
    },
    {
      field: 'legalPersonName',
      title: '法人姓名',
      minWidth: 120,
    },
    {
      field: 'legalPersonPhone',
      title: '法人电话',
      minWidth: 120,
    },
    {
      field: 'safetyPersonName',
      title: '安全负责人',
      minWidth: 120,
    },
    {
      field: 'safetyPerson',
      title: '安全负责人电话',
      minWidth: 100,
    },
    {
      field: 'safetyPersonPhone',
      title: '业务员姓名',
      minWidth: 100,
    },
    {
      field: 'businessPersonName',
      title: '业务员电话',
      minWidth: 150,
    },
    {
      field: 'socialCreditCode',
      title: '社会信用代码',
      minWidth: 100,
    },
    {
      field: 'outerTruckAnnualReviewNo',
      title: '外集卡年审编号',
      minWidth: 150,
    },
    {
      field: 'wharfRemark',
      title: '码头备注',
      width: 150,
    },
    {
      field: 'createSource',
      title: '创建源',
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 100,
      formatter: 'formatDateTime',
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 100,
      formatter: 'formatDateTime',
    },
    {
      field: 'isValid',
      title: '是否有效',
      minWidth: 100,
    },
    {
      title: '操作',
      minWidth: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 车队详情基础信息字段 */
export function detailBasicSchema(): DescriptionItemSchema[] {
  return [
    // 基础信息
    { field: 'fleetCode', label: '车队代码' },
    {
      field: 'isRelease',
      label: '是否有效',
      render: (value) => {
        return `${value ? '是' : '否'}`;
      },
    },
    { field: 'fleetCnName', label: '车队中文名' },
    { field: 'fleetShortName', label: '车队简写' },
    { field: 'fleetPhone', label: '车队电话' },
    { field: 'fleetAddress', label: '车队地址' },
    { field: 'legalPersonName', label: '法人姓名' },
    { field: 'legalPersonPhone', label: '法人电话' },
    { field: 'safetyPersonName', label: '安全负责人' },
    { field: 'safetyPerson', label: '安全负责人电话' },
    { field: 'safetyPersonPhone', label: '业务员姓名' },
    { field: 'businessPersonName', label: '业务员电话' },
    { field: 'socialCreditCode', label: '社会信用代码' },
    { field: 'outerTruckAnnualReviewNo', label: '外集卡年审编号' },
    { field: 'createSource', label: '创建源' },
    { field: 'createTime', label: '创建时间' },
    { field: 'updateTime', label: '更新时间' },
    // 确保数据中 tradeType 字段的值正确
    {
      field: 'tradeType',
      label: '贸易类型',
      render: (value) => {
        return value === 'FOREIGN' ? '外贸' : '内贸';
      },
    },
    { field: 'contIsoList', label: 'ISO' },
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
/** 车队详情限制信息字段 */
export function detailRestrictionSchema(): DescriptionItemSchema[] {
  return [
    // 基础信息
    { field: 'restrictedCount', label: '已限制次数' },
    {
      field: 'isRelease',
      label: '是否限制',
      render: (value) => {
        return `${value ? '是' : '否'}`;
      },
    },
    { field: 'restrictionReason', label: '限制原因代码及描述' },
    { field: 'restrictInfoSource', label: '限制信息来源' },
    { field: 'restrictStartTime', label: '限制开始时间' },
    { field: 'restrictEndTime', label: '限制结束时间' },
    { field: 'lastRestrictTimeTotal', label: '最近一次限制时间合计' },
    { field: 'wharfRemark', label: '码头备注' },
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
        placeholder: '选择箱区',
        allowClear: true,
        readonly: true,
        showSearch: false,
        disabled: true,
        value: '',
      },
      slot: true,
    },
    {
      fieldName: 'createTime',
      label: '操作时间',
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
        // options: getPlanStatusOptions('trade_type'),
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
      field: 'operatorName',
      title: '操作人',
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: '操作时间',
      minWidth: 150,
      formatter: 'formatDateTime',
    },
    {
      field: 'operationType',
      title: '修改类型',
      minWidth: 100,
      cellRender: {
        name: 'CellTagDict',
        props: 'empty_container_control_main_operation_type',
        // options: getPlanStatusOptions(
        //           'empty_container_control_main_operation_type',
        //         ),
      },
    },
  ];
}

export function gatePlanColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center' },
    {
      field: 'planNo',
      title: '计划号',
      minWidth: 100,
    },
    {
      field: 'isRelease',
      title: '是否放箱',
      minWidth: 100,
      formatter: (params) => {
        return String(params.cellValue) === 'true' ? 'Y' : 'N';
      },
    },
    {
      field: 'bayRanges',
      title: '箱区范围',
      minWidth: 120,
    },
    {
      field: 'mainGateReleaseQuantity',
      title: '可放总箱量',
      minWidth: 100,
    },
    {
      field: 'dischargeVslSchedule',
      title: '卸船船期',
      minWidth: 200,
    },
  ];
}
