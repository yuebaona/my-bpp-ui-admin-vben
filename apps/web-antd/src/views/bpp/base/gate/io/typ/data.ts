import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { useAccess } from '@vben/access';

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

loadDictData(['is_valid', 'gate_io_type', 'gate_io_location', 'empty_full']);

// 获取字典值对应的文本
export const getDictText = (
  dictType: string,
  value: number | string | undefined,
): string => {
  if (value === undefined || value === null) return '';
  const dictData = bppBaseDict.getBppBaseDictOptions(dictType);
  const item = dictData?.find((item) => String(item.value) === String(value));
  return item?.label || String(value);
};

// 获取字典选项列表（字符串值）
export const getDictOptions = (dictType: string) => {
  const options = bppBaseDict.getBppBaseDictOptions(dictType);
  return options.map((item) => ({
    label: item.label,
    value: item.value,
  }));
};

// 获取字典选项列表（布尔值），用于 is_valid 等布尔类型字段的编辑
const getDictBooleanOptions = (dictType: string) => {
  const options = bppBaseDict.getBppBaseDictOptions(dictType);
  return options.map((item) => ({
    label: item.label,
    value: item.value === 'true',
  }));
};

// 在文件顶部定义辅助函数
const createInputFormatter = (regex: RegExp) => {
  return {
    onCompositionstart: (e: any) => {
      e.target.composing = true;
    },
    onCompositionend: (e: any) => {
      e.target.composing = false;
      const value = e.target.value.replaceAll(regex, '').toUpperCase();
      if (e.target.value !== value) {
        e.target.value = value;
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
      }
    },
    oninput: (e: any) => {
      if (e.target.composing) return;
      const value = e.target.value.replaceAll(regex, '').toUpperCase();
      if (e.target.value !== value) {
        e.target.value = value;
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
      }
    },
  };
};

export function gateIOSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'businessCode',
      label: '业务代码',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入业务代码',
        onCompositionstart: (e: any) => {
          e.target.composing = true;
        },
        onCompositionend: (e: any) => {
          e.target.composing = false;
          const value = e.target.value.replaceAll(/[^a-z]/gi, '').toUpperCase();
          if (e.target.value !== value) {
            e.target.value = value;
            e.target.dispatchEvent(new Event('input', { bubbles: true }));
          }
        },
        oninput: (e: any) => {
          if (e.target.composing) return;
          const value = e.target.value.replaceAll(/[^a-z]/gi, '').toUpperCase();
          if (e.target.value !== value) {
            e.target.value = value;
            e.target.dispatchEvent(new Event('input', { bubbles: true }));
          }
        },
      },
    },
    {
      fieldName: 'mappingCode',
      label: '接口转换代码',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入接口转换代码',
        onCompositionstart: (e: any) => {
          e.target.composing = true;
        },
        onCompositionend: (e: any) => {
          e.target.composing = false;
          const value = e.target.value.replaceAll(/[^a-z]/gi, '').toUpperCase();
          if (e.target.value !== value) {
            e.target.value = value;
            e.target.dispatchEvent(new Event('input', { bubbles: true }));
          }
        },
        oninput: (e: any) => {
          if (e.target.composing) return;
          const value = e.target.value.replaceAll(/[^a-z]/gi, '').toUpperCase();
          if (e.target.value !== value) {
            e.target.value = value;
            e.target.dispatchEvent(new Event('input', { bubbles: true }));
          }
        },
      },
    },
    {
      fieldName: 'businessName',
      label: '业务类型名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入业务类型名称',
      },
    },
    {
      fieldName: 'isValid',
      label: '是否有效',
      component: 'Select',
      componentProps: {
        options: getDictOptions('is_valid'),
        allowClear: true,
        placeholder: '请选择是否有效',
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}

export function gateIOColumns(): VxeTableGridOptions['columns'] {
  const access = useAccess();
  const hasEditPermission = access.hasAccessByCodes([
    // 'bpp:flow-acceptance-plan:edit',
    // 'bpp:flow-acceptance-plan:create',
    'base:gate-io-typ:manager',
  ]);

  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    { type: 'checkbox', width: 50, fixed: 'left' },
    {
      field: 'businessCode',
      title: '业务代码',
      minWidth: 100,
      fixed: 'left',
      editRender: hasEditPermission
        ? {
            name: 'input',
            attrs: createInputFormatter(/[^a-z]/gi),
          }
        : undefined,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any) => {
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
      field: 'businessName',
      title: '业务类型名称',
      minWidth: 100,
      editRender: hasEditPermission ? { name: 'input' } : undefined,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any) => {
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
      field: 'pickupLocation',
      title: '提箱地',
      minWidth: 100,
      editRender: hasEditPermission
        ? {
            name: 'select',
            options: bppBaseDict.getBppBaseDictOptions('gate_io_location'),
          }
        : undefined,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '',
          allowClear: true,
          options: bppBaseDict.getBppBaseDictOptions('gate_io_location'),
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
          return String(row[column.field]) === String(option.data);
        }
        return true;
      },
    },
    {
      field: 'deliveryLocation',
      title: '送箱地',
      minWidth: 100,
      editRender: hasEditPermission
        ? {
            name: 'select',
            options: bppBaseDict.getBppBaseDictOptions('gate_io_location'),
          }
        : undefined,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '',
          allowClear: true,
          options: bppBaseDict.getBppBaseDictOptions('gate_io_location'),
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
          return String(row[column.field]) === String(option.data);
        }
        return true;
      },
    },
    {
      field: 'plnValidDays',
      title: '业务计划有效天数',
      minWidth: 100,
      editRender: hasEditPermission
        ? {
            name: 'input',
            attrs: createInputFormatter(/\D/g),
          }
        : undefined,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any) => {
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
      field: 'isValid',
      title: '是否有效',
      minWidth: 100,
      editRender: {
        name: 'select',
        options: getDictBooleanOptions('is_valid'),
      },
      formatter: ({ cellValue }) => getDictText('is_valid', cellValue),
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '',
          allowClear: true,
          options: [
            { label: '是', value: true },
            { label: '否', value: false },
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
        if (option.data !== '') {
          return row[column.field] === option.data;
        }
        return true;
      },
    },
    {
      field: 'mappingCode',
      title: '接口转换代码',
      minWidth: 100,
      editRender: hasEditPermission
        ? {
            name: 'input',
            attrs: createInputFormatter(/[^a-z]/gi),
          }
        : undefined,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any) => {
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
      title: '创建人',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any) => {
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
      minWidth: 150,
      formatter: 'formatDateTime',
    },
    {
      field: 'updaterName',
      title: '更新人',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any) => {
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
      field: 'updateTime',
      title: '更新时间',
      minWidth: 150,
      formatter: 'formatDateTime',
    },
  ];
}

export function transportInstructionColumns(): VxeTableGridOptions['columns'] {
  const access = useAccess();
  const hasEditPermission = access.hasAccessByCodes([
    // 'bpp:flow-acceptance-plan:edit',
    // 'bpp:flow-acceptance-plan:create',
    'base:gate-io-typ:manager',
  ]);

  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    { type: 'checkbox', width: 50, fixed: 'left' },
    {
      field: 'transportOrderCode',
      title: '运输指令代码',
      minWidth: 100,
      fixed: 'left',
      editRender: hasEditPermission
        ? {
            name: 'input',
            attrs: createInputFormatter(/[^a-z_]/gi),
          }
        : undefined,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any) => {
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
      field: 'transportOrderName',
      title: '运输指令名称',
      minWidth: 100,
      editRender: hasEditPermission ? { name: 'input' } : undefined,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any) => {
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
      field: 'gateInOutType',
      title: '送提类型',
      minWidth: 100,
      editRender: hasEditPermission
        ? {
            name: 'select',
            options: bppBaseDict.getBppBaseDictOptions('gate_io_type'),
          }
        : undefined,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          allowClear: true,
          options: bppBaseDict.getBppBaseDictOptions('gate_io_type'),
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
          return String(row[column.field]) === String(option.data);
        }
        return true;
      },
    },
    {
      field: 'contDirection',
      title: '指令箱流向',
      minWidth: 100,
      editRender: hasEditPermission ? { name: 'input' } : undefined,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any) => {
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
      field: 'emptyFull',
      title: '箱空重',
      minWidth: 100,
      editRender: hasEditPermission
        ? {
            name: 'select',
            options: bppBaseDict.getBppBaseDictOptions('empty_full'),
          }
        : undefined,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          allowClear: true,
          options: bppBaseDict.getBppBaseDictOptions('empty_full'),
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
          return String(row[column.field]) === String(option.data);
        }
        return true;
      },
    },
    {
      field: 'transportOrderValidDays',
      title: '指令有效期（天）',
      minWidth: 100,
      editRender: hasEditPermission
        ? {
            name: 'input',
            attrs: createInputFormatter(/\D/g),
          }
        : undefined,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any) => {
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
      field: 'mappingCode',
      title: '接口转换代码',
      minWidth: 100,
      editRender: hasEditPermission
        ? {
            name: 'input',
            attrs: createInputFormatter(/[^a-z_]/gi),
          }
        : undefined,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any) => {
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
      field: 'isValid',
      title: '是否有效',
      minWidth: 100,
      editRender: {
        name: 'select',
        options: getDictBooleanOptions('is_valid'),
      },
      formatter: ({ cellValue }) => getDictText('is_valid', cellValue),
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '',
          allowClear: true,
          options: [
            { label: '是', value: true },
            { label: '否', value: false },
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
        if (option.data !== '') {
          return row[column.field] === option.data;
        }
        return true;
      },
    },
    {
      field: 'isUsedForPln',
      title: '是否用于受理计划天数',
      minWidth: 100,
      editRender: hasEditPermission
        ? {
            name: 'select',
            options: getDictBooleanOptions('is_valid'),
          }
        : undefined,
      formatter: ({ cellValue }) => getDictText('is_valid', cellValue),
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '',
          allowClear: true,
          options: [
            { label: '是', value: true },
            { label: '否', value: false },
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
        if (option.data !== '') {
          return row[column.field] === option.data;
        }
        return true;
      },
    },
    {
      field: 'creatorName',
      title: '创建人',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any) => {
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
      minWidth: 150,
      formatter: 'formatDateTime',
    },
    {
      field: 'updaterName',
      title: '更新人',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
        events: {
          input: (params: any) => {
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
      field: 'updateTime',
      title: '更新时间',
      minWidth: 150,
      formatter: 'formatDateTime',
    },
  ];
}
