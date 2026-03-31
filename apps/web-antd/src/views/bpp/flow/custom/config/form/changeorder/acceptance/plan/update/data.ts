import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';

import { z } from '#/adapter/form';

export function changeOrderPlanInfoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'applyName',
      component: 'Input',
      label: '申请人',
      componentProps: {
        placeholder: '请输入申请编号',
      },
      rules: z
        .string()
        .nonempty('作业航次为必填项')
        .regex(/^[^\u4E00-\u9FA5]*$/, '作业航次不允许输入中文'),
    },
    {
      fieldName: 'applyPhone',
      component: 'Input',
      label: '申请人联系电话',
      componentProps: {
        placeholder: '请输入申请人联系电话',
      },
      rules: 'required',
    },
    {
      fieldName: 'cargoOwnerCode',
      component: 'DatePicker',
      label: '货主单位',
      componentProps: {
        placeholder: '请输入货主单位',
      },
      rules: 'required',
    },
    {
      fieldName: 'cargoAgentCode',
      component: 'DatePicker',
      label: '货代单位',
      componentProps: {
        placeholder: '请输入货代单位',
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      component: 'Textarea',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
      },
      formItemClass: 'w-full p-0 md:col-span-2 my-3',
      rules: 'required',
    },
  ];
}

// 原计划与付费信息表单配置
export function originalPlanPaymentInfoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'applyName',
      component: 'Input',
      label: '申请人',
      componentProps: { placeholder: '请输入申请人' },
      rules: 'required',
    },
    {
      fieldName: 'applyPhone',
      component: 'Input',
      label: '申请人电话',
      componentProps: { placeholder: '请输入申请人电话' },
      rules: 'required',
    },
    {
      fieldName: 'cargoOwnerCode',
      component: 'Select',
      label: '货主单位',
      componentProps: {
        placeholder: '请选择货主单位',
        options: [
          { label: '广西中粮物流有限公司', value: '广西中粮物流有限公司' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'cargoAgentCode',
      component: 'Input',
      label: '货代单位',
      componentProps: { placeholder: '请输入货代单位' },
      rules: 'required',
    },
    {
      fieldName: 'applyPlanCount',
      component: 'InputNumber',
      label: '计划数量',
      componentProps: { placeholder: '请输入计划数量' },
      rules: 'required',
    },
    {
      fieldName: 'fleetCustomerCode',
      component: 'Input',
      label: '车队单位',
      componentProps: { placeholder: '请输入车队单位' },
      rules: 'required',
    },
    {
      fieldName: 'originalApplicationPlanStart',
      component: 'DatePicker',
      label: '开始时间',
      componentProps: { placeholder: '请选择开始时间', format: 'YYYY/MM/DD' },
      rules: 'required',
    },
    {
      fieldName: 'originalApplicationPlanEnd',
      component: 'DatePicker',
      label: '结束时间',
      componentProps: { placeholder: '请选择结束时间', format: 'YYYY/MM/DD' },
      rules: 'required',
    },
    {
      fieldName: 'payerCodeGate',
      component: 'Select',
      label: '付费单位',
      componentProps: {
        placeholder: '请选择付费单位',
        options: [
          { label: '广西中粮物流有限公司', value: '广西中粮物流有限公司' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'paymentTypeGate',
      component: 'Input',
      label: '付费方式',
      componentProps: { placeholder: '请输入付费方式' },
      rules: 'required',
    },
    {
      fieldName: 'invoiceTitle',
      component: 'Input',
      label: '发票抬头',
      componentProps: { placeholder: '请输入发票抬头' },
      rules: 'required',
    },
    {
      fieldName: 'returnTerminalName',
      component: 'Select',
      label: '返场码头',
      componentProps: {
        placeholder: '请选择返场码头',
        options: [{ label: '自动化码头', value: '自动化码头' }],
      },
      rules: 'required',
    },
    {
      fieldName: 'relatedCustomerCode',
      component: 'Input',
      label: '关联TTO',
      componentProps: { placeholder: '请输入关联TTO' },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      component: 'Textarea',
      label: '备注',
      componentProps: { placeholder: '请输入备注', rows: 3 },
    },
  ];
}

// 改单付费信息表单配置
export function changeOrderPaymentInfoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'payerCodeGate',
      component: 'Input',
      label: '付费人',
      componentProps: {
        placeholder: '请输入付费人',
      },
      rules: 'required',
    },
    {
      fieldName: 'paymentTypeGate',
      component: 'Input',
      label: '付费方式',
      componentProps: {
        placeholder: '请输入付费方式',
      },
      rules: 'required',
    },
    {
      fieldName: 'invoiceTitle',
      component: 'Input',
      label: '发票抬头',
      componentProps: {
        placeholder: '请输入发票抬头',
      },
      rules: 'required',
    },
  ];
}
// 进箱信息表单配置
export function inboxInfoFormSchema(): VbenFormSchema[] {
  return [
    // 第一行
    {
      fieldName: 'vslVoy',
      component: 'Input',
      label: '船名航次',
      componentProps: { placeholder: '请输入船名航次' },
      rules: 'required',
      dependencies: {
        triggerFields: [''],
        show: false,
      },
    },
    {
      fieldName: 'billNo',
      component: 'none',
      label: '提单号',
      rules: 'required',
    },
    {
      fieldName: 'dischargePort',
      component: 'Input',
      label: '卸货港',
      componentProps: { placeholder: '请输入卸货港' },
      rules: 'required',
    },
    {
      fieldName: 'destinationPort',
      component: 'Input',
      label: '目的港',
      componentProps: { placeholder: '请输入目的港' },
      rules: 'required',
    },

    // 第二行
    {
      fieldName: 'HolderCode',
      component: 'Input',
      label: '持箱人',
      componentProps: { placeholder: '请输入持箱人' },
      rules: 'required',
    },
    {
      fieldName: 'isLCL',
      component: 'Input',
      label: '是否拼箱',
      componentProps: { placeholder: '' },
      rules: 'required',
    },
    {
      fieldName: 'isOverLimit',
      component: 'RadioGroup',
      label: '是否超限',
      componentProps: {
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'transportMode',
      component: 'Input',
      label: '运输方式',
      componentProps: { placeholder: '请输入运输方式' },
      rules: 'required',
    },

    // 第三行
    {
      fieldName: 'tradeType',
      component: 'RadioGroup',
      label: '内贸/外贸',
      componentProps: {
        options: [
          { label: '内贸', value: 'domestic' },
          { label: '外贸', value: 'foreign' },
        ],
        defaultValue: 'domestic',
      },
      rules: 'required',
    },
    {
      fieldName: 'cargoName',
      component: 'Input',
      label: '货名',
      componentProps: { placeholder: '请输入货名' },
      rules: 'required',
    },
    {
      fieldName: 'overLimitFront',
      component: 'Input',
      label: '前超',
      componentProps: { placeholder: '请输入前超' },
      rules: 'required',
    },
    {
      fieldName: 'railwayStation',
      component: 'Input',
      label: '火车站点',
      componentProps: { placeholder: '请输入火车站点' },
      rules: 'required',
    },

    // 第四行
    {
      fieldName: 'size',
      component: 'Input',
      label: '尺寸',
      componentProps: { placeholder: '请输入尺寸' },
      rules: 'required',
    },
    {
      fieldName: 'unNo',
      component: 'Input',
      label: 'UNNO',
      componentProps: { placeholder: '请输入UNNO' },
      rules: 'required',
    },
    {
      fieldName: 'overLimitBack',
      component: 'Input',
      label: '后超',
      componentProps: { placeholder: '请输入后超' },
      rules: 'required',
    },
    {
      fieldName: 'isLandSeaTradeChannel',
      component: 'Input',
      label: '是否陆海贸易新通道',
      componentProps: { placeholder: '' },
      rules: 'required',
    },

    // 第五行
    {
      fieldName: 'contType',
      component: 'Input',
      label: '箱型',
      componentProps: { placeholder: '请输入箱型' },
      rules: 'required',
    },
    {
      fieldName: 'imdgCodeCode',
      component: 'Input',
      label: 'imdgCode',
      componentProps: { placeholder: '请输入imdgCode' },
      rules: 'required',
    },
    {
      fieldName: 'overLimitLeft',
      component: 'Input',
      label: '左超',
      componentProps: { placeholder: '请输入左超' },
      rules: 'required',
    },
    {
      fieldName: 'sourceDirection',
      component: 'Input',
      label: '来源/流向',
      componentProps: { placeholder: '请输入来源/流向' },
      rules: 'required',
    },

    // 第六行
    {
      fieldName: 'contHeight',
      component: 'Input',
      label: '箱高',
      componentProps: { placeholder: '请输入箱高' },
      rules: 'required',
    },
    {
      fieldName: 'isRefrigerated',
      component: 'RadioGroup',
      label: '是否打冷',
      componentProps: {
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'overLimitRight',
      component: 'Input',
      label: '右超',
      componentProps: { placeholder: '请输入右超' },
      rules: 'required',
    },
    {
      fieldName: 'customsDeclarationMode',
      component: 'Input',
      label: '报关方式',
      componentProps: { placeholder: '请输入报关方式' },
      rules: 'required',
    },

    // 第七行
    {
      fieldName: 'contIso',
      component: 'Input',
      label: '箱ISO',
      componentProps: { placeholder: '请输入箱ISO' },
      rules: 'required',
    },
    {
      fieldName: 'refrigerationTemp',
      component: 'Input',
      label: '打冷温度',
      componentProps: { placeholder: '请输入打冷温度' },
      rules: 'required',
    },
    {
      fieldName: 'OverLimitHeight',
      component: 'Input',
      label: '超高',
      componentProps: { placeholder: '请输入超高' },
      rules: 'required',
    },
    {
      fieldName: 'contWeightKg',
      component: 'Input',
      label: '箱重',
      componentProps: { placeholder: '请输入箱重' },
      rules: 'required',
    },

    // 第八行
    {
      fieldName: 'contEmptyKg',
      component: 'Input',
      label: '空重',
      componentProps: { placeholder: '' },
      rules: 'required',
    },
    {
      fieldName: 'ventilationPort',
      component: 'Input',
      label: '通风口',
      componentProps: { placeholder: '请输入通风口' },
      rules: 'required',
    },
    {
      fieldName: 'isDamaged',
      component: 'RadioGroup',
      label: '是否残损',
      componentProps: {
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'isDirectPickLoad',
      component: 'RadioGroup',
      label: '是否直装',
      componentProps: {
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' },
        ],
      },
      rules: 'required',
    },

    // 第九行
    {
      fieldName: 'isCommodityEmptyCont',
      component: 'RadioGroup',
      label: '是否商品空箱',
      componentProps: {
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' },
        ],
        defaultValue: 'no',
      },
      rules: 'required',
    },
    {
      fieldName: 'contGrade',
      component: 'Input',
      label: '箱等级',
      componentProps: { placeholder: '请输入箱等级' },
      rules: 'required',
    },
    {
      fieldName: 'damageGrade',
      component: 'Input',
      label: '残损等级',
      componentProps: { placeholder: '请输入残损等级' },
      rules: 'required',
    },
  ];
}
// 提箱信息表单配置
export function pickupBoxInfoFormSchema(): VbenFormSchema[] {
  return [
    // 第一行
    {
      fieldName: 'vslVoy',
      component: 'Input',
      label: '船名航次',
      componentProps: {
        placeholder: '请输入船名航次',
      },
      dependencies: {
        triggerFields: [''],
        show: () => true,
      },
      rules: 'required',
    },
    {
      fieldName: 'billNo',
      component: 'Input',
      label: '提单号',
      componentProps: {
        placeholder: '请输入提单号',
      },
      rules: 'required',
    },
    {
      fieldName: 'contEmptyKg',
      component: 'Input',
      label: '空重',
      componentProps: {
        placeholder: '请输入空重',
      },
      rules: 'required',
    },
    {
      fieldName: 'isCommodityEmptyCont',
      component: 'RadioGroup',
      label: '是否商品空箱',
      componentProps: {
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' },
        ],
        defaultValue: 'no',
      },
      rules: 'required',
    },

    // 第二行
    {
      fieldName: 'size',
      component: 'Input',
      label: '尺寸',
      componentProps: {
        placeholder: '请输入尺寸',
      },
      rules: 'required',
    },
    {
      fieldName: 'contType',
      component: 'Input',
      label: '箱型',
      componentProps: {
        placeholder: '请输入箱型',
      },
      rules: 'required',
    },
    {
      fieldName: 'contHeight',
      component: 'Input',
      label: '箱高',
      componentProps: {
        placeholder: '请输入箱高',
      },
      rules: 'required',
    },
    {
      fieldName: 'contIso',
      component: 'Input',
      label: '箱ISO',
      componentProps: {
        placeholder: '请输入箱ISO',
      },
      rules: 'required',
    },

    // 第三行
    {
      fieldName: 'HolderCode',
      component: 'Input',
      label: '持箱人',
      componentProps: {
        placeholder: '请输入持箱人',
      },
      rules: 'required',
    },
    {
      fieldName: 'tradeType',
      component: 'RadioGroup',
      label: '内贸/外贸',
      componentProps: {
        options: [
          { label: '内贸', value: 'domestic' },
          { label: '外贸', value: 'foreign' },
        ],
        defaultValue: 'domestic',
      },
      rules: 'required',
    },
    {
      fieldName: 'imdgCode',
      component: 'Input',
      label: 'IMDGCode',
      componentProps: {
        placeholder: '请输入imdgCode',
      },
      rules: 'required',
    },
    {
      fieldName: 'unNo',
      component: 'Input',
      label: 'UNNO',
      componentProps: {
        placeholder: '请输入UNNO',
      },
      rules: 'required',
    },

    // 第四行
    {
      fieldName: 'contGrade',
      component: 'Input',
      label: '箱等级',
      componentProps: {
        placeholder: '请输入箱等级',
      },
      rules: 'required',
    },
    {
      fieldName: 'isPTIValid',
      component: 'RadioGroup',
      label: '是否PTI有效',
      componentProps: {
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'isDamaged',
      component: 'RadioGroup',
      label: '是否残损',
      componentProps: {
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'damagedGrade',
      component: 'Input',
      label: '残损等级',
      componentProps: {
        placeholder: '请输入残损等级',
      },
      rules: 'required',
    },

    // 第五行
    {
      fieldName: 'transportMode',
      component: 'Input',
      label: '运输方式',
      componentProps: {
        placeholder: '请输入运输方式',
      },
      rules: 'required',
    },
    {
      fieldName: 'railwayStation',
      component: 'Input',
      label: '火车站点',
      componentProps: {
        placeholder: '请输入火车站点',
      },
      rules: 'required',
    },
    {
      fieldName: 'isLandSeaTradeChannel',
      component: 'RadioGroup',
      label: '是否陆海贸易新通道',
      componentProps: {
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'sourceDirection',
      component: 'Input',
      label: '来源/流向',
      componentProps: {
        placeholder: '请输入来源/流向',
      },
      rules: 'required',
    },

    // 第六行
    {
      fieldName: 'relatedOrderNo',
      component: 'Input',
      label: '关联提单号',
      componentProps: {
        placeholder: '请输入关联提单号',
      },
      rules: 'required',
    },
    {
      fieldName: 'isAssigned',
      component: 'RadioGroup',
      label: '是否指定',
      componentProps: {
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'assignedReason',
      component: 'Input',
      label: '指定原因',
      componentProps: {
        placeholder: '请输入指定原因',
      },
      rules: 'required',
    },
    {
      fieldName: 'isDirectPickLoad',
      component: 'RadioGroup',
      label: '是否直提',
      componentProps: {
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' },
        ],
      },
      rules: 'required',
    },

    // 第七行
    {
      fieldName: 'relatedPlanNo',
      component: 'Input',
      label: '关联计划号',
      componentProps: {
        placeholder: '请输入关联计划号',
      },
      rules: 'required',
    },
  ];
}
/** 进箱信息列表的字段 */
export function inboxInfoColumns(): VxeTableGridOptions['columns'] {
  return [
    // 复选框列
    { type: 'checkbox', width: 40, fixed: 'left' },

    // 序号列
    {
      title: '序号',
      width: 60,
      align: 'center',
      type: 'seq',
    },

    // 持箱人
    {
      field: 'HolderCode',
      title: '持箱人',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 尺寸
    {
      field: 'size',
      title: '尺寸',
      minWidth: 80,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 箱型
    {
      field: 'contType',
      title: '箱型',
      minWidth: 80,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 箱高
    {
      field: 'contHeight',
      title: '箱高',
      minWidth: 80,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 箱ISO
    {
      field: 'contIso',
      title: '箱ISO',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 空重
    {
      field: 'contEmptyKg',
      title: '空重',
      minWidth: 80,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 内外贸
    {
      field: 'tradeType',
      title: '内外贸',
      minWidth: 100,
      filters: [{ data: 'domestic' }, { data: 'foreign' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '',
          allowClear: true,
          options: [
            { label: '内贸', value: 'domestic' },
            { label: '外贸', value: 'foreign' },
          ],
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}` === option.data;
        }
        return true;
      },
      formatter: ({ cellValue }) => {
        return cellValue === 'domestic' ? '内贸' : '外贸';
      },
    },

    // 货名
    {
      field: 'cargoName',
      title: '货名',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 型号
    {
      field: 'model',
      title: '型号',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 当前位置
    {
      field: 'currentLocation',
      title: '当前位置',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 进口船名
    {
      field: 'importVesselName',
      title: '进口船名',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 进口航次
    {
      field: 'importVoyage',
      title: '进口航次',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 出口船名
    {
      field: 'exportVesselName',
      title: '出口船名',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 出口航次
    {
      field: 'exportVoyage',
      title: '出口航次',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 外贸港
    {
      field: 'foreignTradePort',
      title: '外贸港',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 目的港
    {
      field: 'destinationPort',
      title: '目的港',
      minWidth: 120,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 箱等级
    {
      field: 'contGrade',
      title: '箱等级',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 柜封号
    {
      field: 'contSealNo',
      title: '柜封号',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 箱重
    {
      field: 'contWeightKg',
      title: '箱重',
      minWidth: 80,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 海关编码
    {
      field: 'customsCode',
      title: '海关编码',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 票货类型
    {
      field: 'ticketCargoType',
      title: '票货类型',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 执法等级
    {
      field: 'lawEnforcementLevel',
      title: '执法等级',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 是否冷箱
    {
      field: 'isRefrigerated',
      title: '是否冷箱',
      minWidth: 100,
      filters: [{ data: 'yes' }, { data: 'no' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '',
          allowClear: true,
          options: [
            { label: '是', value: 'yes' },
            { label: '否', value: 'no' },
          ],
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}` === option.data;
        }
        return true;
      },
      formatter: ({ cellValue }) => {
        return cellValue === 'yes' ? '是' : '否';
      },
    },

    // 打冷温度
    {
      field: 'refrigerationTemp',
      title: '打冷温度',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 通风口
    {
      field: 'ventilationPort',
      title: '通风口',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 是否框架
    {
      field: 'isFramework',
      title: '是否框架',
      minWidth: 100,
      filters: [{ data: 'yes' }, { data: 'no' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '',
          allowClear: true,
          options: [
            { label: '是', value: 'yes' },
            { label: '否', value: 'no' },
          ],
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}` === option.data;
        }
        return true;
      },
      formatter: ({ cellValue }) => {
        return cellValue === 'yes' ? '是' : '否';
      },
    },

    // 左超
    {
      field: 'overLimitLeft',
      title: '左超',
      minWidth: 80,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 右超
    {
      field: 'overLimitRight',
      title: '右超',
      minWidth: 80,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          allowClear: true,
          placeholder: '',
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 前超
    {
      field: 'overLimitFront',
      title: '前超',
      minWidth: 80,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          allowClear: true,
          placeholder: '',
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 后超
    {
      field: 'overLimitRear',
      title: '后超',
      minWidth: 80,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          allowClear: true,
          placeholder: '',
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 超高
    {
      field: 'overlimitHeight',
      title: '超高',
      minWidth: 80,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          allowClear: true,
          placeholder: '',
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 进场时间
    {
      field: 'entryTime',
      title: '进场时间',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          allowClear: true,
          placeholder: '',
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 出场时间
    {
      field: 'exitTime',
      title: '出场时间',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          allowClear: true,
          placeholder: '',
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 车队
    {
      field: 'fleet',
      title: '车队',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          allowClear: true,
          placeholder: '',
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 进场方式
    {
      field: 'entryMethod',
      title: '进场方式',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          allowClear: true,
          placeholder: '',
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 出场方式
    {
      field: 'exitMethod',
      title: '出场方式',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          allowClear: true,
          placeholder: '',
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },

    // 操作列
    {
      title: '操作',
      width: 160,
      fixed: 'right',
      slots: {
        default: 'operation', // 对应模板中的 slot 名称
      },
    },
  ];
}
