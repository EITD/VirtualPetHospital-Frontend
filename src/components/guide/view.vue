<template>
    <div class="container">
        <HeaderBar name = "医院导览"></HeaderBar>
        <div class="content">
            <div class="pic">
                <div class="CT">
                    <img @click="guideTo('CT')" src="/img/position.png" alt="" style="width:32px;height:32px;">
                    <span>CT</span>
                </div>
                <div class="surgicalOperation">
                    <img @click="guideTo('surgicalOperation')" src="/img/position.png" alt="" style="width:32px;height:32px;">
                    <span>手术室</span>
                </div>
                <div class="room">
                    <img @click="guideTo('patientRoom')" src="/img/position.png" alt="" style="width:32px;height:32px;">
                    <span>问诊室</span>
                </div>
                <div class="front">
                    <img @click="guideTo('front')" src="/img/position.png" alt="" style="width:32px;height:32px;">
                    <span>前台大厅</span>
                </div>
            </div>
          <a-button @click="back" type="primary" style="margin-bottom: 30px;">返回主页</a-button>
        </div>
    </div>
</template>
<script setup>
import HeaderBar from '@/components/common-comps/header-bar.vue';
import { useRouter } from "vue-router";
const router = useRouter();
const back = () => {
  router.push({
    name: 'Home'
  })
}
const guideTo = (v) => {
   if(v === 'CT'){
        router.push({
            name: 'Guide', params: {
                x: 100,
                y: 200
            }
        })
    }
    else if(v==='surgicalOperation'){
        router.push({
             name: 'Surgical', params: {
                 x: 100,
                 y: 200
             }
         })
    }
    else if(v==='patientRoom'){
        router.push({
                name: 'PatientRoom', params: {
                    x: 100,
                    y: 200
                }
            })
    } 
    else if(v==='front'){
        router.push({
                name: 'front', params: {
                    x: 100,
                    y: 200
                }
            })
    }
}

</script>
<style lang="less" scoped>
.container {
  overflow: scroll;
  background: url("../../assets/background1.jpg");
  
  width: 100%;
  height: 100%;
  .content{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      .pic{
            margin: auto;
            position: relative;
            background: url("/img/3DView.jpg");
            width:1200px;height:600px;
        .CT{
            color:red;
            position: absolute;
            left: 450px;
            top: 220px;
        }
        .surgicalOperation{
            color:red;
            position: absolute;
            left: 600px;
            top: 200px;
        }
        .room{
            color:red;
            position: absolute;
            left: 270px;
            top: 290px;
        }
        .front{
            color:red;
            position: absolute;
            left: 500px;
            top: 370px;
        }
      }
  }
}
</style>