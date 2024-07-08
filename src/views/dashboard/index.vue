<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      name: {{ roles[0] === "admin" ? name + roles + "!" : name }}
    </div>

    <el-select
          v-model="subId"
          placeholder="输入以选择科目"
          clearable
          filterable
          name="subject"
          ref="subject"
          @change="onChange"
        >
          <el-option
            v-for="item in subjectData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
    <v-chart class="chart" :option="options" />
  </div>
</template>

<script>
import { labelOption } from "@/utils/chart-parameter";
import { mapGetters } from "vuex";
import { getChartData } from "@/api/chart"; // 引入 API 文件
import { getStatistics, getTeacherSubject } from "@/api/user";
import { getMyId } from "@/utils/userinfo";

export default {
  name: "Dashboard",
  data() {
    return {
      questionData: [],
      subId: null,
      subjectData:[]
    };
  },
  computed: {
    options() {
      return {
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
            data: this.questionData.map(item=>item.queText),
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
            data: this.questionData.map(item=>item.maxRate),
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
            data:this.questionData.map(item=>item.avgRate),
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
            data: this.questionData.map(item=>item.minRate),
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
        subId:this.subId
      }
    },
    ...mapGetters(["roles", "name","token"]),
  },
  created() {
    getTeacherSubject(this.myId).then(response => {
      this.subjectData = response.data;
      this.subId = this.subjectData[0].id;
      getStatistics(this.queryForm).then(response => {
        this.questionData = response.data;
      });
    })

  },
  methods: {
    onChange() {
      getStatistics(this.queryForm).then(response => {
        this.questionData = response.data;
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.chart {
  height: 400px;
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
