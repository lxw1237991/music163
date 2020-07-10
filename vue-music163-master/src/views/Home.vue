<template>
  <div class="home">
    <transition
      name="loading"
      enter-active-class="animated fadeOut"
      leave-active-class="animated fadeOut"
    >
      <div class="loading" v-if="showLoading">
        <img src="../assets/loading.svg" alt />
      </div>
    </transition>
    <HomeList></HomeList>
    <!-- 推荐歌单 -->
    <div class="personalized-box">
      <CardTitle>推荐歌单</CardTitle>

      <ul class="songlist">
        <SongCardList
          :songlist="personalized"
          v-for="(personalized,index) in personalizeds"
          :key="index"
          :currentSong="courrntSong"
        ></SongCardList>
      </ul>
    </div>

    <!-- 最新音乐 -->
    <div class="newsong">
      <CardTitle>最新音乐</CardTitle>

      <ul>
        <SongList
          :type="type"
          :songs="newsong"
          :currentSong="courrntSong"
          v-for="(newsong,index) in newsongs"
          :key="index"
          @transferId="$emit('transferId',$event)"
        ></SongList>
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CardTitle from "@/components/CardTitle.vue";
import SongCardList from "@/components/SongCardList.vue";
import SongList from "@/components/SongList.vue";
import HomeList from "@/components/HomeList.vue";
export default {
  name: "Home",
  props: {
    courrntSong: Object
  },
  data: function() {
    return {
      personalizeds: [],
      newsongs: [],
      type: "new",
      showLoading: true
    };
  },
  components: {
    CardTitle,
    SongCardList,
    SongList,
    HomeList
  },
  methods: {
    // ajax获取推荐歌单数据
    getPersonalizedFn: function() {
      var _this = this;
      this.axios
        .get("/personalized", {
          params: {
            limit: 6
          }
        })
        .then(function(response) {
          // console.log(response.data.result);
          _this.personalizeds = response.data.result;
          window.localStorage.setItem(
            "personalizeds",
            JSON.stringify({
              expies: Date.now() + 10 * 60 * 1000,
              result: response.data.result
            })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // ajax获取最新音乐数据
    getNewsongFn: function() {
      var _this = this;
      this.axios
        .get("/personalized/newsong")
        .then(function(response) {
          // console.log(response.data.result);
          _this.newsongs = response.data.result;
          window.localStorage.setItem(
            "newsongs",
            JSON.stringify({
              expies: Date.now() + 10 * 60 * 1000,
              result: response.data.result
            })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  created() {
    var personalizedsStorage = JSON.parse(
      window.localStorage.getItem("personalizeds")
    );
    if (personalizedsStorage && personalizedsStorage.expies > Date.now()) {
      // 本地存储 存在 且有效时间大于当前时间，使用本地存储
      this.personalizeds = personalizedsStorage.result;
    } else {
      // 本地存储 不存在 且有 效时间小于或等于当前时间，则ajax拿数据
      this.getPersonalizedFn();
    }

    var newsongs = JSON.parse(window.localStorage.getItem("newsongs"));
    if (newsongs && newsongs.expies > Date.now()) {
      // 本地存储 存在 且有效时间大于当前时间，使用本地存储
      this.newsongs = newsongs.result;
    } else {
      // 本地存储 不存在 且有 效时间小于或等于当前时间，则ajax拿数据
      this.getNewsongFn();
    }
  },
  // 路由守卫
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.showLoading = false;
    });
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // console.log(to, from, "即将离开home");
    this.showLoading = true;
    next();
  }
};
</script>
<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  .loading {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100vh;
    z-index: 99;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    img {
      width: 20%;
      height: auto;
      margin: auto;
    }
  }
}
.songlist {
  display: flex;
  flex-wrap: wrap;
}
</style>
