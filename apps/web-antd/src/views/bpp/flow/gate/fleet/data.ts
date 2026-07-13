import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { z } from '#/adapter/form';
import { getDictDataPage } from '#/api/bpp/base/dict/data';
import { bppBaseDictStore } from '#/store/bpp/base/dict';

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
    {
      field: 'fltCd',
      title: '车队代码',
      minWidth: 100,
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'fltNm',
      title: '车队中文名',
      minWidth: 180,
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'fltShortNm',
      title: '车队简写',
      minWidth: 130,
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'fltAddr',
      title: '车队地址',
      minWidth: 200,
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'rstrCnt',
      title: '已限制次数',
      minWidth: 120,
      sortable: true,
      filterRender: { name: 'VxeNumberInput', props: { clearable: true } },
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
          clearable: true,
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
          clearable: true,
        },
      },
    },
    {
      field: 'rstrStarDt',
      title: '限制开始时间',
      minWidth: 130,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'rstrEndDt',
      title: '限制结束时间',
      minWidth: 130,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'rstrLastDt',
      title: '最近一次限制时间合计',
      minWidth: 180,
      sortable: true,
      filterRender: { name: 'VxeNumberInput', props: { clearable: true } },
    },
    {
      field: 'legalNm',
      title: '法人姓名',
      minWidth: 120,
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'legalPh',
      title: '法人电话',
      minWidth: 120,
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'safetyNm',
      title: '安全负责人姓名',
      minWidth: 130,
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'safetyPh',
      title: '安全负责人电话',
      minWidth: 130,
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'bizNm',
      title: '业务员姓名',
      minWidth: 120,
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'bizPh',
      title: '业务员电话',
      minWidth: 120,
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'bizRegNo',
      title: '社会信用代码',
      minWidth: 180,
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'otrAuditNo',
      title: '外集卡年审编号',
      minWidth: 150,
      filterRender: { name: 'VxeInput', props: { clearable: true } },
    },
    {
      field: 'portRm',
      title: '码头备注',
      width: 250,
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
            { label: '北港网', value: '北港网' },
            { label: '业务处理平台', value: '业务处理平台' },
          ],
          clearable: true,
        },
      },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 150,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 150,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'enableFlg',
      title: '是否启用',
      minWidth: 100,
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
      slot: true,
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
      slot: true,
    },
    {
      fieldName: 'rstrDataSrc',
      label: '限制信息来源',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '',
      },
      slot: true,
    },
    {
      fieldName: 'rstrStartDt',
      label: '限制开始时间',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '',
      },
      slot: true,
    },
    {
      fieldName: 'rstrEndDt',
      label: '限制结束时间',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '',
      },
      slot: true,
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
      slot: true,
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
      slot: true,
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '',
      },
      slot: true,
    },
    {
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '',
      },
      slot: true,
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
      field: 'fltName',
      title: '车队名称',
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
      field: 'rstrDesc',
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
      minWidth: 150,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, popupStyle: { zIndex: 8001 } },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'rstrEndDt',
      title: '限制结束时间',
      minWidth: 150,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, popupStyle: { zIndex: 8001 } },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'rstrTotalTime',
      title: '最近一次限制时间合计',
      minWidth: 180,
      sortable: true,
      filterRender: { name: 'VxeNumberInput', props: { clearable: true } },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 150,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, popupStyle: { zIndex: 8001 } },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'releaseTime',
      title: '解除限制时间',
      minWidth: 150,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, popupStyle: { zIndex: 8001 } },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'dataSrc',
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
      field: 'creator',
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

/** 限制明细表单 */
export function restrictionFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'fltName',
      label: '车队名称',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'rstrRsn',
      label: '限制代码：描述',
      component: 'Input',
      rules: 'required',
      slot: true,
    },
    {
      fieldName: 'rstrStartDt',
      label: '限制开始时间',
      component: 'DatePicker',
      rules: 'required',
      componentProps: {
        popupStyle: { zIndex: 8001 },
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
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
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'rstrTotalTime',
      label: '限制时间合计',
      component: 'Input',
      componentProps: {
        popupStyle: { zIndex: 8001 },
        disabled: true,
      },
      slot: true,
      formItemClass: 'col-span-2 w-2/3',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      slot: true,
    },
    {
      fieldName: 'releaseTime',
      label: '解除限制时间',
      component: 'DatePicker',
      componentProps: {
        popupStyle: { zIndex: 8001 },
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'dataSrc',
      label: '限制信息来源',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      slot: true,
    },
    {
      fieldName: 'creator',
      label: '创建账号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      slot: true,
    },
  ];
}
