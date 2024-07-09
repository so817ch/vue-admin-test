<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      欢迎: {{ roles[0] === "admin" ? name + roles + "!" : name }}
    </div>
    <el-form :inline="true" class="demo-form-inline" v-if="roles[0] !== 'admin'">
      <el-form-item label="我的科目">
        <el-select
          v-model="subId"
          placeholder="输入以选择科目"
          clearable
          filterable
          name="subject"
          ref="subject"
          @change="onChange"
          @clear="onClear"
          
        >
          <el-option
            v-for="item in subjectData"
            :key="item.id"
            :label="item.id + '-' + item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="charts-row" v-if="roles[0] !== 'admin'">
      <v-chart
        class="chart"
        :option="options"
        :initOptions="{ renderer: 'svg' }"
      />
      <v-chart
        class="chart2"
        :option="options2"
        :initOptions="{ renderer: 'svg' }"
      />
    </div>
  </div>
</template>

<script>
import { labelOption } from "@/utils/chart-parameter";
import { option2 } from "@/utils/echarts-ring";
import * as echarts from "echarts";
import { mapGetters } from "vuex";
import { getChartData } from "@/api/chart"; // 引入 API 文件
import { getStatistics, getTeacherSubject } from "@/api/user";
import { getMyId } from "@/utils/userinfo";
import { render } from "nprogress";
import { getAnswerPage } from "@/api/answer";

export default {
  name: "Dashboard",
  data() {
    return {
      allQuestionNum: null,
      answerData: [],
      questionData: [],
      subId: null,
      subjectData: [],
    };
  },
  computed: {
    options2() {
      option2.dataset.source = [[1, this.allQuestionNum]];
      return option2;
    },
    options() {
      return {
        title: {
          text: "科目整体问题得分情况",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["最高分", "平均分", "最低分"],
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: this.questionData.map((item) => item.queText),
            axisLabel: {
              rotate: 13, // 这里设置x轴标签旋转90度
              fontSize:8
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "最高分",
            itemStyle: {
              color: "#67C23A", // 绿色
            },
            type: "bar",
            barGap: 0,
            label: labelOption,
            emphasis: {
              focus: "series",
            },
            data: this.questionData.map((item) =>
              (item.maxRate * 100).toFixed(2)
            ),
          },
          {
            name: "平均分",
            itemStyle: {
              color: "#409EFF", // 绿色
            },
            type: "bar",
            label: labelOption,
            emphasis: {
              focus: "series",
            },
            data: this.questionData.map((item) =>
              (item.avgRate * 100).toFixed(2)
            ),
          },
          {
            name: "最低分",
            itemStyle: {
              color: "#F56C6C", // 绿色
            },
            type: "bar",
            label: labelOption,
            emphasis: {
              focus: "series",
            },
            data: this.questionData.map((item) =>
              (item.minRate * 100).toFixed(2)
            ),
          },
          // {
          //   name: "Wetland",
          //   type: "bar",
          //   label: labelOption,
          //   emphasis: {
          //     focus: "series",
          //   },
          //   data: [98, 77, 101, 99, 40],
          // },
        ],
      };
    },
    myId() {
      return getMyId(this.token);
    },
    queryForm() {
      return {
        userId: this.myId,
        subId: this.subId,
      };
    },
    ...mapGetters(["roles", "name", "token"]),
  },
  created() {
    getTeacherSubject(this.myId).then((response) => {
      this.subjectData = response.data;
      this.subId = this.subjectData[0].id;
      getStatistics(this.queryForm).then((response) => {
        this.questionData = response.data;
      });
    });
    getAnswerPage({
      page: 1,
      pageSize: 100000,
      queId: null,
      status: null,
      subId: null,
      userId: this.myId,
    }).then((response) => {
      this.allQuestionNum = response.data.records.filter(
        (item) => item.status === 1
      ).length;
    });
  },
  methods: {
    onClear() {},
    onChange() {
      if (this.queryForm.subId) {
        getStatistics(this.queryForm).then((response) => {
          this.questionData = response.data;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.charts-row {
  display: flex;
  justify-content: space-between; /* 或者使用 justify-content: space-around; */
  gap: 20px; /* 可选，设置图表之间的间距 */
}

.chart {
  flex: 2; /* 使每个图表平分父容器的宽度 */
  height: 500px; /* 设置图表高度 */
}

.chart2 {
  flex: 1; /* 使每个图表平分父容器的宽度 */
  height: 500px;
}

.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
