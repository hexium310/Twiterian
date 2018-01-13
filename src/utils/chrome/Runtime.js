export default class {
  /**
   * @param {string} path
   * @returns {string}
   */
  static getURL = path => chrome.runtime.getURL(path)

  static sendMessage = (...args) => new Promise(resolve => chrome.runtime.sendMessage(...args, resolve))

  static onMessage = chrome.runtime.onMessage
}
