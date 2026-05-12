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

/** 已限制明细表格字段 */
export function restrictionColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 40,
    },
    {
      title: '司机名称',
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

/** 司机管理列表的搜索表单 */
export function driverSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'driverCode',
      label: '司机账号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机代码/名称',
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
      fieldName: 'driverName',
      label: '司机姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入限制代码/描述',
        allowClear: true,
      },
    },
    {
      fieldName: 'driverIdCard',
      label: '身份证号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入限制代码/描述',
        allowClear: true,
      },
    },
    {
      fieldName: 'fleetCode',
      label: '所属车队代码/名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入限制代码/描述',
        allowClear: true,
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

/** 司机新增表单 */
export function newFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'driverCode',
      label: '司机代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机代码',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'driverCnName',
      label: '司机名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机名称',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'driverShortName',
      label: '司机简称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机简称',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'driverPhone',
      label: '司机电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机电话',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'driverAddress',
      label: '司机地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机地址',
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

/** 司机编辑表单 */
export function editFormSchema(): VbenFormSchema[] {
  return [
    // 基础信息信息
    {
      fieldName: 'basicInfo',
      component: 'Space',
      label: '基础信息',
      formItemClass: 'w-full p-0 md:col-span-2',
    },
    {
      fieldName: 'driverAccount',
      label: '司机账号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机账号',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'driverName',
      label: '姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机名称',
        allowClear: true,
      },
    },
    {
      fieldName: 'driverPhone',
      label: '手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机简称',
        allowClear: true,
      },
    },
    {
      fieldName: 'driverIdCard',
      label: '身份证号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机电话',
        allowClear: true,
      },
    },
    {
      fieldName: 'driverLicenseNo',
      label: '驾驶证号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机地址',
        allowClear: true,
      },
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'bindLicensePlate',
      label: '绑定车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入法人姓名',
        allowClear: true,
      },
    },
    {
      fieldName: 'fleetCode',
      label: '所属司机代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入法人电话',
        allowClear: true,
      },
    },
    {
      fieldName: 'fleetNameCn',
      label: '所属司机中文名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入安全负责人',
        allowClear: true,
      },
    },
    {
      fieldName: 'lastEntryTime',
      label: '最后进场时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入安全负责人电话',
        allowClear: true,
      },
    },
    {
      fieldName: 'lastExitTime',
      label: '最后出场时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务员姓名',
        allowClear: true,
      },
    },
    {
      fieldName: 'createSource',
      label: '创建源',
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务员电话',
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统一社会信用代码',
        allowClear: true,
      },
    },
    {
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入外集卡年审编号',
        allowClear: true,
      },
    },
    {
      fieldName: 'createSource',
      label: '创建源',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
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
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
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
      fieldName: 'isRestricted',
      label: '是否限制',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
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
      fieldName: 'fleetIsRestricted',
      label: '所属司机是否被限制',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'vehicleIsRestricted',
      label: '绑定车辆是否被限制',
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
      formItemClass: 'w-full p-0 md:col-span-2',
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
      fieldName: 'restrictEndTime',
      label: '限制结束时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'lastRestrictTimeTotal',
      label: '最近一次限制时间合计',
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
      rules: 'required',
      formItemClass: 'col-span-2',
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
      fieldName: 'driverCode',
      label: '司机代码',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'driverCnName',
      label: '司机名称',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'bindLicensePlate',
      label: '车牌号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'driverName',
      label: '司机姓名',
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

/** 司机信息字段 */
export function driverInfoColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    { type: 'checkbox', width: 40, fixed: 'left' },
    {
      field: 'driverCode',
      title: '司机代码',
      minWidth: 150,
    },
    {
      field: 'driverCnName',
      title: '司机中文名',
      minWidth: 100,
    },
    {
      field: 'driverPhone',
      title: '司机电话',
      minWidth: 150,
    },
    {
      field: 'driverShortName',
      title: '司机简写',
      minWidth: 120,
    },
    {
      field: 'driverAddress',
      title: '司机地址',
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

/** 司机详情基础信息字段 */
export function detailBasicSchema(): DescriptionItemSchema[] {
  return [
    // 基础信息
    { field: 'driverAccount', label: '司机账号' },
    {
      field: 'isRelease',
      label: '是否有效',
      render: (value) => {
        return `${value ? '是' : '否'}`;
      },
    },
    { field: 'driverCnName', label: '姓名' },
    { field: 'driverPhone', label: '手机号' },
    { field: 'driverIdCard', label: '身份证号' },
    { field: 'driverLicenseNo', label: '驾驶证号' },
    { field: 'bindLicensePlate', label: '绑定车牌号' },
    { field: '', label: '' },
    { field: 'fleetCode', label: '所属车队代码' },
    { field: 'fleetNameCn', label: '所属车队中文名称' },
    { field: 'lastEntryTime', label: '最后进场时间' },
    { field: 'lastExitTime', label: '最后出场时间' },
    { field: 'createSource', label: '创建源' },
    { field: 'createTime', label: '创建时间' },
    { field: 'updateTime', label: '更新时间' },
  ];
}
/** 司机详情限制信息字段 */
export function detailRestrictionSchema(): DescriptionItemSchema[] {
  return [
    {
      field: 'isRelease',
      label: '是否限制',
      render: (value) => {
        return `${value ? '是' : '否'}`;
      },
    },
    { field: 'restrictedCount', label: '已限制次数' },
    { field: 'fleetIsRestricted', label: '所属车队是否被限制' },
    { field: 'vehicleIsRestricted', label: '绑定车辆是否被限制' },
    { field: 'restrictionReason', label: '限制原因代码及描述', span: 2 },
    { field: 'restrictInfoSource', label: '限制信息来源' },
    { field: 'restrictStartTime', label: '限制开始时间' },
    { field: 'restrictEndTime', label: '限制结束时间' },
    { field: 'lastRestrictTimeTotal', label: '最近一次限制时间合计' },
    { field: 'wharfRemark', label: '码头备注', span: 2 },
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
