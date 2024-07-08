<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryFormNow" class="demo-form-inline">
      <el-form-item label="科目名称">
        <el-select
          v-model="queryFormNow.subId"
          placeholder="输入以选择科目"
          clearable
          filterable
          name="subject"
          ref="subject"
          @change="onSubjectChange"
          @clear="onSubjectClear"
        >
          <el-option
            v-for="item in subjectData"
            :key="item.id"
            :label="item.id + '-' + item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="题目名称">
        <el-select
          v-model="queryFormNow.queId"
          placeholder="请先选择科目"
          clearable
          filterable
          name="question"
          ref="question"
        >
          <el-option
            v-for="item in questionData"
            :key="item.id"
            :label="item.text"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="评分状态">
        <el-select
          v-model="queryFormNow.status"
          placeholder="请先选择科目"
          clearable
          filterable
          name="question"
          ref="question"
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
          <span>新增答案</span>
        </template></el-button
      >

      <el-button class="menu-button" type="success" @click="handleBatchJudge"
        ><template>
          <font-awesome-icon
            class="button-icon"
            icon="fa-solid fa-list-check"
          />
          <span>批量评分</span>
        </template></el-button
      >

      <el-button class="menu-button" type="success" @click="handleGenerateExcel"
        ><template>
          <font-awesome-icon
            class="button-icon"
            icon="fa-solid fa-list-check"
          />
          <span>导出Excel</span>
        </template></el-button
      >

      <el-popover placement="right" width="400" trigger="click">
        <el-upload
          class="upload-demo"
          drag
          action="http://localhost:8080/answer/upload"
          multiple
          :headers="{ token: this.token }"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div
            class="el-upload__tip"
            slot="tip"
            style="display: flex; align-items: center"
          >
            点击下载<el-link
              type="primary"
              style="font-size: 12px"
              href="https://web-tilas-nj.oss-cn-beijing.aliyuncs.com/testAnswer.xlsx"
              >模版文件</el-link
            >
          </div>
        </el-upload>
        <el-button class="menu-button" type="success" slot="reference"
          ><template>
            <font-awesome-icon
              class="button-icon"
              icon="fa-solid fa-cloud-arrow-up"
            />
            <span>上传答案</span>
          </template></el-button
        >
      </el-popover>

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

      <el-table-column label="作答详情" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.ansText }}</span>
        </template>
      </el-table-column>

      <el-table-column label="得分" width="65" align="center">
        <template v-slot="scope">
          <span
            :style="{
              color:
                scope.row.status &&
                scope.row.ansScore / scope.row.queScore < 0.6
                  ? '#F56C6C'
                  : '',
            }"
            >{{
              scope.row.status
                ? scope.row.ansScore + "/" + scope.row.queScore
                : "-"
            }}</span
          >
        </template>
      </el-table-column>

      <el-table-column label="所属题目" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.queText }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所属科目" width="150" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.subName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="80" align="center">
        <template v-slot="scope">
          <el-tag :type="scope.row.status ? 'success' : 'info'">
            {{ status.find((item) => item.id === scope.row.status).name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="155" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.createTime.replace("T", " ") }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="275" header-align="center">
        <template v-slot="scope">
          <!-- 点击按钮时，将id传入方法 -->
          <el-button
            size="mini"
            type="success"
            @click="handleJudge(scope.row.id)"
            ><template>
              <font-awesome-icon class="button-icon" icon="fa-solid fa-list" />
              <span>判题</span>
            </template></el-button
          >

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
import { mapGetters } from "vuex";
import { deleteQuestion, getQuestionPage } from "@/api/question";
import {
  deleteSchool,
  getAllSchool,
  getSchoolPage,
  addSchool,
  getSchool,
  updateSchool,
} from "@/api/school";
import {
  addSubject,
  deleteSubject,
  getSubject,
  getSubjectPage,
  updateSubject,
} from "@/api/subject";
import { deleteTeacher, getTeacherPage, getTeacherSubject } from "@/api/user";
import { getMyId } from "@/utils/userinfo";
import { deleteAnswer, getAnswerPage, judgeAnswer } from "@/api/answer";

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
      subjectData: [],
      questionData: [],
      multipleSelection: [],
      queryForm: {
        subId: null,
        questionId: null,
        status: null,
      },
      queryFormNow: {
        subId: null,
        questionId: null,
        status: null,
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
        { id: 0, name: "未评" },
        { id: 1, name: "已评" },
      ],
    };
  },
  computed: {
    myId() {
      return getMyId(this.token);
    },
    ...mapGetters(["token"]),
    pageQueryForm() {
      const mergeForm = {
        ...this.pageForm,
        ...this.queryForm,
        userId: this.myId,
      };
      return mergeForm;
    },
    getAllPageQueryForm() {
      const mergeFormCopy = JSON.parse(JSON.stringify(this.pageQueryForm));
      mergeFormCopy.page = 1;
      mergeFormCopy.pageSize = 1000000;
      return mergeFormCopy;
    },
  },
  watch: {
    // tableData: {
    //   handler(newVal) {
    //     let tableDataCopy=JSON.parse(JSON.stringify(this.tableData))
    //     tableDataCopy.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    //   },
    //   deep: true,
    //   immediate: true // 初始化时立即执行
    // }
  },
  created: function () {
    getAnswerPage(this.pageQueryForm).then((response) => {
      this.tableData = response.data.records;
      this.total = response.data.total;
      this.isShow = true;
    });
    getAnswerPage(this.getAllPageQueryForm).then((response) => {
      this.allData = response.data.records;
    });
    getTeacherSubject(this.myId).then((response) => {
      this.subjectData = response.data;
    });
  },
  methods: {
    handleGenerateExcel() {
      const toGenerateAnswerEN = this.allData.filter((item) =>
        this.multipleSelection.includes(item.id)
      );
      console.log(toGenerateAnswerEN);
      let toGenerateAnswerCN = [];
      toGenerateAnswerEN.forEach((item) => {
        toGenerateAnswerCN.push({
          答案ID: item.id,
          答案描述: item.ansText,
          题目描述: item.queText,
          所属课程: item.subName,
          答案得分: item.ansScore,
          题目分值: item.queScore,
          得分率: item.ansScore / item.queScore,
          得分点: item.scoreDetail,
        });
      });
      console.log(toGenerateAnswerCN);
    },
    exportToExcel(objList) {
      // 将JSON对象数组转换为工作表
      const worksheet = XLSX.utils.json_to_sheet(objList);

      // 创建一个工作簿
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "人员信息");

      // 生成Excel文件并保存
      XLSX.writeFile(workbook, "人员信息.xlsx");
    },
    handleJudge(id) {
      judgeAnswer([id])
        .then((response) => {
          this.$message({
            type: "success",
            message: "成功",
          });
          const pageFormCopy = JSON.parse(JSON.stringify(this.pageQueryForm));
          this.changePage(pageFormCopy.page);
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "失败",
          });
        });
    },
    handleUploadSuccess(response, file, fileList) {
      console.log(response);
      this.$message({
        type: "success",
        message: "上传成功",
      });
      this.changePage(1);
    },
    handleUploadError(err, file, fileList) {
      this.$message({
        type: "error",
        message: "上传失败",
      });
    },
    onSubjectChange() {
      const id = this.queryFormNow.subId;
      if (id) {
        getQuestionPage({
          page: 1,
          pageSize: 1000000,
          subId: id,
          userId: this.myId,
        }).then((response) => {
          this.questionData = response.data.records;
        });
      }
    },
    onSubjectClear() {
      this.queryFormNow.subId = null;
      this.questionData = [];
    },
    getAllData() {
      getAnswerPage(this.getAllPageQueryForm).then((response) => {
        this.allData = response.data.records;
      });
    },
    handleQuery() {
      this.multipleSelection = [];
      this.queryForm = JSON.parse(JSON.stringify(this.queryFormNow));
      console.log(this.pageQueryForm);
      this.changePage(1);
    },
    handleEdit(id) {
      //跳转到添加页面，同时传递品牌id，方便在添加页面查询品牌信息，并显示
      this.$router.push("/judge/answerinfo/" + id);
    },
    handleAdd() {
      this.$router.push({ path: "/judge/addanswer" });
    },
    handleCheckAll() {
      console.log(this.allData);
      this.multipleSelection = this.allData.map((item) => item.id);
      console.log(this.multipleSelection);
      const pageFormCopy = JSON.parse(JSON.stringify(this.pageQueryForm));
      this.changePage(pageFormCopy.page);
    },
    handleUnCheckAll() {
      this.multipleSelection = [];
      const pageFormCopy = JSON.parse(JSON.stringify(this.pageQueryForm));
      this.changePage(pageFormCopy.page);
    },
    handleDelete(id, name) {
      deleteAnswer([id])
        .then((response) => {
          this.$message({
            message: `成功删除了答案：${name}`,
            type: "success",
          });
          console.log("id=" + id);
          const index = this.multipleSelection.findIndex((item) => item === id);
          console.log("index=" + index);
          if (index !== -1) {
            this.multipleSelection.splice(index, 1);
          }
          const pageFormCopy = JSON.parse(JSON.stringify(this.pageQueryForm));
          this.changePage(pageFormCopy.page);
        })
        .catch((error) => {
          this.$message({
            message: `删除失败：${error}`,
            type: "error",
          });
        });
    },
    colg() {
      this.queryForm = JSON.parse(JSON.stringify(this.queryFormNow));
      console.log(this.pageQueryForm);
    },
    changePage(page) {
      this.pageForm.page = page;
      const pageFormCopy = JSON.parse(JSON.stringify(this.pageQueryForm));
      getAnswerPage(pageFormCopy).then((response) => {
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
    handleBatchJudge() {
      judgeAnswer(this.multipleSelection)
        .then((response) => {
          this.$message({
            message: `成功`,
            type: "success",
          });
          this.multipleSelection = [];
          const pageFormCopy = JSON.parse(JSON.stringify(this.pageQueryForm));
          this.changePage(pageFormCopy.page);
        })
        .catch((err) => {
          this.$$message({
            message: `失败：${err}`,
            type: "success",
          });
        });
    },
    handleBatchDelete() {
      deleteAnswer(this.multipleSelection)
        .then((response) => {
          this.$message({
            message: `成功删除了ID为${this.multipleSelection}的共${this.multipleSelection.length}个答案`,
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