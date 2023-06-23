<template>
  <div class="toobars">
    <div class="toolbarLeft">
      <div>
        <ToolOutlined />
      </div>
      <div class="toobarTitle" v-if="title">{{title}}</div>
      <a-button type="primary" :shape="addBtnName ? 'round' : 'circle'" size="small" v-if="addBtnFunc" @click="add">
        <template #icon>
          <PlusOutlined />
        </template>
        <span v-if="addBtnName">{{addBtnName}}</span>
      </a-button>
    </div>
    <div class="toolbarRight">
      <a-input-search v-if="searchComp.func" :placeholder="searchComp.placeholder" :style="`width:${searchComp.width}px;`"
        enter-button @search="searchComp.func" />
    </div>
  </div>
</template>

<script setup>
import { ToolOutlined, PlusOutlined } from '@ant-design/icons-vue'
const emit = defineEmits(['addBtnFunc'])
const props = defineProps({
  title: { required: false, type: String, default: null },
  addBtnName: { required: false, type: Object, default: null },
  searchComp: {
    required: false, type: Object, default: () => {
      return {
        placeholder: null, width: 200, func: null
      }
    }
  }
})
const add = () => {
  emit('addBtnFunc')
}
</script>

<style lang="less" scoped>
@import "@/assets/styles/common.less";
.toobars {
  .flexRowBetweenCenter();
  .toolbarLeft {
    .flexRowStartCenter();
    & > div {
      margin-right: 8px;
    }
    .toobarTitle {
      font-weight: bold;
      font-size: 1.1rem;
    }
  }
  .toolbarRight {
    .flexRowEndCenter();
  }
}
</style>