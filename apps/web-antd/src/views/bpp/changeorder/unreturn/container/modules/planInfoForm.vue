<script setup lang="ts">
import { Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getCustomerList } from '#/api/bpp/common';
import { useSearchSelect } from '#/components/form-create/components/use-search-select';
import { planInfoFormSchema } from '#/views/bpp/changeorder/unreturn/container/data';

// 申请人搜索选择器
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
      pageSize: 10,
      customerName: value,
    });
  },
  labelField: 'customerName',
  valueField: 'customerName',
  errorMessage: '获取申请人数据失败',
  toUpperCase: true,
  searchMode: 'input',
  minSearchLength: 2,
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 100,
  },
  schema: planInfoFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  actionWrapperClass: 'col-span-2 text-right',
});
</script>

<template>
  <ACard title="改单计划信息">
    <Form>
      <template #person>
        <Select
          v-model:value="applicantState.value"
          placeholder="请输入申请人"
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
      <template #company>
        <Select
          v-model:value="applicantState.value"
          placeholder="请输入货主单位"
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
      <template #agentCompany>
        <Select
          v-model:value="applicantState.value"
          placeholder="请输入货代单位"
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
  </ACard>
</template>
