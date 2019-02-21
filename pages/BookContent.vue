<template>
  <div class="detail-wrapper">
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
      showMenu: true,
      showBack: false,
      showLogo: false,
      actions: [
        {
          icon: "home",
          route: {
            name: "index"
          }
        }
      ]
    },
    appSideBarState: {
      // 头部条的相关配置
      title: {
        imageLeft: '',
        altLeft: '',
        iconLeft: 'home',
        text: 'Home',
        imageRight: '',
        altRight: '',
        iconRight: '',
        route: '/'
      },

      // user: {
      //     name: 'Lavas',
      //     email: 'lavas@baidu.com',
      //     location: 'Shanghai'
      // },

      // 分块组
      blocks: [
        {
          // 子列表1
          // sublistTitle: 'Sublist1',
          list: [
            {
              text: 'Detail Page 11111',
              icon: 'sentiment_satisfied',
              route: '/detail/1'
            },
            {
              text: 'Detail Page 22222',
              icon: 'sentiment_satisfied',
              alt: 'mood-bad',
              route: '/detail/2'
            },
            {
              text: 'Detail Page 33333',
              icon: 'sentiment_neutral',
              route: '/detail/3'
            }
          ]
        }
      ]
    }
  };


  function setState(store) {
    store.dispatch("appShell/appHeader/setAppHeader", state.appHeaderState);
    store.dispatch("appShell/appSidebar/setAppSiderBar", state.appSideBarState);
  }

  export default {
    name: "BookContent",
    metaInfo() {
      return {
        title: this.title,
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
        bookContent: null,
        title: '',
        bookId: this.$route.query.id,
        msg: null,
        bookMenu: null
      }
    },
    async asyncData({store, route}) {
      await store.dispatch("getBookContent/getBookContent", {books_id: route.query.books_id, id: route.query.id});
      await store.dispatch("getContentBookMenu/getContentBookMenu", route.query.id);
    },
    computed: {
      ...mapState("getBookContent", ["content"]),
      ...mapState("getContentBookMenu", ["menu"])
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

      localStorage.setItem('contentbookmenu', JSON.stringify(this.menu)); // 内容页的书目
      let list = [];
      if (this.menu && Array.isArray(this.menu.data)) {
        for (let me of this.menu.data) {
          list.push({
            text: me.name,
            icon: null,
            route: `/book-content?id=${this.$route.query.id}&books_id=${me.id}`,
            id: me.id
          })
        }
      }
      state.appSideBarState.blocks[0].list = list;
      state.appSideBarState.title.text = this.content.name;
      state.appSideBarState.title.iconLeft = 'book';
      state.appSideBarState.title.route = `/book-menu?bookId=${this.$route.query.id}&bookName=${this.content.name}`;
      setState(this.$store);

      if (this.$route.query.id !== this.menu.books_id) {
        this.bookMenu = [];
      } else {
        this.bookMenu = this.menu;
      }
    },
    mounted() {
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
      font-size: 16px;
      font-weight: bold;
    }
  }
</style>
