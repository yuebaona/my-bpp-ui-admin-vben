// 改单付费信息组件
<script setup lang="ts">
import { Card, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getCustomerList } from '#/api/bpp/common';
import { useSearchSelect } from '#/components/form-create/components/use-search-select';
import { changeOrderPaymentInfoFormSchema } from '#/views/bpp/changeorder/current/history/container/data';

// 付费人搜索选择器
const {
  state: applicantState,
  search: applicantSearch,
  handleInput: handleApplicantInput,
  handleCompositionStart: handleApplicantCompositionStart,
  handleCompositionEnd: handleApplicantCompositionEnd,
} = useSearchSelect({
  searchApi: async (value: string) => {
    return await getCustomerList({
      pageNo: 1,
      pageSize: 100,
      customerName: value,
    });
  },
  labelField: 'customerName',
  valueField: 'customerName',
  errorMessage: '获取付费人数据失败',
  toUpperCase: true,
  searchMode: 'input',
  minSearchLength: 2,
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  schema: changeOrderPaymentInfoFormSchema(),
});
</script>

<template>
  <Card title="改单付费信息">
    <Form>
        <template #payer>
          <Select
            v-model:value="applicantState.value"
            placeholder="请输入付费人"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="applicantState.fetching ? undefined : null"
            :options="applicantState.data"
            @search="applicantSearch"
            allow-clear
            show-search
            @input="handleApplicantInput"
            @compositionstart="handleApplicantCompositionStart"
            @compositionend="handleApplicantCompositionEnd"
          />
        </template>
      </Form>
  </Card>
</template>
