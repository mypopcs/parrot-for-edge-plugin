//总处理入口
function initForPage(){
    //如果没获取到页面就退出执行
    if(!document.body){
        return
    }
    //加载英语词典
    ptWords.load_eng_words(); //可以用此直接调用
    
    //在扩展程序中本地存储数据可以通过 chrome.storage API 实现
    chrome.storage.local.get(['match_words'], function(result){
        /*--------创建浮层用于显示单词详情----------*/
        // var bubbleDOM = ptBubble.create_bubble();
        // //向页面注入
        // document.body.appendChild(bubbleDOM)
        // tipsProcess()

        /*--------执行单词匹配并高亮----------*/
        //获取到所有单词并存入数组
        var allMatch_words = result.match_words;
        console.log(allMatch_words)
        for(m=0; m<allMatch_words.length; m++){
            //执行匹配
            ptWords.do_wordsMatch(allMatch_words[m])
        }
    })
}
//当页面完成后执行
window.addEventListener('load', function(event){
    initForPage();
})