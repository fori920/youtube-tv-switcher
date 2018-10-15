// Called when the user clicks on the browser action.
(function(chromeApi) {

  getCurrentPageVersion = function (tabUrl) {
    var ytValidRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)/g;
    var ytValidStdPageRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)?(\/watch\?v=).+$/g;
    var ytValidTvPageRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)?(\/tv#\/watch(\/video)?\/(idle|control)\?v=).+$/g;

    if (!ytValidRegex.test(tabUrl)) {
      return undefined;
    } else if (ytValidStdPageRegex.test(tabUrl)) {
      return "std";
    } else if (ytValidTvPageRegex.test(tabUrl)) {
      return "tv";
    }

    return undefined;
  };

  getConvertedActionUrl = function (tabUrl) {
    var result = '';

    var shortStdYtUrlRegex = /\/watch\?v=.+/g;
    var shortTvYtUrlRegex = /\/tv#\/watch\/video\/(idle|control)\?v=.+/g;
    var shortStdYtUrlReplaceRegex = /\/watch\?v=/g;
    var shortTvYtUrlReplaceRegex = /\/tv#\/watch\/video\/(idle|control)\?v=/g;

    if (shortStdYtUrlRegex.test(tabUrl)) {
      result = tabUrl.replace(shortStdYtUrlReplaceRegex, '/tv#/watch/idle?v=');
    }

    else {
      result = tabUrl.replace(shortTvYtUrlReplaceRegex, '/watch?v=');
    }

    // YouTube standard website video url
    //https://www.youtube.com/watch?v=9tRDQK2MtRs
    // YouTube TV url
    //https://www.youtube.com/tv#/watch/video/idle?v=9tRDQK2MtRs
    return result;
  }

  onInit = function () {

  };

  chromeApi.browserAction.onClicked.addListener(function(tab) {
    var actionUrl = '';
    var tabUrl = tab.url;

    if (getCurrentPageVersion(tabUrl) !== undefined) {
      actionUrl = getConvertedActionUrl(tabUrl);
      if (actionUrl !== tabUrl) {
        chromeApi.tabs.update(tab.id, {url: actionUrl});
      }
    }

  });

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(!changeInfo.url) return; // URL did not change
    // Might be better to analyze the URL to exclude things like anchor changes
    var pageVersion = getCurrentPageVersion(tab.url);
    if (pageVersion === undefined) return;

    /* ... */
    chrome.browserAction.setBadgeText({text: pageVersion.toUpperCase(), tabId: tab.id});
  });

  chrome.tabs.onCreated.addListener(function(tab){
    var pageVersion = getCurrentPageVersion(tab.url);
    if (pageVersion === undefined) return;

    /* ... */
    chrome.browserAction.setBadgeText({text: pageVersion.toUpperCase(), tabId: tab.id});
  });

})(chrome);
