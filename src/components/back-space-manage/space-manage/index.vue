<template>
  <div class="container">
    <a-page-header title="空间管理" />
    <div class="body">
      <div class="searchForm" style='display: flex; justify-content: space-between'>
        <a-form :model="spaceManageForm" autocomplete="off" layout="inline">
          <a-form-item label="空间类型" name="spaceType" style="margin: 10px 10px">
            <a-select v-model:value="spaceManageForm.spaceType" placeholder="请选择空间类型">
              <!-- <a-select-option value="all">全部</a-select-option> -->
              <a-select-option value="official">标准空间</a-select-option>
              <a-select-option value="official_customize">专属空间</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="空间名称" name="spaceName" style="margin: 10px 20px">
            <a-input v-model:value="spaceManageForm.spaceName"></a-input>
          </a-form-item>
          <a-form-item label="空间ID" name="spaceId" style="margin: 10px 20px">
            <a-input v-model:value="spaceManageForm.spaceId"></a-input>
          </a-form-item>
          <a-form-item label="空间状态" name="spaceState" style="margin: 10px 10px">
            <a-select v-model:value="spaceManageForm.spaceState" placeholder="请选择空间状态">
              <!-- <a-select-option value="all">全部</a-select-option> -->
              <a-select-option value="on">已上架</a-select-option>
              <a-select-option value="off">已下架</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" style="margin: 10px 10px 10px 30px"
              @click="pagination.pageNum=1;search()">查询</a-button>
            <a-button style="margin: 10px" @click="resetFields">重置</a-button>
          </a-form-item>
        </a-form>
        <!-- <div style="line-height: 50px; margin-right:0px;">
                <a>空间模板Excel下载</a>
            </div> -->
        <div class="createSpace">
          <a-button type="primary" @click="propData.title='新建空间'; cModalVisible=true">新建空间</a-button>
        </div>
      </div>

      <div class="spaceManageTable">
        <a-table class="ant-table-body" :columns="columns" :data-source="data.list" :scroll="scroll"
          :pagination="false" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'operation'">
              <a style="margin:10px" v-if="record.type=='专属空间'"
                @click="aModalVisible=true; propData.name=record.name; propData.spaceId=record._id">添加组织</a>
              <a style="margin:10px" v-if="record.type=='专属空间'"
                @click="getDetail(record._id,record.name,record.status)">查看组织</a>
              <a style="margin:10px" @click="propData.title='编辑空间';cModalVisible=true">编辑</a>
              <a style="margin:10px" v-if="isShow(record.type, record.status, record.relatedOrgNum)"
                @click="showDeleteConfirm(record.name, record._id)">删除</a>
              <a style="margin:10px" v-text="record.status == '已上架' ? '下架':'上架'"
                @click="changeStatus(record.status,  record._id)"></a>
            </template>
          </template>
        </a-table>
      </div>
      <div class="footer"> 
          <a-pagination class='pages' v-model:current="pagination.pageNum" v-model:page-size="pagination.pageSize"
            :total="pagination.total" 
              @change="pageChange" show-less-items/>
      </div>
      <CreateSpaceModal v-if="cModalVisible" @changeState="changeCModalState" :title="propData.title" />
      <AddOrgModal v-if="aModalVisible" :name="propData.name" :spaceId="propData.spaceId"
        @changeState="changeAModalState" />
    </div>
  </div>
</template>

<script>
export default {
  name: "orgSpaceList",
};
</script>

<script setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import { defineComponent, reactive, ref, toRefs, toRaw, computed, onMounted, getCurrentInstance, createVNode } from "vue";
import { Form } from "ant-design-vue";
import { useReq } from "@/components/common/use-req.js";
import { useRouter } from "vue-router";
import lodash from 'lodash'
import CreateSpaceModal from "./create-space-modal.vue"
import AddOrgModal from "./add-org-modal.vue"
const router = useRouter();
const useForm = Form.useForm;
const { handleReqAct } = useReq();
const { proxy } = getCurrentInstance()
const scroll = {
  x: 1500,
  y: window.innerHeight - 330,
};
const propData = reactive({
  radioData: '',
  name: '',
  spaceId: '',
  title: ''
});
const operator = ''  //上架或下架
onMounted(() => {
  // getSpaceData();
});
const isShow = (type, status, relatedOrgNum) => {
  if (type == '标准空间' && status == '已下架' || type == '专属空间' && relatedOrgNum == '') return true;
  return false;
}
const getDetail = (_id, spaceName, status) => {
  if (status == '已上架') {
    status = 'on'
  } else {
    status = 'off'
  }
  router.push({
    name: 'orgSpaceList', params: {
      _id, spaceName, status
    }
  });
}
const spaceManageForm = reactive({
  spaceType: '',
  spaceName: '',
  spaceId: '',
  spaceState: '',
});
const { resetFields } = Form.useForm(spaceManageForm);
const data = reactive({
  list: [],
  totalCount: 0,
});
const cModalVisible = ref(false);
const changeCModalState = (val) => {
  cModalVisible.value = val;
  getSpaceData();
};
const eModalVisible = ref(false);
const changeEModalState = (val) => {
  eModalVisible.value = val;
  getSpaceData();
};
const aModalVisible = ref(false);
const changeAModalState = (val) => {
  aModalVisible.value = val;
  getSpaceData();
};
//对表格的单元格进行条件渲染
const renderTdBackground = (record) => {
  if (record.status == '已下架') {
    return {
      style: {
        'color': 'red',
      },
    }
  }
};
const renderShowOrgNum = (record) => {
  if (record.type == '标准空间') {
    record.relatedOrgNum = ''
    return {
      style: {
        
      },
    }
  }
}
const columns = [{
  title: '空间ID',
  width: 200,
  dataIndex: '_id',
  key: '_id',
}, {
  title: '空间名称',
  width: 150,
  dataIndex: 'name',
  key: 'name',
}, {
  title: '空间类型',
  dataIndex: 'type',
  key: 'type',
  width: 160,
}, {
  title: '空间状态',
  dataIndex: 'status',
  key: 'status',
  width: 150,
  customCell: renderTdBackground

}, {
  title: '关联组织个数',
  dataIndex: 'relatedOrgNum',
  key: 'relatedOrgNum',
  width: 100,
  customCell: renderShowOrgNum
}, {
  title: '备注',
  dataIndex: 'desc',
  key: 'desc',
  width: 150,
}, {
  title: '更新人',
  dataIndex: 'updater',
  key: 'updater',
  width: 120,
}, {
  title: '更新时间',
  dataIndex: 'updatedAt',
  key: 'updatedAt',
  width: 160,
},
{
  title: '操作',
  key: 'operation',
  fixed: 'right',
  width: '170px'

}];
const getSpaceData = async () => {
  let res = await handleReqAct({
    name: 'getSpaceList',
    datas: {
      type: spaceManageForm.spaceType,
      name: spaceManageForm.spaceName,
      id: spaceManageForm.spaceId,
      status: spaceManageForm.spaceState,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize
    }
  });
  if (res.success) {
    data.list = res.result.data;
    pagination.total = res.result.totalCount;
  } else {
  }
};
const changeStatus = async (status, _id) => {
  let op = '';
  let text = '';
  if (status == '已上架') {
    op = 'off';
    text = '下架';
  } else { op = 'on'; text = '上架'; }
  proxy.$modal.confirm({
    centered: true,
    maskClosable: true,
    closable: true,
    icon: createVNode(ExclamationCircleFilled),
    title: '确认' + text + '该空间吗？',
    okText: text,
    okType: 'danger',
    cancelText: '取消',
    async onOk () {
      let res = await handleReqAct({
        name: 'changeStatus',
        datas: {
          spaceStatus: op,
          spaceId: _id
        }
      });
      if (res.success) {
        proxy.$message.success(text + '空间成功');
        getSpaceData()
      } else {
        // console.log(res);
      }
    },
    onCancel () {
    },

  });
}
const pagination = reactive({
  total: undefined,
  pageNum: 1,
  pageSize: 20,
  showSizeChanger: false,
  // hideOnSinglePage:true,//只有一页时是否隐藏分页器
});
const pageChange = (number) => {
  pagination.pageNum = number
  getSpaceData()
}
const showDeleteConfirm = (spaceName, _id) => {
  proxy.$modal.confirm({
    centered: true,
    maskClosable: true,
    closable: true,
    icon: createVNode(ExclamationCircleFilled),
    title: '确认删除空间：' + spaceName,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk () {
      let res = await handleReqAct({
        name: 'deleteSpace',
        link: `/${_id}`,
        datas: {
          id: _id
        }
      });
      if (res.success) {
        proxy.$message.success('删除空间成功');
        getSpaceData();
      } else {
        // console.log(res);
      }
    },
    onCancel () {
    },

  });
};

// const rulesRef = reactive({
//     spaceName: [{
//         required: false,
//         pattern: /^[\a-\z\A-\Z0-9\u4e00-\u9fe5]+$/,
//         message: '不能含有特殊字符',
//         // validator: valiSpaceName,
//         trigger: 'change'
//     }],
// });
// const {
//   onResetFields,
//   validate,
//   validateInfos,
// } = useForm(spaceManageForm, rulesRef);
const search = async () => {
  // await validate().then(res => {
  getSpaceData();
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
  .createSpace {
    margin: 10px 0px;
  }
  .spaceManageTable {
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
