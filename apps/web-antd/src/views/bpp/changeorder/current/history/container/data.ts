import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';

export function changeOrderPlanInfoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'person',
      component: 'Select',
      label: '申请人',
      componentProps: {
        allowClear: true,
        placeholder: '请输入申请人',
      },
      rules: 'required',
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
      fieldName: 'company',
      component: 'Select',
      label: '货主单位',
      componentProps: {
        allowClear: true,
        placeholder: '请输入货主单位',
      },
      rules: 'required',
    },
    {
      fieldName: 'agentCompany',
      component: 'Select',
      label: '货代单位',
      componentProps: {
        allowClear: true,
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
    },
  ];
}

/** 箱信息列表的搜索栏 */
export function boxInfoSearchFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'contNo',
      label: '集装箱号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入集装箱号',
        allowClear: true,
      },
    },
    {
      fieldName: 'owner',
      label: '持箱人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入持箱人',
        allowClear: true,
      },
    },
    {
      fieldName: 'vesselVoyage',
      label: '船名航次',
      component: 'Input',
      componentProps: {
        placeholder: '请输入船名航次',
        allowClear: true,
      },
    },
    {
      fieldName: 'pickupNo',
      label: '提单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入提单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'containerStatus',
      label: '箱状态',
      component: 'Input',
      componentProps: {
        placeholder: '请输入箱状态',
        allowClear: true,
      },
    },
  ];
}

/** 箱信息字段 */
export function boxInfoColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    { type: 'checkbox', width: 40, fixed: 'left' },
    {
      field: 'contNo',
      title: '集装箱号',
      minWidth: 80,
      fixed: 'left',
    },
    {
      field: 'vesselVoyage',
      title: '船名航次',
      minWidth: 80,
    },
    {
      field: 'pickupNo',
      title: '提单号',
      minWidth: 80,
    },
    {
      field: 'sealNo',
      title: '铅封号',
      minWidth: 80,
    },
    {
      field: 'owner',
      title: '持箱人',
      minWidth: 50,
    },
    {
      field: 'containerFlow',
      title: '箱流向',
      minWidth: 80,
    },
    {
      field: 'containerStatus',
      title: '状态',
      minWidth: 50,
    },
  ];
}

// 业务类型信息表单配置
export function businessTypeInfoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'originalApplicant',
      component: 'Select',
      label: '业务类型',
      componentProps: {
        placeholder: '',
        options: [
          { label: '广西中粮物流有限公司', value: '广西中粮物流有限公司' },
          { label: '广西中粮物流有限公司', value: '广西中粮物流有限公司' },
          { label: '在场中转箱修改为进口箱', value: '3' },
        ],
        defaultValue: '3',
      },
    },
    {
      fieldName: 'containerStatus',
      component: 'Text',
      label: '状态',
      componentProps: {
        placeholder: '',
      },
    },
    {
      fieldName: 'originalShipperUnit',
      component: 'Text',
      label: '受理计划号：',
      componentProps: {
        placeholder: '',
      },
    },
    {
      fieldName: 'originalForwarderUnit',
      component: 'Text',
      label: '审核说明：',
      componentProps: {
        placeholder: '',
      },
    },
  ];
}

// 改单付费信息表单配置
export function changeOrderPaymentInfoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'payer',
      component: 'Select',
      label: '付费人',
      componentProps: {
        allowClear: true,
        placeholder: '',
      },
      rules: 'required',
    },
    {
      fieldName: 'changePaymentMethod',
      component: 'Input',
      label: '付费方式',
      componentProps: {
        allowClear: true,
        placeholder: '',
      },
      rules: 'required',
    },
    {
      fieldName: 'changeInvoiceHead',
      component: 'Input',
      label: '发票抬头',
      componentProps: {
        allowClear: true,
        placeholder: '',
        disabled: true,
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
      fieldName: 'vesselVoyage',
      component: 'Input',
      label: '船名航次',
      componentProps: { placeholder: '请输入船名航次' },
      rules: 'required',
    },
    {
      fieldName: 'pickupNo',
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
      fieldName: 'owner',
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
      fieldName: 'transportType',
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
      fieldName: 'contType',
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
      fieldName: 'right',
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
      fieldName: 'overHeight',
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
      fieldName: 'vent',
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
      fieldName: 'pickupNo',
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
      fieldName: 'contType',
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
      fieldName: 'owner',
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
      fieldName: 'damage',
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
      fieldName: 'transportType',
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
export function boxlistColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 40, fixed: 'left' },
    { type: 'checkbox', width: 40, fixed: 'left' },
    {
      field: 'contNo',
      title: '箱号',
      minWidth: 120,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'editedContNo',
      title: '修改箱号',
      minWidth: 120,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'owner',
      title: '持箱人',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'importVesselName',
      title: '进口船名航次',
      minWidth: 120,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'exportVesselName',
      title: '出口船名航次',
      minWidth: 120,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'originPort',
      title: '始发港',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'loadPort',
      title: '装货港',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'dischargePort',
      title: '卸货港',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'nextDischargePort',
      title: '下一卸货港',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'destinationPort',
      title: '目的港',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'isOverLimit',
      title: '拼箱',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'pickupNo',
      title: '提单号',
      minWidth: 120,
      slots: { default: 'pickupNo' },
    },
    {
      field: 'isLCL',
      title: '空/重',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'tradeType',
      title: '内/外贸',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'containerFlow',
      title: '箱流向',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'containerStatus',
      title: '状态',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'size',
      title: '尺寸',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'contType',
      title: '箱型',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'containerHeight',
      title: '箱高',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'iso',
      title: 'ISO',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'weight',
      title: '箱重',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'vgm',
      title: 'VGM',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'containerLevel',
      title: '箱等级',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'damage',
      title: '是否残损',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'damageLevel',
      title: '残损等级',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'pti',
      title: 'PTI有效',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'ptiTime',
      title: '有效期',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'imdg',
      title: '危品等级（IMDG）',
      minWidth: 150,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'unno',
      title: '危品联合国代码（UNNO）',
      minWidth: 180,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'sealNo',
      title: '铅封号',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'isRefrigerated',
      title: '是否打冷',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'temperature',
      title: '温度',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'vent',
      title: '通风口',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'overLimit',
      title: '是否超限箱',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'front',
      title: '前超',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'rear',
      title: '后超',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'left',
      title: '左超',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'right',
      title: '右超',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'overHeight',
      title: '超高',
      minWidth: 80,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'transportType',
      title: '运输方式',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'isLandSeaTrade',
      title: '是否陆海贸易新通道',
      minWidth: 150,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'trainStation',
      title: '火车站点',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'sourceFlow',
      title: '来源/流向',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'customsType',
      title: '报关方式',
      minWidth: 100,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'emptyFlag',
      title: '商品空箱标志',
      minWidth: 140,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
    {
      field: 'transferFlag',
      title: '国际中转箱标志',
      minWidth: 140,
      editRender: {
        name: 'input',
      },
      align: 'center',
    },
  ];
}
/** 批量修改的字段 */
export function batchEditFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'owner',
      label: '持箱人',
      component: 'Input',
    },
    {
      fieldName: 'importVesselName',
      label: '进口船名航次',
      component: 'Select',
      componentProps: {
        placeholder: '请输入进口船名航次',
        allowClear: true,
      },
    },
    {
      fieldName: 'exportVesselName',
      label: '出口船名航次',
      component: 'Select',
      componentProps: {
        placeholder: '请输入出口船名航次',
        allowClear: true,
      },
    },
    {
      fieldName: 'originPort',
      label: '始发港',
      component: 'Input',
    },
    {
      fieldName: 'loadPort',
      label: '装货港',
      component: 'Input',
    },
    {
      fieldName: 'dischargePort',
      label: '卸货港',
      component: 'Input',
    },
    {
      fieldName: 'nextDischargePort',
      label: '下一卸货港',
      component: 'Input',
    },
    {
      fieldName: 'destinationPort',
      label: '目的港',
      component: 'Input',
    },
    {
      fieldName: 'empty',
      label: '空重',
      component: 'Input',
    },
    {
      fieldName: 'pickupNo',
      label: '提单号',
      component: 'PrimaryButton',
      componentProps: {
        onClick: () => {
          console.log('点击了选择提单号按钮');
        },
      },
      renderComponentContent: () => {
        return {
          default: () => '选择提单号',
        };
      },
    },
    {
      fieldName: 'tradeType',
      label: '内/外贸',
      component: 'Input',
    },
    {
      fieldName: 'weight',
      label: '箱重',
      component: 'Input',
    },
    {
      fieldName: 'containerFlow',
      label: '箱流向',
      component: 'Input',
    },
    {
      fieldName: 'cargo',
      label: '商品空箱标志',
      component: 'Input',
    },
    {
      fieldName: 'cargo',
      label: '国际中转箱标志',
      component: 'Input',
    },
    {
      fieldName: 'size',
      label: '尺寸',
      component: 'Input',
    },
    {
      fieldName: 'contType',
      label: '箱型',
      component: 'Input',
    },
    {
      fieldName: 'containerHeight',
      label: '箱高',
      component: 'Input',
    },
    {
      fieldName: 'iso',
      label: 'ISO',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'vgm',
      label: 'VGM',
      component: 'Input',
    },
    {
      fieldName: 'containerLevel',
      label: '箱等级',
      component: 'Input',
    },
    {
      fieldName: 'damage',
      label: '是否残损',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是', value: 'Y' },
          { label: '否', value: 'N' },
        ],
      },
    },
    {
      fieldName: 'damageLevel',
      label: '残损等级',
      component: 'Input',
    },
    {
      fieldName: 'trainStation',
      label: '火车站点',
      component: 'Input',
    },
    {
      fieldName: 'imdg',
      label: '危品等级（IMDG）',
      component: 'Input',
    },
    {
      fieldName: 'unno',
      label: '危品联合国代码（UNNO）',
      component: 'Input',
    },
    {
      fieldName: 'transportType',
      label: '运输方式',
      component: 'Input',
    },
    {
      fieldName: 'isRefrigerated',
      label: '是否打冷',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是', value: 'Y' },
          { label: '否', value: 'N' },
        ],
      },
    },
    {
      fieldName: 'temperature',
      label: '温度',
      component: 'Input',
    },
    {
      fieldName: 'vent',
      label: '通风口',
      component: 'Input',
    },
    {
      fieldName: 'overLimit',
      label: '是否超限',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是', value: 'Y' },
          { label: '否', value: 'N' },
        ],
      },
    },
    {
      fieldName: 'front',
      label: '前超',
      component: 'Input',
    },
    {
      fieldName: 'rear',
      label: '后超',
      component: 'Input',
    },
    {
      fieldName: 'front',
      label: '左超',
      component: 'Input',
    },
    {
      fieldName: 'right',
      label: '右超',
      component: 'Input',
    },
    {
      fieldName: 'overHeight',
      label: '超高',
      component: 'Input',
    },
    {
      fieldName: 'isLandSeaTrade',
      label: '是否陆海贸易新通道',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是', value: 'Y' },
          { label: '否', value: 'N' },
        ],
      },
    },
    {
      fieldName: 'sourceFlow',
      label: '来源/流向',
      component: 'Input',
    },
    {
      fieldName: 'customsType',
      label: '报关方式',
      component: 'Input',
    },
  ];
}

/** 提单信息管理表格列配置 */
export function ladingBillColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: '序号',
      type: 'seq',
      field: 'serialNumber',
      width: 50,
      align: 'center',
    },
    {
      type: 'checkbox',
      field: 'checkbox',
      width: 40,
      fixed: 'left',
    },
    {
      field: 'pickupNo',
      title: '提单号',
      minWidth: 120,
      fixed: 'left',
      sortable: true,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'cargo',
      title: '货名',
      minWidth: 120,
      sortable: true,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'packageWeight',
      title: '货件重',
      minWidth: 120,
      sortable: true,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'quantity',
      title: '货件重',
      minWidth: 120,
      sortable: true,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'totalWeight',
      title: '货总重',
      minWidth: 120,
      sortable: true,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'volume',
      title: '货体积',
      minWidth: 120,
      sortable: true,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'operation',
      title: '操作',
      minWidth: 120,
      slots: { default: 'operationAction' },
    },
  ];
}
