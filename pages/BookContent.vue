<template>
  <div class="detail-wrapper" v-wechat-title="$route.meta.title=title">
    <v-layout row wrap>
      <v-flex style="padding: 10px">
        <article class="detail-content text-xs-center">
          <header class="detail-title text-xs-center">{{title}}</header>
          <router-link :to="{
                        name: 'bookContent',
                        query: {
                            id: bookId ,
                            books_id:bookContent && bookContent.prev,
                            name:bookId
                        }
                    }"
                       style="text-decoration: none" v-show="bookContent && bookContent.prev"
          >
            <v-btn color="primary" small style="min-width: 0;margin: 0;">上一章</v-btn>
          </router-link>
          <router-link :to="{
                        name: 'bookContent',
                        query: {
                            id: bookId ,
                            books_id:bookContent && bookContent.next,
                            name:bookId
                        }
                    }"
                       style="text-decoration: none" v-show="bookContent && bookContent.next"
          >
            <v-btn color="primary" small style="min-width: 0;margin: 0;">下一章</v-btn>
          </router-link>
          <pre style="word-break: break-all;white-space: pre-wrap;text-align: justify;margin: 10px 0 ;">{{bookContent && bookContent[0].content}}</pre>
          <router-link :to="{
                        name: 'bookContent',
                        query: {
                            id: bookId ,
                            books_id:bookContent && bookContent.prev,
                            name:bookId
                        }
                    }"
                       style="text-decoration: none" v-show="bookContent && bookContent.prev"
          >
            <v-btn color="primary" small style="min-width: 0;margin: 0;">上一章</v-btn>
          </router-link>
          <router-link :to="{
                        name: 'bookContent',
                        query: {
                            id: bookId ,
                            books_id:bookContent && bookContent.next,
                            name:bookId
                        }
                    }"
                       style="text-decoration: none" v-show="bookContent && bookContent.next"
          >
            <v-btn color="primary" small style="min-width: 0;margin: 0;">下一章</v-btn>
          </router-link>
        </article>
        <div v-show="msg">{{msg}}</div>
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

  function changeTitle(store) {

  }

  export default {
    name: "BookContent",
    metaInfo() {
      return {
        title: `${this.$route.query.name}`,
        titleTemplate: "%s - Lavas",
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
        bookContent: null,
        title: this.$route.query.name,
        bookId: this.$route.query.id,
        msg: null
      }
    },
    async asyncData({store, route}) {
      await store.dispatch("getBookContent/getBookContent", {books_id: route.query.books_id, id: route.query.id});
    },
    computed: {
      ...mapState("getBookContent", ["content"])
    },
    activated() {
      setState(this.$store);
    },
    created() {
      localStorage.setItem('bookcontent', JSON.stringify(this.content));
      if (this.$route.query.books_id != this.content[0].id) {
        this.bookContent = null;
      } else {
        this.bookContent = this.content;
      }
      this.title = this.bookContent ? this.bookContent[0].name : '';
      state.appHeaderState.title = this.content ? this.content[0].name : '';
      setState(this.$store);
    },
    mounted() {
      document.title = this.title;
      window.scroll(0, 0);
      if (navigator.onLine) {
        this.msg = null;
      } else {
        this.msg = '网络异常，稍后请刷新重试~';
      }
    },
    watch: {
      '$route'(to, from) {
        console.log(to, from);
        if (to.fullPath !== from.fullPath) {
          // next();

        }
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .detail-content {
    line-height: 24px;

    .detail-title {
      padding: 10px 0;
      font-size: 18px;
      font-weight: bold;
    }
  }
</style>
