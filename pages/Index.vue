<template>
  <div>
    <div class="content">
      <div class="banner-con">
        <v-carousel>
          <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src"></v-carousel-item>
        </v-carousel>
      </div>
      <div style="height: 10px;"></div>
      <video controls name="media" style="width: 100%">
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

      this.books2 = this.books;
      this.tangShi = this.tangShis;
    },
    mounted() {
      const DB_NAME = 'Netease'
      const DB_VERSION = 1
      const OB_NAMES = {
        UseKeyPath: 'UseKeyPath',
        UseKeyGenerator: 'UseKeyGenerator'
      }

      function openindexedDB() {
        // The call to the open() function returns an IDBOpenDBRequest object with a result (success) or error value that you handle as an event.
        return new Promise((resolve, reject) => {
          /**
           * NOTE:
           * 1. 第一次打开可能会提示用户获取 indexedDB 的权限
           * 2. 浏览器隐身模式不会存在本地，只会存储在内存中
           */
          const request = window.indexedDB.open(DB_NAME, DB_VERSION)
          request.onerror = function (event) {
            // Do something with request.errorCode!
            console.log('open request failed', event)
            console.error(event.target.error)
          }
          request.onsuccess = function (event) {
            // Do something with request.result!
            // console.log('open request success', event)
            var db = event.target.result
            db.onerror = function (e) {
              console.error('Database error: ', e.target.error)
              reject(e.target.error)
            }
            db.onclose = e => {
              console.error('Database close:', e.target.error)
              reject(e.target.error)
            }
            resolve(db)
          }
          request.onupgradeneeded = function (event) {
            /**
             * NOTE:
             * 1. 创建新的 objectStore
             * 2. 删除旧的不需要的 objectStore
             * 3. 如果需要更新已有 objectStore 的结构，需要先删除原有的 objectStore ，然后重新创建
             */
            // The IDBDatabase interface
            console.log('onupgradeneeded', event)
            var db = event.target.result
            // Create an objectStore for this database
            obUseKeypath(db)
            obUseKeyGenerator(db)
            /**
             * NOTE:
             * transaction
             * 三个事件：
             * 1. error
             * 2. abort
             * 3. complete
             * 两个方法：
             * 1. abort
             * Rolls back all the changes to objects in the database associated with this transaction. If this transaction has been aborted or completed, then this method throws an error event.
             * 2. objectStore
             * Returns an IDBObjectStore object representing an object store that is part of the scope of this transaction.
             */
            db.transaction.oncomplete = function (e) {
              console.log('obj create success', e)
            }
          }
        })
      }

      function obUseKeypath(db) {
        const objectStore = db.createObjectStore(OB_NAMES.UseKeyPath, {
          keyPath: 'time'
        })
        objectStore.createIndex('errorCode', 'errorCode', {unique: false})
        objectStore.createIndex('level', 'level', {unique: false})
      }

      function obUseKeyGenerator(db) {
        const objectStore = db.createObjectStore(OB_NAMES.UseKeyGenerator, {
          autoIncrement: true
        })
        objectStore.createIndex('errorCode', 'errorCode', {unique: false})
        objectStore.createIndex('time', 'time', {unique: true})
        objectStore.createIndex('level', 'level', {unique: false})
      }

      openindexedDB();
      const TestData = [
        {
          event: 'NE-TEST1',
          level: 'warning',
          errorCode: 200,
          url: 'http://www.example.com',
          time: '2017/11/8 下午4:53:039',
          isUploaded: false
        },
        {
          event: 'NE-TEST2',
          msg: '测试2',
          level: 'error',
          errorCode: 1000,
          url: 'http://www.example.com',
          time: '2017/11/8 下午4:53:042',
          isUploaded: false
        },
        {
          event: 'NE-TEST3',
          msg: '测试3',
          level: 'info',
          errorCode: 3000,
          url: 'http://www.example.com',
          time: '2017/11/8 下午4:53:043',
          isUploaded: false
        },
        {
          event: 'NE-TEST4',
          mgs: '测试4',
          level: 'info',
          url: 'http://www.example.com',
          time: '2017/11/8 下午4:53:0423',
          isUploaded: false
        }
      ];

      function addData(docs, objName) {
        if (!(docs && docs.length)) {
          throw new Error('docs must be a array!')
        }
        return openindexedDB().then(db => {
          const tx = db.transaction([objName], 'readwrite')
          tx.oncomplete = e => {
            console.log('tx:addData onsuccess', e)
            return Promise.resolve(docs)
          }
          tx.onerror = e => {
            e.stopPropagation()
            console.error('tx:addData onerror', e.target.error)
            return Promise.reject(e.target.error)
          }
          tx.onabort = e => {
            console.warn('tx:addData abort', e.target)
            return Promise.reject(e.target.error)
          }
          const obj = tx.objectStore(objName)
          docs.forEach(doc => {
            const req = obj.add(doc)
            /**
             * NOTE:
             * request
             * 两个事件：
             * 1. success
             * 2. error
             */
            // req.onsuccess = e => console.log('obj:addData onsuccess', e.target)
            req.onerror = e => {
              console.error('obj:addData onerror', e.target.error)
            }
          })
        })
      }

      // addData(TestData, OB_NAMES.UseKeyGenerator)
      //   .then(() => addData(TestData, OB_NAMES.UseKeyPath));



      /**
       * 读取给定 key 的数据
       * @param {string} objName 仓库名称
       * @param {*} key 要读取数据的 primary key 值
       */
      function readData (objName, key) {
        return openindexedDB().then(db => {
          const tx = db.transaction([objName])
          const obj = tx.objectStore(objName)
          const req = obj.get(key)
          req.onsuccess = e => {
            console.log(`readData success. key:${key},result:`, e.target.result)
            return Promise.resolve(e.target.result)
          }
          req.onerror = e => {
            console.error(`readData error. key:${key},error: ${e.target.errorCode}`)
            return Promise.reject(e.target.error)
          }
        })
      }

      readData(OB_NAMES.UseKeyGenerator, 5);

      function updateData (objName, key, changes) {
        return openindexedDB().then(db => {
          return new Promise((resolve, reject) => {
            const tx = db.transaction([objName], 'readwrite')
            const obj = tx.objectStore(objName)
            const req = obj.get(key)
            req.onsuccess = e => {
              let doc = e.target.result
              let newDoc = Object.assign(doc, changes)
              const req = obj.put(newDoc)
              req.onsuccess = e => {
                console.log(`updateData success, newDoc:`, newDoc, e)
                resolve(e.target.result)
              }
              req.onerror = e => {
                resolve(e.target.result)
              }
            }
            req.onerror = e => {
              reject(e.target.error)
            }
          })
        })
      }

      // updateData(OB_NAMES.UseKeyGenerator, 1, {time: '123'})
      //   .then(doc => console.log(doc))
      //   .catch(console.error)


      /**
       * 删除指定 key 的数据
       * @param {string} objName 仓库名称
       * @param {*} key 要删除数据的 primary key 值
       */
      function deleteData (objName, key) {
        return openindexedDB().then(db => {
          const tx = db.transaction([objName], 'readwrite')
          const obj = tx.objectStore(objName)
          const req = obj.delete(key)
          req.onsuccess = e => {
            console.log(`readData success. key:${key},result:`, e.target.result)
            return Promise.resolve(e.target.result)
          }
          req.onerror = e => {
            console.error(`readData error. key:${key},error: ${e.target.errorCode}`)
            return Promise.reject(e.target.error)
          }
        })
      }

      // deleteData(OB_NAMES.UseKeyGenerator, 1)
      //   .then(doc => console.log(doc))


    }
  };

  window.addEventListener("online", online, false);

  window.addEventListener("offline", offline, false);

  function online() {
    console.log(true);
  }

  function offline() {
    console.log(false);
  }
</script>

<style>
  .banner-con .v-carousel__prev .v-icon.material-icons.theme--dark,
  .banner-con .v-carousel__next .v-icon.material-icons.theme--dark {
    line-height: 46px;
  }
</style>
