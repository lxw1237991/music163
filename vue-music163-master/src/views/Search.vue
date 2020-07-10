<template>
  <div class="search">
    <HomeList></HomeList>
    <!-- 输入框 -->
    <div class="search-bar">
      <SearchInput
        :getkeyword="keyword"
        :Mode="Mode"
        @translate-keyword="searchSugFn($event)"
        @focusFn="Mode=$event.mode"
        @closeFn="Mode='keyword';showkey=false"
      ></SearchInput>
    </div>
    <!-- 搜索结果 -->
    <div class="search-result" v-if="showkey">
      <!-- 搜索建议词 -->
      <div class="suggest-word" v-if="Mode=='suggest'">
        <h3>搜索“{{inputkeyword}}”</h3>
        <ul>
          <li
            v-for="(srchsuggestkeyword,index) in srchsuggestkeywords"
            :key="index"
            @click="searchDetFn(srchsuggestkeyword.keyword)"
          >
            <i class="srch"></i>
            <span>{{srchsuggestkeyword.keyword}}</span>
          </li>
        </ul>
      </div>
      <!-- 搜索关键词 -->
      <div class="keyword-search" v-if="Mode=='keyword'">
        <!-- <h3>最佳匹配</h3> -->
        <div class="songlist">
          <ul>
            <SongList
              :type="type"
              :songs="track"
              v-for="(track,index) in srchSongs"
              :key="index"
              @transferId="$emit('transferId',$event)"
              :currentSong="courrntSong"
            ></SongList>
          </ul>
        </div>
      </div>
    </div>

    <!--热门搜索  -->
    <div class="search-hot" v-if="!showkey">
      <h3 class="title">热门搜索</h3>
      <ul>
        <li
          v-for="(item,index) in searchhot"
          :key="index"
          @click="searchDetFn(item.first)"
        >{{item.first}}</li>
      </ul>
    </div>
    <!-- 历史搜索 -->
    <div class="search-history" v-if="!showkey">
      <ul>
        <li
          v-for="(historyWord,index) in historyWords"
          :key="index"
          @click="searchDetFn(historyWord)"
        >
          <i></i>
          <div>
            <span class="content">{{historyWord}}</span>
            <span class="close">
              <i @click.stop="delHistoryWords(historyWord)"></i>
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import HomeList from "@/components/HomeList.vue";
import SearchInput from "@/components/SearchInput.vue";
import SongList from "@/components/SongList.vue";
export default {
  components: {
    HomeList,
    SearchInput,
    SongList
  },
  props: {
    courrntSong: Object
  },
  data: function() {
    return {
      searchhot: null,
      inputkeyword: "",
      srchsuggestkeywords: [],
      showkey: false,
      Mode: "suggest",
      // Mode: 'detailed',
      srchSongs: null,
      keyword: "",
      type: "search",
      historyWords: []
    };
  },
  methods: {
    searchhotFn: function() {
      var searchhotStorage = JSON.parse(window.localStorage.getItem("shot"));
      if (searchhotStorage && searchhotStorage.expies > Date.now()) {
        this.searchhot = searchhotStorage.result;
      } else {
        window.axios.get("/search/hot").then(response => {
          this.searchhot = response.data.result.hots;
          window.localStorage.setItem(
            "shot",
            JSON.stringify({
              expies: Date.now() + 10 * 60 * 1000,
              result: response.data.result.hots
            })
          );
        });
      }
    },
    // 搜索建议ajax获取数据
    searchSugFn: function(v) {
      if (this.Mode == "keyword") return;
      this.inputkeyword = v;
      // this.showkey = true;
      window.axios
        .get("/search/suggest", {
          params: {
            keywords: v,
            type: "mobile"
          }
        })
        .then(response => {
          // console.log(response);
          this.srchsuggestkeywords = response.data.result.allMatch;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 搜索关键词ajax拿数据
    searchDetFn: function(v) {
      this.Mode = "keyword";
      this.keyword = v;
      this.showkey = true;
      let old = { ...this.srchSongs };
      this.srchSongs = null;

      this.setHistoryWords(v);
      if (v) {
        this.inputkeyword = v;
        window.axios
          .get("/search", {
            params: {
              keywords: v
            }
          })
          .then(response => {
            // console.log(response);
            this.srchSongs = response.data.result.songs;
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        this.srchSongs = { ...old };
      }
    },
    // 设置添加历史搜索记录
    setHistoryWords: function(v) {
      var historyWordsStorage = JSON.parse(
        window.localStorage.getItem("historyWords")
      );
      // console.log(historyWordsStorage);
      if (historyWordsStorage) {
        // 筛选
        let isExist = historyWordsStorage.some(item => {
          return item == v;
        });
        // 取反，追加
        if (!isExist) historyWordsStorage.push(v);
        this.historyWords = [...historyWordsStorage];
        window.localStorage.setItem(
          "historyWords",
          JSON.stringify(historyWordsStorage)
        );
      } else {
        this.historyWords = [];
        window.localStorage.setItem("historyWords", JSON.stringify([v]));
        this.historyWords.push(v);
      }
    },
    // 删除搜索历史记录
    delHistoryWords: function(v) {
      var historyWordsStorage = JSON.parse(
        window.localStorage.getItem("historyWords")
      );
      historyWordsStorage.splice(historyWordsStorage.indexOf(v), 1);
      this.historyWords = [...historyWordsStorage];
      window.localStorage.setItem(
        "historyWords",
        JSON.stringify(historyWordsStorage)
      );
    }
  },
  created() {
    this.searchhotFn();
    this.historyWords = JSON.parse(window.localStorage.getItem("historyWords"));
  },
  watch: {
    inputkeyword: function(v) {
      if (v && this.Mode == "suggest" && this.inputkeyword != "") {
        this.showkey = true;
      } else if (this.inputkeyword == "") {
        this.showkey = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.search {
  .search-bar {
    width: 100%;
  }
  .suggest-word {
    h3 {
      height: 50px;
      margin-left: 10px;
      padding-right: 10px;
      font-size: 15px;
      line-height: 50px;
      color: #507daf;
    }
    ul {
      li {
        display: flex;
        height: 45px;
        padding-left: 10px;
        align-items: center;

        i {
          flex: 0 0 auto;
          margin-right: 7px;
          width: 15px;
          height: 15px;
          background-image: url("../assets/srch.svg");
          display: inline-block;
          vertical-align: middle;
          background-position: 0 0;
          background-size: contain;
          background-repeat: no-repeat;
        }
        span {
          display: inline-block;
          flex: 1;
          width: 1%;
          padding-right: 10px;
          font-size: 15px;
          line-height: 45px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: normal;
          position: relative;
          &::before {
            position: absolute;
            z-index: 2;
            content: "";
            top: 0;
            left: 0;
            width: 300%;
            height: 300%;
            pointer-events: none;
            box-sizing: border-box;
            transform-origin: top left;
            border: 0 solid rgba(0, 0, 0, 0.1);
            transform: scale(0.333333);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            transform: scale(0.333333);
          }
        }
      }
    }
  }
  .search-hot {
    padding: 15px 10px 0;
    h3 {
      font-size: 12px;
      line-height: 12px;
      color: #666;
    }
    ul {
      margin: 10px 0 7px;
      li {
        display: inline-block;
        height: 32px;
        margin-right: 8px;
        margin-bottom: 8px;
        padding: 0 14px;
        font-size: 14px;
        line-height: 32px;
        color: #333;
        border-radius: 60px;
        border: 1px solid #d3d4da;
      }
    }
  }
  .search-history {
    ul {
      li {
        display: flex;
        align-items: center;
        height: 45px;
        i {
          display: inline-block;
          width: 15px;
          height: 15px;
          margin: 0 10px;
          vertical-align: middle;
          background-image: url("../assets/histy.svg");
          background-position: 0 0;
          background-size: contain;
          background-repeat: no-repeat;
        }
        div {
          flex: 1;
          width: 1%;
          display: flex;
          .content {
            flex: 1;
            font-size: 17px;
          }
          .close {
            flex: 0 0 auto;
            & > i {
              background-image: url("../assets/close.svg");
            }
          }
        }
      }
    }
  }
}
</style>