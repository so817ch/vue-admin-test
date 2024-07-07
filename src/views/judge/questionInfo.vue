<template>
  <div class="app-container">
    <el-form
      :model="questionForm"
      :rules="rules"
      ref="questionForm"
      label-width="100px"
      class="demo-questionForm"
    >
      <el-form-item label="题目内容" prop="text">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入题目内容"
          v-model="questionForm.text"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="标准答案" prop="stand">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入标准答案"
          v-model="questionForm.stand"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="题目分值" prop="score">
        <el-input-number size="small" v-model="questionForm.score" :min=1 :max=100></el-input-number>
      </el-form-item>

      <el-form-item label="所属科目" prop="subId">
        <el-select
          v-model="questionForm.subId"
          placeholder="输入以选择所属科目"
          clearable
          filterable
          name="subId"
          ref="subId"
          style="width: 100%"
        >
          <el-option
            v-for="item in subjectData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="handleSubmit">{{
          isEdit ? "提交修改" : "立即创建"
        }}</el-button>

        <el-button @click="resetForm('questionForm')">重置</el-button>
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
import { addQuestion, getQuestion, updateQuestion } from "@/api/question";
import { getMyId } from "@/utils/userinfo";

export default {
  data() {
    return {
      isEdit: false,
      passwordType: "password",

      subjectData: [],

      questionForm: {
        cnt: 0,
        createTime: "",
        id: 0,
        score: null,
        stand: "",
        subId: null,
        text: "",
        updateTime: "",
        userId: null,
      },
      schoolData: [],
      rules: {
        text: [
          { required: true, trigger: "blur", message: "题目描述不能为空" },
        ],
        stand: [
          { required: true, trigger: "blur", message: "标准答案不能为空" },
        ],
        
        subId: [
          {
            required: true,
            trigger: "change",
            message: "请选择一个科目",
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
      const { id, createTime, updateTime, userId, ...res } =
        this.questionForm;
      return res;
    },
    updateForm() {
      const formCopy = JSON.parse(JSON.stringify(this.questionForm));
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
      getQuestion(id).then((response) => {
        this.questionForm = response.data;
      });

      // getSubjectPage({ page: 1, pageSize: 1000000 }).then((response) => {
      //   this.allSubject = response.data.records;
      // });
    }
  },
  methods: {
    showPwd() {
      this.passwordType =
        this.passwordType === "password" ? "text" : "password";
    },
    getSchoolName(id) {
      return this.schoolData.find((item) => item.id === id)?.name;
    },
    handleSubmit() {
      if (!this.isEdit) {
        this.$refs.questionForm.validate((valid) => {
          if (valid) {
            console.log(this.updateForm);
            addQuestion(this.updateForm)
              .then((response) => {
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.$router.push({ path: "/judge/question" });
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
        this.$refs.questionForm.validate((valid) => {
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