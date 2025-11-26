<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';

import {router} from '#/router'
import {ContentWrap} from '@vben/common-ui';
import acceptancePlanForm from '#/views/bpp/flowacceptanceplanovropr/flow/detailView.vue';
import taskComment from '#/views/bpp/flowacceptanceplanovropr/flow/taskComment.vue';
import {Button, Card, Flex, Modal, Space} from "ant-design-vue";
import customButtonView from "#/views/bpp/flowacceptanceplanovropr/flow/audit/customButtonView.vue";
import businessButtonView from "#/views/bpp/flowacceptanceplanovropr/flow/audit/businessButtonView.vue";
import {
  type FlowOverLimitWorkApi,
  getAcceptancePlanOverOperation
} from "#/api/bpp/flowoverlimitwork";

/**
 * 参数
 */
const props = defineProps({
  businessKey: String,
  // 业务单据ID
  id: {
    type: String,
    default: '1',
  },
  // 流程状态
  status: Number,
  // 当前任务对象
  todoTask: Object,
  // 流程节点信息
  activityNodes: Object,
  processInstance: Object, // 流程实例信息
});
const buttonKey = ref(0);
const detailData = ref(null);
const openTask = ref(false);
const formRef = ref(null);
const containerDataArray = ref<FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO>([{
  id: undefined,
  containerNo: undefined,
  plannedSpreaderType: undefined,
}])
const { query } = useRoute();
const queryId = computed(() => query.id as string);
const acceptancePlanOverOperationData = ref(null)
const acceptancePlanData = ref(null)

async function getDetailData() {
  // 加载单据数据
  const businessData = await getAcceptancePlanOverOperation(props.businessKey);
  containerDataArray.value = businessData.acceptancePlanOverOperationContainerRespVOS;
  acceptancePlanOverOperationData.value = businessData.acceptancePlanOverOperationRespVO;
  acceptancePlanData.value = businessData.acceptancePlanRespVO;
}
//取消审批
function closeForm(){
  router.back();
}
//打开审批任务窗口
function openTaskModal(){
  openTask.value = true;
  buttonKey.value++
}
const taskKey = ref(0);
function closeCallBack(){
  openTask.value = false;
  taskKey.value++
}

/**
 * 判断是否商务审批节点
 */
function checkBusiness(){
  const taskDefinitionKey = props.todoTask?.taskDefinitionKey;
  if(
    '商务审批>Activity__958393840291762844553390'.includes(taskDefinitionKey) ||
    '商务审批>Activity__363350869191762844270536'.includes(taskDefinitionKey) ||
    '商务审批>Activity__200127356231762844452715'.includes(taskDefinitionKey) ||
    '商务审批>Activity__947027861251762844498687'.includes(taskDefinitionKey)){
    return true;
  }
  return false;
}
onMounted(() => {
  getDetailData();
});
</script>

<template>
  <ContentWrap class="m-2">
    <!--审批中-->
    <div v-if="status == 1">
      <acceptancePlanForm :id="id" />
      <!--商务审批节点增加额外信息-->
      <div
        v-if="checkBusiness()"
      >
        <taskComment
          :process-instance-id="processInstance?.id"
          :businessKey="businessKey"
          :isShowApply="false"
          :acceptancePlanOverOperationData="acceptancePlanOverOperationData"
          :containerDataArray="containerDataArray"
        />
      </div>
      <!--其他节点节点增加额外信息-->
      <div v-else>
        <taskComment
          :process-instance-id="processInstance?.id"
          :businessKey="businessKey"
          :isShowApply="true"
          :acceptancePlanOverOperationData="acceptancePlanOverOperationData"
          :acceptancePlanData="acceptancePlanData"
          :containerDataArray="containerDataArray"
        />
      </div>
      <Card style="padding: 0px;margin-top: 10px">
          <Flex justify="center">
          <Space>
            <Button @click="closeForm">取消</Button>
            <Button type="primary" @click="openTaskModal">办理</Button>
          </Space>
        </Flex>
      </Card>
    </div>
    <!--审批完成，即流程结束,-->
    <div v-else>
      <acceptancePlanForm :id="id" />
    </div>
  </ContentWrap>
  <!--任务办理窗口-->
  <Modal
    :open='openTask'
    :width="1200"
    title="提交审核"
    :closable="false"
    :key="taskKey"
    >
    <!--商务审批节点-->
      <div v-if="checkBusiness()">
        <businessButtonView
          :key="buttonKey"
          :business-key="businessKey"
          :todo-task="todoTask"
          :activity-nodes="activityNodes"
          :container-data-array="containerDataArray"
          @close-form="closeCallBack"/>
      </div>
    <!--客服等其他节点-->
      <div v-else>
        <customButtonView
          :key="buttonKey"
          :business-key="businessKey"
          :todo-task="todoTask"
          :activity-nodes="activityNodes"
          @close-form="closeCallBack"/>
      </div>
    <template #footer/>
  </Modal>
</template>
