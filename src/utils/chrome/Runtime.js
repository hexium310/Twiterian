export default class {
  /**
   * @param {string} path
   * @returns {string}
   */
  static getURL = path => chrome.runtime.getURL(path)
}
