<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'backSpaceManage'
}
</script>
<script setup>
</script>

<style lang="less" scoped>
:deep(.ant-table-thead > tr > th) {
  font-weight: 650;
}
:deep(.ant-form-item .ant-select, .ant-form-item .ant-cascader-picker) {
  min-width: 150px;
}
:deep(.ant-table-thead > tr > th, .ant-table-tbody > tr > td, .ant-table
    tfoot
    > tr
    > th, .ant-table tfoot > tr > td) {
  overflow-wrap: normal;
}
:deep(.ant-page-header) {
  padding: 8px 24px;
}
</style>