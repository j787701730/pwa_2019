<template>
  <div>
    <div class="content">
      <div class="banner-con">
        <v-carousel height="400">
          <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src"></v-carousel-item>
        </v-carousel>
      </div>
      <div style="height: 10px;"></div>
      <video controls style="width: 100%;background: rgba(0,0,0,0.3);">
        <source src="https://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" type="video/mp4">
      </video>
      <v-container fluid style="padding: 10px">
        <v-layout row wrap>
          <v-flex v-for="item in tangShi" :key="item.id" xs12 sm6 md4 lg2>
            <v-card flat tile style="margin-bottom: 20px">
              <div>{{item.title}}</div>
              <div>{{item.author}}</div>
              <div v-html="item.content">{{item.content}}</div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <div>
        <h2>LAVAS</h2>
        <h4>[ˈlɑ:vəz]</h4>
        <ul>
          <li v-for="(book,i) in books2" :key="i">{{book.name}} - {{book.author}}</li>
        </ul>
        <v-btn color="primary" @click="dialog = true">xxxx</v-btn>
        <v-dialog v-model="dialog" max-width="290">
          <v-card>
            <v-card-title class="headline">Use Google's location service?</v-card-title>
            <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google,
              even when no apps are running.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat="flat" @click="dialog = false">Disagree</v-btn>
              <v-btn color="green darken-1" flat="flat" @click="dialog = false">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState} from "vuex";

  function setState(store) {
    store.dispatch("appShell/appHeader/setAppHeader", {
      show: true,
      title: "HCJP",
      showMenu: true,
      showBack: false,
      showLogo: false,
      actions: [
        {
          icon: "search",
          route: "/search"
        }
      ]
    });
  }

  export default {
    name: "index",
    data() {
      return {
        items: [
          {
            src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg"
          },
          {
            src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg"
          },
          {
            src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
          }
        ],
        dialog: false,
        books2: [],
        tangShi: []
      };
    },
    metaInfo: {
      title: "Home",
      titleTemplate: "%s - HCJP",
      meta: [
        {name: "keywords", content: "lavas PWA"},
        {
          name: "description",
          content:
            "基于 Vue 的 PWA 解决方案，帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题"
        }
      ]
    },
    async asyncData({store, route}) {
      setState(store);
      await store.dispatch("getBooks/setWeather");
      await store.dispatch("getTangShi/tangShi");
    },
    activated() {
      setState(this.$store);
    },
    computed: {
      ...mapState("getBooks", ["books"]),
      ...mapState("getTangShi", ["tangShis"]),
    },
    created() {
      localStorage.setItem('books', JSON.stringify(this.books));
      localStorage.setItem('tangShis', JSON.stringify(this.tangShis));
      this.books2 = this.books;
      this.tangShi = this.tangShis;
    },
    mounted() {
      window.addEventListener("online", online, false);
      window.addEventListener("offline", online, false);

      function online() {
        console.log(navigator.onLine ? 'online' : 'offline');
      }

      online();
    }
  };


</script>

<style>
  .banner-con .v-carousel__prev .v-icon.material-icons.theme--dark,
  .banner-con .v-carousel__next .v-icon.material-icons.theme--dark {
    line-height: 46px;
  }
</style>
