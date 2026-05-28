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
      title: '车队',
      field: 'fleetNameCn',
      minWidth: 150,
      editRender: { name: 'input' },
    },
    {
      title: '车牌号',
      field: 'licensePlate',
      minWidth: 150,
      editRender: { name: 'input' },
    },
    {
      title: '司机',
      field: 'driverName',
      minWidth: 150,
      editRender: { name: 'input' },
    },
    {
      title: '限制代码：描述',
      field: 'restrictionReason',
      minWidth: 150,
      editRender: { name: 'input' },
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
      title: '解除限制时间',
      field: 'restrictReleaseTime',
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

/** 车队管理列表的搜索表单 */
export function vehicleSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'licensePlate',
      label: '车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号',
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
      fieldName: 'trailerPlate',
      label: '挂车车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入挂车车牌号',
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
      fieldName: 'fleetCode',
      label: '车队代码/中文名',
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
    {
      fieldName: 'isAnnualInspected',
      label: '是否年审',
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
  ];
}

/** 车辆新增表单 */
export function newFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'licensePlate',
      label: '车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'isValid',
      label: '是否有效',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'rfidNo',
      label: '射频识别号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'beidouDeviceNo',
      label: '北斗设备号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'lastEntryTime',
      label: '最后进场时间',
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'lastExitTime',
      label: '最后出场时间',
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'fleetCode',
      label: '车队代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fleetNameCn',
      label: '车队中文名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'trailerPlate',
      label: '挂车车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'engineNo',
      label: '发动机编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'trailerLicenseNo',
      label: '挂车行驶证号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'licenseExpireDate',
      label: '行驶证有效期',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'isAnnualInspected',
      label: '是否年审',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'annualInspectTime',
      label: '年审时间',
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD',
      },
      rules: 'required',
    },
    {
      fieldName: 'inspectorName',
      label: '年审员',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'licenseFileNo',
      label: '行驶证档案编号',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'dangerPermitNo',
      label: '危险品许可证',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'etcNo',
      label: '车辆ETC号',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'vehicleWeightKg',
      label: '车辆自重(kg)',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'maxLoadWeightKg',
      label: '最大载重(kg)',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'vehicleLength',
      label: '长度',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'vehicleWidth',
      label: '宽度',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'cabColor',
      label: '车头颜色',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'ownerName',
      label: '车主姓名',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'ownerPhone',
      label: '车主电话',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'ownerIdCard',
      label: '车主身份证',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'isAutoPort',
      label: '是否自动化码头',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'isNewEnergy',
      label: '是否新能源车',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      rules: 'required',
      formItemClass: 'w-full md:col-span-2',
    },
    {
      fieldName: 'portRemark',
      label: '码头备注',
      component: 'Input',
      rules: 'required',
      formItemClass: 'w-full md:col-span-2',
    },
    {
      fieldName: 'attachStartTime',
      label: '开始挂靠时间',
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'isDisabled',
      label: '是否停用',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
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
  ];
}

/** 车队编辑表单 */
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
      fieldName: 'licensePlate',
      label: '车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'isValid',
      label: '是否有效',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'rfidNo',
      label: '射频识别号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'beidouDeviceNo',
      label: '北斗设备号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'lastEntryTime',
      label: '最后进场时间',
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'lastExitTime',
      label: '最后出场时间',
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'fleetCode',
      label: '车队代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fleetNameCn',
      label: '所属车队中文名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'trailerPlate',
      label: '挂车车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'engineNo',
      label: '发动机编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'trailerLicenseNo',
      label: '挂车行驶证号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'licenseExpireDate',
      label: '行驶证有效期',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'isAnnualInspected',
      label: '是否年审',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'annualInspectTime',
      label: '年审时间',
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'inspectorName',
      label: '年审员',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'licenseFileNo',
      label: '行驶证档案编号',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'dangerPermitNo',
      label: '危险品许可证',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'etcNo',
      label: '车辆ETC号',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'vehicleWeightKg',
      label: '车辆自重(kg)',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'maxLoadWeightKg',
      label: '最大载重(kg)',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'vehicleLength',
      label: '长度',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'vehicleWidth',
      label: '宽度',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'cabColor',
      label: '车头颜色',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'ownerName',
      label: '车主姓名',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'ownerPhone',
      label: '车主电话',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'ownerIdCard',
      label: '车主身份证',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'isAutoPort',
      label: '是否自动化码头',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'isNewEnergy',
      label: '是否新能源车',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      rules: 'required',
      formItemClass: 'w-full md:col-span-2',
    },
    {
      fieldName: 'portRemark',
      label: '码头备注',
      component: 'Input',
      rules: 'required',
      formItemClass: 'w-full md:col-span-2',
    },
    {
      fieldName: 'attachStartTime',
      label: '开始挂靠时间',
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'isDisabled',
      label: '是否停用',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
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
      fieldName: 'restrictedCount',
      label: '所属车队是否被限制',
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
      fieldName: 'Code',
      label: '车队代码',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'CnName',
      label: '车队名称',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'licensePlate',
      label: '车牌号',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'driverName',
      label: '司机姓名',
      component: 'Input',
      rules: 'required',
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
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        zIndex: 6000,
      },
      rules: 'required',
    },
    {
      fieldName: 'restrictEndTime',
      label: '限制结束时间',
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        zIndex: 6000,
      },
      rules: 'required',
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
      label: '解除限制时间',
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        zIndex: 6000,
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
/** 车队信息字段 */
export function settingInfoColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    { type: 'checkbox', width: 40, fixed: 'left' },
    {
      field: 'licensePlate',
      title: '闸口类型',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            { label: '是', value: '是' },
            { label: '否', value: '否' },
          ],
        },
        events: {
          change: (params: any) => {
            const { $grid, column } = params;
            $grid.saveFilterByEvent('change', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}` === option.data;
        }
        return true;
      },
      editRender: {
        name: 'VxeSelect',
        options: [
          { label: '是', value: '是' },
          { label: '否', value: '否' },
        ],
      },
    },
    {
      field: 'rfidNo',
      title: '进出闸模式',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            { label: '进', value: '进' },
            { label: '出', value: '出' },
          ],
        },
        events: {
          change: (params: any) => {
            const { $grid, column } = params;
            $grid.saveFilterByEvent('change', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}` === option.data;
        }
        return true;
      },
      editRender: {
        name: 'VxeSelect',
        options: [
          { label: '进', value: '进' },
          { label: '出', value: '出' },
        ],
      },
    },
    {
      field: 'beidouDeviceNo',
      title: '尺寸',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            { label: '20', value: '20' },
            { label: '40', value: '40' },
          ],
        },
        events: {
          change: (params: any) => {
            const { $grid, column } = params;
            $grid.saveFilterByEvent('change', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}` === option.data;
        }
        return true;
      },
      editRender: {
        name: 'VxeSelect',
        options: [
          { label: '20', value: '20' },
          { label: '40', value: '40' },
        ],
      },
    },
    {
      field: 'mainIsRelease',
      title: '空重',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            { label: '空', value: '空' },
            { label: '重', value: '重' },
          ],
        },
        events: {
          change: (params: any) => {
            const { $grid, column } = params;
            $grid.saveFilterByEvent('change', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}` === option.data;
        }
        return true;
      },
      editRender: {
        name: 'VxeSelect',
        options: [
          { label: '空', value: '空' },
          { label: '重', value: '重' },
        ],
      },
    },
    {
      field: 'lastExitTime',
      title: '集装箱类型',
      minWidth: 100,
      filterMultiple: true,
      filters: [{ data: [] }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          multiple: true,
          options: [
            { label: '空', value: '空' },
            { label: '重', value: '重' },
          ],
        },
        events: {
          change: (params: any) => {
            const { $grid, column } = params;
            $grid.saveFilterByEvent('change', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        const values = option.data;
        if (values && values.length > 0) {
          return values.includes(`${row[column.field]}`);
        }
        return true;
      },
      editRender: {
        name: 'VxeSelect',
        options: [
          { label: '空', value: '空' },
          { label: '重', value: '重' },
        ],
      },
    },
    {
      field: 'fleetCode',
      title: '最大重量（kg）',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
      },
      editRender: {
        name: 'VxeInput',
        props: {
          type: 'number',
        },
      },
    },
    // {
    //   title: '操作',
    //   minWidth: 150,
    //   fixed: 'right',
    //   slots: { default: 'actions' },
    // },
  ];
}

/** 车队详情基础信息字段 */
export function detailBasicSchema(): DescriptionItemSchema[] {
  return [
    // 基础信息
    { field: 'licensePlate', label: '车牌号' },
    {
      field: 'isRelease',
      label: '是否有效',
      render: (value) => {
        return `${value ? '是' : '否'}`;
      },
    },
    { field: 'rfidNo', label: '射频识别号' },
    { field: 'beidouDeviceNo', label: '北斗设备号' },
    { field: 'lastEntryTime', label: '最后进场时间' },
    { field: 'lastExitTime', label: '最后出场时间' },
    { field: 'fleetCode', label: '车辆代码' },
    { field: 'fleetNameCn', label: '所属车队中文名' },
    { field: 'trailerPlate', label: '挂车车牌号' },
    { field: 'engineNo', label: '发动机编号' },
    { field: 'trailerLicenseNo', label: '挂车行驶证号' },
    { field: 'licenseExpireDate', label: '行驶证有效期' },
    { field: 'isAnnualInspected', label: '是否年审' },
    { field: 'annualInspectTime', label: '年审时间' },
    { field: 'inspectorName', label: '年审员' },
    { field: 'licenseFileNo', label: '行驶证档案编号' },
    { field: 'dangerPermitNo', label: '危险品许可证' },
    { field: 'etcNo', label: '车辆ETC号' },
    { field: 'vehicleWeightKg', label: '车辆自重(kg)' },
    { field: 'maxLoadWeightKg', label: '最大载重(kg)' },
    { field: 'vehicleLength', label: '长度' },
    { field: 'vehicleWidth', label: '宽度' },
    { field: 'cabColor', label: '车头颜色' },
    { field: 'ownerName', label: '车主姓名' },
    { field: 'ownerPhone', label: '车主电话' },
    { field: 'ownerIdCard', label: '车主身份证' },
    { field: 'isAutoPort', label: '是否自动化码头' },
    { field: 'isNewEnergy', label: '是否新能源车' },
    { field: 'remark', label: '备注', span: 2  },
    { field: 'portRemark', label: '码头备注', span: 2 },
    { field: 'attachStartTime', label: '开始挂靠时间' },
    { field: 'isDisabled', label: '是否停用' },
    { field: 'createSource', label: '创建源' },
    { field: 'createTime', label: '创建时间' },
    { field: 'updateTime', label: '更新时间' },
    // 确保数据中 tradeType 字段的值正确
    // {
    //   field: 'tradeType',
    //   label: '贸易类型',
    //   render: (value) => {
    //     return value === 'FOREIGN' ? '外贸' : '内贸';
    //   },
    // },
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
    { field: 'fleetNameCn', label: '所属车队中文名' },
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

