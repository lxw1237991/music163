<template>
  <div class="song-list" :class="{redlist:redlist}" @click="$emit('transferId',song)">
    <slot></slot>
    <div>
      <div class="content">
        <h3 class="song-name">
          {{song.name}}
          <span v-if="song.alia">({{song.alia}})</span>
        </h3>
        <p class="song-singer">
          <span></span>
          {{joinArtists(song.artist)}}-{{song.albumname}}
        </p>
      </div>
      <div class="play-box">
        <img
          class="play"
          style="background:none"
          v-if="currentSong && songs.id === currentSong.id"
          src="../assets/playing.svg"
          alt
        />
        <span v-else class="play"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SongList",
  props: {
    songs: {
      type: Object,
      default: () => {
        return {
          id: 1442545710,
          type: 4,
          name: "怕光的人",
          copywriter: null,
          picUrl:
            "http://p1.music.126.net/ATwEbG_A9cRWtHFQyR4M4g==/109951164928592761.jpg",
          canDislike: true,
          trackNumberUpdateTime: null,
          song: {
            name: "怕光的人",
            id: 1442545710,
            position: 0,
            alias: ["网剧《致我们甜甜的小美满》男主主题曲"],
            status: 0,
            fee: 8,
            copyrightId: 1416757,
            disc: "01",
            no: 4,
            artists: [
              {
                name: "周锐",
                id: 13058505,
                picId: 0,
                img1v1Id: 0,
                briefDesc: "",
                picUrl:
                  "http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                img1v1Url:
                  "http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                albumSize: 0,
                alias: [],
                trans: "",
                musicSize: 0,
                topicPerson: 0
              }
            ],
            album: {
              name: "怕光的人",
              id: 88366870,
              type: "EP/Single",
              size: 1,
              picId: 109951164928592770,
              blurPicUrl:
                "http://p1.music.126.net/ATwEbG_A9cRWtHFQyR4M4g==/109951164928592761.jpg",
              companyId: 0,
              pic: 109951164928592770,
              picUrl:
                "http://p1.music.126.net/ATwEbG_A9cRWtHFQyR4M4g==/109951164928592761.jpg",
              publishTime: 1587571200000,
              description: "",
              tags: "",
              company: "Gstar音乐工作室",
              briefDesc: "",
              artist: {
                name: "",
                id: 0,
                picId: 0,
                img1v1Id: 0,
                briefDesc: "",
                picUrl:
                  "http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                img1v1Url:
                  "http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                albumSize: 0,
                alias: [],
                trans: "",
                musicSize: 0,
                topicPerson: 0
              },
              songs: [],
              alias: ["网剧《致我们甜甜的小美满》男主主题曲"],
              status: 0,
              copyrightId: 1416757,
              commentThreadId: "R_AL_3_88366870",
              artists: [
                {
                  name: "周锐",
                  id: 13058505,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: "",
                  picUrl:
                    "http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                  img1v1Url:
                    "http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                  albumSize: 0,
                  alias: [],
                  trans: "",
                  musicSize: 0,
                  topicPerson: 0
                }
              ],
              subType: "录音室版",
              transName: null,
              mark: 0,
              picId_str: "109951164928592761"
            },
            starred: false,
            popularity: 100,
            score: 100,
            starredNum: 0,
            duration: 284890,
            playedNum: 0,
            dayPlays: 0,
            hearTime: 0,
            ringtone: "",
            crbt: null,
            audition: null,
            copyFrom: "",
            commentThreadId: "R_SO_4_1442545710",
            rtUrl: null,
            ftype: 0,
            rtUrls: [],
            copyright: 0,
            transName: null,
            sign: null,
            mark: 0,
            noCopyrightRcmd: null,
            hMusic: {
              name: null,
              id: 4874086129,
              size: 11397791,
              extension: "mp3",
              sr: 44100,
              dfsId: 0,
              bitrate: 320000,
              playTime: 284890,
              volumeDelta: -26604
            },
            mMusic: {
              name: null,
              id: 4874086130,
              size: 6838692,
              extension: "mp3",
              sr: 44100,
              dfsId: 0,
              bitrate: 192000,
              playTime: 284890,
              volumeDelta: -24004
            },
            lMusic: {
              name: null,
              id: 4874086131,
              size: 4559142,
              extension: "mp3",
              sr: 44100,
              dfsId: 0,
              bitrate: 128000,
              playTime: 284890,
              volumeDelta: -22303
            },
            bMusic: {
              name: null,
              id: 4874086131,
              size: 4559142,
              extension: "mp3",
              sr: 44100,
              dfsId: 0,
              bitrate: 128000,
              playTime: 284890,
              volumeDelta: -22303
            },
            mvid: 0,
            rtype: 0,
            rurl: null,
            mp3Url: null,
            exclusive: false,
            privilege: {
              id: 1442545710,
              fee: 8,
              payed: 0,
              st: 0,
              pl: 128000,
              dl: 0,
              sp: 7,
              cp: 1,
              subp: 1,
              cs: false,
              maxbr: 999000,
              fl: 128000,
              toast: false,
              flag: 0,
              preSell: false
            }
          },
          alg: "hot_server"
        };
      }
    },
    type: {
      type: String,
      default: () => {
        return "new";
      }
    },
    redlist: {
      type: Boolean,
      default: () => false
    },
    currentSong: Object
  },
  data: function() {
    return {
      song: {
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
      }
    };
  },
  methods: {
    setSong: function(v) {
      if (this.type === "self") {
        this.song = v;
        return;
      }
      this.song.name = v.name;
      this.song.id = v.id;
      if (this.type === "new") {
        this.song.alia = v.song.alias[0];
        this.song.artist = v.song.artists;
        this.song.albumname = v.song.album.name;
        this.song.duration = v.song.duration;
        this.song.picUrl = v.song.album.picUrl;
        return;
      } else if (this.type === "hot") {
        this.song.alia = v.alia[0];
        this.song.artist = v.ar;
        this.song.albumname = v.al.name;
        this.song.duration = v.dt;
        this.song.picUrl = v.al.picUrl;
        return;
      } else if (this.type === "search") {
        this.song.alia = v.alias[0];
        this.song.artist = v.artists;
        this.song.albumname = v.album.name;
        this.song.duration = v.duration;
        // this.song.picUrl = `http://p2.music.126.net/rFUKVdOjqxgwAT6Zi6qv7A==/${v.album.picId}.jpg`;
        // this.song.picUrl = "url('../assets/disc_default.png')";
        this.getpicUrl(v.id);
        return;
      }
    },
    joinArtists: function(artists) {
      return artists.map(artist => artist.name).join(" / ");
    },
    getpicUrl: function(v) {
      window.axios
        .get("/song/detail", {
          params: {
            ids: v
          }
        })
        .then(response => {
          // console.log(response);
          this.song.picUrl = response.data.songs[0].al.picUrl;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  created() {
    this.setSong(this.songs);
  }
};
</script>

<style lang="less" scoped>
.redlist {
  &:nth-child(-n + 3) {
    span {
      color: red;
    }
  }
}
.song-list {
  position: relative;
  font-size: 16px;
  height: 55px;
  padding: 6px 0;
  box-sizing: border-box;
  margin: 0 6px;
  border-bottom: 1px solid lightgray;
  vertical-align: top;

  & > span {
    float: left;
    width: 40px;
    height: 55px;
    padding: 10px;
  }
  & > div {
    display: flex;
    .content {
      width: 0;
      flex: 1 1 auto;
      .song-name {
        font-size: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: normal;
        span {
          color: #888888;
          margin-left: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: normal;
        }
      }
      .song-singer {
        font-size: 12px;
        color: #888888;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: normal;
        span {
          display: inline-block;
          width: 12px;
          height: 8px;
          background: url("https://s3.music.126.net/mobile-new/img/index_icon_2x.png")
            0px 0px no-repeat;
          background-size: 166px 97px;
        }
      }
    }
    .play-box {
      display: flex;
      align-items: center;
      padding: 0 10px;
      .play {
        width: 22px;
        height: 22px;
        background: url("https://s3.music.126.net/mobile-new/img/index_icon_2x.png") -24px
          0px no-repeat;
        background-size: 166px 97px;
      }
    }
  }
}
</style>