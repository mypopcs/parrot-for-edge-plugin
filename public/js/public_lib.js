var ptPublicLib = {
    /*--------获取单词数据----------*/
    getWordData: function(){
        chrome.storage.local.get(['allWordsInfo'], function(result){
            return allWordsInfo = result.allWordsInfo;
        })
    }
}