<template>
  <div class="hot">
    <HomeList></HomeList>
    <div class="hot-header">
      <div class="hot-content">
        <div class="logo"></div>
        <p>更新日期：{{updatetime}}</p>
      </div>
    </div>
    <div class="song-list">
      <keep-alive>
        <ul>
          <SongList
           @transferId="$emit('transferId',$event)"
            :type="type"
            :songs="Top20"
            :redlist="red"
            v-for="(Top20,index) in Top20s"
            :key="falg=((index+1<10)?'0'+(index+1):(index+1)+'')"
            :currentSong="courrntSong"
          >
            <span>{{falg}}</span>
          </SongList>
        </ul>
      </keep-alive>
    </div>
  </div>
</template>


<script>
import SongList from "@/components/SongList.vue";
import HomeList from "@/components/HomeList.vue";
export default {
   props: {
    courrntSong: Object
  },
  name: "Hot",
  data: function() {
    return {
      hotsong: [],
      Top20s: [],
      flag: "",
      updatetime: "",
      type: "hot",
      red:true,
    };
  },
  components: {
    SongList,
    HomeList
  },
  methods: {
    //  ajax获取 热榜歌曲 数据
    getHotsongFn: function() {
      var _this = this;
      this.axios
        .get("/top/list?idx=1")
        .then(function(response) {
          // console.log(response);
          // 全部歌曲信息
          _this.hotsong = response.data.playlist;
          //  前20首歌曲
          _this.Top20s = _this.hotsong.tracks.slice(0, 20);
          // 调用设置时间函数
          _this.setUpdatTime(_this.hotsong.trackNumberUpdateTime);
          // 设置本地存储
          window.localStorage.setItem(
            "hotsong",
            JSON.stringify({
              expies: Date.now() + 10 * 60 * 1000,
              result: response.data.playlist
            })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 设置时间为 月 日格式
    setUpdatTime: function(v) {
      var d = new Date(v);
      var times = d.getMonth() + 1 + "月" + d.getDate() + "日";
      this.updatetime = times;
    }
  },
  created() {
    var hotsongStorage = JSON.parse(window.localStorage.getItem("hotsong"));
    if (hotsongStorage && hotsongStorage.expies > Date.now()) {
      // 本地存储 存在 且有效时间大于当前时间，使用本地存储
      this.hotsong = hotsongStorage.result;
      //  前20首歌曲
      this.Top20s = this.hotsong.tracks.slice(0, 20);
      // 调用设置时间函数
      this.setUpdatTime(this.hotsong.trackNumberUpdateTime);
    } else {
      // 本地存储 不存在 且有 效时间小于或等于当前时间，则ajax拿数据
      this.getHotsongFn();
    }
  }
};
</script>

<style lang="less" scoped>
.hot {
  width: 100%;
  .hot-header {
    width: 100%;
    position: relative;
    padding-top: 38.9%;
    // overflow: hidden;
    background: url(//s3.music.126.net/mobile-new/img/hot_music_bg_2x.jpg)
      no-repeat;
    background-size: contain;
    .hot-content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: absolute;

      left: 0;
      top: 0;
      padding-left: 20px;

      .logo {
        width: 142px;
        height: 67px;
        background: url(//s3.music.126.net/mobile-new/img/index_icon_2x.png) -24px -30px
          no-repeat;
        background-size: 166px 97px;
      }
      p {
        margin-top: 10px;
        color: hsla(0, 0%, 100%, 0.8);
        font-size: 12px;
      }
    }
  }
}
</style>