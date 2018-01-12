export default class {
  static Local = class {
    /**
     * @param {string|string[]|object} [keys=null]
     * @returns {Promise<object>}
     */
    static get = (keys = null) => new Promise(resolve => chrome.storage.local.get(keys, resolve))

    /**
     * @param {object} items
     * @returns {Promise<any>}
     */
    static set = items => new Promise(resolve => chrome.storage.local.set(items, resolve))

    /**
     * @param {string|string[]|object} keys
     * @returns {Promise<any>}
     */
    static remove = keys => new Promise(resolve => chrome.storage.local.remove(keys, resolve))
  }
}
