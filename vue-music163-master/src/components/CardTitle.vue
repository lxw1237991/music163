<template>
  <div class="card-title">
    <h3>
      <slot></slot>
    </h3>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
@red: #d43c33;
h3 {
  color: #333333;
  font-weight: normal;
  border-left: 3px solid @red;
  padding-left: 6px;
  margin: 10px 0;
}
</style>