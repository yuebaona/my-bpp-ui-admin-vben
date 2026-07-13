import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

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

/** 司机管理列表的搜索表单 */
export function driverSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'drvrCd',
      label: '司机账号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机账号',
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
      fieldName: 'dvrNm',
      label: '司机姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机姓名',
        allowClear: true,
      },
    },
    {
      fieldName: 'driverIdCard',
      label: '身份证号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入身份证号',
        allowClear: true,
      },
    },
    {
      fieldName: 'fltCd',
      label: '所属车队代码/名字',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属车队代码/名字',
        allowClear: true,
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
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
      },
    },
    {
      fieldName: 'rstrRsn',
      label: '限制代码/描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入限制代码/描述',
        allowClear: true,
      },
    },
  ];
}

/** 司机信息表格字段 */
export function driverInfoColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    {
      field: 'dvrCd',
      title: '司机账号',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入司机账号',
        },
      },
    },
    {
      field: 'dvrNm',
      title: '司机姓名',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入司机姓名',
        },
      },
    },
    {
      field: 'dvrPh',
      title: '手机号',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入手机号',
        },
      },
    },
    {
      field: 'idNo',
      title: '身份证号',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入身份证号',
        },
      },
    },
    {
      field: 'dvrLicNo',
      title: '驾驶证号',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入驾驶证号',
        },
      },
    },
    {
      field: 'fltCd',
      title: '所属车队代码',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入所属车队代码',
        },
      },
    },
    {
      field: 'fltNm',
      title: '所属车队中文名',
      minWidth: 130,
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入所属车队中文名',
        },
      },
    },
    {
      field: 'fltRstrFlg',
      title: '所属车队是否被限制',
      minWidth: 160,
      formatter: ({ cellValue }: any) => {
        if (cellValue === null || cellValue === undefined || cellValue === '') return '';
        return cellValue === 1 || cellValue === '1' || cellValue === true ? '是' : '否';
      },
      filters: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          allowClear: true,
          dropdownStyle: { zIndex: 8001 },
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
        },
      },
    },
    {
      field: 'isRstr',
      title: '是否限制',
      minWidth: 90,
      formatter: ({ cellValue }: any) => {
        if (cellValue === null || cellValue === undefined || cellValue === '') return '';
        return cellValue === 1 || cellValue === '1' || cellValue === true ? '是' : '否';
      },
      filters: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          allowClear: true,
          dropdownStyle: { zIndex: 8001 },
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
        },
      },
    },
    {
      field: 'rstrRsn',
      title: '限制原因代码及描述',
      minWidth: 200,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入限制原因代码及描述',
        },
      },
    },
    {
      field: 'rstrCnt',
      title: '已限制次数',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'number',
          clearable: true,
          placeholder: '请输入次数',
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
        props: {
          type: 'date',
          clearable: true,
          placeholder: '请选择日期',
        },
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
        props: {
          type: 'date',
          clearable: true,
          placeholder: '请选择日期',
        },
      },
    },
    {
      field: 'lastRstrDt',
      title: '最近一次限制时间合计',
      minWidth: 180,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'number',
          clearable: true,
          placeholder: '请输入限制时间合计',
        },
      },
    },
    {
      field: 'dataSrc',
      title: '限制信息来源',
      minWidth: 120,
      filters: [
        { label: '北港网', value: '北港网' },
        { label: '业务处理平台', value: '业务处理平台' },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          allowClear: true,
          dropdownStyle: { zIndex: 8001 },
          options: [
            { label: '北港网', value: '北港网' },
            { label: '业务处理平台', value: '业务处理平台' },
          ],
        },
      },
    },
    {
      field: 'trkNo',
      title: '绑定车牌号',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入绑定车牌号',
        },
      },
    },
    {
      field: 'AAAAA',
      title: '绑定车辆是否被限制',
      minWidth: 150,
      filters: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          allowClear: true,
          options: [
            { label: '是', value: true },
            { label: '否', value: false },
          ],
        },
      },
    },
    {
      field: 'AAAAA',
      title: '最后进场时间',
      minWidth: 150,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'date',
          clearable: true,
          placeholder: '请选择日期',
        },
      },
    },
    {
      field: 'AAAAA',
      title: '最后出场时间',
      minWidth: 150,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'date',
          clearable: true,
          placeholder: '请输入最后出场时间',
        },
      },
    },
    {
      field: 'remark',
      title: '码头备注',
      minWidth: 200,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入安全负责人电话',
        },
      },
    },
    {
      field: 'dataSrc',
      title: '创建源',
      minWidth: 100,
      filters: [
        { label: '北港网', value: '北港网' },
        { label: '业务处理平台', value: '业务处理平台' },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          allowClear: true,
          dropdownStyle: { zIndex: 8001 },
          options: [
            { label: '北港网', value: '北港网' },
            { label: '业务处理平台', value: '业务处理平台' },
          ],
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
        props: {
          type: 'date',
          clearable: true,
          placeholder: '请选择日期',
        },
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
        props: {
          type: 'date',
          clearable: true,
          placeholder: '请选择日期',
        },
      },
    },
    {
      field: 'enableFlg',
      title: '是否有效',
      minWidth: 90,
      formatter: ({ cellValue }: any) => {
        if (cellValue === null || cellValue === undefined || cellValue === '') return '';
        return cellValue === 1 || cellValue === '1' || cellValue === true ? '是' : '否';
      },
      filters: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          allowClear: true,
          options: [
            { label: '是', value: '1' },
            { label: '否', value: '0' },
          ],
        },
      },
    },
  ];
}

/** 司机详情表单（底部详情栏） */
export function detailFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'dvrCd',
      label: '司机账号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机账号',
        allowClear: true,
      },
      rules: z.string().regex(/^\d{11}$/, { message: '请输入11位有效数字' }),
    },
    {
      fieldName: 'dvrNm',
      label: '司机姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机姓名',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'dvrPh',
      label: '手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机电话',
        allowClear: true,
      },
      rules: z.string().regex(/^\d{11}$/, { message: '请输入11位有效数字' }),
    },
    {
      fieldName: 'enableFlg',
      label: '是否有效',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        allowClear: true,
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'idNo',
      label: '身份证号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入身份证号',
        allowClear: true,
      },
      rules: z.string().regex(/^\d{17}[\dXx]$/, { message: '请输入18位有效身份证号' }),
    },
    {
      fieldName: 'dvrLicNo',
      label: '驾驶证号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入身份证号',
        allowClear: true,
      },
      rules: 'required',
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
      fieldName: 'divider',
      label: '',
      component: 'Divider',
      componentProps: {
        style: { display: 'none' },
      },
    },
    {
      fieldName: 'fltCd',
      label: '所属车队代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队代码',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fltNm',
      label: '所属车队中文名',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fltRstrFlg',
      label: '所属车队是否被限制',
      component: 'Input',
      componentProps: {
        disabled: true,
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
      fieldName: 'trkNo',
      label: '绑定车牌号',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'trkRstrFlg',
      label: '绑定车辆是否被限制',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'AAAAA',
      label: '最后进场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择进场时间',
        allowClear: true,
        showTime: false,
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      rules: 'required',
    },
    {
      fieldName: 'AAAAA',
      label: '最后出场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择出场时间',
        allowClear: true,
        showTime: false,
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      rules: 'required',
    },

    {
      fieldName: 'isRstr',
      label: '是否限制',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'rstrCnt',
      label: '已限制次数',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      slot: true,
    },
    {
      fieldName: 'rstrRsn',
      label: '限制原因代码及描述',
      component: 'Input',
      rules: 'required',
      slot: true,
    },
    {
      fieldName: 'rstrInfoSrc',
      label: '限制信息来源',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      slot: true,
    },
    {
      fieldName: 'rstrStartDt',
      label: '限制开始时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      slot: true,
    },
    {
      fieldName: 'rstrEndDt',
      label: '限制结束时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      slot: true,
    },
    {
      fieldName: 'lastRstrDt',
      label: '最近一次限制时间合计',
      component: 'Input',
      componentProps: {
        disabled: true,
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
      fieldName: 'remark',
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
      fieldName: 'divider',
      label: '',
      component: 'Divider',
      componentProps: {
        style: { display: 'none' },
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
      slot: true,
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
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      slot: true,
    },
  ];
}

/** 限制信息表格字段 */
export function restrictionColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center' },
    {
      title: '车队',
      field: 'fltCd',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入车队',
        },
      },
      editRender: { name: 'input' },
    },
    {
      title: '车牌号',
      field: 'trkNo',
      minWidth: 130,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入车牌号',
        },
      },
      editRender: { name: 'input' },
    },
    {
      field: 'dvrNm',
      title: '司机',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入司机姓名',
        },
      },
    },
    {
      title: '限制代码：描述',
      field: 'rstrRsn',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入限制代码',
        },
      },
      editRender: { name: 'input' },
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
        props: {
          type: 'date',
          clearable: true,
          placeholder: '请选择日期',
        },
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
        props: {
          type: 'date',
          clearable: true,
          placeholder: '请选择日期',
        },
      },
    },
    {
      field: 'lastRstrDt',
      title: '限制时间合计',
      minWidth: 130,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'number',
          clearable: true,
          placeholder: '请输入天数',
        },
      },
    },
    {
      field: 'createTime',
      title: '创建时间',
      sortable: true,
      minWidth: 150,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'date',
          clearable: true,
          placeholder: '请选择日期',
        },
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
        props: {
          type: 'date',
          clearable: true,
          placeholder: '请选择日期',
        },
      },
    },
    {
      field: 'dataSrc',
      title: '限制信息来源',
      minWidth: 130,
      filters: [
        { label: '北港网', value: '北港网' },
        { label: '业务处理平台', value: '业务处理平台' },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          dropdownStyle: { zIndex: 8001 },
          options: [
            { label: '北港网', value: '北港网' },
            { label: '业务处理平台', value: '业务处理平台' },
          ],
        },
      },
    },
    {
      field: 'creator',
      title: '创建账号',
      minWidth: 130,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入创建账号',
        },
      },
    },
  ];
}

/** 限制表单字段 */
export function restrictionFormSchema(): VbenFormSchema[] {
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
      fieldName: 'rstrRsn',
      label: '限制代码：描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入限制代码：描述',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'trkNo',
      label: '车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'dvrNm',
      label: '司机姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机姓名',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'rstrStartDt',
      label: '限制开始时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择解除时间',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'rstrEndDt',
      label: '限制结束时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择限制结束时间',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'lastRstrDt',
      label: '限制时间合计',
      component: 'Input',
      componentProps: {
        disabled: true,
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
        placeholder: '请选择解除限制时间',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
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
