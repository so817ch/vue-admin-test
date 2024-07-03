<template>
  <div class="signup-container">
    <el-form
      ref="signUpForm"
      :model="signUpForm"
      :rules="signUpRules"
      class="signup-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Sign Up Form</h3>
      </div>

      <el-form-item prop="userName" class="input">
        <span class="svg-container">
          <font-awesome-icon icon="fa-solid fa-user" />
        </span>
        <el-input
          ref="userName"
          v-model="signUpForm.userName"
          placeholder="用户名"
          name="userName"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password" class="input">
        <span class="svg-container">
          <font-awesome-icon icon="fa-solid fa-lock" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="signUpForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleSignUp"
        />
        <span class="show-pwd" @click="showPwd(0)">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-form-item prop="passwordCheck" class="input">
        <span class="svg-container">
          <font-awesome-icon icon="fa-solid fa-check-double" />
        </span>
        <el-input
          :key="passwordType"
          ref="passwordCheck"
          v-model="signUpForm.passwordCheck"
          :type="passwordCheckType"
          placeholder="再次确认密码"
          name="passwordCheck"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleSignUp"
        />
        <span class="show-pwd" @click="showPwd(1)">
          <svg-icon
            :icon-class="passwordCheckType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-form-item prop="name" class="input">
        <span class="svg-container">
          <font-awesome-icon icon="fa-solid fa-id-card" />
        </span>
        <el-input
          ref="name"
          v-model="signUpForm.name"
          placeholder="真实姓名"
          name="name"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="tel" class="input">
        <span class="svg-container">
          <font-awesome-icon icon="fa-solid fa-phone" />
        </span>
        <el-input
          ref="tel"
          v-model="signUpForm.tel"
          placeholder="联系电话"
          name="tel"
          type="tel"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="schId">
        <div class="select">
          <span class="svg-container">
            <font-awesome-icon icon="fa-solid fa-school" />
          </span>
          <el-select
            v-model="signUpForm.schId"
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
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item prop="gender">
        <div class="select">
          <span class="svg-container">
            <font-awesome-icon icon="fa-solid fa-venus-mars" />
          </span>
          <el-select
            v-model="signUpForm.gender"
            placeholder="性别"
            clearable
            name="gender"
            ref="gender"
          >
            <el-option
              v-for="item in genderData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <template>
                <font-awesome-icon
                  style="margin-right: 12px"
                  :icon="item.icon"
                />
                <span>{{ item.name }}</span>
              </template>
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <div>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleSignUp"
          >注册</el-button
        >
      </div>

      <div>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleBack"
          >返回登录</el-button
        >
      </div>

      <div class="tips">
        <span style="margin-right: 20px">admin-username: admin</span>
        <span> password: admin</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getAllSchool } from "@/api/school";
import { register } from "@/api/user";
import {
  validUserName,
  validEmail,
  validPassword,
  validTel,
} from "@/utils/validate";

export default {
  name: "SignUp",
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
    const validatePasswordCheck = (rule, value, callback) => {
      if (value !== this.signUpForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error("请输入正确格式的邮箱"));
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
      genderData: [
        { id: 1, name: "男", icon: "fa-solid fa-mars" },
        { id: 2, name: "女", icon: "fa-solid fa-venus" },
      ],
      schoolData: [
        { id: 1, name: "中国石油大学（华东）" },
        { id: 2, name: "中国石油大学（北京）" },
      ],
      signUpForm: {
        userName: "",
        password: "",
        passwordCheck: "",
        name: "",
        tel: "",
        schId: null,
        gender: null,
      },

      signUpRules: {
        userName: [
          { required: true, trigger: "blur", validator: validateUserName },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        passwordCheck: [
          { required: true, trigger: "blur", validator: validatePasswordCheck },
        ],
        tel: [{ required: true, trigger: "blur", validator: validateTel }],
        name: [
          { required: true, trigger: "blur", message: "请输入你的真实姓名" },
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
      loading: false,
      passwordType: "password",
      passwordCheckType: "password",
      redirect: undefined,
    };
  },
  created: function () {
    getAllSchool().then((response) => {
      console.log(response);
      const { data } = response;
      this.schoolData = data;
    }).catch((error) => {
      this.$message({
        message: '没有获取到学校信息:'+error,
        type: 'error'
      });
    })
  },
  computed: {
    registerForm() {
      let { passwordCheck, ...res } = this.signUpForm;
      return res;
    },
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    handleBack() {
      this.$router.push("/login");
    },
    handleSignUp() {
      this.$refs.signUpForm.validate((valid) => {
        if (valid) {
          console.log(this.registerForm);
          register(this.registerForm).then((response) => {
            this.$message({
              message: "恭喜你，这是一条成功消息",
              type: "success",
            });
            console.log(response);
          }).catch((error) => {
            this.$message.error('错了哦，这是一条后端返回错误消息');
            console.log(error);
          });
        } else {
          this.$message.error('错了哦，这是一条表单校验错误消息');
          console.log("error submit!!");
          return false;
        }
      });
    },
    showPwd(type) {
      if (!type) {
        this.passwordType =
          this.passwordType === "password" ? "text" : "password";
        this.$nextTick(() => {
          this.$refs.password.focus();
        });
      } else {
        this.passwordCheckType =
          this.passwordCheckType === "password" ? "text" : "password";
        this.$nextTick(() => {
          this.$refs.passwordCheck.focus();
        });
      }
    },
    // handleLogin() {
    //   this.$refs.loginForm.validate(valid => {
    //     if (valid) {
    //       this.loading = true
    //       this.$store.dispatch('user/login', this.loginForm).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //         this.loading = false
    //       }).catch(() => {
    //         this.loading = false
    //       })
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // }
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .signup-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.signup-container {
  .input .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .selector .el-input {
    display: inline-block;
    height: 47px;
  }
  .el-input {
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.signup-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .signup-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 100px 35px 100px;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .select {
    display: flex;
    .el-select {
      flex-grow: 1;
    }
  }
}
</style>
