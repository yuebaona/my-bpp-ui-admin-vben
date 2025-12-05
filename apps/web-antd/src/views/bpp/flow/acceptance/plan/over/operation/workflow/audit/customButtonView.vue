<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue';
import {useRoute} from 'vue-router';

import {router} from '#/router'
import {Button, Card, Flex, message, Space} from "ant-design-vue";
import {confirm} from '@vben/common-ui';
import {
  type FlowOverLimitWorkApi,
  getAcceptancePlanOverOperation,
  startProgressAcceptancePlanOverOperation,
} from "#/api/bpp/flow/acceptance/plan/over/operation";
import {getDictDataPage} from '#/api/bpp/base/dict/data';
import {approveTask, rejectTask, transferTask,} from '#/api/bpm/task';
import {getSimpleUserList} from '#/api/system/user';

defineOptions({name: 'CustomButtonView'});
const emit = defineEmits(['closeCallBack']);
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
const transferVisible = ref(false);
const operationButtonRef = ref();
const buttonLoading = ref(false);
const plannedSpreaderTypeArray = ref([])
const initPlannedMachineryTypeArray = ref([]);
const plannedMachineryTypeArray = ref([]);
const detailData = ref(null);
const openTask = ref(false);
const formRef = ref(null);

const { query } = useRoute();
const queryId = computed(() => query.id as string);
// 下一步审批节点
const nextNodeNameArray = ref([])
const formData = ref<FlowOverLimitWorkApi.AcceptancePlanOverOperationVO>({
  id: undefined,
  isAllowedStacking: undefined,
  plannedMachineryType: undefined,
  acceptancePlanNo: undefined,
  processInstanceId: undefined,
  auditOpinion: undefined,
  nodeName: undefined,
  acceptancePlanOverOperationOtherProcessReqVOS: [{
    id: undefined,
    containerNo: undefined,
    plannedSpreaderType: undefined,
  }],
});
const transferFormRef = ref(null);
const transferFormData = ref({
  assigneeUserId: undefined,
  auditOpinion: undefined,
})
async function getDetailData() {
  // 加载单据数据
  const businessData = await getAcceptancePlanOverOperation(props.businessKey);
  const overFormData = businessData.acceptancePlanOverOperationRespVO;
  formData.value.id = overFormData.id;
  formData.value.isAllowedStacking = overFormData.isAllowedStacking;
  formData.value.plannedMachineryType = overFormData.plannedMachineryType;
  formData.value.acceptancePlanNo = overFormData.acceptancePlanNo;
  formData.value.processInstanceId = overFormData.processInstanceId;
  formData.value.acceptancePlanOverOperationOtherProcessReqVOS =  businessData.acceptancePlanOverOperationContainerRespVOS;
}
//取消审批
function closeForm(){
  router.back();
}
//打开审批任务窗口
function openTaskModal(){
  openTask.value = true;
}
function closeTask(){
  emit('close-form');
}
//审批通过
async function passTask() {
  try {
    buttonLoading.value = true;
    await formRef.value.validate();
    // 修改单据数据
    await startProgressAcceptancePlanOverOperation(formData.value)
    //流程变量
    let variables = {
      entity: {
        nodeName: formData.value.nodeName,
      },
    }
    // 审批通过数据
    const data = {
      id: props.todoTask?.id,
      reason: formData.value.auditOpinion,
      variables, // 审批通过, 把修改的字段值赋于流程实例变量
      nextAssignees: {}, // 下个自选节点选择的审批人信息
    } as any;
    // 任务审批
    await approveTask(data);
    message.success('审批通过成功');
    setTimeout(() => {
      closeTask();
    }, 500);
  }catch (e){
    const res = JSON.stringify(e);
    if (res.indexOf('errorFields') > -1) {
      message.error('有字段未填写。');
    } else {
      message.error('审批失败' + res);
    }
  }finally {
    buttonLoading.value = false;
  }
}
//拒绝任务，即流程结束
async function noPassTask() {
  if (!formData.value.auditOpinion) {
    message.error('请填写审批意见！');
    return;
  }
  const taskId = props.todoTask?.id;
  if (!taskId) {
    message.error('任务ID不能为空');
    return;
  }
  confirm({
    content: `确定拒绝任务吗？，拒绝后流程直接结束。`,
  }).then(async () => {
    try {
      buttonLoading.value = true;
      // 审批不通过数据
      const data = {
        id: taskId,
        reason: formData.value.auditOpinion,
      };
      await rejectTask(data);
      message.success('拒绝成功,流程已结束！');
      setTimeout(() => {
        closeTask();
      }, 500);
    }catch (e) {
      message.error('拒绝失败' + JSON.stringify(e));
    }finally {
      buttonLoading.value = false;
    }
  });
}
//任务转办弹窗
async function openTransferTask(){
  transferVisible.value = true;
}
//转办任务
async function doTransferTask(){
  await transferFormRef.value.validate();
  try {
    buttonLoading.value = true;
    const data = {
      id: props.todoTask?.id,
      reason: transferFormData.value.auditOpinion,
      assigneeUserId: transferFormData.value.assigneeUserId,
    };
    await transferTask(data);
    message.success('转办成功！');
    buttonLoading.value = false;
    transferVisible.value = false;
    setTimeout(() => {
      closeTask();
    }, 500);
  }catch (e) {
    message.error('转办失败' + JSON.stringify(e));
  }finally {
    buttonLoading.value = false;
  }
}
// 表格列配置
const columns = reactive([
  {
    title: '序号',
    dataIndex: 'index',
    // 自定义序号生成逻辑
    customRender: ({ index }) => index + 1,
    width: 80,
    align: 'center',
  },
  {
    align: 'center',
    title: '箱号',
    dataIndex: 'containerNo',
    width: 120,
  },
  {
    title: '作业吊具',
    dataIndex: 'plannedSpreaderType',
    width: 160,
    align: 'center',
  },
]);
function changeRadio(e){
  const value = e.target.value;
  formData.value.plannedMachineryType = null;
  if(value){
    plannedMachineryTypeArray.value = initPlannedMachineryTypeArray.value.filter(x=> x.value === 'RMG_QC')
  }else{
    plannedMachineryTypeArray.value = initPlannedMachineryTypeArray.value.filter(x=> x.value === 'QC')
  }
};
async function getDictData(dictType: string){
  const dictData = await getDictDataPage({dictType: dictType});
  return dictData.list;
};
const formRules = ref({
  isAllowedStacking:{ required: true, message: '请输入箱子是否需要落堆' },
  plannedMachineryType:{ required: true, message: '请输入机械类型' },
  nodeName:{ required: true, message: '请输入下一步审批节点' },
  // 吊具类型校验规则
  plannedSpreaderTypeRules: [
    {
      required: true,
      message: '请选择吊具类型',
    }
  ]
});
//初始化字典数据
async function initDictData(){
  const dictData = await getDictData('spreader_type');
  plannedSpreaderTypeArray.value = dictData;
  const mechanical = await getDictData('mechanical_type');
  initPlannedMachineryTypeArray.value = mechanical;
  plannedMachineryTypeArray.value = mechanical;
  if(props.activityNodes && props.activityNodes.length > 0){
    nextNodeNameArray.value = props.activityNodes.filter(x=> x.status===-1 && x.id !="EndEvent");
  }
}
/** 初始化用户数据 */
const userList = ref([]);
async function getUserList(){
  const userDataList = await getSimpleUserList();
  userList.value = userDataList.map(x=>{
    return {
      label: x.nickname,
      value: x.id
    }
  })
}
onMounted(async () => {
  await getUserList();
  await initDictData();
  await getDetailData();
});
</script>

<template>
  <Card>
    <a-form
      ref="formRef"
      :rules="formRules"
      :model="formData"
    >
      <a-form-item label="下一步审批节点" name="nodeName">
        <a-select
          v-model:value="formData.nodeName"
          allow-clear
          placeholder="请选择下一步审批节点"
        >
          <a-select-option :value="item.name" v-for="item in nextNodeNameArray" :key="item.value">{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <!-- 箱子是否需要落堆（单选） -->
      <a-form-item label="箱子是否需要落堆" name="isAllowedStacking">
        <a-radio-group v-model:value="formData.isAllowedStacking" @change="changeRadio">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- 机械类型（下拉） -->
      <a-form-item label="机械类型" name="plannedMachineryType">
        <a-select
          v-model:value="formData.plannedMachineryType"
          allow-clear
          placeholder="请选择机械类型"
        >
          <a-select-option :value="item.value" v-for="item in plannedMachineryTypeArray" :key="item.value">{{item.label}}</a-select-option>
        </a-select>
      </a-form-item>
      <!-- 作业吊具（动态表格） -->
      <a-form-item label="作业吊具"
        >
        <div class="table-container">
          <a-table
            :columns="columns"
            :data-source="formData.acceptancePlanOverOperationOtherProcessReqVOS"
            bordered
            :pagination="false"
            :scroll="{ x: 'auto' }"
            :row-key="(record) => record.index"
          >
            <!-- 作业吊具列：下拉选择器 -->
            <template #bodyCell="{ column, record,index }">
              <template v-if="column.dataIndex === 'plannedSpreaderType'">
                <a-form-item
                  :name="['acceptancePlanOverOperationOtherProcessReqVOS', index, 'plannedSpreaderType']"
                  :rules="formRules.plannedSpreaderTypeRules"
                             >
                  <a-select
                    v-model:value="record.plannedSpreaderType"
                    style="width: 180px"
                    allow-clear
                  >
                    <a-select-option :value="item.value" v-for="item in plannedSpreaderTypeArray" :key="item.value">{{item.label}}</a-select-option>
                  </a-select>
                </a-form-item>
              </template>
            </template>
          </a-table>
        </div>
      </a-form-item>

      <!-- 审核意见（文本域） -->
      <a-form-item label="审核意见" name="auditOpinion">
        <a-textarea
          v-model:value="formData.auditOpinion"
          placeholder="请输入审核意见"
          rows="4"
        />
      </a-form-item>
      <a-form-item>
        <Flex justify="end">
          <Space>
            <Button @click="closeTask">取消</Button>
            <Button type="primary" @click="passTask" :loading="buttonLoading">通过</Button>
            <Button type="primary" danger @click="noPassTask" :loading="buttonLoading">拒绝</Button>
            <a-popover v-model:open="transferVisible" title="转办" trigger="click">
              <template #content>
                <a-card  style="width: 500px;height: 246px">
                  <a-form
                    ref="transferFormRef"
                    :model="transferFormData"
                  >
                    <a-form-item label="转办给" name="assigneeUserId"
                                 :rules="[
                                   { required: true, message: '请选择转办用户' }
                                 ]"
                    >
                      <a-select
                        v-model:value="transferFormData.assigneeUserId"
                        style="width: 100%"
                        placeholder="请选择用户"
                        :options="userList"
                      ></a-select>
                    </a-form-item>
                    <a-form-item label="审核意见" name="auditOpinion"
                                 :rules="[
                                   { required: true, message: '请输入审核意见' }
                                 ]"
                    >
                      <a-textarea
                        v-model:value="transferFormData.auditOpinion"
                        placeholder="请输入审核意见"
                        rows="4"
                      />
                    </a-form-item>
                    <a-form-item>
                      <Flex justify="center">
                        <Space>
                          <Button @click="()=>{
                                transferVisible=false;
                                transferFormData.assigneeUserId=undefined;
                                transferFormData.auditOpinion=null;
                                }"
                                  :loading="buttonLoading">取消</Button>
                          <Button type="primary" @click="doTransferTask" :loading="buttonLoading">确定</Button>
                        </Space>
                      </Flex>
                    </a-form-item>
                  </a-form>
                </a-card>
              </template>
              <Button type="primary" color="pink" @click="openTransferTask" :loading="buttonLoading">转办</Button>
            </a-popover>
          </Space>
        </Flex>
      </a-form-item>
    </a-form>
  </Card>
</template>
