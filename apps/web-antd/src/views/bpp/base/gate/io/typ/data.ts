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

loadDictData(['is_valid']);

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

// 获取字典选项列表
export const getDictOptions = (dictType: string) => {
  const options = bppBaseDict.getBppBaseDictOptions(dictType);
  return options.map((item) => ({
    label: item.label,
    value: item.value,
  }));
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
      },
    },
    {
      fieldName: 'mappingCode',
      label: '接口转换代码',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入接口转换代码',
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
    'bpp:flow-acceptance-plan:edit',
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
            attrs: {
              oninput: (e: any) => {
                e.target.value = e.target.value
                  .replaceAll(/[^a-z]/gi, '')
                  .toUpperCase();
              },
            },
          }
        : undefined,
    },
    {
      field: 'businessName',
      title: '业务类型名称',
      minWidth: 100,
      editRender: hasEditPermission ? { name: 'input' } : undefined,
    },
    {
      field: 'pickupLocation',
      title: '提箱地',
      minWidth: 100,
      editRender: hasEditPermission ? { name: 'input' } : undefined,
    },
    {
      field: 'deliveryLocation',
      title: '送箱地',
      minWidth: 100,
      editRender: hasEditPermission ? { name: 'input' } : undefined,
    },
    {
      field: 'plnValidDays',
      title: '业务计划有效天数',
      minWidth: 100,
      editRender: hasEditPermission ? { name: 'input' } : undefined,
    },
    {
      field: 'isValid',
      title: '是否有效',
      minWidth: 100,
      editRender: {
        name: 'select',
        options: bppBaseDict.getBppBaseDictOptions('is_valid'),
      },
      formatter: ({ cellValue }) => getDictText('is_valid', cellValue),
    },
    {
      field: 'mappingCode',
      title: '接口转换代码',
      minWidth: 100,
      editRender: hasEditPermission
        ? {
            name: 'input',
            attrs: {
              oninput: (e: any) => {
                e.target.value = e.target.value
                  .replaceAll(/[^a-z]/gi, '')
                  .toUpperCase();
              },
            },
          }
        : undefined,
    },
    {
      field: 'creatorName',
      title: '创建人',
      minWidth: 100,
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
    'bpp:flow-acceptance-plan:edit',
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
            attrs: {
              oninput: (e: any) => {
                e.target.value = e.target.value
                  .replaceAll(/[^a-z_]/gi, '')
                  .toUpperCase();
              },
            },
          }
        : undefined,
    },
    {
      field: 'transportOrderName',
      title: '运输指令名称',
      minWidth: 100,
      editRender: hasEditPermission ? { name: 'input' } : undefined,
    },
    {
      field: 'gateInOutType',
      title: '送提类型',
      minWidth: 100,
      editRender: hasEditPermission ? { name: 'input' } : undefined,
    },
    {
      field: 'contDirection',
      title: '指令箱流向',
      minWidth: 100,
      editRender: hasEditPermission ? { name: 'input' } : undefined,
    },
    {
      field: 'emptyFull',
      title: '箱空重',
      minWidth: 100,
      editRender: hasEditPermission ? { name: 'input' } : undefined,
    },
    {
      field: 'transportOrderValidDays',
      title: '指令有效期（天）',
      minWidth: 100,
      editRender: { name: 'input' },
    },
    {
      field: 'mappingCode',
      title: '接口转换代码',
      minWidth: 100,
      editRender: hasEditPermission
        ? {
            name: 'input',
            attrs: {
              oninput: (e: any) => {
                e.target.value = e.target.value
                  .replaceAll(/[^a-z_]/gi, '')
                  .toUpperCase();
              },
            },
          }
        : undefined,
    },
    {
      field: 'isValid',
      title: '是否有效',
      minWidth: 100,
      editRender: {
        name: 'select',
        options: bppBaseDict.getBppBaseDictOptions('is_valid'),
      },
      formatter: ({ cellValue }) => getDictText('is_valid', cellValue),
    },
    {
      field: 'isUsedForPln',
      title: '是否用于受理计划天数',
      minWidth: 100,
      editRender: hasEditPermission
        ? {
            name: 'select',
            options: bppBaseDict.getBppBaseDictOptions('is_valid'),
          }
        : undefined,
      formatter: ({ cellValue }) => getDictText('is_valid', cellValue),
    },
    {
      field: 'creatorName',
      title: '创建人',
      minWidth: 100,
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
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 150,
      formatter: 'formatDateTime',
    },
  ];
}
