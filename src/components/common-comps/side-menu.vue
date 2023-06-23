<template>
  <div class="sidemenu">
    <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" v-model:openKeys="openKeys">
      <!-- <a-menu-item key="Index" @click="gotoPage('Index')">
        <UserOutlined />
        <span>nav 1</span>
      </a-menu-item> -->
      <!-- <a-sub-menu key="resource" @click="gotoPage">
        <template #icon>
          <VideoCameraOutlined />
        </template>
        <template #title>内部资源管理</template>
        <a-menu-item key="resourcePool">资源池管理</a-menu-item>
        <a-menu-item key="innerOrg">内部组织管理</a-menu-item>
        <a-menu-item key="outerOrg">外部组织管理</a-menu-item>
        <a-menu-item key="excessUsed">超量使用申请记录</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="backSpaceManage" @click="gotoPage">
        <template #icon>
          <VideoCameraOutlined />
        </template>
        <template #title>后台空间管理</template>
        <a-menu-item key="spaceManage">空间管理</a-menu-item>
        <a-menu-item key="orgSpaceList">组织空间列表</a-menu-item>
      </a-sub-menu> -->
      <a-sub-menu key="screen" @click="gotoPage">
        <template #icon>
          <img src="/img/visual.png" style="width: 16px; height: 16px" />
        </template>
        <template #title>可视化显示</template>
        <a-menu-item key="screenShowInfo">大屏展示</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="infoManage" @click="gotoPage">
        <template #icon>
          <img src="/img/personInfo.png" style="width: 16px; height: 16px" />
        </template>
        <template #title>信息管理</template>
        <a-menu-item key="ownerInfoManage">业主信息管理</a-menu-item>
        <!-- <a-menu-item key="staffInfo">工作人员信息管理</a-menu-item> -->
        <a-menu-item key="houseInfo">房屋信息管理</a-menu-item>
        <a-menu-item key="carInfo">车位信息管理</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="notificationManagement" @click="gotoPage">
        <template #icon>
          <img src="/img/info.png" style="width: 16px; height: 16px" />
        </template>
        <template #title>通知管理</template>
        <a-menu-item key="activity">活动通知</a-menu-item>
        <a-menu-item key="property">物业通知</a-menu-item>
        <a-menu-item key="vote">投票通知</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="maintenanceManage" @click="show = !show;gotoPage();">
        <template #icon>
          <img src="/img/fix.png" style="width: 16px; height: 16px" />
        </template>
        <template #title>
          <div style="display: flex;flex-direction: row;align-items: center;">
            <div>维修管理</div> 
            <div v-if="show === true" style="margin-left: 5px;">
              <a-badge :count="badgeNum"/>
            </div>
          </div>
        </template>
        <a-menu-item key="maintenanceList">
          <div style="display: flex;flex-direction: row;align-items: center;">
            <div>维修列表</div>
            <div style="margin-left: 5px;">
              <a-badge :count="badgeNum"/>
            </div>
          </div>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="messageManagement" @click="gotoPage">
        <template #icon>
          <img src="/img/reply.png" style="width: 16px; height: 16px" />
        </template>
        <template #title>留言管理</template>
        <a-menu-item key="complaint">投诉管理</a-menu-item>
        <a-menu-item key="suggestion">意见反馈管理</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="paymentManagement" @click="gotoPage">
        <template #icon>
          <img src="/img/pay.png" style="width: 16px; height: 16px" />
        </template>
        <template #title>缴费管理</template>
        <a-menu-item key="propertyFee">物业费管理</a-menu-item>
        <a-menu-item key="carFee">车位费管理</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="inOutInfo" @click="gotoPage">
        <template #icon>
          <img src="/img/inOut.png" style="width: 16px; height: 16px" />
        </template>
        <template #title>出入管理</template>
        <a-menu-item key="visitorInfo">访客信息管理</a-menu-item>
        <a-menu-item key="inOutInfo">出入信息管理</a-menu-item>
      </a-sub-menu>
      <!-- <a-sub-menu key="backSpaceManage" @click="gotoPage">
        <template #icon>
          <VideoCameraOutlined />
        </template>
        <template #title>核酸信息管理</template>
        <a-menu-item key="spaceManage">空间管理</a-menu-item>
        <a-menu-item key="orgSpaceList">组织空间列表</a-menu-item>
      </a-sub-menu> -->
    </a-menu>
  </div>
</template>

<script>
import { UserOutlined, VideoCameraOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

export default {
  name: 'SideMenu'
}
</script>
<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex'
const store = useStore()
const router = useRouter();
const route = useRoute();
const selectedKeys = ref(['']);
const openKeys=ref(['resource'])
const show = ref(true)
// const badgeNum = ref(store.getters['system/_setState']('fixInfo').badgeNum)
const badgeNum = ref(10)
watch(()=>router.currentRoute.value.path,(val)=>{
selectedKeys.value[0]=val.split('/')[2]
},{
  immediate:true
})
onMounted(()=>{
})
function gotoPage () {
  console.log(selectedKeys.value[0])
  if(selectedKeys.value[0]=== 'maintenanceList'){ badgeNum.value = 0; }
  router.push({ name: selectedKeys.value[0]});
}
</script>

<style lang="less" scoped>
@import "@/assets/styles/common.less";
.sidemenu {
  .heightCalc(100%, 64px);
  overflow-y: auto;
}
:deep(.ant-badge){
  top:-2px
}
:deep(.ant-badge-count){
  box-shadow: 0 0 0 0px #fff
}
</style>