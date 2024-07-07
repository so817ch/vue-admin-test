<template>
  <div class="app-container">
    <el-form
      :model="teacherForm"
      :rules="rules"
      ref="teacherForm"
      label-width="100px"
      class="demo-teacherForm"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="teacherForm.userName"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="teacherForm.password"
          :disabled="isEdit ? false : true"
          :placeholder="
            !isEdit
              ? '默认密码为首字母大写的用户名前五位+联系电话后六位'
              : '请输入密码'
          "
          :key="passwordType"
          :type="passwordType"
        ></el-input>
        <span class="show-pwd" @click="showPwd()">
          <font-awesome-icon
            :icon="
              passwordType === 'password'
                ? 'fa-solid fa-eye-slash'
                : 'fa-solid fa-eye'
            "
          />
        </span>
      </el-form-item>

      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="teacherForm.name"></el-input>
      </el-form-item>

      <el-form-item label="联系电话" prop="tel">
        <el-input v-model="teacherForm.tel"></el-input>
      </el-form-item>

      <el-form-item label="账户状态" prop="status">
        <el-radio-group
          v-model="teacherForm.status"
          :disabled="isEdit ? false : true"
          size="mini"
        >
          <el-radio-button
            v-for="item in status"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item label="学校" prop="schId">
        <el-select
          v-model="teacherForm.schId"
          placeholder="输入以选择学校"
          clearable
          filterable
          name="schId"
          ref="schId"
          style="width: 100%"
        >
          <el-option
            v-for="item in schoolData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="teacherForm.gender">
          <el-radio
            v-for="item in genderData"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item label="教授课程" >
        <el-select
          v-model="newSubject"
          value-key="id"
          multiple
          filterable
          placeholder="无"
          style="width: 100%"
          :disabled="true"
        >
          <el-option
            v-for="item in allSubject"
            :key="item.id"
            :label="item.name"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">{{
          isEdit ? "提交修改" : "立即创建"
        }}</el-button>

        <el-button @click="resetForm('teacherForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getAllSchool } from "@/api/school";
import { validUserName, validPassword, validTel } from "@/utils/validate";
import { getTeacherById, getTeacherSubject, register, updateTeacher } from "@/api/user";
import { getSubject, getSubjectPage } from "@/api/subject";

export default {
  data() {
    const validateUserName = (rule, value, callback) => {
      if (!validUserName(value)) {
        callback(new Error("用户名只能由数字，英文字母和“_”、”-“字符组成"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error("密码必须包含至少8位大小写英文字母和数字字符"));
      } else {
        callback();
      }
    };
    const validateTel = (rule, value, callback) => {
      if (!validTel(value)) {
        callback(new Error("请输入正确格式的联系电话"));
      } else {
        callback();
      }
    };
    return {
      isEdit: false,
      passwordType: "password",
      status: [
        { id: 0, name: "正常" },
        { id: 1, name: "异常" },
      ],
      genderData: [
        { id: 1, name: "男", icon: "fa-solid fa-mars" },
        { id: 2, name: "女", icon: "fa-solid fa-venus" },
      ],
      oldSubject: [],
      newSubject: [],
      allSubject:[],
      toAdd: [],
      toDelete:[],
      teacherForm: {
        id: null,
        userName: "",
        password: "",
        name: "",
        gender: null,
        tel: "",
        schId: null,
        createTime: "",
        updateTime: "",
        status: 0,
        deleted: 0,
      },
      schoolData: [],
      rules: {
        userName: [
          { required: true, trigger: "blur", validator: validateUserName },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        tel: [{ required: true, trigger: "blur", validator: validateTel }],
        name: [
          { required: true, trigger: "blur", message: "请输入你的真实姓名" },
        ],
        status: [
          {
            required: true,
            trigger: "change",
            message: "请选择一个状态",
          },
        ],
        schId: [
          {
            required: true,
            trigger: "change",
            message: "请选择一个学校",
          },
        ],
        gender: [
          {
            required: true,
            trigger: "change",
            message: "请选择你的性别",
          },
        ],
      },
    };
  },
  computed: {
    // isAdmin() {
    //   return this.roles[0] === 'admin' ? true : false;
    // },
    ...mapGetters(["roles"]),
    defaultPassword() {
      const part1 = (
        this.teacherForm.userName.charAt(0).toUpperCase() +
        this.teacherForm.userName.slice(1)
      ).slice(0, 5);
      const part2 = this.teacherForm.tel.slice(-6);
      return part1 + part2;
    },
    uploadForm() {
      const { id, createTime, updateTime, status, deleted, ...res } =
        this.teacherForm;
      return res;
    },
    updateForm() {
      const formCopy = JSON.parse(JSON.stringify(this.teacherForm));
      formCopy.updateTime = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, -5);
      return formCopy;
    },
  },
  watch: {
    // 监听电话号码字段
    defaultPassword: function (newValue, oldValue) {
      // 当输入的电话号码长度至少为6位时，设置密码为电话号码的后六位
      if (!this.isEdit) {
        this.teacherForm.password = newValue;
      }
    },
  },
  created: function () {
    getAllSchool().then((response) => {
      this.schoolData = response.data;
    });
    if (this.$route.params.id) {
      this.isEdit = true;
      const id = this.$route.params.id;
      getTeacherById(id).then((response) => {
        this.teacherForm = response.data;
      });
      getTeacherSubject(id).then(response => {
        this.newSubject = response.data;
        this.oldSubject = JSON.parse(JSON.stringify(response.data));
      })
      getSubjectPage({ page: 1, pageSize: 1000000 }).then(response => {
        this.allSubject = response.data.records;
      })
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
        this.$refs.teacherForm.validate((valid) => {
          if (valid) {
            console.log(this.uploadForm);
            register(this.uploadForm)
              .then((response) => {
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.$router.push({ path: "/teacher/index" });
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
        this.$refs.teacherForm.validate((valid) => {
          if (valid) {
            console.log(this.updateForm);
            updateTeacher(this.updateForm)
              .then((response) => {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.$router.push({ path: "/teacher/index" });
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