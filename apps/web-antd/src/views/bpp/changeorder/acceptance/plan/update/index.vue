<script setup lang="ts">
import BillOfLadingInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/billOfLadingInfo.vue';
import boxList from '#/views/bpp/changeorder/acceptance/plan/update/modules/boxList.vue';
import ChangeOrderPaymentInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/changeOrderPaymentInfo.vue';
import ChangeOrderPlanInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/changeOrderPlanInfo.vue';
import InboxInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/inboxInfo.vue';
import OriginalPlanPaymentInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/originalPlanPaymentInfo.vue';
</script>

<template>
  <Page auto-content-height>
    <div class="w-screen">
      <div class="mb-2 flex">
        <div class="flex w-1/2 flex-col">
          <div>
            <ChangeOrderPlanInfo />
          </div>
          <div class="mt-2">
            <ChangeOrderPaymentInfo />
          </div>
        </div>
        <div class="ml-2 w-1/2">
          <OriginalPlanPaymentInfo />
        </div>
      </div>
      <!-- 提单信息 -->
      <div>
        <BillOfLadingInfo />
      </div>
      <!-- 进箱信息 -->
      <div class="mt-2">
        <InboxInfo />
      </div>
    </div>
    <boxList />
  </Page>
</template>
