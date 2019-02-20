<template>
  <div class="detail-wrapper">
    <v-layout row wrap>
      <v-flex style="padding: 10px">
        <article class="detail-content text-xs-center">
          <!--<header class="detail-title text-xs-center">{{$route.query.bookName}}</header>-->
          <ul style="padding-left: 0;text-align: left">
            <li v-for="item in bookMenu.data" :key="item.id" style="list-style: none;font-size: 14px">
              <router-link
                :to="{
                        path: '/book-content',
                        query: {
                            id: bookId ,
                            books_id:item.id
                        }
                    }"
                style="text-decoration: none"
              >{{item.name}}
              </router-link>
            </li>
          </ul>
          <div v-show="msg">{{msg}}</div>
        </article>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

  import {mapState} from "vuex";

  let state = {
    appHeaderState: {
      show: true,
      title: "HCJP",
      showMenu: false,
      showBack: true,
      showLogo: false,
      actions: [
        {
          icon: "home",
          route: {
            name: "index"
          }
        }
      ]
    }
  };

  function setState(store) {
    store.dispatch("appShell/appHeader/setAppHeader", state.appHeaderState);
  }

  export default {
    name: "BookMenu",
    metaInfo() {
      return {
        title: `${this.$route.query.bookName}`,
        titleTemplate: "%s - HCJP",
        meta: [
          {name: "keywords", content: "lavas PWA"},
          {
            name: "description",
            content:
              "基于 Vue 的 PWA 解决方案，帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题"
          }
        ]
      };
    },
    data() {
      return {
        bookMenu: [],
        bookId: this.$route.query.bookId,
        msg: null
      }
    },
    async asyncData({store, route}) {
      state.appHeaderState.title = route.query.bookName;
      setState(store);
      await store.dispatch("getBookMenu/getBookMenu", route.query.bookId);
    },
    computed: {
      ...mapState("getBookMenu", ["menu"])
    },
    activated() {
      setState(this.$store);
    },
    created() {
      localStorage.setItem('bookmenu', JSON.stringify(this.menu));
      if (this.$route.query.bookId != this.menu.books_id) {
        this.bookMenu = [];
      } else {
        this.bookMenu = this.menu;
      }
      if (navigator.onLine) {
        this.msg = null;
      } else {
        this.msg = '网络异常，稍后请刷新重试~';
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .detail-content {
    line-height: 30px;

    .detail-title {
      margin-bottom: 20px;
      padding: 10px 0;
      font-size: 36px;
      font-weight: bold;
    }
  }
</style>
