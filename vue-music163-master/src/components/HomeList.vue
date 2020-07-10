<template>
  <ul id="nav">
    <li>
      <router-link to="/">推荐音乐</router-link>
    </li>
    <li>
      <router-link to="/hot">热歌榜</router-link>
    </li>
    <li>
      <router-link to="/search">搜索</router-link>
    </li>
  </ul>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
@red: #d43c33;
#nav {
  display: flex;

  li {
    flex: 1;
    height: 40px;
    list-style: none;
    line-height: 40px;
    box-sizing: border-box;
    border-bottom: 1px solid lightgray;
    text-align: center;
    a {
      color: #2c3e50;
      text-decoration: none;
      padding: 0 3px 6px;

      &.router-link-exact-active {
        color: @red;
        border-bottom: 2px solid @red;
      }
    }
  }
}
</style>