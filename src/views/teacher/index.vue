<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="审批人">
        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      stripe=""
      border
      style="width: 100%"
      @select="handleSelection"
      @select-all="handleSelectAll"
      ref="teacherTable"
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>

      <el-table-column label="ID" width="50" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="姓名" width="100" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="性别" width="50" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.gender === 1 ? "男" : "女" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="学校" header-align="center">
        <template v-slot="scope">
          <span>{{ getSchoolName(scope.row.schId) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="80" align="center">
        <template v-slot="scope">
          <el-tag :type="scope.row.status ? 'danger' : 'success'">
            {{ scope.row.status ? "异常" : "正常" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250" header-align="center">
        <template v-slot="scope">
          <!-- 点击按钮时，将id传入方法 -->
          <el-button size="mini" @click="handleInfo(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            circle
            size="mini"
            @click="handleDelete(scope.row.id)"
          >
            <div class="icon-container">
              <font-awesome-icon icon="fa-solid fa-trash-can" />
            </div>
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="changePage"
      :current-page="pageForm.page"
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
import { getAllSchool } from "@/api/school";
import { getTeacherPage } from "@/api/user";

export default {
  data() {
    return {
      currentPage: 1,
      total: 1,
      pageForm: {
        page: 1,
        pageSize: 10,
      },

      // 默认不显示分页
      isShow: false,
      tableData: [],
      schoolData: [],
      multipleSelection: [],
      formInline: {
          user: '',
          region: ''
        }
    };
  },
  created: function () {
    getTeacherPage(this.pageForm).then((response) => {
      this.tableData = response.data.records;
      this.total = response.data.total;
      this.isShow = true;
    });
    getAllSchool().then((response) => {
      this.schoolData = response.data;
    });
  },
  methods: {
    changePage(page) {
      console.log("page");
      this.pageForm.page = page;
      getTeacherPage(this.pageForm).then((response) => {
        this.tableData = response.data.records;
        this.total = response.data.total;
        this.$nextTick(() => {
          this.setDefaultSelection(); // 确保在表格渲染后调用
        });
      });
    },
    handleSelection(selection, row) {
      const index = this.multipleSelection.findIndex((item) => item === row.id);
      if (index === -1) {
        this.multipleSelection.push(row.id);
      } else {
        this.multipleSelection.splice(index, 1);
      }
      console.log(this.multipleSelection);
    },
    handleSelectAll(selection) {
      this.tableData.forEach((row) => {
        const index = this.multipleSelection.findIndex(
          (item) => item === row.id
        );
        if (index !== -1) {
          this.multipleSelection.splice(index, 1);
        }
      });
      selection.forEach((row) => {
        this.multipleSelection.push(row.id);
      });
      console.log(this.multipleSelection);
    },
    setDefaultSelection() {
      this.tableData.forEach((row) => {
        if (this.multipleSelection.includes(row.id)) {
          this.$refs.teacherTable.toggleRowSelection(row, true);
        }
      });
    },
    getSchoolName(id) {
      return this.schoolData.find((item) => item.id === id)?.name;
    },
    onSubmit() {
        console.log('submit!');
      }
  },
};
</script>

<style scoped>
.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1em; /* 设置宽度为1em */
  height: 1em; /* 设置高度为1em，与宽度相同保持正方形 */
  font-size: 1em; /* 调整图标大小，确保它不会超出按钮界限 */
}

/* 调整图标本身的尺寸以适应容器 */
.fa-icon {
  width: 100%;
  height: 100%;
}
</style>