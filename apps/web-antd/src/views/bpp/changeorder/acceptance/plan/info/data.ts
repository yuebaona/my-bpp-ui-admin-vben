import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AcceptancePlanApi } from '#/api/bpp/changeorder/acceptance/plan/info';
import type { DescriptionItemSchema } from '#/components/description';

import { getDictDataPage } from '#/api/bpp/base/dict/data';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
import { getRangePickerDefaultProps } from '#/utils';

const bppBaseDict = bppBaseDictStore();

function createDictFilter(dictType: string) {
  return ({ option, row, column }: { column: any; option: any; row: any }) => {
    if (option.data) {
      const searchText = option.data.toLowerCase();
      const dictOptions = bppBaseDict.getBppBaseDictOptions(dictType) || [];
      const cellValue = `${row[column.field]}`.toLowerCase();

      // 查找标签或值包含搜索文本的字典项
      const dictItem = dictOptions.find(
        (item) =>
          item.label.toLowerCase().includes(searchText) ||
          item.value.toLowerCase().includes(searchText),
      );

      // 如果找到字典项，使用字典值匹配；否则使用原始搜索文本匹配
      const matchValue = dictItem ? dictItem.value.toLowerCase() : searchText;
      return cellValue.includes(matchValue);
    }
    return true;
  };
}
/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'applicantPlanType',
      label: '业务类型',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选计划类型',
        allowClear: true,
        api: async (params?: any) => {
          return await getDictDataPage(params);
        },
        params: {
          pageNo: 1,
          pageSize: 100,
          dictType: 'acceptance_plan_type',
        },
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().includes(input.toLowerCase());
        },
        resultField: 'list',
        labelField: 'label',
        valueField: 'value',
      },
    },
  ];
}

/** 改单详情字段 */
export function acceptancePlanRecordSchema(): DescriptionItemSchema[] {
  return [
    // 基础信息
    { field: 'acptPlnNo', label: '受理计划号' },
    { field: 'acptPlnWebNo', label: '网上受理计划号' },
    { field: 'applicantPlanType', label: '业务类型' },
    { field: 'planStatus', label: '改单计划状态' },
    { field: 'applicantCode', label: '申请人' },
    { field: 'payer', label: '付款人' },
    { field: 'createTime', label: '创建时间' },
    { field: 'conclusionTime', label: '审核时间' },
    { field: 'handlerRemark', label: '备注' },
    { field: 'reviewInfo', label: '拒绝原因' },
  ];
}

/** 修改记录对比 字段 */
export function acceptancePlanChangeRecordSchema(): VxeTableGridOptions<AcceptancePlanApi.RecordBase>['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center' },
    {
      field: 'fieldName',
      title: '字段名',
      minWidth: 180,
    },
    {
      field: 'changeRecord',
      title: '修改记录',
      minWidth: 180,
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'acceptancePlanNo',
      label: 'acptPlnNo',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入受理计划号，支持多条查询（仅支持逗号分隔）',
      },
    },
    {
      fieldName: 'acptPlnWebNo',
      label: '网上受理计划号',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入网上受理计划号，支持多条查询（仅支持逗号分隔）',
      },
    },
    {
      fieldName: 'billNo',
      label: '提单号',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入提单号，支持多条查询（仅支持逗号分隔）',
      },
    },
    {
      fieldName: 'vesselNameVoyage',
      label: '船名航次',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入船名航次',
      },
    },
    {
      fieldName: 'applicantPlanType',
      label: '计划类型',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选计划类型',
        allowClear: true,
        api: async (params?: any) => {
          return await getDictDataPage(params);
        },
        params: {
          pageNo: 1,
          pageSize: 100,
          dictType: 'acceptance_plan_type',
        },
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().includes(input.toLowerCase());
        },
        resultField: 'list',
        labelField: 'label',
        valueField: 'value',
      },
    },
    {
      fieldName: 'planStatus',
      label: '计划状态',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选计划类型',
        allowClear: true,
        api: async (params?: any) => {
          return await getDictDataPage(params);
        },
        params: {
          pageNo: 1,
          pageSize: 100,
          dictType: 'acceptance_plan_status',
        },
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().includes(input.toLowerCase());
        },
        resultField: 'list',
        labelField: 'label',
        valueField: 'value',
      },
    },
    {
      fieldName: 'applicantCode',
      label: '申请人',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入申请人',
      },
    },
    {
      fieldName: 'payer',
      label: '付费人',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入付费人',
      },
    },
    {
      fieldName: 'applicantPlanStart',
      label: '计划开始时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'applicantPlanEnd',
      label: '计划完成时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
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
    {
      fieldName: 'conclusionTime',
      label: '审结时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<AcceptancePlanApi.Plan>['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center' },
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '受理计划号唯一标识',
      minWidth: 180,
      visible: false,
    },
    {
      field: 'acptPlnNo',
      title: '受理计划号',
      minWidth: 180,
    },
    {
      field: 'acptPlnWebNo',
      title: '网上受理计划号',
      minWidth: 180,
    },
    {
      field: 'applicantPlanType',
      title: '受理计划类型',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: createDictFilter('acceptance_plan_type'),
      cellRender: {
        name: 'CellTagDict',
        props: 'acceptance_plan_type',
      },
    },
    {
      field: 'planStatus',
      title: '受理计划状态',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: createDictFilter('acceptance_plan_status'),
      cellRender: {
        name: 'CellTagDict',
        props: 'acceptance_plan_status',
      },
    },
    {
      field: 'planCount',
      title: '计划箱量',
      children: [
        { field: 'planTwentyFtVolume', title: '20', minWidth: 60 },
        { field: 'planFortyFtVolume', title: '40', minWidth: 60 },
        { field: 'planFortyFiveFtVolume', title: '45', minWidth: 60 },
      ],
    },
    {
      field: 'completeCount',
      title: '完成箱量',
      children: [
        { field: 'completeTwentyFtVolume', title: '20', minWidth: 60 },
        { field: 'completeFortyFtVolume', title: '40', minWidth: 60 },
        { field: 'completeFortyFiveFtVolume', title: '45', minWidth: 60 },
      ],
    },
    {
      field: 'remainderCount',
      title: '剩余箱量',
      children: [
        { field: 'remainingTwentyFtVolume', title: '20', minWidth: 60 },
        { field: 'remainingFortyFtVolume', title: '40', minWidth: 60 },
        { field: 'remainingFortyFiveFtVolume', title: '45', minWidth: 60 },
      ],
    },
    {
      field: 'vesselFullNameIn',
      title: '进口船名\n（英文/中文）',
      minWidth: 120,
      formatter: ({ row }) => {
        const vslNameIn = row.vslNameIn || '';
        const vslZhNameIn = row.vslZhNameIn || '';
        return vslNameIn && vslZhNameIn
          ? `${vslNameIn}/${vslZhNameIn}`
          : vslNameIn || vslZhNameIn || '';
      },
    },
    {
      field: 'vslVoyIn',
      title: '进口航次',
      minWidth: 120,
    },
    {
      field: 'vesselNameOut',
      title: '出口船名\n（英文/中文）',
      minWidth: 120,
      formatter: ({ row }) => {
        const vslNameOut = row.vslNameOut || '';
        const vslZhNameOut = row.vslZhNameOut || '';
        return vslNameOut && vslZhNameOut
          ? `${vslNameOut}/${vslZhNameOut}`
          : vslNameOut || vslZhNameOut || '';
      },
    },
    {
      field: 'vslVoyOut',
      title: '出口航次',
      minWidth: 120,
    },
    {
      field: 'billNo',
      title: '提单号',
      minWidth: 120,
    },
    {
      field: 'cargoName',
      title: '货名',
      minWidth: 120,
    },
    {
      field: 'tradeTypeIn',
      title: '内外贸（进口）',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: createDictFilter('trade_type'),
      cellRender: {
        name: 'CellTagDict',
        props: 'trade_type',
      },
    },
    {
      field: 'tradeTypeOut',
      title: '内外贸（出口）',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: createDictFilter('trade_type'),
      cellRender: {
        name: 'CellTagDict',
        props: 'trade_type',
      },
    },
    {
      field: 'isDirectPickLoadOut',
      title: '直提',
      minWidth: 120,
      formatter: ({ row }) => {
        return row.isDirectPickLoadOut ? '✓' : '✗';
      },
    },
    {
      field: 'isDirectPickLoadIn',
      title: '直装',
      minWidth: 120,
      formatter: ({ row }) => {
        return row.isDirectPickLoadIn ? '✓' : '✗';
      },
    },
    {
      field: 'imdgCodeOut',
      title: '提箱IMDG',
      minWidth: 120,
    },
    {
      field: 'imdgCodeIn',
      title: '进箱IMDG',
      minWidth: 120,
    },
    {
      field: 'isPtiValidOut',
      title: '提箱PTI',
      minWidth: 120,
    },
    {
      field: 'isPtiValidIn',
      title: '进箱PTI',
      minWidth: 120,
    },
    {
      field: 'cwi',
      title: 'CWI',
      minWidth: 120,
    },
    {
      field: 'isDamage',
      title: '残损',
      minWidth: 120,
      formatter: ({ row }) => {
        return row.isDamage ? '✓' : '✗';
      },
    },
    {
      field: 'damageGrade',
      title: '残损等级',
      minWidth: 120,
    },
    {
      field: 'applicantPlanStart',
      title: '计划开始时间',
      minWidth: 135,
      formatter: 'formatDateTime',
    },
    {
      field: 'applicantPlanEnd',
      title: '计划结束时间',
      minWidth: 135,
      formatter: 'formatDateTime',
    },
    {
      field: 'createTime',
      title: '计划创建时间',
      minWidth: 135,
      formatter: 'formatDateTime',
    },
    {
      field: 'updateTime',
      title: '计划更新时间',
      minWidth: 135,
      formatter: 'formatDateTime',
    },
    {
      field: 'conclusionTime',
      title: '计划审核时间',
      minWidth: 135,
      formatter: 'formatDateTime',
    },
    {
      field: 'updater',
      title: '计划更新人',
      minWidth: 120,
    },
    {
      field: 'relatedBillNo',
      title: '关联提单号',
      minWidth: 120,
    },
    {
      field: 'applicantCompanyName',
      title: '申请人',
      minWidth: 120,
    },
    {
      field: 'cargoAgentCode',
      title: '货代',
      minWidth: 120,
    },
    {
      field: 'cargoOwnerCode',
      title: '货主',
      minWidth: 120,
    },
    {
      field: 'payerNameGate',
      title: '付费人',
      minWidth: 120,
    },
    {
      field: 'paymentTypeGate',
      title: '付费方式',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: createDictFilter('billing_method'),
      cellRender: {
        name: 'CellTagDict',
        props: 'billing_method',
      },
    },
    {
      field: 'invoiceTitle',
      title: '开票抬头',
      minWidth: 120,
    },
    {
      field: 'isBinding',
      title: '是否捆绑',
      minWidth: 120,
      formatter: ({ row }) => {
        return row.isBinding ? '✓' : '✗';
      },
    },
    {
      field: 'reviewInfo',
      title: '拒绝原因',
      minWidth: 120,
    },
    {
      field: 'handlerRemark',
      title: '备注',
      minWidth: 120,
    },
    {
      title: '操作',
      minWidth: 180,
      slots: { default: 'actions' },
      fixed: 'right',
    },
  ];
}
