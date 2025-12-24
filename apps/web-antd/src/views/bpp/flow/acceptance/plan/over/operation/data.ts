import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DescriptionItemSchema } from '#/components/description';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

import { z } from '#/adapter/form';
import { getDictDataPage } from '#/api/bpp/base/dict/data';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
import { getRangePickerDefaultProps } from '#/utils';

const bppBaseDict = bppBaseDictStore();
// 预加载需要的字典数据
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
function renderTagDict(dictType: string, cellValue: string) {
  const dictOptions = bppBaseDict.getBppBaseDictOptions(dictType);
  const data = dictOptions.map((option) => ({
    value: option.value,
    label: option.label,
    color: option.colorType,
  }));
  let color = '';
  let label = '';
  data.find((item) => {
    if (item.value === cellValue) {
      color = item.color;
      label = item.label;
    }
  });
  return h(Tag, { color }, () => label);
}
// 文件信息
export interface fileVo {
  fileName: string;
  fileUrl: string;
}
// 现场操作确认表单字段
export function onSiteOperationConfirmFormSchema(
  disabledFields: string[] = [], // 需要禁用的字段名数组
): VbenFormSchema[] {
  // 判断字段是否应该禁用
  const shouldDisable = (fieldName: string): boolean => {
    return disabledFields.includes(fieldName);
  };
  return [
    {
      fieldName: 'cheWorkChangeType',
      label: '现场作业类别',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择现场作业类别',
        allowClear: true,
        api: async (params?: any) => {
          return await getDictDataPage(params);
        },
        params: {
          pageNo: 1,
          pageSize: 100,
          dictType: 'on_site_operation_category',
        },
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().includes(input.toLowerCase());
        },
        resultField: 'list',
        labelField: 'label',
        valueField: 'value',
        disabled: shouldDisable('cheWorkChangeType'),
      },
      rules: 'required',
    },
    {
      fieldName: 'operationSource',
      label: '驱动源',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择现场作业类别',
        allowClear: true,
        api: async (params?: any) => {
          return await getDictDataPage(params);
        },
        params: {
          pageNo: 1,
          pageSize: 100,
          dictType: 'driving_source',
        },
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().includes(input.toLowerCase());
        },
        resultField: 'list',
        labelField: 'label',
        valueField: 'value',
        disabled: shouldDisable('operationSource'),
      },
      rules: 'required',
    },
    {
      fieldName: 'changeReason',
      label: '变更原因',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择变更原因',
        allowClear: true,
        api: async (params?: any) => {
          return await getDictDataPage(params);
        },
        params: {
          pageNo: 1,
          pageSize: 100,
          dictType: 'change_reason',
        },
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().includes(input.toLowerCase());
        },
        resultField: 'list',
        labelField: 'label',
        valueField: 'value',
      },
      rules: 'required',
    },
    {
      fieldName: 'operationFile',
      label: '现场图片上传',
      component: 'ImageUpload',
      formItemClass: 'md:col-span-2',
      componentProps: {
        multiple: true,
        maxNumber: 9,
      },
    },
    {
      fieldName: 'vslName',
      label: '作业船名',
      component: 'Select',
      rules: 'required',
    },
    {
      fieldName: 'vslVoy',
      label: '作业航次',
      component: 'Select',
      rules: 'required',
    },
    {
      fieldName: 'contNo',
      label: '箱号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入箱号',
        allowClear: true,
        onInput: (e: Event) => {
          setTimeout(() => {
            const target = e.target as HTMLInputElement;
            target.value = target.value
              .toUpperCase()
              .replaceAll(/[^A-Z0-9]/g, '');
          }, 10);
        },
        disabled: shouldDisable('contNo'),
      },
      rules: z.string().refine(
        (value) => {
          // 如果值为 "HATCH"，则不校验
          if (value.toUpperCase() === 'HATCH') {
            return true;
          }
          // 其他情况校验格式
          return /^[A-Z]{4}\d{7}$/i.test(value);
        },
        {
          message: '请输入正确的箱号（前四位为英文，后七位数字）',
        },
      ),
    },
    {
      fieldName: 'operationPosition',
      label: '作业位置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业位置',
        allowClear: true,
        onInput: (e: Event) => {
          setTimeout(() => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.toUpperCase();
          }, 10);
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'machNo',
      label: '作业机械号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业机械号',
        allowClear: true,
        onInput: (e: Event) => {
          setTimeout(() => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.toUpperCase();
          }, 10);
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'cheType',
      label: '实际吊具类型',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择实际吊具类型',
        allowClear: true,
        api: async (params?: any) => {
          return await getDictDataPage(params);
        },
        params: {
          pageNo: 1,
          pageSize: 100,
          dictType: 'spreader_type',
        },
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().includes(input.toLowerCase());
        },
        resultField: 'list',
        labelField: 'label',
        valueField: 'value',
      },
      rules: 'required',
    },
    {
      fieldName: 'startTime',
      label: '更换换吊具开始时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        placeholder: '请选择换吊具开始时间',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'endTime',
      label: '更换换吊具结束时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        placeholder: '请选择换吊具结束时间',
        showTime: true,
      },
      dependencies: {
        rules(values) {
          return z
            .string({ message: '请选择换吊具结束时间' })
            .refine((value) => {
              if (!value || !values.startTime) {
                return true;
              }
              return Number(value) > Number(values.startTime);
            }, '更换吊具结束时间必须大于更换吊具开始时间');
        },
        triggerFields: ['endTime', 'startTime'],
      },
      rules: 'required',
    },
    {
      fieldName: 'startTimeBack',
      label: '换回原吊具开始时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        placeholder: '请选择换吊具开始时间',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'endTimeBack',
      label: '换回原吊具结束时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        placeholder: '请选择换吊具结束时间',
        showTime: true,
      },
      dependencies: {
        rules(values) {
          return z
            .string({ message: '请选择换回原吊具结束时间' })
            .refine((value) => {
              if (!value || !values.startTimeBack) {
                return true;
              }
              return Number(value) > Number(values.startTimeBack);
            }, '换回原吊具结束时间必须大于换回原吊具开始时间');
        },
        triggerFields: ['endTimeBack', 'startTimeBack'],
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
        rows: 4,
        allowClear: true,
      },
    },
  ];
}
// 箱信息表格数据列表
export function contInfoColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: '序号',
      field: 'serialNumber',
      type: 'seq',
      minWidth: 80,
      slots: { footer: 'serialNumber' },
    },
    {
      title: '箱号',
      field: 'contNo',
      minWidth: 120,
      editRender: {
        name: 'input',
        events: {
          input: async (params: any) => {
            const seq = params.seq;
            const currentRow = params.data[seq - 1]; // 当前行数据

            setTimeout(() => {
              const cellEl = params.$grid.getCellElement(
                currentRow,
                'contNo',
              );
              const inputEl = cellEl?.querySelector('.vxe-default-input');

              if (inputEl) {
                inputEl.value = inputEl.value.toUpperCase();
              }
            }, 10);
          },
        },
        immediate: true,
      },
      editConfig: {
        mode: 'row',
        autoFocus: true,
      },
    },
    {
      title: '尺寸',
      field: 'contSize',
      minWidth: 200,
      editRender: {
        name: 'select',
      },
      slots: {
        edit: 'contSizeEdit',
      },
    },
    {
      title: '箱型',
      field: 'contType',
      minWidth: 200,
      editRender: {
        name: 'select',
      },
      slots: {
        edit: 'contTypeEdit',
      },
    },
    {
      title: '货重KG',
      field: 'contCargoWeight',
      minWidth: 100,
      editRender: { name: 'input' },
    },
    {
      title: '箱货总重KG',
      field: 'contTotalWeight',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      title: '货物尺寸CM',
      field: 'contCargoSize',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      title: '超限明细CM',
      field: 'contOogDetails',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      title: '操作',
      minWidth: 120,
      slots: { default: 'actions' },
      fixed: 'right',
    },
  ];
}
// 箱信息详情表格数据列表
export function contInfoDetailColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: '序号',
      field: 'serialNumber',
      type: 'seq',
      minWidth: 80,
      slots: { footer: 'serialNumber' },
    },
    {
      title: '箱号',
      field: 'contNo',
      minWidth: 120,
    },
    {
      title: '尺寸',
      field: 'contSize',
      minWidth: 80,
    },
    {
      title: '箱型',
      field: 'contType',
      minWidth: 80,
    },
    {
      title: '货重KG',
      field: 'contCargoWeight',
      minWidth: 100,
    },
    {
      title: '箱货总重KG',
      field: 'contTotalWeight',
      minWidth: 120,
    },
    {
      title: '货物尺寸CM',
      field: 'contCargoSize',
      minWidth: 120,
    },
    {
      title: '超限明细CM',
      field: 'contOogDetails',
      minWidth: 120,
    },
  ];
}
// 附件详情
export function attachmentDetailColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: '序号',
      field: 'serialNumber',
      type: 'seq',
      minWidth: 80,
    },
    {
      title: '附件名称',
      field: 'fileName',
      minWidth: 120,
    },
    {
      title: '附件地址',
      field: 'filePath',
      minWidth: 80,
      slots: { default: 'filePath' },
    },
    {
      title: '操作',
      minWidth: 120,
      slots: { default: 'actions' },
      fixed: 'right',
    },
  ];
}
// 受理计划表单字段
export function acceptancePlanFormSchema(): VbenFormSchema[] {
  return [
    // 基本信息
    {
      fieldName: 'basic',
      component: 'none',
      label: '基础信息',
      formItemClass: 'md:col-span-2',
    },
    {
      fieldName: 'acptPlnNo',
      label: '申请编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请编号',
        allowClear: true,
        disabled: true,
      },
    },
    {
      fieldName: 'applicantCompanyName',
      label: '申请公司名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请公司名称',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'handlingPerson',
      label: '经办人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入经办人',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'handlingPhoneNumber',
      label: '经办人联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入经办人联系电话',
        allowClear: true,
      },
      // 更严格的手机号码校验
      rules: z
        .string()
        .min(11, '手机号码必须是11位纯数字，不含空格及特殊符号')
        .max(11, '手机号码必须是11位纯数字，不含空格及特殊符号')
        .regex(
          /^1[3-9]\d{9}$/,
          '请输入正确的手机号码格式，必须是11位纯数字，不含空格及特殊符号',
        ),
    },
    {
      fieldName: 'paymentTypeSea',
      label: '缴费方式（海侧）',
      component: 'RadioGroup',
      componentProps: {
        options: bppBaseDict.getBppBaseDictOptions('payment_method'),
      },
      rules: 'required',
    },
    {
      fieldName: 'payerNameSea',
      label: '缴费方（海侧）',
      component: 'Select',
      rules: 'required',
    },
    {
      fieldName: 'paymentTypeGate',
      label: '缴费方式（陆侧）',
      component: 'RadioGroup',
      componentProps: {
        options: bppBaseDict.getBppBaseDictOptions('payment_method'),
      },
      rules: 'required',
    },
    {
      fieldName: 'payerNameGate',
      label: '缴费方（陆侧）',
      component: 'Select',
      rules: 'required',
    },
    {
      fieldName: 'category',
      label: '进出口类别',
      component: 'RadioGroup',
      componentProps: {
        options: bppBaseDict.getBppBaseDictOptions('import_export_type'),
      },
      rules: 'required',
    },
    {
      fieldName: 'vslName',
      label: '作业船名（中文名称）',
      component: 'Select',
      rules: 'required',
    },
    {
      fieldName: 'vslVoy',
      label: '作业航次',
      component: 'Select',
      componentProps: {
        placeholder: '请输入作业航次',
        allowClear: true,
      },
      rules: z
        .string()
        .nonempty('作业航次为必填项')
        .regex(/^[^\u4E00-\u9FA5]*$/, '作业航次不允许输入中文'),
    },
    {
      fieldName: 'plannedOperationTime',
      label: '预计作业时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        placeholder: '请选择预计作业时间',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'divider',
      component: 'Divider',
      formItemClass: 'w-full p-0 md:col-span-2',
    },
    // 箱信息
    {
      fieldName: 'basic',
      component: 'none',
      label: '箱货信息',
      formItemClass: 'md:col-span-2',
    },
    {
      fieldName: 'billNo',
      label: '提单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入提单号',
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
      rules: z
        .string()
        .regex(/^[A-Z0-9]+$/, '请输入正确的提单号（英文，数字）'),
    },
    {
      fieldName: 'cargoName',
      label: '货名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入货名',
        allowClear: true,
        onInput: (e: Event) => {
          setTimeout(() => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.toUpperCase();
          }, 10);
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'contInfo',
      component: 'none',
      label: '箱信息',
      formItemClass: 'w-full p-0 md:col-span-2',
      rules: 'required',
    },
    // 附件
    {
      fieldName: 'attachmentFile',
      label: '附件',
      component: 'Upload',
      rules: 'required',
      formItemClass: 'w-full p-0 md:col-span-2 mt-3',
    },
    {
      fieldName: 'divider',
      component: 'Divider',
      formItemClass: 'w-full p-0 md:col-span-2',
    },
    {
      fieldName: 'handlerConfirmInfo',
      component: 'none',
      label: '经办人确认信息',
      formItemClass: 'w-full p-0 md:col-span-2',
    },
    {
      fieldName: 'handlerRemark',
      label: '经办人备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入经办人备注',
        allowClear: true,
        onInput: (e: Event) => {
          setTimeout(() => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.toUpperCase();
          }, 10);
        },
      },
      formItemClass: 'w-full p-0 md:col-span-2 my-3',
      rules: 'required',
    },
    {
      fieldName: 'handlerConfirmation',
      label: ' 经办人确认',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入经办人确认',
        allowClear: true,
        onInput: (e: Event) => {
          setTimeout(() => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.toUpperCase();
          }, 10);
        },
      },
      formItemClass: 'w-full p-0 md:col-span-2 my-3',
      rules: 'required',
    },
    {
      fieldName: 'handlingPersonLast',
      label: '经办人：',
      component: 'text',
    },
  ];
}
/** 超限作业申请列表的搜索表单 */
export function acceptancePlanOvrOprFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'acptPlnNo',
      label: '申请编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请编号',
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
      fieldName: 'vslName',
      label: '作业船名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业船名',
        allowClear: true,
      },
      solt: 'form-vslName',
    },
    {
      fieldName: 'vslVoy',
      label: '作业航次',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业航次',
        allowClear: true,
      },
      solt: 'form-vslVoy',
    },
    {
      fieldName: 'billNo',
      label: '提单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入提单号（多提单搜索英文逗号,分隔）',
        allowClear: true,
        onInput: (e: Event) => {
          setTimeout(() => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.toUpperCase();
          }, 10);
        },
      },
    },
    {
      fieldName: 'applicantCompanyName',
      label: '申请单位',
      component: 'none',
      componentProps: {
        placeholder: '请输入申请单位',
        allowClear: true,
      },
      slot: 'form-applicantCompanyName',
    },
    {
      fieldName: 'contNo',
      label: '箱号',
      component: 'Input',
      componentProps: {
        placeholder: '请输箱号（多箱号搜索英文逗号,分隔）',
        allowClear: true,
        onInput: (e: Event) => {
          setTimeout(() => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.toUpperCase();
          }, 10);
        },
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'TimeRangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'conclusionTime',
      label: '审结时间',
      component: 'TimeRangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 超限作业申请列表的字段 */
export function acceptancePlanOvrOprColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40, fixed: 'left' },
    {
      field: 'acptPlnNo',
      title: '申请编号',
      minWidth: 120,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'planStatus',
      title: '受理状态',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: createDictFilter('acceptance_plan_status'),
      cellRender: {
        name: 'CellTagDict',
        props: 'acceptance_plan_status',
      },
    },
    {
      field: 'approvalWorkflowCurrentNode',
      title: '审批节点',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'acptPlnWebNo',
      title: '网上编号',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'applicantCompanyName',
      title: '申请单位',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'handlingPerson',
      title: '经办人',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
      sortable: true,
    },
    {
      field: 'vslName',
      title: '作业船名',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'vslVoy',
      title: '作业航次',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'category',
      title: '进出口类别',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: createDictFilter('import_export_type'),
      cellRender: {
        name: 'CellTagDict',
        props: 'import_export_type',
      },
    },
    {
      field: 'vslCode',
      title: '作业船名代码',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'billNo',
      title: '提单号',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'cargoName',
      title: '货名',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;
            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'payerNameSea',
      title: '海侧缴费方',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'paymentTypeSea',
      title: '海侧缴费方式',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: createDictFilter('payment_method'),
      cellRender: {
        name: 'CellTagDict',
        props: 'payment_method',
      },
    },
    {
      field: 'payerNameGate',
      title: '陆侧缴费方',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'paymentTypeGate',
      title: '陆侧缴费方式',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: createDictFilter('payment_method'),
      cellRender: {
        name: 'CellTagDict',
        props: 'payment_method',
      },
    },
    {
      field: 'isSystemRate',
      title: '是否系统费率',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: createDictFilter('system_rate'),
      cellRender: {
        name: 'CellTagDict',
        props: 'system_rate',
      },
    },
    {
      field: 'conclusionTime',
      title: '审结时间',
      minWidth: 180,
      formatter: 'formatDateTime',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
// 超限作业申请详情字段
export function acceptancePlanOvrOprDetailSchema(): DescriptionItemSchema[] {
  return [
    // 基础信息
    { field: 'acptPlnNo', label: '申请编号' },
    { field: 'applicantCompanyName', label: '申请公司名称' },
    { field: 'handlingPerson', label: '经办人' },
    { field: 'handlingPhoneNumber', label: '经办人联系电话' },
    {
      field: 'paymentTypeSea',
      label: '缴费方式（海侧）',
      render: (cellValue) => {
        return renderTagDict('payment_method', cellValue);
      },
    },
    { field: 'payerNameSea', label: '缴费方（海侧）' },
    {
      field: 'paymentTypeGate',
      label: '缴费方式（陆侧）',
      render: (cellValue) => {
        return renderTagDict('payment_method', cellValue);
      },
    },
    { field: 'payerNameGate', label: '缴费方（陆侧）' },
    {
      field: 'category',
      label: '进出口类别',
      render: (cellValue) => {
        return renderTagDict('import_export_type', cellValue);
      },
    },
    { field: 'vslName', label: '作业船名（中文名称）' },
    { field: 'vslVoy', label: '作业航次' },
    { field: 'plannedOperationTime', label: '预计作业时间' },
  ];
}

// 箱列表的字段配置
export function useBoxGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'checkbox',
      width: 40,
      fixed: 'left',
    },
    {
      field: 'contOperationNode',
      title: '现场作业节点',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: createDictFilter('on_site_operation_node'),
      cellRender: {
        name: 'CellTagDict',
        props: 'on_site_operation_node',
      },
    },
    {
      field: 'contNo',
      title: '箱号',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'contSize',
      title: '尺寸',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'contType',
      title: '箱型',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'contCargoWeight',
      title: '货物重KG',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'contTotalWeight',
      title: '箱货总重KG',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'contCargoSize',
      title: '货物尺寸CM',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'contOogDetails',
      title: '超限明细CM',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
  ];
}
// 变更吊具记录的字段配置
export function machineSpreaderChangeRecordGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'checkbox',
      width: 40,
      fixed: 'left',
    },
    {
      field: 'cheWorkChangeType',
      title: '现场作业类别',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;
            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: createDictFilter('on_site_operation_category'),
      cellRender: {
        name: 'CellTagDict',
        props: 'on_site_operation_category',
      },
    },
    {
      field: 'vslName',
      title: '作业船名',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'vslVoy',
      title: '作业航次',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'contNo',
      title: '箱号',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'operationSource',
      title: '驱动源',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: createDictFilter('driving_source'),
      cellRender: {
        name: 'CellTagDict',
        props: 'driving_source',
      },
    },
    {
      field: 'changeReason',
      title: '变更原因',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: createDictFilter('change_reason'),
      cellRender: {
        name: 'CellTagDict',
        props: 'change_reason',
      },
    },
    {
      field: 'cheWorkType',
      title: '作业机械类别',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'machNo',
      title: '作业机械号',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'isOnSiteWork',
      title: '现场是否实际作业',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: createDictFilter('actual_operation'),
      cellRender: {
        name: 'CellTagDict',
        props: 'actual_operation',
      },
    },
    {
      field: 'operationPosition',
      title: '作业位置',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'cheType',
      title: '作业吊具类型',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: createDictFilter('spreader_type'),
      cellRender: {
        name: 'CellTagDict',
        props: 'spreader_type',
      },
    },
    {
      field: 'startTime',
      title: '换吊具开始时间',
      minWidth: 200,
      formatter: 'formatDateTime',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'endTime',
      title: '换吊具结束时间',
      minWidth: 200,
      formatter: 'formatDateTime',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'creatorName',
      title: '创建者',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 200,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any, value: string) => {
            const { $grid, column } = params;

            $grid.saveFilterByEvent('input', column.field);
          },
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
