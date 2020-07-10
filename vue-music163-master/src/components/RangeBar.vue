<template>
  <div class="rangbar">
    <div class="range-box">
      <span class="back" :style="{width:newtime/rangmax*100+'%'}"></span>
      <span class="pointer" :style="{left:newtime/rangmax*100+'%'}"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["rangmax", "newtime"],
  computed: {}
};
</script>

<style lang="less" scoped>
.rangbar {
  width: 100%;
  .range-box {
    width: 100%;
    height: 3px;
    position: relative;
    background: hsla(0, 1%, 50%, 0.925);
    .back {
      width: 100%;
      height: 3px;
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      background: hsla(0, 2%, 84%, 0.74);
    }
    .pointer {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      position: absolute;
      top: -2px;
      left: 0;
      background: white;
    }
  }
}
</style>