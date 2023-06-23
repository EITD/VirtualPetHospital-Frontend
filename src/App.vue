<template>
  <a-config-provider :locale="localeObj">
    <template v-if="$route.meta.template === 'dashboardTemp'">
      <div id="dashboardTemp">
        <!-- <a-layout style="height:100%;overflow:hidden;">
          <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
            <div class="dashLogo">
              <a-image :width="40" :preview="false" src="/img/community.png" @click="reloadPage" />
              <span v-if="!collapsed" style="margin-left:8px;">智慧社区</span>
            </div>
            <SideMenu />
          </a-layout-sider>
          <a-layout>
            <a-layout-header style="background: #ffffff; padding: 8px;height:50px">
              <div class="dashHeader">
                <div class="dashHeaderLeft">
                  <MenuUnfoldOutlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
                  <MenuFoldOutlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
                </div>
                <div class="dashHeaderRight">
                  <HeaderRight />
                </div>
              </div>
            </a-layout-header>
            <a-layout-content style="padding:8px;" class="dashConetnt">
              <router-view v-slot="{ Component }">
                <transition name="ani-container">
                  <keep-alive v-if="$route.meta.keepAlive">
                    <component :is="Component" />
                  </keep-alive>
                  <component v-else :is="Component" />
                </transition>
              </router-view>
            </a-layout-content>
          </a-layout>
        </a-layout> -->
      </div>
    </template>
    <template v-else-if="$route.meta.template === 'oneScreenTemp'">
      <router-view v-slot="{ Component }">
        <transition name="ani-container">
          <keep-alive v-if="$route.meta.keepAlive">
            <component :is="Component" />
          </keep-alive>
          <component v-else :is="Component" />
        </transition>
      </router-view>
    </template>
  </a-config-provider>
</template>

<script>
export default {
  name: 'App',
}
</script>
<script setup>
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { getCurrentInstance, computed, ref,onMounted,watch } from 'vue';
import { useI18n } from 'vue-i18n';
import SideMenu from '@/components/common-comps/side-menu.vue';
import HeaderRight from '@/components/common-comps/dash-header-right/index.vue';
import { connectWebsocket } from '@/utils/websocket'
import { useStore } from 'vuex'
const store = useStore()

const { proxy } = getCurrentInstance();
const { locale } = useI18n();
const localeObj = computed(() => proxy._cnf.languages[locale.value]);
const collapsed = ref(false)
const screenWidth=ref(document.body.clientWidth)
const timer=ref(false) //防止频繁触发窗口刷新
//窗口改变页面重载
// watch(()=>screenWidth.value,(val)=>{
//      if(!timer.value){
//           screenWidth.value = val
//             timer.value= true
//             setTimeout(()=>{
//                 window.location.reload();
//                 timer.value = false
//             },400)
//         }
// })
onMounted(()=>{
   window.onresize = () => {
        return (() => {
            window.screenWidth = document.body.clientWidth
            screenWidth.value = window.screenWidth
        })()
    }
})
function reloadPage () {
  window.location.href = '/';
}



</script>

<style lang="less">
@import "@/assets/styles/global.less";
</style>
