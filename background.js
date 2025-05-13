const API_BG = typeof browser !== 'undefined' ? browser : chrome;
API_BG.runtime.onInstalled.addListener(() => {
  console.log("ChatGPT Auto-Truncate installed v2.3");
});