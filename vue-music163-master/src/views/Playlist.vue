<template>
  <div class="playlist" v-bind="courrntSong=$attrs">
    <transition
      name="loading"
      enter-active-class="animated fadeOut"
      leave-active-class="animated fadeOut"
    >
      <div class="loading" v-if="showLoading2">
        <img src="../assets/loading.svg" alt />
      </div>
    </transition>
    <template v-if="songListDetail">
      <!-- 头部背景 头像 作者 -->
      <div class="header">
        <div class="back-btn" >
          <i class="fa fa-arrow-left" @click="$router.back()"></i>
        </div>
        <div class="mask" :style="{backgroundImage:`url(${songListDetail.coverImgUrl})`}"></div>
        <div class="fl">
          <img :src="songListDetail.coverImgUrl" alt />
          <span class="playcount">
            <i class="fa fa-headphones"></i>
            {{playCount(songListDetail.playCount)}}
          </span>
          <span class="icon">歌单</span>
        </div>
        <div class="fr">
          <h3>{{songListDetail.name}}</h3>
          <img :src="songListDetail.creator.avatarUrl" alt />
          <span>{{songListDetail.creator.nickname}}</span>
        </div>
      </div>
      <!-- 标签和简介 -->
      <div class="info">
        <div class="tags">
          <span>标签：</span>
          <i v-for="(tag,index) in songListDetail.tags" :key="index">{{tag}}</i>
        </div>
        <div class="desc" :class="{show:showMoreDesc}">
          <span>简介：</span>
          <span>{{songListDetail.description}}</span>
        </div>
        <div class="more">
          <span @click="showMoreDesc=!showMoreDesc">
            <i v-if="showMoreDesc" class="fa fa-angle-up"></i>
            <i v-else class="fa fa-angle-down"></i>
          </span>
        </div>
      </div>

      <!-- 歌曲 -->
      <div class="song-list">
        <h3>歌曲列表</h3>
        <ul v-if="songListDetail">
          <SongList
            :type="type"
            :songs="track"
            v-for="(track,index) in songListDetail.tracks"
            :key="index"
            @transferId="$emit('transferId',$event)"
            :currentSong="courrntSong.courrntSong"
          >
            <span>{{index+1}}</span>
          </SongList>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import SongList from "@/components/SongList.vue";
export default {
  components: {
    SongList
  },
  data: function() {
    return {
      songListId: this.$route.query.id,
      songAllId: [],
      songListDetail: null,
      songAll: null,
      showMoreDesc: false,
      type: "hot",
      currentTabComponent: SongList,
      showLoading2: false,
      courrntSong: null
    };
  },
  methods: {
    // ajax获取歌单数据
    getSongListDetail: function(id, that) {
      var _this = that;
      _this.axios
        .get("/playlist/detail", {
          params: {
            id: id
          }
        })
        .then(function(response) {
          // console.log(response);
          // 全部歌曲信息
          _this.songListDetail = response.data.playlist;
          // 设置本地存储
          window.localStorage.setItem(
            "sl-" + id,
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
    // 判断本地拿数据还是从ajax拿数据
    getStorageFn: function(id, that) {
      var _this = that;
      // 每次创建组件都拿数据 太频繁 本地存储
      const cacheSongListDetail = JSON.parse(
        window.localStorage.getItem("sl-" + id)
      );
      if (cacheSongListDetail && cacheSongListDetail.expies > Date.now()) {
        // 存在并且还没有过期
        _this.songListDetail = cacheSongListDetail.result;
      } else {
        // 已经过期
        _this.getSongListDetail(id, _this);
      }
    },
    //改 播放次数 显示
    playCount: function(num) {
      if (num > 100000000) {
        return num / 100000000 > 0
          ? (num / 100000000).toFixed(1) + "亿"
          : num + "";
      } else if (num > 10000) {
        return num / 10000 > 0 ? (num / 10000).toFixed(1) + "万" : num + "";
      } else {
        return num + "";
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    var id = Number(to.query.id);
    // console.log(id);
    const cacheSongListDetail = JSON.parse(
      window.localStorage.getItem("sl-" + id)
    );

    if (cacheSongListDetail && cacheSongListDetail.expies > Date.now()) {
      // 存在并且还没有过期
      var songData = cacheSongListDetail.result;
      next(vm => {
        vm.showLoading2 = false;
        vm.songListId = id;
        vm.songListDetail = songData;
        vm.courrntSong = to.query.courrntSong;
      });
    } else {
      // 已经过期
      // ajax重新拿数据
      window.axios
        .get("/playlist/detail", {
          params: {
            id: id
          }
        })
        .then(response => {
          // console.log(response);
          // 全部歌曲信息
          var songData = response.data.playlist;
          // 设置本地存储
          window.localStorage.setItem(
            "sl-" + id,
            JSON.stringify({
              expies: Date.now() + 10 * 60 * 1000,
              result: response.data.playlist
            })
          );
          next(vm => {
            vm.showLoading2 = false;
            vm.songListId = Number(to.query.id);
            vm.songListDetail = songData;
            vm.courrntSong = to.query.courrntSong;
            // vm.songAll=songData.tracks;
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },

  // 离开路由后清除 歌单数据
  beforeRouteLeave(to, from, next) {
    // this.showLoading2 = true;
    this.songListDetail = null;
    next();
  },
  created() {
    // this.getStorageFn();
  }
  // // 路由更新守卫 进入路由之前 拦截路由
  // beforeRouteUpdate(to, from, next) {
  //   from;
  //   this.songListId = Number(to.query.id);
  //   next();
  //   console.log("路由更新");
  // },
  // watch: {
  //   songListId: function() {
  //     console.log("变化了");
  //     this.getStorageFn();
  //   }
  // }
};
</script>

<style lang="less" scoped>
.playlist {
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
img {
  max-width: 100%;
}
.header {
  display: flex;
  padding: 40px 15px 30px;
  position: relative;
  overflow: hidden;
  color: white;
  .back-btn {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 40px;
    width: 40px;
    z-index: 999;
    line-height: 40px;
    text-align: center;
    i {
      font-size: 20px;
      color: white;
      // margin-left: 16px;
    }
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(30px) brightness(0.8);
    transform: scale(1.5);
    background-position: center;
  }
  .fl {
    flex: 4;
    position: relative;
    font-size: 12px;
    line-height: 18px;
    .ptl() {
      position: absolute;
      left: 0;
      top: 0;
    }
    .playcount {
      .ptl();
      width: 100%;
      text-align: right;
      padding: 0 5px;
      background: rgba(0, 0, 0, 0.3);
    }
    .icon {
      .ptl();
      top: 15px;
      background: #bb3b3f;
      padding: 0 10px;
      border-top-right-radius: 1em;
      border-bottom-right-radius: 1em;
    }
  }
  .fr {
    flex: 6;
    padding-left: 15px;
    h3 {
      padding: 5px 0 20px 0;
    }
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
    }
    span {
      font-size: 14px;
      padding-left: 15px;
    }
  }
}
// 简介
.info {
  padding: 0 10px;
  line-height: 1.5em;
  font-size: 14px;
  .tags {
    margin: 10px 0;
    span {
      vertical-align: middle;
    }
    i {
      font-size: 12px;
      margin-right: 5px;
      font-style: normal;
      border: 1px solid lightgray;
      border-radius: 12px;
      padding: 2px 5px;
    }
  }
  .desc {
    height: 1.5em;
    overflow: hidden;
    text-overflow: ellipsis;
    &.show {
      height: auto;
    }
    span {
      white-space: pre-wrap;
      vertical-align: baseline;
    }
  }
  .more {
    overflow: hidden;
    span {
      float: right;
      i {
        font-size: 16px;
      }
    }
  }
}
.song-list {
  h3 {
    height: 23px;
    line-height: 23px;
    padding: 0 10px;
    font-size: 12px;
    color: #666;
    background-color: #eeeff0;
  }
}
</style>