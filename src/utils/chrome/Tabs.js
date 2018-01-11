export default class {
  /**
   * @param {?int} [tabId]
   * @param {object} updateProperties
   * @returns {Promise<Tab>}
   */
  static update = (tabId, updateProperties) => {
    if (typeof tabId === 'object') {
      updateProperties = tabId
      tabId = null
    }

    return new Promise(resolve => chrome.tabs.update(tabId, updateProperties, resolve))
  }
}
