<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="申请编号" prop="applicationNo">
        <el-input v-model="formData.applicationNo" placeholder="请输入申请编号" />
      </el-form-item>
      <el-form-item label="申请单位代码" prop="applicationCompany">
        <el-input v-model="formData.applicationCompany" placeholder="请输入申请单位代码" />
      </el-form-item>
      <el-form-item label="申请人代码" prop="applicant">
        <el-input v-model="formData.applicant" placeholder="请输入申请人代码" />
      </el-form-item>
      <el-form-item label="船舶代码" prop="shipCode">
        <el-input v-model="formData.shipCode" placeholder="请输入船舶代码" />
      </el-form-item>
      <el-form-item label="航次代码" prop="voyageCode">
        <el-input v-model="formData.voyageCode" placeholder="请输入航次代码" />
      </el-form-item>
      <el-form-item label="提单号" prop="billNo">
        <el-input v-model="formData.billNo" placeholder="请输入提单号" />
      </el-form-item>
      <el-form-item label="货名" prop="cargoName">
        <el-input v-model="formData.cargoName" placeholder="请输入货名" />
      </el-form-item>
      <el-form-item label="进出口类别" prop="impExpType">
        <el-select v-model="formData.impExpType" placeholder="请选择进出口类别">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.$dictType.toUpperCase())"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请工作流id" prop="processId">
        <el-input v-model="formData.processId" placeholder="请输入申请工作流id" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { FlowOverlimitWorkApi, FlowOverlimitWork } from '@/api/bpp/flowoverlimitwork'

/** 超限作业申请 表单 */
defineOptions({ name: 'FlowOverlimitWorkForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  applicationNo: undefined,
  applicationCompany: undefined,
  applicant: undefined,
  shipCode: undefined,
  voyageCode: undefined,
  billNo: undefined,
  cargoName: undefined,
  impExpType: undefined,
  processId: undefined
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await FlowOverlimitWorkApi.getFlowOverlimitWork(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as FlowOverlimitWork
    if (formType.value === 'create') {
      await FlowOverlimitWorkApi.createFlowOverlimitWork(data)
      message.success(t('common.createSuccess'))
    } else {
      await FlowOverlimitWorkApi.updateFlowOverlimitWork(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    applicationNo: undefined,
    applicationCompany: undefined,
    applicant: undefined,
    shipCode: undefined,
    voyageCode: undefined,
    billNo: undefined,
    cargoName: undefined,
    impExpType: undefined,
    processId: undefined
  }
  formRef.value?.resetFields()
}
</script>