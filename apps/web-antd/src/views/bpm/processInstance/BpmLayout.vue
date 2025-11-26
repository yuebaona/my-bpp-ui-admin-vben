<template>
  <div>
    <!--用于来承载子路由。否则路由跳转会报错：Uncaught Error: No match for {"name":"BpmProcessInstanceDetail", ...}-->
    <router-view/>
  </div>
</template>
