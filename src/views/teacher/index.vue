<template>
  <div class="app-container">
    <el-table :data="tableData" stripe="" style="width: 100%">
      <el-table-column label="ID" width="180" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.date }}</span>
        </template>  
      </el-table-column>
      <el-table-column label="姓名" width="180" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" header-align="center"> 
        <template v-slot="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="changePage"
      :current-page="pageForm.pageNum"
      v-if="isShow"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageForm.pageSize"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getTeacherPage } from '@/api/user';

export default {
  data() {
    return {
      currentPage: 1,
      total: 1,
      pageForm: {
        pageNum:1,
        pageSize: 10,
      },
      
      // 默认不显示分页
      isShow: false,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  created: function () {
    getTeacherPage(this.pageForm).then((response) => {
      this.tableData = response.data.records;
      this.total = response.data.total;
      this.isShow = true;
    })
  },
  methods: {
    changePage(pageNum) {
      this.pageForm.pageNum = pageNum;
      getCoursePage(this.pageForm).then((response) => {
        this.tableData = response.data.records;
        this.total = response.data.total;
      });
    },
  }
};
</script>

<style>
</style>