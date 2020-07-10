<template>
  <div class="SearchInput">
    <div class="inputcover">
      <i class="srch"></i>
      <input
        type="search"
        placeholder="搜索歌曲、歌手、专辑"
        autocomplete="off"
        v-model="keyword"
        @focus="$emit('focusFn',isNull)"
      />
      <i class="srch-close" @click="closeFn()"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchInput",
  props: ["getkeyword", "Mode"],
  data: function() {
    return {
      keyword: "",
      isNull: {mode:'suggest'}
    };
  },
  methods: {
    closeFn:function () {
      this.keyword='';
      this.$emit('closeFn',true)
    }
  },
  watch: {
    keyword: function(newValue) {
      // console.log(newValue)
      this.$emit("translate-keyword", newValue);
    },
    Mode: function(v) {
      if (v == "keyword") {
        this.keyword = this.getkeyword;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.SearchInput {
  width: 100%;
  padding: 15px 10px;
  .inputcover {
    position: relative;
    width: 100%;
    height: 30px;
    padding: 0 30px;
    box-sizing: border-box;
    background: #ebecec;
    border-radius: 30px;
    input {
      outline: none;
      border-radius: 0;
      border: 0;
      width: 100%;
      height: 30px;
      line-height: 18px;
      background: rgba(0, 0, 0, 0);
      font-size: 14px;
      color: #333;
    }
    input[type="search"]::-webkit-search-cancel-button {
      -webkit-appearance: none;
    }
    i {
      position: absolute;
      display: inline-block;
      margin: 0 8px;
      vertical-align: middle;
      width: 13px;
      height: 13px;
      background-position: 0 0;
      background-size: contain;
      background-repeat: no-repeat;
    }
    .srch {
      left: 0;
      top: 9px;
      background-image: url("../assets/srch.svg");
    }
    .srch-close {
      right: 0;
      top: 9px;
      background-image: url("../assets/srchclose.svg");
    }
  }
}
</style>