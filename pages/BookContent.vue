<template>
  <div class="detail-wrapper">
    <v-layout row wrap>
      <v-flex style="padding: 10px">
        <article class="detail-content text-xs-center">
          <header class="detail-title text-xs-center">{{$route.query.name}}</header>
          <pre style="word-break: break-all;white-space: pre-wrap;text-align: justify">{{bookContent[0].content}}</pre>
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
        bookContent: []
      }
    },
    async asyncData({store, route}) {
      state.appHeaderState.title = route.query.name;
      setState(store);
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
      this.bookContent = this.content;
    }
  };
</script>

<style lang="stylus" scoped>
  .detail-content {
    line-height: 30px;

    .detail-title {
      margin-bottom: 20px;
      padding: 10px 0;
      font-size: 18px;
      font-weight: bold;
    }
  }
</style>
