<template>
<div class="container">
    <HeaderBar name="总览"/>
  <div>
    <div class="content">
      <div class="item" @click="changeTo('GuideView')">
        <img src="/img/hospital.png" alt="">
          医院导览
      </div>
      <div class="item" @click="changeTo('ResponsibilityLearning')">
         <img src="/img/study-center.png" alt="">
          职能学习
      </div>
      <div class="item" @click="changeTo('TestHome')">
         <img src="/img/test.png" alt="">
          测试
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
<script setup>
import HeaderBar from '@/components/common-comps/header-bar.vue';

import { defineComponent, reactive, ref, onMounted, getCurrentInstance, watch } from 'vue';
import { useReq } from '@/components/common/use-req.js'
import { useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const { handleReqAct } = useReq()
const router = useRouter()
const changeTo = (val) => {
    router.push({name: val})
}
</script>

<style lang="less" scoped>
.container {
  background: url("@/assets/background1.jpg");
  width: 100%;
  height: 100%;
  
  .content{
    
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 1000px;
    height: 400px;
    margin: auto;
    margin-top: 100px;

    justify-content: center;
    .item{
      margin: 50px;
      height: 200px;
      width: 200px;
      border-radius: 200px;
      background-color:rgb(233, 244, 254);
      text-align: center;
      line-height:200px;
      box-shadow: 0 0 10px 2px #939498; 
      cursor: pointer;
    }
  }
}
</style>