<template>
  <div class="container">
    <a-page-header title="组织专属空间详细列表" />
    <div class="body">
      <div class="searchForm">
        <a-form
          :model="orgSpaceForm"
          autocomplete="off"
          style="width: 100%"
          layout="inline"
        >
          <a-form-item
            label="组织名称"
            name="orgName"
            style="margin: 10px 10px"
          >
            <a-input v-model:value="orgSpaceForm.orgName"></a-input>
          </a-form-item>
          <a-form-item label="组织ID" name="orgId" style="margin: 10px 10px" >
            <a-input v-model:value="orgSpaceForm.orgId" placeholder="请填写完整的组织ID"></a-input>
          </a-form-item>
          <a-form-item
            label="组织状态"
            name="orgState"
            style="margin: 10px 10px"
          >
            <a-select
              v-model:value="orgSpaceForm.orgState"
              placeholder="请选择组织状态"
            >
              <a-select-option value="all">全部</a-select-option>
              <a-select-option value="on">正常</a-select-option>
              <a-select-option value="off">已解散</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="空间名称"
            name="spaceName"
            style="margin: 10px 10px"
          >
            <a-input v-model:value="orgSpaceForm.spaceName"></a-input>
          </a-form-item>
          <a-form-item label="空间ID" name="spaceId" style="margin: 10px 10px">
            <a-input v-model:value="orgSpaceForm.spaceId"></a-input>
          </a-form-item>
          <a-form-item
            label="空间状态"
            name="spaceState"
            style="margin: 10px 10px"
          >
            <a-select
              v-model:value="orgSpaceForm.spaceState"
              placeholder="请选择空间状态"
            >
              <a-select-option value="all">全部</a-select-option>
              <a-select-option value="on">已上架</a-select-option>
              <a-select-option value="off">已下架</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="组织空间状态"
            name="orgSpaceState"
            style="margin: 10px 10px"
          >
            <a-select
              v-model:value="orgSpaceForm.orgSpaceState"
              placeholder="请选择组织空间状态"
            >
              <a-select-option value="all">全部</a-select-option>
              <a-select-option value="on">已上架</a-select-option>
              <a-select-option value="off">已下架</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              style="margin: 10px"
              @click="pagination.pageNum = 1;search()"
              >查询</a-button
            >
            <a-button style="margin: 10px" @click="resetFields">重置</a-button>
          </a-form-item>
        </a-form>

        <div class="orgSpaceTable">
          <a-table
            class="ant-table-body"
            :columns="columns"
            :data-source="data.list"
            :scroll="scroll"
            :pagination="false"
            bordered
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'operation'">
                <a v-text="record.orgSpaceStatus == '已上架' ? '下架组织空间':'上架组织空间'" 
                   v-show="!(record.orgStatus=='已解散' && record.orgSpaceStatus == '已下架')"
                   @click="offConfirm(record.spaceId, record.orgId, record.orgSpaceStatus)">
                </a>
                <!-- <a style="margin:10px" v-show="record.orgSpaceStatus == '已下架'"
                   @click="deleteConfirm(record)">移除组织</a> -->
              </template>
              
            </template>
          </a-table>
        </div>
      </div>
      <div class="footer"> 
          <a-pagination class='pages' v-model:current="pagination.pageNum" v-model:page-size="pagination.pageSize"
            :total="pagination.total" 
              @change="pageChange" show-less-items/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "orgSpaceList",
};
</script>

<script setup>
import { defineComponent, reactive, ref, toRefs, toRaw, computed, onMounted, createVNode, getCurrentInstance} from "vue";
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import { Form } from "ant-design-vue";
import { useReq } from "@/components/common/use-req.js";
import { useRoute } from "vue-router";
const { proxy } = getCurrentInstance()
const route = useRoute();
const { handleReqAct } = useReq();
const useForm = Form.useForm;

const scroll = {
  x: 1500,
  y: window.innerHeight - 390,
};

const orgSpaceForm = reactive({
  orgName: '',
  orgId: '',
  orgState: '',
  spaceName: '',
  spaceId: '',
  spaceState: '',
  orgSpaceState: '',
});
const { resetFields } = Form.useForm(orgSpaceForm);
onMounted(() => {
  // orgSpaceForm.spaceName = route.params.spaceName;
  // orgSpaceForm.spaceId = route.params._id;
  // // orgSpaceForm.spaceState = route.params.status;
  // getOrgSpaceData();
});
const data = reactive({
  list: [],
  totalCount: 0,
});
const getOrgSpaceData = async (resource) => {
  let orgStatus = ''
  if(orgSpaceForm.orgState=='正常'){
    orgStatus = 'on'
  }else if(orgSpaceForm.orgState=='已解散'){
    orgStatus = 'off'
  }else{
    orgStatus = 'all'
  }
  let res = await handleReqAct({
    name: "getOrgSpaceList",
    datas: {
      orgName: orgSpaceForm.orgName,
      orgId: orgSpaceForm.orgId,
      orgStatus: orgSpaceForm.orgState,
      spaceId: orgSpaceForm.spaceId,
      spaceName: orgSpaceForm.spaceName,
      spaceStatus: orgSpaceForm.spaceState,
      orgSpaceStatus: orgSpaceForm.orgSpaceState,
      pageSize: pagination.pageSize,
      pageNum: pagination.pageNum
    },
  });
  if (res.success) {
    data.list = res.result.data;
    pagination.total = res.result.totalCount;
  } else {
    // console.log(res);
  }
};
const renderTdColor=(record)=>{
  if(record.spaceStatus == '已下架'){
      return {
        style: {
          'color': 'red',
        },
      }
  }
};
const renderTdOrgColor=(record)=>{
  if(record.orgStatus == '已解散'){
      return {
        style: {
          'color': 'red',
        },
      }
  }
};
const renderTdOrgSpaceColor=(record)=>{
  if(record.orgSpaceStatus == '已下架'){
      return {
        style: {
          'color': 'red',
        },
      }
  }
};
const columns = [{
  title: '组织名称',
  width: 100,
  dataIndex: 'orgName',
  key: 'orgName',
}, {
  title: '组织ID',
  width: 150,
  dataIndex: 'orgId',
  key: 'orgId',
}, {
  title: '组织状态',
  dataIndex: 'orgStatus',
  key: 'orgStatus',
  width:70,
  customCell: renderTdOrgColor
}, {
  title: '空间名称',
  dataIndex: 'spaceName',
  key: 'spaceName',
  width: 150,
}, {
  title: '空间状态',
  dataIndex: 'spaceStatus',
  key: 'spaceStatus',
  width: 70,
  customCell: renderTdColor
}, {
  title: '该组织空间状态',
  dataIndex: 'orgSpaceStatus',
  key: 'orgSpaceStatus',
  width: 80,
  customCell: renderTdOrgSpaceColor
}, {
  title: '空间ID',
  dataIndex: 'spaceId',
  key: 'spaceId',
  width: 150,
}, {
  title: '操作',
  key: 'operation',
  fixed: 'right',
  width: 80,
}];

const pagination = reactive({
  total: undefined,
  pageNum: 1,
  pageSize: 20,
  showSizeChanger: false,
  // hideOnSinglePage:true,//只有一页时是否隐藏分页器
  // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`, //分页中显示总的数据
  // onChange: (current) => {
  //   pagination.pageNum = current;
  //   getOrgSpaceData();
  // },
});
const pageChange = (value) => {
  pagination.pageNum = value;
  getOrgSpaceData();
};
const offConfirm = async (spaceId, orgId, orgSpaceStatus) => {
  let status = '';
  let text = '';
  if(orgSpaceStatus == '已上架'){
    status = 'OFF';
    text = '下架';
  }else{
    status = 'ON';
    text = '上架';
  }
  proxy.$modal.confirm({
    centered: true,
    maskClosable: true,
    closable: true,
    icon: createVNode(ExclamationCircleFilled),
    title: '确认' + text + '该组织的空间吗',
    // content: spaceName,
    okText: text,
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      let res = await handleReqAct({
        name: 'changeOrgSpaceStatus',
         datas: {
          spaceId: spaceId,
          organizationId: orgId,
          status: status
        },
      });
      if (res.success) {
        proxy.$message.success(text+'组织空间成功');
        getOrgSpaceData();
      } else {
        // console.log(res);
      }
      },
      onCancel() {
      },

    });

};
// const deleteConfirm = (v) => {
//  proxy.$modal.confirm({
//     title:'移除组织',
//     centered: true,
//     maskClosable: true,
//     closable: true,
//     icon: createVNode(ExclamationCircleFilled),
//     content: `确定要移除该组织吗？`,
//     okText: '移除',
//     cancelText: '取消',
//     onOk: async () => {
//       let res = await handleReqAct({
//         name: '',
//         link: `/${v.orgId}`
//       })
//       proxy.showLog('', res)
//       if (res.success) {
//         proxy.$message.success('移除组织成功');
//         search()
//       } else {
//         // proxy.$message.error(proxy._errCode.getErrMsg(res.errCode));
//       }
//     }
//   })
// }
// const valiSpaceName = (_rule) => {
//   let specialKey =
//         "（。(&*（‘";
//       for (let i = 0; i < orgSpaceForm.spaceName.length; i++) {
//         if (specialKey.indexOf(orgSpaceForm.spaceName.substr(i, 1)) != -1) {
//           return Promise.reject('不能含有特殊字符');;
//         }
//       }
//       return Promise.resolve();
// }
// const rulesRef = reactive({
//     spaceName: [{
//         required: false,
//         pattern: /^[\a-\z\A-\Z0-9\u4e00-\u9fe5]+$/,
//         // validator: valiSpaceName,
//         message: '不能含有特殊字符',
//         trigger: 'change'
//     }],
// });
// const {
//   onResetFields,
//   validate,
//   validateInfos,
// } = useForm(orgSpaceForm, rulesRef);
const search = async()=> {
  // await validate().then(res => {
    getOrgSpaceData();
  // }).catch(err => {
  // });
};
</script>

<style lang="less" scoped>
.body {
  border-top: 3px solid #e4e4e7;
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .orgSpaceTable {
    margin-top: 10px;
  }
  .footer{
    width: 100%;
    display: flex;
    margin-top: 10px;
    margin-bottom: 20px;
    align-items: center;
    justify-content: right;
  }
}
:deep(.ant-form-horizontal .ant-form-item-label) {
  text-align: left;
}
:deep(.ant-form-item-label > label) {
  font-weight: 550;
}
</style>
