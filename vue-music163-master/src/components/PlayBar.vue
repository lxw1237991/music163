<template>
  <div class="playbar" @click="$emit('click-fullscren',showFullscreen)">
    <!-- playbarbottom -->
    <transition
      name="playbar-bottom"
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <div v-show="!showFullscreen" class="playbarbottom" @click="showFullscreenFn">
        <div class="thumb">
          <img v-if="courrnt" :class="{active: playing}" :src="courrntSong.picUrl" alt />
        </div>
        <div class="info">
          <h5 v-if="courrnt">{{courrntSong.name}}</h5>
          <span v-if="courrnt">{{joinArtists(courrntSong.artist)}}</span>
        </div>
        <div class="progress" @click.stop="playingFn()">
          <canvas id="canvas" width="100" height="100"></canvas>
          <i v-if="playing" class="fa fa-pause"></i>
          <i v-else class="fa fa-play"></i>
        </div>
        <div class="playlist" @click.stop="showPlayList=!showPlayList">
          <i class="fa fa-list"></i>
        </div>
      </div>
    </transition>
    <!-- 播放列表 -->
    <div>
      <transition
        name="item"
        enter-active-class="animated slideInUp"
        leave-active-class="animated slideOutDown"
      >
        <div v-if="showPlayList" class="defaultPlayList">
          <SongList
            :type="type"
            :songs="newsong"
            :currentSong="courrntSong"
            v-for="(newsong,index) in defaultPlayList"
            :key="index"
            @transferId="$emit('transferId',$event);playListFlag=index"
          >
            <span>{{index+1}}</span>
          </SongList>
        </div>
      </transition>
      <transition
        name="custom-classes-transition2"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div class="slmask" v-if="showPlayList" @click.stop="showPlayList=false"></div>
      </transition>
    </div>

    <!-- fullscren -->
    <transition
      name="custom-classes-transition3"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-show="showFullscreen" class="fullscreenplay">
        <div class="mask" :style="{backgroundImage:`url(${courrntSong.picUrl})`}"></div>
        <header>
          <div class="back-btn">
            <i class="fa fa-arrow-left" @click="showFullscreen=false"></i>
          </div>
          <div class="info">
            <h5 v-if="courrnt">{{courrntSong.name}}</h5>
            <span v-if="courrnt">{{joinArtists(courrntSong.artist)}}</span>
          </div>
        </header>

        <!-- 唱片图片 -->
        <div v-show="!showCircle" class="circle" :class="{active:playing}" @click="showCircle=true">
          <div class="needle"></div>
          <div class="glue">
            <div>
              <img v-if="courrntSong.picUrl" :src="courrntSong.picUrl" alt />
            </div>
          </div>
        </div>
        <!-- 歌词 -->
        <div v-show="showCircle" class="lyric-box" @click="showCircle=false">
          <!-- 音量 -->
          <div class="volume">
            <span>
              <i class="fa fa-volume-up"></i>
              <!-- <i class="fa fa-volume-off"></i> -->
            </span>
            <input type="range" v-model="volumeNum" max="100" />
            <div>
              <RangeBar :rangmax="100" :newtime="volumeNum"></RangeBar>
            </div>
          </div>
          <div class="scroll-box">
            <ul class="scroll" :style="{transform:`translateY(${-currentLyricIndex * 28}px)`}">
              <li
                v-for="(item, index) in parsedLyric"
                :class="{active: index===currentLyricIndex}"
                :key="index"
              >{{item.text}}</li>
            </ul>
          </div>
        </div>
        <footer>
          <!-- 时长进度条 -->
          <div class="progress-bar">
            <span class="state-time">{{countTime(newtime/1000)}}</span>
            <span class="range">
              <input
                type="range"
                v-model="newtime"
                :max="courrntSong.duration"
                @input="newTimeFn($event)"
              />
              <div>
                <RangeBar :rangmax="courrnt?courrntSong.duration:0" :newtime="courrnt?newtime:0"></RangeBar>
              </div>
            </span>
            <span class="all-time">{{alltime}}</span>
          </div>
          <!-- 控制按钮集 -->
          <div class="control-bar">
            <div class="loop-model" @click="playModeState=(playModeState+1)==3?0:playModeState+1">
              <span class="list-loop" v-if="playModes[playModeState]=='list'"></span>
              <span class="one-loop" v-else-if="playModes[playModeState]=='single'"></span>
              <span class="random-loop" v-else-if="playModes[playModeState]=='random'"></span>
            </div>
            <div class="prev" @click="prevSong()">
              <span>
                <i class="fa fa-step-backward"></i>
              </span>
            </div>
            <div class="play-pause" @click.stop="playingFn()">
              <span v-if="playing" class="pause"></span>
              <span v-else class="play"></span>
            </div>
            <div class="next" @click="nextSong()">
              <span>
                <i class="fa fa-step-forward"></i>
              </span>
            </div>
            <div class="playlist" @click.stop="showPlayList=!showPlayList">
              <span>
                <i class="fa fa-list"></i>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </transition>
    <audio :src="songId"></audio>
  </div>
</template>

<script>
import SongList from "@/components/SongList.vue";
import RangeBar from "@/components/RangeBar.vue";
export default {
  components: {
    SongList,
    RangeBar
  },
  props: {
    courrnt: {
      type: Object,
      default: () => {
        return {
          id: "",
          name: "",
          picUrl: "",
          alia: "",
          artist: [],
          albumname: "",
          duration: ""
        };
      }
    },
    showFullscreenOut: Boolean
  },
  data: function() {
    return {
      courrntSong: {
        id: "",
        name: "",
        picUrl: "",
        alia: "",
        artist: [],
        albumname: "",
        duration: ""
      },
      playing: false,
      showFullscreen: false,
      showCircle: false,
      currentLyric: null,
      currentLyricIndex: 0,
      defaultPlayList: [],
      type: "self",
      showPlayList: false,
      newtime: 0,
      alltime: 0,
      inputfale: true,
      playModeState: 0,
      playModes: ["list", "single", "random"],
      playListFlag: 0,
      volumeNum: 100
    };
  },
  computed: {
    songId: function() {
      if (this.courrnt)
        return ` https://music.163.com/song/media/outer/url?id=${this.courrnt.id}.mp3 `;
      else return "";
    },
    parsedLyric: function() {
      if (this.currentLyric !== null) {
        var arrNew = [];
        this.currentLyric.split("\n").map(item => {
          var regex = /\d{2}:\d{2}\.\d+/gi;
          if (item.search(regex) != -1) {
            var time = item.match(regex);
            for (let index = 0; index < time.length; index++) {
              var m = time[index].substr(0, 2);
              var s = time[index].substr(3, 2);
              var n = time[index].substr(5);
              arrNew.push({
                time: Number(m) * 60 + Number(s) + Number(n),
                text: item.substr(item.lastIndexOf("]") + 1) || "——————"
              });
            }
            return {};
          } else {
            return {};
          }
        });
        // 数组排序 从小到大
        for (let i = 0; i < arrNew.length - 1; i++) {
          for (let j = 0; j < arrNew.length - 1; j++) {
            if (arrNew[j].time > arrNew[j + 1].time) {
              var temp = arrNew[j];
              arrNew[j] = arrNew[j + 1];
              arrNew[j + 1] = temp;
            }
          }
        }
        return arrNew;
      } else {
        return null;
      }
    }
  },
  methods: {
    //拼接作者
    joinArtists: function(artists) {
      return artists.map(artist => artist.name).join(" / ");
    },
    // 歌曲播放时间转换
    countTime: function(n) {
      var val = Math.floor(n);
      var m = Math.floor(val / 60);
      var s = val % 60;
      m = m > 9 ? m : "0" + m;
      s = s > 9 ? s : "0" + s;
      return m + ":" + s;
    },
    drawProgress: function() {
      var canvas = this.$el.querySelector("#canvas");
      var audio = this.$el.querySelector("audio");

      /** @type {HTMLCanvasElement} */
      var context = canvas.getContext("2d");
      context.clearRect(0, 0, 100, 100);
      context.beginPath();
      context.arc(50, 50, 45, 0, 2 * Math.PI);
      context.closePath();
      context.strokeStyle = "gray";
      context.lineWidth = "4";
      context.stroke();
      var _this = this;
      audio.ontimeupdate = function() {
        if (_this.inputfale) {
          _this.newtime = this.currentTime * 1000;
        }
        // console.log(this.currentTime)
        var duration = _this.courrnt.duration;
        if (!audio.paused) {
          _this.playing = true;
        }
        context.clearRect(0, 0, 100, 100);
        context.beginPath();
        context.arc(50, 50, 45, 0, 2 * Math.PI);
        context.closePath();
        context.strokeStyle = "gray";
        context.lineWidth = "4";
        context.stroke();
        context.beginPath();
        context.arc(
          50,
          50,
          45,
          -0.5 * Math.PI,
          -0.5 * Math.PI + 2 * Math.PI * ((this.currentTime * 1000) / duration)
        );
        context.strokeStyle = "#d43c33";
        context.lineWidth = "4";
        context.stroke();
        // 播放结束后
        if (this.ended) {
          context.clearRect(0, 0, 100, 100);
          context.beginPath();
          context.arc(50, 50, 45, 0, 2 * Math.PI);
          context.closePath();
          context.strokeStyle = "gray";
          context.lineWidth = "4";
          context.stroke();
          _this.playing = false;
        }
        // 歌词滚动
        if (_this.parsedLyric) {
          let index;
          for (let i = 0; i < _this.parsedLyric.length; i++) {
            index = i;
            if (this.currentTime + 0.15 < _this.parsedLyric[i].time) {
              index = i - 1;
              break;
            }
          }
          if (index === undefined) {
            index = _this.parsedLyric.length - 1;
          }
          _this.currentLyricIndex = index;
        }
      };
      // 循环播放模式
      audio.onended = function() {
        if (_this.playModes[_this.playModeState] == "list") {
          _this.playListFlag =
            _this.playListFlag + 1 == _this.defaultPlayList.length
              ? 0
              : _this.playListFlag + 1;
          _this.$emit("listSong", _this.defaultPlayList[_this.playListFlag]);
        }
        if (_this.playModes[_this.playModeState] == "single") {
          this.play();
        }
        if (_this.playModes[_this.playModeState] == "random") {
          _this.playListFlag = Math.round(
            Math.random() * (_this.defaultPlayList.length - 1 - 0) + 0
          );
          _this.$emit("randomSong", _this.defaultPlayList[_this.playListFlag]);
        }
      };
    },
    // 设置进度条
    newTimeFn: function(v) {
      // this.inputfale = false;
      // this.newtime = v.target.value / 1000;
      var audio = this.$el.querySelector("audio");
      audio.currentTime = v.target.value / 1000;
    },
    // 播放状态
    playingFn: function() {
      if (this.courrnt !== null) {
        this.playing = !this.playing;
        var audio = this.$el.querySelector("audio");
        if (this.playing) {
          audio.play();
        } else {
          audio.pause();
        }
      }
    },
    // 设置showFullscreen的值
    showFullscreenFn: function() {
      if (this.courrnt !== null) {
        this.showFullscreen = !this.showFullscreen;
        if (this.showFullscreen) {
          this.getLyric();
          this.showPlayList = false;
        }
      }
    },
    // 获取歌词
    getLyric: function() {
      this.currentLyric = null;
      var cachedLyric = window.localStorage.getItem(
        "lyric" + this.courrntSong.id
      );
      if (cachedLyric) {
        this.currentLyric = cachedLyric;
      } else {
        window.axios
          .get("lyric", {
            params: {
              id: this.courrntSong.id
            }
          })
          .then(response => {
            // console.log(response);
            if (
              response.data.lrc !== undefined &&
              response.data.lrc.lyric !== undefined
            ) {
              this.currentLyric = response.data.lrc.lyric;
              window.localStorage.setItem(
                "lyric" + this.courrntSong.id,
                response.data.lrc.lyric
              );
            } else {
              this.currentLyric = "[00:00.00]无歌词\n";
            }
          });
      }
    },
    // 下一首歌
    nextSong: function() {
      this.playListFlag =
        this.playListFlag + 1 == this.defaultPlayList.length
          ? 0
          : this.playListFlag + 1;
      // this.courrntSong=this.defaultPlayList[this.playListFlag]
      this.$emit("nextSong", this.defaultPlayList[this.playListFlag]);
    },
    // 上一首歌
    prevSong: function() {
      this.playListFlag =
        this.playListFlag - 1 == -1
          ? this.defaultPlayList.length - 1
          : this.playListFlag - 1;
      // this.courrntSong=this.defaultPlayList[this.playListFlag]
      this.$emit("prevSong", this.defaultPlayList[this.playListFlag]);
    }
  },
  created() {
    if (this.courrnt) {
      this.courrntSong = this.courrnt;
      this.alltime = this.countTime(this.courrntSong.duration / 1000);
    }
  },
  mounted() {
    this.drawProgress();
    // var audio = this.$el.querySelector("audio");
    // audio.oncanplay = function() {
    //   this.play();
    // };
    if (this.courrntSong.id) {
      let isExist = this.defaultPlayList.some(item => {
        return item.id == this.courrntSong.id;
      });
      // 取反，追加到播放列表中
      if (!isExist) this.defaultPlayList.push(this.courrntSong);
    }
  },
  watch: {
    courrnt: function(v) {
      if (v) {
        this.courrntSong = v;
        // 设置歌曲总时长格式
        this.alltime = this.countTime(v.duration / 1000);
        this.playing = true;
        var audio = this.$el.querySelector("audio");
        // audio.play();
        audio.oncanplay = function() {
          this.play();
        };
        
        // 筛选 播放列表歌曲 和 播放歌曲 是否相同，不同返回false
        let isExist = this.defaultPlayList.some(item => {
          return item.id == v.id;
        });
        // 取反，追加到播放列表中
        if (isExist) {
          var flag = this.defaultPlayList.indexOf(v);
          this.playListFlag = flag;
        } else {
          this.defaultPlayList.push(v);
          this.playListFlag = this.defaultPlayList.length - 1;
        }
      } else {
        this.playing = false;
      }
      this.getLyric();
    },
    volumeNum: function(v) {
      var audio = this.$el.querySelector("audio");
      audio.volume = v / 100;
    },
    showFullscreenOut: function(v) {
      this.showFullscreen = v;
    },
    // playing: function(v) {
    //   var audio = this.$el.querySelector("audio");
    //   // audio.autoplay=true
    //   audio.oncanplay = () => {
    //     audio.play();
    //   };
   
    //   console.log(audio.buffered.length);
    //   audio.pause();
    //   if (v) {
    //     // audio.autoplay
    //     //  audio.pause();
    //     audio.play();
    //   } else {
    //     // audio.pause();
    //   }
    // }
  }
};
</script>

<style lang="less" scoped>
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.playbarbottom {
  padding: 5px 0;
  background: white;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
  .margin() {
    margin: 0 10px;
  }
  .thumb {
    .margin();
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    background: url("../assets/disc-ip6.png") center center no-repeat,
      url("../assets/disc_default.png") center center no-repeat;
    background-size: 100%;
    background-color: dimgray;
    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      animation: rotate 6s linear infinite;
      animation-play-state: paused;
      &.active {
        animation-play-state: running;
      }
    }
  }
  .info {
    width: 0;
    flex: 1 1 auto;
    font-size: 12px;
    line-height: 18px;
    h5 {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: normal;
    }
    span {
      color: gray;
      display: block;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: normal;
    }
  }
  .progress {
    .margin();
    flex: 0 0 auto;
    width: 38px;
    height: 38px;
    position: relative;
    #canvas {
      width: 36px;
      height: 36px;
    }
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 12px;
      height: 12px;
      line-height: 1em;
      text-align: center;
      color: lightgray;
      font-size: 12px;
      display: block;
      margin-top: -7.5px;
      margin-left: -6.5px;
    }
  }
  .playlist {
    .margin();
    flex: 0 0 auto;
    display: block;
    width: 28px;
    height: 28px;
    // background: chartreuse;
    i {
      vertical-align: bottom;
    }
  }
}
// 播放列表
.defaultPlayList {
  position: fixed;
  bottom: 50px;
  left: 2.5%;
  width: 95%;
  height: 60%;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: auto;
}
.slmask {
  position: fixed;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
}
.fullscreenplay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 998;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .mask {
    filter: blur(30px) brightness(0.5);
    transform: scale(2);
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-color: #0b0c12;
    background-image: linear-gradient(#252b6bc9, #0b0c12);
    position: absolute;
    z-index: -1;
  }
  header {
    height: 50px;
    display: flex;
    .back-btn {
      height: 50px;
      width: 50px;
      z-index: 999;
      line-height: 50px;
      i {
        font-size: 20px;
        color: white;
        margin-left: 16px;
      }
    }
    .info {
      flex: 1;
      font-size: 16px;
      color: white;
      line-height: 20px;
      margin-top: 5px;
      margin-left: 5px;
      h5 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: normal;
      }
      span {
        font-size: 14px;
        color: hsla(0, 2%, 84%, 0.74);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: normal;
      }
    }
  }

  .circle {
    flex: 1;
    text-align: center;
    position: relative;
    .glue {
      padding: 54px;
      // width: 180px;
      // height: 180px;
      background-image: url("../assets/disc_light-ip6.png"),
        url("../assets/disc_default.png");
      background-size: 100%;
      border-radius: 50%;
      display: inline-block;
      margin-top: 84px;
      animation: rotate 6s linear infinite;
      animation-play-state: paused;
      div {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        vertical-align: middle;
        img {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          vertical-align: middle;
        }
      }
    }
    .needle {
      width: 96px;
      height: 137px;
      background-image: url("../assets/needle.png");
      background-size: 100%;
      position: absolute;
      top: 0;
      left: 50%;
      z-index: 1;
      margin-left: -16px;
      transform: rotate(-12deg);
      transform-origin: 16px 0;
      transition: all 0.3s;
    }
    &.active {
      .needle {
        transform: rotate(0deg);
      }
      .glue {
        animation-play-state: running;
      }
    }
  }
  .lyric-box {
    flex: 1;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    .volume {
      flex: 1;
      position: relative;
      width: 65%;
      margin: auto;
      span {
        position: absolute;
        top: 50%;
        left: -20px;
        margin-top: -6px;
        i {
          color: white;
          font: 16px;
        }
      }
      input {
        position: relative;
        width: 100%;
        opacity: 0;
        z-index: 1010;
        margin-top: 5px;
      }
      div {
        width: 100%;
        position: absolute;
        top: 5px;
        left: 0;
        margin-top: 5px;
      }
    }
    .scroll-box {
      width: 100%;
      height: 94%;
      overflow: hidden;
      position: relative;
      .scroll {
        text-align: center;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 50%;
        margin-top: -1em;
        transition: transform 0.3s;
        li {
          line-height: 2em;
          font-size: 14px;
          // height: 2em;
          color: hsla(0, 0%, 100%, 0.6);
          &.active {
            color: white;
          }
        }
      }
    }
  }
  footer {
    width: 100%;
    height: 120px;
    .progress-bar {
      width: 100%;
      height: 30%;
      // background: chartreuse;
      text-align: center;
      .state-time {
        font-size: 12px;
        color: hsla(0, 2%, 84%, 0.74);
      }
      .all-time {
        font-size: 12px;
        color: hsla(0, 2%, 84%, 0.74);
      }
      .range {
        display: inline-block;
        position: relative;
        width: 65%;
        margin: 0 5%;
        input {
          position: relative;
          width: 100%;
          opacity: 0;
          z-index: 1010;
          margin-top: 5px;
        }
        div {
          width: 100%;
          position: absolute;
          top: 5px;
          left: 0;
          margin-top: 5px;
        }
      }
    }
    .control-bar {
      width: 100%;
      height: 70%;
      display: flex;
      justify-content: space-around;
      div {
        // flex: 1;
        margin: auto;
        text-align: center;
        font-size: 24px;
        height: 2em;
        line-height: 2em;
        span {
          i {
            color: white;
          }
        }
      }
      .loop-model {
        display: flex;
        span {
          margin: auto;
          display: block;
          font-size: 16px;
          width: 1em;
          height: 1em;
          background: url("../assets/btn.png") no-repeat;
          transform: scale(1.5);
        }
        .list-loop {
          // display: none;
          background-position: -64px -179px;
        }
        .random-loop {
          // display: none;
          background-position: -128px -179px;
        }
        .one-loop {
          // display: none;
          background-position: 0 -179px;
        }
      }
      .play-pause {
        span {
          display: block;
          width: 2em;
          height: 2em;
          background: url("../assets/btn.png") no-repeat;
          background-size: 600%;
        }
        .play {
          background-position: -6px -6px;
        }
        .pause {
          background-position: -6px -63px;
        }
      }
    }
  }
}
.fadeIn {
  animation-duration: 0.3s;
}
</style>