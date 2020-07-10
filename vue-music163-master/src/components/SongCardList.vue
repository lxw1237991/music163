<template>
  <div class="card-list" @click="routerToPlayListPage(songlist.id)">
    <img :src="songlist.picUrl" alt />
    <div class="playcount">
      <i class="fa fa-headphones"></i>
      {{playCount}}
    </div>
    <p>{{songlist.name}}</p>
  </div>
</template>

<script>
export default {
  name: "Song",
  props: {
    songlist: {
      type: Object,
      default: () => {
        return {
          id: 4969079749,
          type: 0,
          name: "欧美 | 欢快小调拯救你的不开心",
          copywriter: "编辑推荐：音乐是治愈人心的良药",
          picUrl:
            "https://p1.music.126.net/nflx5ZxSSPivvGnyS5WRGw==/109951164906376339.jpg",
          canDislike: false,
          trackNumberUpdateTime: 1586934907095,
          playCount: 815852,
          trackCount: 100,
          highQuality: false,
          alg: "featured"
        };
      },
      playCount: String,
    },
    currentSong: Object
  },
  methods: {
    routerToPlayListPage: function(id) {
      this.$router.push({
        path: "playlist",
        query: { id: id}
      });
    }
  },
  computed: {
    playCount: function() {
      var num = this.songlist.playCount;
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
  }
};
</script>

<style lang="less" scoped>
@red: #d43c33;
.card-list {
  flex-basis: 30%;
  flex-grow: 1;
  margin-bottom: 5px;
  position: relative;
  &:nth-child(3n + 2) {
    margin: 0 3px;
  }
  img {
    vertical-align: middle;
  }
  .playcount {
    position: absolute;
    top: 0;
    right: 3px;
    color: white;
    font-size: 12px;
  }
  p {
    font-size: 14px;
    margin: 3px 3px 5px;
    line-height: 1.2em;
    height: 2.4em;
    overflow: hidden;
  }
}
</style>