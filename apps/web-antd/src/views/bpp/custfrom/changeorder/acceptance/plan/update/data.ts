import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';

export function changeOrderPlanInfoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'applyCode',
      component: 'Input',
      label: '申请人',
      componentProps: {
        placeholder: '请输入订单编号',
      },
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
      rules: 'required',
      disabled: true,
    },
    {
      fieldName: 'applyPhone',
      component: 'Input',
      label: '申请人联系电话',
      componentProps: {
        placeholder: '请输入申请人联系电话',
      },
      disabled: true,
    },
    {
      fieldName: 'applyTime',
      component: 'DatePicker',
      label: '货主单位',
      componentProps: {
        placeholder: '请输入货主单位',
      },
      rules: 'required',
      disabled: true,
    },
    {
      fieldName: 'applyTime',
      component: 'DatePicker',
      label: '货代单位',
      componentProps: {
        placeholder: '请输入货代单位',
      },
      rules: 'required',
      disabled: true,
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
      disabled: true,
    },
  ];
}

// 原计划与付费信息表单配置
export function originalPlanPaymentInfoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'originalApplicant',
      component: 'Input',
      label: '申请人',
      componentProps: {
        placeholder: '请输入申请人',
      },
      rules: 'required',
    },
    {
      fieldName: 'originalApplicantPhone',
      component: 'Input',
      label: '申请人电话',
      componentProps: {
        placeholder: '请输入申请人电话',
      },
      rules: 'required',
    },
    {
      fieldName: 'originalShipperUnit',
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
      fieldName: 'originalForwarderUnit',
      component: 'Input',
      label: '货代单位',
      componentProps: {
        placeholder: '请选择货代单位',
      },
      rules: 'required',
    },
    {
      fieldName: 'originalPlanQuantity',
      component: 'Input',
      label: '计划数量',
      componentProps: {
        placeholder: '请选择计划数量',
      },
      rules: 'required',
    },
    {
      fieldName: 'originalVehicleUnit',
      component: 'Input',
      label: '车队单位',
      componentProps: {
        placeholder: '请选择车队单位',
      },
      rules: 'required',
    },
    {
      fieldName: 'originalStartTime',
      component: 'DatePicker',
      label: '开始时间',
      componentProps: {
        placeholder: '请选择开始时间',
        format: 'YYYY/MM/DD',
      },
      rules: 'required',
    },
    {
      fieldName: 'originalEndTime',
      component: 'DatePicker',
      label: '结束时间',
      componentProps: {
        placeholder: '请选择结束时间',
        format: 'YYYY/MM/DD',
      },
      rules: 'required',
    },
    {
      fieldName: 'originalPaymentUnit',
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
      fieldName: 'originalPaymentMethod',
      component: 'Input',
      label: '付费方式',
      componentProps: {
        placeholder: '请选择付费方式',
      },
      rules: 'required',
    },
    {
      fieldName: 'originalInvoiceHead',
      component: 'Input',
      label: '发票抬头',
      componentProps: {
        placeholder: '请选择发票抬头',
      },
      rules: 'required',
    },
    {
      fieldName: 'originalReturnWharf',
      component: 'Input',
      label: '返场码头',
      componentProps: {
        placeholder: '',
        options: [{ label: '自动化码头', value: '自动化码头' }],
      },
    },
    {
      fieldName: 'originalGatewayTTO',
      component: 'Input',
      label: '关联TTO',
      componentProps: {
        placeholder: '',
      },
    },
    {
      fieldName: 'originalRemark',
      component: 'Textarea',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
        rows: 3,
      },
      formItemClass: 'w-full p-0 md:col-span-2',
    },
  ];
}

// 改单付费信息表单配置
export function changeOrderPaymentInfoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'changePayer',
      component: 'Input',
      label: '付费人',
      componentProps: {
        placeholder: '',
      },
    },
    {
      fieldName: 'changePaymentMethod',
      component: 'Input',
      label: '付费方式',
      componentProps: {
        placeholder: '',
      },
    },
    {
      fieldName: 'changeInvoiceHead',
      component: 'Input',
      label: '发票抬头',
      componentProps: {
        placeholder: '',
      },
    },
  ];
}
// 进箱信息表单配置
export function inboxInfoFormSchema(): VbenFormSchema[] {
  return [
    // 第一行
    {
      fieldName: 'vesselVoyage',
      component: 'Input',
      label: '船名航次',
      componentProps: { placeholder: '请输入船名航次' },
      rules: 'required',
    },
    {
      fieldName: 'billOfLadingNo',
      component: 'Input',
      label: '提单号',
      componentProps: { placeholder: '请输入提单号' },
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
      fieldName: 'containerHolder',
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
      fieldName: 'frontOver',
      component: 'Input',
      label: '前超',
      componentProps: { placeholder: '请输入前超' },
      rules: 'required',
    },
    {
      fieldName: 'trainStation',
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
      fieldName: 'unno',
      component: 'Input',
      label: 'UNNO',
      componentProps: { placeholder: '请输入UNNO' },
      rules: 'required',
    },
    {
      fieldName: 'rearOver',
      component: 'Input',
      label: '后超',
      componentProps: { placeholder: '请输入后超' },
      rules: 'required',
    },
    {
      fieldName: 'isLandSeaTrade',
      component: 'Input',
      label: '是否陆海贸易新通道',
      componentProps: { placeholder: '' },
      rules: 'required',
    },

    // 第五行
    {
      fieldName: 'containerType',
      component: 'Input',
      label: '箱型',
      componentProps: { placeholder: '请输入箱型' },
      rules: 'required',
    },
    {
      fieldName: 'imdg',
      component: 'Input',
      label: 'IMDG',
      componentProps: { placeholder: '请输入IMDG' },
      rules: 'required',
    },
    {
      fieldName: 'leftOver',
      component: 'Input',
      label: '左超',
      componentProps: { placeholder: '请输入左超' },
      rules: 'required',
    },
    {
      fieldName: 'sourceFlow',
      component: 'Input',
      label: '来源/流向',
      componentProps: { placeholder: '请输入来源/流向' },
      rules: 'required',
    },

    // 第六行
    {
      fieldName: 'containerHeight',
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
      fieldName: 'rightOver',
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
      fieldName: 'containerISO',
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
      fieldName: 'heightOver',
      component: 'Input',
      label: '超高',
      componentProps: { placeholder: '请输入超高' },
      rules: 'required',
    },
    {
      fieldName: 'containerWeight',
      component: 'Input',
      label: '箱重',
      componentProps: { placeholder: '请输入箱重' },
      rules: 'required',
    },

    // 第八行
    {
      fieldName: 'weightType',
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
      fieldName: 'isShallowDraft',
      component: 'RadioGroup',
      label: '是否浅栽',
      componentProps: {
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'isDirectLoading',
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
      fieldName: 'isCommodityEmptyBox',
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
      fieldName: 'containerLevel',
      component: 'Input',
      label: '箱等级',
      componentProps: { placeholder: '请输入箱等级' },
      rules: 'required',
    },
    {
      fieldName: 'damageLevel',
      component: 'Input',
      label: '残损等级',
      componentProps: { placeholder: '请输入残损等级' },
      rules: 'required',
    },
  ];
}
// 提箱信息表单配置（匹配图片所示字段）
export function pickupBoxInfoFormSchema(): VbenFormSchema[] {
  return [
    // 第一行
    {
      fieldName: 'routeNavigation',
      component: 'Input',
      label: '船名航次',
      componentProps: {
        placeholder: '请输入船名航次',
      },
      rules: 'required',
    },
    {
      fieldName: 'pickupOrderNo',
      component: 'Input',
      label: '提单号',
      componentProps: {
        placeholder: '请输入提单号',
      },
      rules: 'required',
    },
    {
      fieldName: 'emptyWeight',
      component: 'Input',
      label: '空重',
      componentProps: {
        placeholder: '请输入空重',
      },
      rules: 'required',
    },
    {
      fieldName: 'isCommodityEmptyBox',
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
      fieldName: 'containerType',
      component: 'Input',
      label: '箱型',
      componentProps: {
        placeholder: '请输入箱型',
      },
      rules: 'required',
    },
    {
      fieldName: 'containerHeight',
      component: 'Input',
      label: '箱高',
      componentProps: {
        placeholder: '请输入箱高',
      },
      rules: 'required',
    },
    {
      fieldName: 'containerISO',
      component: 'Input',
      label: '箱ISO',
      componentProps: {
        placeholder: '请输入箱ISO',
      },
      rules: 'required',
    },

    // 第三行
    {
      fieldName: 'containerHolder',
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
      fieldName: 'imdg',
      component: 'Input',
      label: 'IMDG',
      componentProps: {
        placeholder: '请输入IMDG',
      },
      rules: 'required',
    },
    {
      fieldName: 'unno',
      component: 'Input',
      label: 'UNNO',
      componentProps: {
        placeholder: '请输入UNNO',
      },
      rules: 'required',
    },

    // 第四行
    {
      fieldName: 'containerLevel',
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
      fieldName: 'damageLevel',
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
      fieldName: 'trainStation',
      component: 'Input',
      label: '火车站点',
      componentProps: {
        placeholder: '请输入火车站点',
      },
      rules: 'required',
    },
    {
      fieldName: 'isLandSeaTradeNewChannel',
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
      fieldName: 'sourceFlow',
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
      fieldName: 'isDesignated',
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
      fieldName: 'designatedReason',
      component: 'Input',
      label: '指定原因',
      componentProps: {
        placeholder: '请输入指定原因',
      },
      rules: 'required',
    },
    {
      fieldName: 'isDirectLoading',
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

    // 船名航次
    {
      field: 'vesselVoyage',
      title: '船名航次',
      minWidth: 180,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入船名航次',
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

    // 提单号
    {
      field: 'billOfLadingNo',
      title: '提单号',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入提单号',
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

    // 卸货港
    {
      field: 'dischargePort',
      title: '卸货港',
      minWidth: 120,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入卸货港',
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
          placeholder: '请输入目的港',
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

    // 持箱人
    {
      field: 'containerHolder',
      title: '持箱人',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入持箱人',
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

    // 是否拼箱
    {
      field: 'isLCL',
      title: '是否拼箱',
      minWidth: 100,
      filters: [{ data: '是' }, { data: '否' }],
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
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}` === option.data;
        }
        return true;
      },
    },

    // 是否超限
    {
      field: 'isOverLimit',
      title: '是否超限',
      minWidth: 100,
      filters: [{ data: 'yes' }, { data: 'no' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
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
      // 格式化显示值
      formatter: ({ cellValue }) => {
        return cellValue === 'yes' ? '是' : '否';
      },
    },

    // 内贸/外贸
    {
      field: 'tradeType',
      title: '内贸/外贸',
      minWidth: 100,
      filters: [{ data: 'domestic' }, { data: 'foreign' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
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
          placeholder: '请输入尺寸',
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
      field: 'containerType',
      title: '箱型',
      minWidth: 80,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入箱型',
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

    // 是否打冷
    {
      field: 'isRefrigerated',
      title: '是否打冷',
      minWidth: 100,
      filters: [{ data: 'yes' }, { data: 'no' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
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
