<template>
  <div class="app-container">
    <el-form
      :model="answerForm"
      :rules="rules"
      ref="answerForm"
      label-width="100px"
      class="demo-answerForm"
    >
      <el-form-item label="作答内容" prop="text">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入答题内容"
          v-model="answerForm.text"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="题目得分" prop="score">
        <el-input-number
          size="small"
          v-model="answerForm.score"
          :min="0"
          :max="100"
          :disabled="answerForm.status ? false : true"
        ></el-input-number>
        <span v-if="isEdit">/10</span>
      </el-form-item>

      <el-form-item label="所属科目" prop="subId">
        <el-select
          v-model="subId"
          placeholder="输入以选择所属科目"
          clearable
          filterable
          name="subId"
          ref="subId"
          style="width: 100%"
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

      <el-form-item label="所属问题" prop="queId">
        <el-select
          v-model="answerForm.queId"
          placeholder="请先选择所属科目"
          clearable
          filterable
          name="subId"
          ref="subId"
          style="width: 100%"
        >
          <el-option
            v-for="item in questionData"
            :key="item.id"
            :label="item.text"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">{{
          isEdit ? "提交修改" : "立即创建"
        }}</el-button>

        <el-button @click="resetForm('answerForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getAllSchool } from "@/api/school";
import { validUserName, validPassword, validTel } from "@/utils/validate";
import {
  getTeacherById,
  getTeacherSubject,
  register,
  updateTeacher,
} from "@/api/user";
import { getSubject, getSubjectPage } from "@/api/subject";
import {
  addQuestion,
  getQuestion,
  getQuestionPage,
  updateQuestion,
} from "@/api/question";
import { getMyId } from "@/utils/userinfo";
import { addAnswer, getAnswer } from "@/api/answer";

export default {
  data() {
    return {
      isEdit: false,
      passwordType: "password",

      subjectData: [],
      questionData: [],
      
      answerForm: {
        createTime: "",
        id: null,
        queId: null,
        score: null,
        subId: null,
        status: null,
        text: "",
        updateTime: "",
      },
      newAnsForm: {
        ansScore: 0,
        ansText: "",
        createTime: "",
        id: 0,
        queId: 0,
        queScore: 0,
        queText: "",
        status: 0,
        subName: "",
        updateTime: "",
        userId: 0,
      },
      schoolData: [],
      rules: {
        text: [
          { required: true, trigger: "blur", message: "题目作答不能为空" },
        ],
        score: [
          { required: true, trigger: "blur", message: "最后得分不能为空" },
        ],

        queId: [
          {
            required: true,
            trigger: "change",
            message: "请选择所属问题",
          },
        ],
      },
    };
  },
  computed: {
    // isAdmin() {
    //   return this.roles[0] === 'admin' ? true : false;
    // },
    myId() {
      return getMyId(this.token);
    },
    ...mapGetters(["token"]),

    uploadForm() {
      const { id, createTime, updateTime, userId, ...res } = this.answerForm;
      return res;
    },
    updateForm() {
      const formCopy = JSON.parse(JSON.stringify(this.answerForm));
      formCopy.updateTime = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, -5);
      formCopy.userId = this.myId;
      return formCopy;
    },
  },
  watch: {},
  created: function () {
    getTeacherSubject(this.myId).then((response) => {
      this.subjectData = response.data;
    });
    if (this.$route.params.id) {
      this.isEdit = true;
      const id = this.$route.params.id;
      getAnswer(id).then((response) => {
        this.answerForm = response.data;
      });

      // getSubjectPage({ page: 1, pageSize: 1000000 }).then((response) => {
      //   this.allSubject = response.data.records;
      // });
    }
  },
  methods: {
    onSubjectChange() {
      const id = this.subId;
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
    showPwd() {
      this.passwordType =
        this.passwordType === "password" ? "text" : "password";
    },
    getSchoolName(id) {
      return this.schoolData.find((item) => item.id === id)?.name;
    },
    handleSubmit() {
      if (!this.isEdit) {
        this.$refs.answerForm.validate((valid) => {
          if (valid) {
            console.log(this.updateForm);
            addAnswer(this.updateForm)
              .then((response) => {
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.$router.back();
              })
              .catch((error) => {
                this.$message({
                  message: "添加失败",
                  type: "error",
                });
              });
          } else {
            console.log("error");
          }
        });
      } else {
        console.log(this.updateForm);
        this.$refs.answerForm.validate((valid) => {
          if (valid) {
            console.log(this.updateForm);
            updateQuestion(this.updateForm)
              .then((response) => {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.$router.push({ path: "/judge/question" });
              })
              .catch((error) => {
                this.$message({
                  message: "修改失败",
                  type: "error",
                });
              });
          } else {
            console.log("error");
          }
        });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>


<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.show-pwd {
  position: absolute;
  right: 10px;
  /*top: 7px;*/
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
</style>