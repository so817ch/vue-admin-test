<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryFormNow" class="demo-form-inline">
      <el-form-item label="科目名称">
        <el-input
          v-model="queryFormNow.name"
          placeholder="输入科目名称"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-row type="flex" justify="end">
      <el-button class="menu-button" type="primary" @click="handleQuery">
        <template>
          <font-awesome-icon
            class="button-icon"
            icon="fa-solid fa-magnifying-glass"
          />
          <span>查询</span>
        </template>
      </el-button>

      <el-button class="menu-button" type="success" @click="handleAdd"
        ><template>
          <font-awesome-icon class="button-icon" icon="fa-solid fa-plus" />
          <span>新增科目</span>
        </template></el-button
      >

      <el-button class="menu-button" type="warning" @click="handleCheckAll"
        ><template>
          <font-awesome-icon
            class="button-icon"
            icon="fa-solid fa-square-check"
          />
          <span>全部选择</span>
        </template></el-button
      >

      <el-button class="menu-button" type="warning" @click="handleUnCheckAll"
        ><template>
          <font-awesome-icon
            class="button-icon"
            icon="fa-solid fa-square-xmark"
          />
          <span>全部取消</span>
        </template></el-button
      >

      <el-button class="menu-button" type="danger" @click="handleBatchDelete"
        ><template>
          <font-awesome-icon class="button-icon" icon="fa-solid fa-trash-can" />
          <span>批量删除</span>
        </template></el-button
      >
    </el-row>

    <el-table
      :data="tableData"
      stripe=""
      height="500"
      border
      style="width: 100%"
      @select="handleSelection"
      @select-all="handleSelectAll"
      ref="subjectTable"
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>

      <el-table-column label="ID" width="50" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="科目" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" header-align="center">
        <template v-slot="scope">
          <!-- 点击按钮时，将id传入方法 -->
          <el-button size="mini" @click="handleEdit(scope.row.id)"
            ><template>
              <font-awesome-icon
                class="button-icon"
                icon="fa-solid fa-circle-info"
              />
              <span>编辑</span>
            </template></el-button
          >

          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id, scope.row.name)"
            ><template>
              <font-awesome-icon
                class="button-icon"
                icon="fa-solid fa-trash-can"
              />
              <span>删除</span>
            </template></el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-row
      type="flex"
      justify="start"
      style="margin-top: 10px; margin-bottom: 10px"
      align="middle"
    >
      <div style="margin-right: 10px; color: #606266; font-size: 13px">
        已选中{{ multipleSelection.length }}/{{ total }}条
      </div>
      <el-select
        v-model="pageForm.pageSize"
        placeholder="请选择"
        size="mini"
        style="margin-right: 10px; width: 100px"
        @change="changePage(1)"
      >
        <el-option
          v-for="item in pageOption"
          :key="item.id"
          :label="`${item.pageSize} 条/页`"
          :value="item.pageSize"
        >
        </el-option>
      </el-select>

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
    </el-row>
  </div>
</template>

<script>
import {
  deleteSchool,
  getAllSchool,
  getSchoolPage,
  addSchool,
  getSchool,
  updateSchool
} from "@/api/school";
import { addSubject, deleteSubject, getSubject, getSubjectPage, updateSubject } from "@/api/subject";
import { deleteTeacher, getTeacherPage } from "@/api/user";

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
      allData: [],
      tableData: [],
      schoolData: [],
      multipleSelection: [],
      queryForm: {
        name: "",
      },
      queryFormNow: {
        name: "",
      },
      pageOption: [
        {
          id: 1,
          pageSize: 5,
        },
        {
          id: 2,
          pageSize: 10,
        },
        {
          id: 3,
          pageSize: 15,
        },
        {
          id: 4,
          pageSize: 20,
        },
      ],
      status: [
        { id: 0, name: "正常" },
        { id: 1, name: "异常" },
      ],
    };
  },
  computed: {
    pageQueryForm() {
      const mergeForm = { ...this.pageForm, ...this.queryForm };
      return mergeForm;
    },
    getAllPageQueryForm() {
      const mergeFormCopy = JSON.parse(JSON.stringify(this.pageQueryForm));
      mergeFormCopy.page = 1;
      mergeFormCopy.pageSize = 1000000;
      return mergeFormCopy;
    },
    getAllPageForm() {
      const mergeFormCopy = JSON.parse(JSON.stringify(this.pageForm));
      mergeFormCopy.page = 1;
      mergeFormCopy.pageSize = 1000000;
      return mergeFormCopy;
    },
  },
  created: function () {
    getSubjectPage(this.pageForm).then((response) => {
      this.tableData = response.data.records;
      this.total = response.data.total;
      this.isShow = true;
    });
    getSubjectPage(this.getAllPageForm).then((response) => {
      this.allData = response.data.records;
    });
    
  },
  methods: {
    getAllData() {
      getSubjectPage(this.getAllPageForm).then((response) => {
      this.allData = response.data.records;
    });
    },
    handleQuery() {
      // this.multipleSelection = [];
      // this.queryForm = JSON.parse(JSON.stringify(this.queryFormNow));
      // this.changePage(1);
    },
    handleEdit(id) {
      //跳转到添加页面，同时传递品牌id，方便在添加页面查询品牌信息，并显示
      // this.$router.push("/teacher/info/" + id);
      getSubject(id).then((response) => {
        const oldName = response.data.name;
        this.$prompt("请输入新科目名称", "修改科目", {
          inputValue: oldName,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(({ value }) => {
            const name = value;
            updateSubject({ id, name })
              .then(() => {
                this.$message({
                  type: "success",
                  message: `成功修改科目”${oldName}“为”${name}“`,
                });
                const pageFormCopy = JSON.parse(JSON.stringify(this.pageForm));
                this.changePage(pageFormCopy.page);
              })
              .catch((error) => {
                this.$message({
                  type: "error",
                  message: "修改失败: " + error,
                });
              });
            // this.$router.go(0);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入",
            });
          });
      });
    },
    handleAdd() {
      // this.$router.push({ path: "/teacher/add" });
      this.$prompt("请输入科目名称", "添加科目", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          const name = value;
          addSubject({ name })
            .then(() => {
              this.$message({
                type: "success",
                message: "添加了科目: " + name,
              });
              const pageFormCopy = JSON.parse(JSON.stringify(this.pageForm));
              this.changePage(pageFormCopy.page);
            })
            .catch((error) => {
              this.$message({
                type: "error",
                message: "添加失败: " + error,
              });
            });
          // this.$router.go(0);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    handleCheckAll() {
      console.log(this.allData);
      this.multipleSelection = this.allData.map((item) => item.id);
      console.log(this.multipleSelection);
      const pageFormCopy = JSON.parse(JSON.stringify(this.pageForm));
      this.changePage(pageFormCopy.page);
    },
    handleUnCheckAll() {
      this.multipleSelection = [];
      const pageFormCopy = JSON.parse(JSON.stringify(this.pageForm));
      this.changePage(pageFormCopy.page);
    },
    handleDelete(id, name) {
      deleteSubject([id])
        .then((response) => {
          this.$message({
            message: `成功删除了科目：${name}`,
            type: "success",
          });
          console.log("id=" + id);
          const index = this.multipleSelection.findIndex((item) => item === id);
          console.log("index=" + index);
          if (index !== -1) {
            this.multipleSelection.splice(index, 1);
          }
          const pageFormCopy = JSON.parse(JSON.stringify(this.pageForm));
          this.changePage(pageFormCopy.page);
        })
        .catch((error) => {
          this.$message({
            message: `删除失败：${error}`,
            type: "error",
          });
        });
    },
    colg(data) {
      console.log(data);
    },
    changePage(page) {
      this.pageForm.page = page;
      const pageFormCopy = JSON.parse(JSON.stringify(this.pageForm));
      getSubjectPage(pageFormCopy).then((response) => {
        this.tableData = response.data.records;
        this.total = response.data.total;
        this.getAllData();
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
          this.$refs.subjectTable.toggleRowSelection(row, true);
        }
      });
    },
    // getSchoolName(id) {
    //   return this.schoolData.find((item) => item.id === id)?.name;
    // },
    handleBatchDelete() {
      deleteSubject(this.multipleSelection)
        .then((response) => {
          this.$message({
            message: `成功删除了ID为${this.multipleSelection}的共${this.multipleSelection.length}个科目`,
            type: "success",
          });
          this.multipleSelection = [];
          this.changePage(1);
        })
        .catch((error) => {
          this.$$message({
            message: `删除失败：${error}`,
            type: "success",
          });
        });
    },
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.menu-button {
  margin-left: 25px;
}

.button-icon {
  margin-right: 5px;
}
</style>