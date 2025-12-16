<script setup lang="ts">
import {onMounted, reactive, ref, watch} from 'vue';

import {Button, Card, Flex, message, Select, SelectOption, Space} from "ant-design-vue";
import {confirm} from '@vben/common-ui';
import {
  businessProgressAcceptancePlanOverOperation,
  acceptancePlanOverRejectProgress
} from "#/api/bpp/flow/acceptance/plan/over/operation";
import {
  approveTask,
  getTaskListByReturn,
  rejectTask,
  returnTask,
  transferTask,
} from '#/api/bpm/task';
import {getSimpleUserList} from '#/api/system/user';

defineOptions({name: 'BusinessButtonView'});

const emit = defineEmits(['close-form']);
/**
 * 参数
 */
const props = defineProps({
  businessKey: String,
  //  业务单据ID
  id: {
    type: String,
    default: '1',
  },
  //  流程状态
  status: Number,
  //  当前任务对象
  todoTask: Object,
  //  流程节点信息
  activityNodes: Object,
  containerDataArray: Object,
  processInstance: Object, //  流程实例信息
});
const transferVisible = ref(false);
const buttonLoading = ref(false);
const formRef = ref(null);

const transferFormRef = ref(null);
const transferFormData = ref({
  assigneeUserId: undefined,
  auditOpinion: undefined,
});
// 退回节点
const returnList = ref([] as any);
const returnVisible = ref(false);
const returnFormRef = ref(null);
const returnFormData = ref({
  id: undefined,
  returnReason: undefined,
  targetTaskDefinitionKey: undefined,
});

//  超限受理集装箱表信息
const containerFormData = ref({
  auditOpinion: undefined,
  containerFormDataArray:[{
    id: undefined,
    acceptancePlanNo: undefined,
    containerNo: undefined,
    isSystemRateSea: undefined,
    isSystemRateGate: undefined,
    priceSea: undefined,
    priceGate: undefined,
  }]
});
//  关闭任务处理弹窗
function closeTask(type: '' | string) {
  emit('close-form', type);
}
function cancelTask(){
  closeTask('');
}
//  审批通过
async function passTask() {
  try {
    buttonLoading.value = true;
    await formRef?.value.validate();
    // 流程变量
    let variables = {
      entity: containerFormData.value,
    }
    //  审批通过数据
    const data = {
      id: props.todoTask?.id,
      reason: containerFormData.value.auditOpinion,
      variables, //  审批通过, 把修改的字段值赋于流程实例变量
      nextAssignees: {}, //  下个自选节点选择的审批人信息
    } as any;
    // 任务审批
    await approveTask(data);
    //  修改单据数据
    await businessProgressAcceptancePlanOverOperation(containerFormData.value.containerFormDataArray)
    message.success('审批通过成功');
    setTimeout(() => {
      closeTask('');
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
// 拒绝
function noPassTask() {
  if (!containerFormData.value.auditOpinion) {
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
      //  审批不通过数据
      const data = {
        id: taskId,
        reason: containerFormData.value.auditOpinion,
      };
      await rejectTask(data);
      // 修改单据数据
      // 修改单据数据
      await acceptancePlanOverRejectProgress({ id: props.businessKey });
      message.success('拒绝成功,流程已结束！');
      setTimeout(() => {
        closeTask('');
      }, 500);
    }catch (e) {
      message.error('拒绝失败' + JSON.stringify(e));
    }finally {
      buttonLoading.value = false;
    }
  });
}

// 任务退回弹窗
async function openReturnTask() {
  try {
    // 获取退回节点
    returnList.value = await getTaskListByReturn(props.todoTask?.id);
    if (returnList.value.length === 0) {
      message.warning('当前没有可退回的节点');
    } else {
      returnFormData.value.id = props.todoTask?.id;
      returnVisible.value = true;
    }
  } catch (e) {
    returnVisible.value = false;
    message.warning('当前没有可退回的节点!');
  }
}

// 任务退回
async function doReturnTask() {
  await returnFormRef.value.validate();
  try {
    buttonLoading.value = true;
    // 1 提交退回
    const data = {
      id: returnFormData.value.id,
      reason: returnFormData.value.returnReason,
      targetTaskDefinitionKey: returnFormData.value.targetTaskDefinitionKey,
    };
    await returnTask(data);
    message.success('退回成功！');
    buttonLoading.value = false;
    returnVisible.value = false;
    setTimeout(() => {
      closeTask('');
    }, 500);
  } catch (e) {
    message.error(`退回失败 + ${JSON.stringify(e)}`);
  } finally {
    buttonLoading.value = false;
  }
}

//  任务转办弹窗
async function openTransferTask(){
  transferVisible.value = true;
}
//  转办任务
async function doTransferTask(){
  await transferFormRef?.value.validate();
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
      closeTask('');
    }, 500);
  }catch (e) {
    message.error('转办失败' + JSON.stringify(e));
  } finally {
    buttonLoading.value = false;
  }
}
//  表格列配置（合并表头）
const columns = reactive([
  {
    title: '序号',
    dataIndex: 'index',
    //  自定义序号生成逻辑
    customRender: ({ index }) => index + 1,
    width: 60,
    align: 'center',
  },
  {
    title: '箱号',
    dataIndex: 'containerNo',
    width: 120,
    align: 'center',
  },
  {
    title: '海侧商务报价',
    align: 'center',
    children: [
      {
        title: '是否使用系统费率',
        dataIndex: 'isSystemRateSea',
        width: 160,
        align: 'center',
      },
      {
        title: '报价金额（人民币）',
        dataIndex: 'priceSea',
        width: 180,
        align: 'center',
      },
    ],
  },
  {
    title: '陆侧商务报价',
    align: 'center',
    children: [
      {
        title: '是否使用系统费率',
        dataIndex: 'isSystemRateGate',
        width: 160,
        align: 'center',
      },
      {
        title: '报价金额（人民币）',
        dataIndex: 'priceGate',
        width: 180,
        align: 'center',
      },
    ],
  },
]);
watch(() => props.containerDataArray, async () => {
  let containerFormDataList=[];
  props.containerDataArray.forEach((item, index) => {
    containerFormDataList.push({
      id: item.id,
      acceptancePlanNo: item.acceptancePlanNo,
      containerNo: item.containerNo,
      isSystemRateSea: item.isSystemRateSea,
      priceSea: item.priceSea,
      isSystemRateGate: item.isSystemRateGate,
      priceGate: item.priceGate,
    });
  });
  containerFormData.value.containerFormDataArray = containerFormDataList;
}, { immediate: true, deep: true })
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
});
</script>

<template>
  <Card>
    <div class="form-container">
      <a-form
        ref="formRef"
        :model="containerFormData"
      >
        <a-form-item>
          <!-- 表格（含合并表头） -->
          <a-table
            :columns="columns"
            :data-source="containerFormData.containerFormDataArray"
            bordered
            :pagination="false"
            :scroll="{ x: 'auto' }"
            :row-key="(record) => record.index"
            style="border-collapse: collapse;"
          >
            <!-- 自定义单元格内容 -->
            <template #bodyCell="{ column, record,index }">
              <!-- 海侧-是否使用系统费率 -->
              <template v-if="column.dataIndex === 'isSystemRateSea'">
                <a-form-item
                  :name="['containerFormDataArray', index, 'isSystemRateSea']"
                  :rules="[{required: true,message: '请填写是否使用系统费率', trigger: 'change'}]"
                >
                  <a-radio-group v-model:value="record.isSystemRateSea">
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </template>
              <!-- 海侧-报价金额 -->
              <template v-if="column.dataIndex === 'priceSea'">
                <a-form-item
                  :name="['containerFormDataArray', index, 'priceSea']"
                  :rules="[{required: !record.isSystemRateSea,message: '请填写海侧报价', trigger: 'change'}]"
                  >
                  <a-input v-model:value="record.priceSea" style="width: 120px;" placeholder="请输入" :disabled="record.isSystemRateSea"/>
                  <span style="margin-left: 4px;">元</span>
                </a-form-item>
              </template>
              <!-- 陆侧-是否使用系统费率 -->
              <template v-if="column.dataIndex === 'isSystemRateGate'">
                <a-form-item
                  :name="['containerFormDataArray', index, 'isSystemRateGate']"
                  :rules="[{required: true,message: '请填写是否使用系统费率', trigger: 'change'}]"
                >
                  <a-radio-group v-model:value="record.isSystemRateGate">
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </template>
              <!-- 陆侧-报价金额 -->
              <template v-if="column.dataIndex === 'priceGate'">
                <a-form-item
                  :name="['containerFormDataArray', index, 'priceGate']"
                  :rules="[{required: !record.isSystemRateGate,message: '请填写陆侧报价', trigger: 'change'}]"
                >
                  <a-input v-model:value="record.priceGate" style="width: 120px;" placeholder="请输入" :disabled="record.isSystemRateGate"/>
                  <span style="margin-left: 4px;">元</span>
                </a-form-item>
              </template>
            </template>
          </a-table>
        </a-form-item>
        <a-form-item label="审批意见" name="auditOpinion"
          :rules="[{required: true,message: '请填写审批意见', trigger: 'change'}]"
        >
          <a-textarea
            v-model:value="containerFormData.auditOpinion"
            placeholder="请输入审批意见"
            style="flex: 1; resize: none;"
            rows="3"
          />
        </a-form-item>
      </a-form>
    </div>
    <Flex justify="end">
      <Space>
        <Button @click="cancelTask">取消</Button>
        <Button type="primary" @click="passTask" :loading="buttonLoading">通过</Button>
        <!--退回-->
        <a-popover v-model:open="returnVisible" title="退回" trigger="manual">
          <template #content>
            <a-card style="width: 500px; height: 250px">
              <a-form
                ref="returnFormRef"
                :model="returnFormData"
              >
                <a-form-item label="退回节点" name="targetTaskDefinitionKey"
                             :rules="[{ required: true, message: '请选择退回节点' }]"
                >
                  <Select
                    v-model:value="returnFormData.targetTaskDefinitionKey"
                    :allow-clear="true"
                    style="width: 100%"
                  >
                    <SelectOption
                      v-for="item in returnList"
                      :key="item.taskDefinitionKey"
                      :label="item.name"
                      :value="item.taskDefinitionKey"
                    >
                      {{ item.name }}
                    </SelectOption>
                  </Select>
                </a-form-item>
                <a-form-item label="退回理由" name="returnReason"
                             :rules="[{ required: true, message: '请输入退回理由' }]"
                >
                  <a-textarea
                    v-model:value="returnFormData.returnReason"
                    placeholder="请输入退回理由"
                    rows="4"
                  />
                </a-form-item>
                <a-form-item>
                  <Flex justify="center">
                    <Space>
                      <Button
                        @click="()=>{
                                  returnVisible = false;
                                  returnFormData.id = undefined;
                                  returnFormData.returnReason = undefined;
                                  returnFormData.targetTaskDefinitionKey = undefined;
                                }"
                        :loading="buttonLoading">取消
                      </Button>
                      <Button type="primary" @click="doReturnTask" :loading="buttonLoading">确定</Button>
                    </Space>
                  </Flex>
                </a-form-item>
              </a-form>
            </a-card>
          </template>
<!--          <Button style="background-color:#ff9900;color: #ffffff" @click.prevent="openReturnTask" :loading="buttonLoading">退回</Button>-->
        </a-popover>
        <Button type="primary" danger @click="noPassTask" :loading="buttonLoading">拒绝</Button>
        <a-popover v-model:open="transferVisible" title="转办" trigger="click">
          <template #content>
            <a-card style="width: 500px; height: 246px">
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
                      <Button
                        @click="()=>{
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
  </Card>
</template>
<style scoped>
.form-container {
  max-width: 900px;
  margin: 20px;
}
</style>
