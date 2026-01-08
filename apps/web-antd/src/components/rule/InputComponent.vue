<script setup lang="ts">
import type { ConditionType, OptionType } from './types';

import { computed } from 'vue';

const props = defineProps<{
  item: ConditionType;
  optionList: OptionType[];
}>();
const emit = defineEmits(['change']);

const isInput = computed(
  () => ['string'].includes(props.item.dbType) && props.item.isEnum !== '1',
);
const isInputNumber = computed(() =>
  ['double', 'integer'].includes(props.item.dbType || ''),
);
const isDatePicker = computed(() => ['date'].includes(props.item.dbType || ''));
const isSelect = computed(
  () =>
    ['select'].includes(props.item.dbType || '') && props.item.isEnum === '1',
);

const DT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DT_MONTH_FORMAT = 'YYYY-MM';
const getDTPickerType = computed(() => props.item.flexStr01 || 'date');
const getDTFormatType = computed(() => {
  return getDTPickerType.value === 'month' ? DT_MONTH_FORMAT : DT_FORMAT;
});
const getOptionsByField = (field: string) => {
  return props.optionList.find((item) => item.field === field)?.options || [];
};

const handleChange = (e: Event) => {
  emit('change', (e.target as HTMLInputElement).value);
};

const handleNumberChange = (value: number | string) => {
  emit('change', value);
};

const handleDateChange = (value: any) => {
  emit('change', value);
};

const handleSelectChange = (value: string) => {
  emit('change', value);
};

const filterOption = (input: string, option: any) => {
  return option.title?.includes(input) || false;
};
</script>

<template>
  <div>
    <a-input
      v-if="isInput"
      :value="item.value"
      class="rule-value"
      placeholder="请输入"
      @change="handleChange"
    />
    <a-input-number
      v-if="isInputNumber"
      :value="item.value"
      class="rule-value"
      placeholder="请输入"
      @change="handleNumberChange"
    />
    <a-date-picker
      v-if="isDatePicker"
      :value="item.value"
      :picker="getDTPickerType"
      :format="getDTFormatType"
      :value-format="getDTFormatType"
      show-now
      show-time
      class="rule-value"
      placeholder="请选择"
      @change="handleDateChange"
    />
    <a-select
      v-if="isSelect"
      :value="item.value"
      class="rule-value"
      placeholder="请选择"
      :filter-option="filterOption"
      show-search
      @change="handleSelectChange"
      style="width: 150px"
    >
      <a-select-option
        v-for="opt of getOptionsByField(item.field)"
        :key="opt.value"
        :title="opt.label"
      >
        {{ opt.label }}
      </a-select-option>
    </a-select>
  </div>
</template>
<style scoped lang="less">
.rule-value {
  width: 100%;
}
</style>
