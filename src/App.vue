<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>


/* 为所有滚动条设置样式 */
::-webkit-scrollbar {
  width: 7px;
  /* 滚动条的宽度 */
  height: 7px;
  /* 滚动条的高度，对水平滚动条有效 */
}

/* 滚动条滑块的样式 */
::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, .3);
  /* 滑块的颜色 */
  border-radius: 4px;
  /* 滑块的圆角 */
}

/* 滚动条轨道的样式 */
::-webkit-scrollbar-track {

  border-radius: 4px;
  /* 轨道的圆角 */
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, .5);
  /* 悬停时滑块的颜色变化 */
}
</style>
