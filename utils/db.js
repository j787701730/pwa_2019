const DB_NAME = 'HCJP';
const DB_VERSION = 4;
const OB_NAMES = {
  TangShi: 'tang-shi',
  Books: 'books'
};

export function openIndexedDB() {
  // The call to the open() function returns an IDBOpenDBRequest object with a result (success) or error value that you handle as an event.
  return new Promise((resolve, reject) => {
    /**
     * NOTE:
     * 1. 第一次打开可能会提示用户获取 indexedDB 的权限
     * 2. 浏览器隐身模式不会存在本地，只会存储在内存中
     */
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = function (event) {
      // Do something with request.errorCode!
      console.log('open request failed', event);
      console.error(event.target.error)
    };
    request.onsuccess = function (event) {
      // Do something with request.result!
      // console.log('open request success', event)
      let db = event.target.result;
      db.onerror = function (e) {
        console.error('Database error: ', e.target.error);
        reject(e.target.error)
      };
      db.onclose = e => {
        console.error('Database close:', e.target.error);
        reject(e.target.error)
      };
      resolve(db)
    };
    request.onupgradeneeded = function (event) {
      /**
       * NOTE:
       * 1. 创建新的 objectStore
       * 2. 删除旧的不需要的 objectStore
       * 3. 如果需要更新已有 objectStore 的结构，需要先删除原有的 objectStore ，然后重新创建
       */
        // The IDBDatabase interface
        // console.log('onupgradeneeded', event);
      let db = event.target.result;
      // Create an objectStore for this database
      if (!db.objectStoreNames.contains(OB_NAMES.TangShi)) {
        obTangShi(db);
      }
      db.deleteObjectStore('TangShi');
      console.log('db.deleteObjectStore(\'TangShi\');');
      // obUseKeypath(db);
      // obUseKeyGenerator(db);

      /**
       * NOTE:
       * transaction
       * 三个事件：
       * 1. error
       * 2. abort
       * 3. complete
       * 两个方法：
       * 1. abort
       * Rolls back all the changes to objects in the database associated with this transaction.
       * If this transaction has been aborted or completed, then this method throws an error event.
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
    // keyPath: 'time'
  });
  // objectStore.createIndex('errorCode', 'errorCode', {unique: false});
  // objectStore.createIndex('level', 'level', {unique: false})
}

function obUseKeyGenerator(db) {
  const objectStore = db.createObjectStore(OB_NAMES.UseKeyGenerator, {
    autoIncrement: true
  });
  // objectStore.createIndex('errorCode', 'errorCode', {unique: false});
  // objectStore.createIndex('time', 'time', {unique: true});
  // objectStore.createIndex('level', 'level', {unique: false})
}

function obTangShi(db) {
  // db.createObjectStore('TangShi');
  const objectStore = db.createObjectStore(OB_NAMES.TangShi, {
    // keyPath: 'time'
  });
  // objectStore.createIndex('errorCode', 'errorCode', {unique: false});
  // objectStore.createIndex('level', 'level', {unique: false})
}

/**
 * 添加数据
 * @param {array} docs 要添加数据
 * @param {string} tableName 仓库名称
 */
export function addData(tableName, docs) {
  if (!(docs && docs.length)) {
    throw new Error('docs must be a array!')
  }
  return openIndexedDB().then(db => {
    const tx = db.transaction([tableName], 'readwrite');
    tx.oncomplete = e => {
      console.log('tx:addData onsuccess', e);
      return Promise.resolve(docs)
    };
    tx.onerror = e => {
      e.stopPropagation();
      console.error('tx:addData onerror', e.target.error);
      return Promise.reject(e.target.error)
    };
    tx.onabort = e => {
      console.warn('tx:addData abort', e.target);
      return Promise.reject(e.target.error)
    };
    const obj = tx.objectStore(tableName);
    docs.forEach(doc => {
      const req = obj.add(doc);
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

// addData(OB_NAMES.UseKeyGenerator.TestData)
//   .then(() => addData(TestData, OB_NAMES.UseKeyPath));


/**
 * 读取给定 key 的数据
 * @param {string} tableName 仓库名称
 * @param {*} key 要读取数据的 primary key 值
 */
export function readData(tableName, key) {
  return openIndexedDB().then(db => {
    const tx = db.transaction([tableName]);
    const obj = tx.objectStore(tableName);
    const req = obj.get(key);
    req.onsuccess = e => {
      console.log(`readData success. key:${key},result:`, e.target.result);
      return Promise.resolve(e.target.result)
    };
    req.onerror = e => {
      console.error(`readData error. key:${key},error: ${e.target.errorCode}`);
      return Promise.reject(e.target.error)
    }
  })
}

// readData(OB_NAMES.UseKeyGenerator, 5);

/**
 * 清空表
 * @param storeName 表名
 */
export function clearObjectStore(storeName) {
  return openIndexedDB().then(db => {
    let transaction = db.transaction(storeName, 'readwrite');
    let store = transaction.objectStore(storeName);
    let req = store.clear();
    req.onsuccess = function (evt) {
      console.debug("clearData success");
    };
    req.onerror = function (evt) {
      console.error("clearData error:", evt.target.errorCode || evt.target.error);
    };
  })
}


/**
 * 更新指定 key 的数据
 * @param {string} tableName 仓库名称
 * @param {*} key 指定的 key
 * @param {object} changes 要修改的属性值
 */
export function updateData(tableName, key, changes) {
  return openIndexedDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction([tableName], 'readwrite');
      const obj = tx.objectStore(tableName);
      const req = obj.get(key);
      req.onsuccess = e => {
        let doc = e.target.result;
        let newDoc = Object.assign(doc, changes);
        const req = obj.put(newDoc);
        req.onsuccess = e => {
          console.log(`updateData success, newDoc:`, newDoc, e);
          resolve(e.target.result)
        };
        req.onerror = e => {
          resolve(e.target.result)
        }
      };
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
 * @param {string} tableName 仓库名称
 * @param {*} key 要删除数据的 primary key 值
 */
export function deleteData(tableName, key) {
  return openIndexedDB().then(db => {
    const tx = db.transaction([tableName], 'readwrite');
    const obj = tx.objectStore(tableName);
    const req = obj.delete(key);
    req.onsuccess = e => {
      console.log(`readData success. key:${key},result:`, e.target.result);
      return Promise.resolve(e.target.result)
    };
    req.onerror = e => {
      console.error(`readData error. key:${key},error: ${e.target.errorCode}`);
      return Promise.reject(e.target.error)
    }
  })
}

// deleteData(OB_NAMES.UseKeyGenerator, 1)
//   .then(doc => console.log(doc))


/**
 * 通过 cursor 获取制定仓库下的所有数据
 * @param {string} tableName 仓库名称
 * @param {function} [cb] 回调函数，对每次得到的 cursor 进行操作
 * @returns {Promise.<array.<object>} 包含所有数据的数组
 */
export function getAllByCursor(tableName, cb) {
  return openIndexedDB().then(db => {
    const arr = [];
    const tx = db.transaction([tableName]);
    const obj = tx.objectStore(tableName);
    return new Promise(resolve => {
      obj.openCursor().onsuccess = e => {
        const cursor = e.target.result;
        if (cursor) {
          arr.push(cursor.value);
          cb && cb(cursor);
          cursor.continue();
        } else {
          return resolve(arr)
        }
      }
    })
  })
}
