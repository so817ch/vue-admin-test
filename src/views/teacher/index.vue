<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="ID号">
        <el-input v-model="queryForm.id" placeholder="ID号"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="queryForm.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="学校">
        <el-select
          v-model="queryForm.schId"
          placeholder="输入以选择学校"
          clearable
          filterable
          name="school"
          ref="school"
        >
          <el-option
            v-for="item in schoolData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryForm.status"
          placeholder="选择状态"
          clearable
          filterable
          name="school"
          ref="school"
        >
          <el-option
            v-for="item in status"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-row type="flex" justify="end">
      <el-button
        class="menu-button"
        type="primary"
        @click="colg(queryForm)"
      >
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
          <span>新增用户</span>
        </template></el-button
      >

      <el-button class="menu-button" type="warning"
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

      <el-table-column label="联系电话" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.tel }}</span>
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
            {{ status.find((item) => item.id === scope.row.status).name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="注册时间" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" header-align="center">
        <template v-slot="scope">
          <!-- 点击按钮时，将id传入方法 -->
          <el-button size="mini" @click="handleInfo(scope.row.id)"
            ><template>
              <font-awesome-icon
                class="button-icon"
                icon="fa-solid fa-circle-info"
                @click="handleInfo(scope.row.id)"
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
import { getAllSchool } from "@/api/school";
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
      tableData: [],
      schoolData: [],
      multipleSelection: [],
      queryForm: {
        id: null,
        name: '',
        schId: null,
        status:null,
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
    handleInfo(id) {
      //跳转到添加页面，同时传递品牌id，方便在添加页面查询品牌信息，并显示
      this.$router.push("/teacher/info/" + id);
    },
    handleAdd() {
      this.$router.push({ path: "/teacher/add" });
    },
    handleUnCheckAll() {
      this.multipleSelection = [];
      const pageFormCopy = JSON.parse(JSON.stringify(this.pageForm));
      this.changePage(pageFormCopy.page);
    },
    handleDelete(id, name) {
      deleteTeacher([id])
        .then((response) => {
          this.$message({
            message: `成功删除了用户：${name}`,
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
          this.$$message({
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
      getTeacherPage(pageFormCopy).then((response) => {
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
    handleBatchDelete() {
      deleteTeacher(this.multipleSelection)
        .then((response) => {
          this.$message({
            message: `成功删除了ID为${this.multipleSelection}的共${this.multipleSelection.length}位用户`,
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