<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      name: {{ roles[0] === "admin" ? name + roles + "!" : name }}
      <v-chart class="chart" :option="chartOption" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getChartData } from "@/api/chart"; // 引入 API 文件

export default {
  name: "Dashboard",
  data() {
    return {
      chartOption: {
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'line'
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["roles", "name"]),
  },
  created() {
    this.fetchChartData();
  },
  methods: {
    fetchChartData() {
      getChartData().then(response => {
        const data = response.data; // 假设返回的数据格式为 { xData: [...], yData: [...] }
        this.chartOption = {
          xAxis: {
            type: 'category',
            data: data.xData
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: data.yData,
              type: 'line'
            }
          ]
        };
      }).catch(error => {
        console.error("Error fetching chart data:", error);
      });
    }
  }
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
