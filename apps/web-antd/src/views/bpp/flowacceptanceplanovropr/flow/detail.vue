<script setup lang="ts">

import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Card, Descriptions } from 'ant-design-vue';
import { ContentWrap } from '@vben/common-ui';
import acceptancePlanForm from '#/views/bpp/flowacceptanceplanovropr/flow/detailView.vue';
import taskComment from '#/views/bpp/flowacceptanceplanovropr/flow/taskComment.vue';
/**
 * 参数
 */
const props = defineProps({
  businessKey: {
    type: Number,
    default: 1,
  },
  id: {
    type: String,
    default: '1',
  },
  //流程状态
  status: String,
  //当前任务对象
  todoTask: Object,
  processInstance: Object // 流程实例信息
});
const datailLoading = ref(false);
const detailData = ref(null);

const { query } = useRoute();
const queryId = computed(() => query.id as string);

async function getDetailData() {
  try {
    datailLoading.value = true;
  } finally {
    datailLoading.value = false;
  }
}

onMounted(() => {
  getDetailData();
});
</script>

<template>
  {{status}}>>{{todoTask?.taskDefinitionKey}}
  <ContentWrap class="m-2">
    <!--审批中-->
    <div v-if="status==1">
      <acceptancePlanForm :id="id"/>
      <!--商务审批节点增加额外信息-->
      <div  v-if="'商务审批>Activity__958393840291762844553390'.indexOf(todoTask?.taskDefinitionKey) > -1 ||
        '商务审批>Activity__363350869191762844270536'.indexOf(todoTask?.taskDefinitionKey) > -1 ||
        '商务审批>Activity__200127356231762844452715'.indexOf(todoTask?.taskDefinitionKey) > -1 ||
        '商务审批>Activity__947027861251762844498687'.indexOf(todoTask?.taskDefinitionKey) > -1"
      >
      </div>
      <!--其他节点节点增加额外信息-->
      <div v-else>
        <taskComment :processInstanceId="processInstance?.id"/>
      </div>
    </div>
    <!--审批完成，即流程结束-->
    <div v-if="status==2">
      已完成
    </div>
  </ContentWrap>
</template>
