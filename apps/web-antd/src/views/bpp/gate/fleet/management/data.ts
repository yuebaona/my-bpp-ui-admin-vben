import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DescriptionItemSchema } from '#/components/description';

import { z } from '#/adapter/form';
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

/** 车队管理列表的搜索表单 */
export function fleetSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'fltCd',
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
      fieldName: 'isRstr',
      label: '是否限制',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        allowClear: true,
        options: [
          { label: '是（Y）', value: 1 },
          { label: '否（N）', value: 0 },
        ],
      },
    },
    {
      fieldName: 'rstrReason',
      label: '限制代码/描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入限制代码/描述',
        allowClear: true,
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
      field: 'fltCd',
      title: '车队代码',
      minWidth: 100,
      editRender: { name: 'input' },
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'fltNm',
      title: '车队中文名',
      minWidth: 180,
      editRender: { name: 'input' },
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'fltShortNm',
      title: '车队简写',
      minWidth: 130,
      editRender: { name: 'input' },
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'fltAddr',
      title: '车队地址',
      minWidth: 200,
      editRender: { name: 'input' },
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'rstrCnt',
      title: '已限制次数',
      minWidth: 100,
      filterRender: { name: 'VxeInput', props: { clearable: true, type: 'number' } },
    },
    {
      field: 'isRstr',
      title: '是否限制',
      minWidth: 120,
      formatter: ({ cellValue }) => {
        return cellValue === 1 ? '是' : cellValue === 0 ? '否' : '';
      },
      filterRender: {
        name: 'VxeSelect',
        props: {
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
          clearable: true
        },
      },
    },
    {
      field: 'rstrReason',
      title: '限制原因代码及描述',
      minWidth: 200,
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'rstrDataSrc',
      title: '限制信息来源',
      minWidth: 120,
      filterRender: {
        name: 'VxeSelect',
        props: {
          options: [
            { label: '智慧安防', value: '智慧安防' },
            { label: '北港网', value: '北港网' },
            { label: '业务处理平台', value: '业务处理平台' },
          ],
          clearable: true
        },
      },
    },
    {
      field: 'rstrStarDt',
      title: '限制开始时间',
      minWidth: 120,
      filterRender: { name: 'VxeInput', props: { type: 'date',clearable: true } },
    },
    {
      field: 'rstrEndDt',
      title: '限制结束时间',
      minWidth: 120,
      filterRender: { name: 'VxeInput', props: { type: 'date', clearable: true} },
    },
    {
      field: 'rstrLastDt',
      title: '最近一次限制时间合计',
      minWidth: 180,
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'number',
          clearable: true
        }
      },
    },
    {
      field: 'legalNm',
      title: '法人姓名',
      minWidth: 120,
      editRender: { name: 'input' },
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'legalPh',
      title: '法人电话',
      minWidth: 120,
      editRender: { name: 'input' },
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'safetyNm',
      title: '安全负责人姓名',
      minWidth: 130,
      editRender: { name: 'input' },
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'safetyPh',
      title: '安全负责人电话',
      minWidth: 130,
      editRender: { name: 'input' },
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'bizNm',
      title: '业务员姓名',
      minWidth: 120,
      editRender: { name: 'input' },
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'bizPh',
      title: '业务员电话',
      minWidth: 120,
      editRender: { name: 'input' },
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'bizRegNo',
      title: '社会信用代码',
      minWidth: 180,
      editRender: { name: 'input' },
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'otrAuditNo',
      title: '外集卡年审编号',
      minWidth: 150,
      editRender: { name: 'input' },
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'portRm',
      title: '码头备注',
      width: 250,
      editRender: { name: 'input' },
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'dataSrc',
      title: '创建源',
      minWidth: 100,
      filterRender: {
        name: 'VxeSelect',
        props: {
          options: [
            { label: '', value: '' },
            { label: '北港网', value: '北港网' },
            { label: '业务处理平台', value: '业务处理平台' },
          ],
          clearable: true
        },
      },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 150,
      formatter: 'formatDateTime',
      filterRender: { name: 'VxeInput', props: { type: 'date', clearable: true} },
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 150,
      formatter: 'formatDateTime',
      filterRender: { name: 'VxeInput', props: { type: 'date', clearable: true} },
    },
    {
      field: 'enableFlg',
      title: '是否启用',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue === 1 ? '是' : cellValue === 0 ? '否' : '';
      },
      editRender: {
        name: 'select',
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
      filterRender: {
        name: 'VxeSelect',
        props: {
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
          clearable: true
        },
      },
    },
  ];
}

/** 已限制明细表格字段 */
export function restrictionColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 60,
    },
    {
      field: 'fltNm',
      title: '车队',
      minWidth: 150,
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
        },
      },
      editRender: { name: 'input' },
    },
    {
      field: 'rstrReason',
      title: '限制代码：描述',
      minWidth: 200,
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
        },
      },
    },
    {
      field: 'rstrStartDt',
      title: '限制开始时间',
      minWidth: 120,
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'date',
          clearable: true,
          popupStyle: { zIndex: 8001 },
        },
      },
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue).toLocaleString('zh-CN');
      },
    },
    {
      field: 'rstrEndDt',
      title: '限制结束时间',
      minWidth: 120,
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'date',
          clearable: true,
          popupStyle: { zIndex: 8001 },
        },
      },
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue).toLocaleString('zh-CN');
      },
    },
    {
      field: 'lastRstrDt',
      title: '限制时间合计',
      minWidth: 120,
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          type: 'number'
        }
      },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 120,
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'date',
          clearable: true,
          popupStyle: { zIndex: 8001 },
        },
      },
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue).toLocaleString('zh-CN');
      },
    },
    {
      field: 'releaseTime',
      title: '解除限制时间',
      minWidth: 120,
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'date',
          clearable: true,
          popupStyle: { zIndex: 8001 },
        },
      },
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue).toLocaleString('zh-CN');
      },
    },
    {
      field: 'rstrDataSrc',
      title: '限制信息来源',
      minWidth: 120,
      filterRender: {
        name: 'VxeSelect',
        props: {
          options: [
            { label: '线下', value: '线下' },
            { label: '业务处理平台', value: '业务处理平台' },
          ],
          popupStyle: { zIndex: 8001 },
        },
      },
    },
    {
      field: 'createAccount',
      title: '创建账号',
      minWidth: 120,
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
        },
      },
    },
  ];
}

/** 车队详情表单 */
export function detailFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'fltCd',
      label: '车队代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队代码',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fltNm',
      label: '车队中文名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队名称',
        allowClear: true,
      },
      rules: 'required',
      // formItemClass: 'col-span-3 w-1/3',
    },
    {
      fieldName: 'fltShortNm',
      label: '车队简写',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队简称',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fltAddr',
      label: '车队地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队地址',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'enableFlg',
      label: '是否有效',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'rstrCnt',
      label: '已限制次数',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '',
      },
      defaultValue: '',
    },
    {
      fieldName: 'isRstr',
      label: '是否限制',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '',
      },
      defaultValue: '',
      slot: 'isRstr',
    },
    {
      fieldName: 'divider',
      label: '',
      component: 'Divider',
      componentProps: {
        style: { display: 'none' },
      },
    },
    {
      fieldName: 'legalNm',
      label: '法人姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入法人姓名',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'legalPh',
      label: '法人电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入法人电话',
        allowClear: true,
      },
      rules: z.string().regex(/^\d{11}$/, { message: '请输入11位有效数字' }),
    },
    {
      fieldName: 'safetyNm',
      label: '安全负责人姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入安全负责人',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'safetyPh',
      label: '安全负责人电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入安全负责人电话',
        allowClear: true,
      },
      rules: z.string().regex(/^\d{11}$/, { message: '请输入11位有效数字' }),
    },
    {
      fieldName: 'bizNm',
      label: '业务员姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务员姓名',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'bizPh',
      label: '业务员电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务员电话',
        allowClear: true,
      },
      rules: z.string().regex(/^\d{11}$/, { message: '请输入11位有效数字' }),
    },
    {
      fieldName: 'bizRegNo',
      label: '统一社会信用代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统一社会信用代码',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'otrAuditNo',
      label: '外集卡年审编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入外集卡年审编号',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'rstrReason',
      label: '限制原因代码及描述',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '',
      },
    },
    {
      fieldName: 'rstrDataSrc',
      label: '限制信息来源',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '',
      },
    },
    {
      fieldName: 'rstrStartDt',
      label: '限制开始时间',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '',
      },
    },
    {
      fieldName: 'rstrEndDt',
      label: '限制结束时间',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '',
      },
    },
    {
      fieldName: 'portRm',
      label: '码头备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入码头备注',
        allowClear: true,
      },
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'lastRstrDt',
      label: '最近一次限制时间合计',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '',
      },
    },
    {
      fieldName: 'divider',
      label: '',
      component: 'Divider',
      componentProps: {
        style: { display: 'none' },
      },
    },
    {
      fieldName: 'dataSrc',
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
        placeholder: '',
      },
    },
    {
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '',
      },
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
      fieldName: 'enableFlg',
      label: '是否有效',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
      rules: 'required',
      defaultValue: 1,
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
      formItemClass: 'col-span-2',
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
      formItemClass: 'col-span-2',
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
      formItemClass: 'col-span-2',
    },
    // 备注信息
    {
      fieldName: 'portRm',
      label: '码头备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入码头备注',
        allowClear: true,
      },
      formItemClass: 'col-span-2',
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
/** 限制明细表单 */
export function restrictionFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'fltCd',
      label: '车队代码',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'rstrRsn',
      label: '限制代码：描述',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'rstrStartDt',
      label: '限制开始时间',
      component: 'DatePicker',
      rules: 'required',
      componentProps: {
        popupStyle: { zIndex: 8001 },
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'rstrEndDt',
      label: '限制结束时间',
      component: 'DatePicker',
      rules: 'required',
      componentProps: {
        popupStyle: { zIndex: 8001 },
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'lastRstrDt',
      label: '限制时间合计',
      component: 'Input',
      componentProps: {
        popupStyle: { zIndex: 8001 },
        disabled: true,
      },
      formItemClass: 'col-span-2 w-2/3',
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
      component: 'Input',
      componentProps: {
        popupStyle: { zIndex: 8001 },
        disabled: true,
      },
    },
    {
      fieldName: 'dataSrc',
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
