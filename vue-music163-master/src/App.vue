<template>
  <div id="app" @touchstart="touchstart" @touchend="touchend" >
    <!-- 一级路由出口 -->
    <keep-alive>
      <router-view @transferId="courrnt=$event" :courrntSong="courrnt"></router-view>
    </keep-alive>
    <!-- 播放器 -->
    <PlayBar
      :courrnt="courrnt"
      :showFullscreenOut="showFullscreen"
      @transferId="courrnt=$event"
      @click-fullscren="showFullscreen=$event"
      @nextSong="courrnt=$event"
      @prevSong="courrnt=$event"
      @listSong="courrnt=$event"
      @randomSong="courrnt=$event"
    ></PlayBar>
  </div>
</template>

<script>
import PlayBar from "@/components/PlayBar";
export default {
  components: {
    PlayBar
  },
  data: function() {
    return {
      courrnt: null,
      touchstartX: 0,
      touchstartY: 0,
      showFullscreen: false
    };
  },
  // computed: {
  //   songId: function() {
  //     if (this.courrnt)
  //       return ` https://music.163.com/song/media/outer/url?id=${this.courrnt}.mp3 `;
  //     else return "";
  //   }
  // },
  methods: {
    touchstart: function(event) {
      // console.log("开始", event.changedTouches[0].clientX);
      this.touchstartX = event.changedTouches[0].clientX;
      this.touchstartY = event.changedTouches[0].clientY;
    },
    touchend: function(event) {
      if (this.showFullscreen) {
        if (
          event.changedTouches[0].clientX - this.touchstartX > 50 &&
          event.changedTouches[0].clientY - this.touchstartY > 10
        ) {
          // console.log('从左到右')
          this.touchstartX = 0;
          this.touchstartY = 0;
          this.showFullscreen = false;
        }
      }
      if (!this.showFullscreen) {
        if (
          event.changedTouches[0].clientX - this.touchstartX > 50 &&
          event.changedTouches[0].clientY - this.touchstartY > 10
        ) {
          // console.log('从左到右')
          this.touchstartX = 0;
          this.touchstartY = 0;
          this.routerBeck();
        }
        if (
          event.changedTouches[0].clientX - this.touchstartX < -50 &&
          event.changedTouches[0].clientY - this.touchstartY > 10
        ) {
          this.routerForward();
        }
      }
    },
    routerBeck: function() {
      this.$router.back();
    },
    routerForward: function() {
      this.$router.forward();
    },
   
  }
};
</script>

<style lang="less">
#app {
  color: #333333;
  width: 100%;
  height: 100%;
  margin-bottom: 50px;
  // audio {
  //   height: 50px;
  // }
}
</style>
