<template>
  <div class="app-container">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="日期" width="180" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.date }}</span>
        </template>  
      </el-table-column>
      <el-table-column label="姓名" width="180" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" header-align="center"> 
        <template v-slot="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        
      ],
    };
  },
};
</script>

<style scoped>
  
</style>