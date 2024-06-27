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

      <el-form-item prop="username" class="input">
        <span class="svg-container">
          <font-awesome-icon icon="fa-solid fa-user" />
        </span>
        <el-input
          ref="username"
          v-model="signUpForm.username"
          placeholder="用户名"
          name="username"
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

      <el-form-item prop="email" class="input">
        <span class="svg-container">
          <font-awesome-icon icon="fa-solid fa-envelope" />
        </span>
        <el-input
          ref="email"
          v-model="signUpForm.email"
          placeholder="Email"
          name="email"
          type="email"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="school">
        <div class="select">
          <span class="svg-container">
            <font-awesome-icon icon="fa-solid fa-school" />
          </span>
          <el-select
            v-model="signUpForm.school"
            placeholder="学校"
            clearable
            filterable
            name="school"
            ref="school"
          >
            <el-option
              v-for="item in schoolData"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
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
          >Sign up</el-button
        >
      </div>

      <div>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleBack"
          >Back</el-button
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
import { validUsername,validEmail, validPassword } from "@/utils/validate";

export default {
  name: "SignUp",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
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
    const validateEmail = (rule, value, callback)=>{
      if (!validEmail(value)) {
        callback(new Error("请输入正确格式的邮箱"));
      } else {
        callback();
      }
    };
    return {
      schoolData: [
        { id: 1, name: "中国石油大学（华东）" },
        { id: 2, name: "中国石油大学（北京）" },
      ],
      signUpForm: {
        username: "",
        password: "",
        passwordCheck: "",
        email: "",
        school: "",
      },

      signUpRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        passwordCheck: [
          { required: true, trigger: "blur", validator: validatePasswordCheck },
        ],
        email: [
          { required: true, trigger: "blur", validator: validateEmail },
        ],
        school: [
          {
            required: true,
            trigger: "change",
            message: "请先选择一个学校",
          },
        ],
      },
      loading: false,
      passwordType: "password",
      passwordCheckType: "password",
      redirect: undefined,
    };
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
      this.$router.push("/login")
    },
    handleSignUp() {
      console.log(this.signUpForm);
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
    padding: 160px 35px 100px;
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
