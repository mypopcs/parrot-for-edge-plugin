var bubbleDom = [
    'bubbleWrap', //Tips容器
    'bubbleWordWrap', //单词容器
    'bubbleExampleWrap', //例子容器
    'bubbleZhWrap',   //中文解释容器
    'bubbleZhName',   //中文解释
    'bubbleWordRead', //发音音标
    'bubbleWordType', //单词类型
    'bubbleWordBg',  //英文单词背景
    'bubbleSubTitle', //二级标题
    'bubbleExampleLine' //单个例句
]
/*--------调用获取单词数据----------*/
var allWordsInfo = ptPublicLib.getWordData
var ptBubble = {
    // var pt_online_dicts = null;
    // var node_get_hover_id = null;
    // var rendered_node_id = null;
    // var highlightClass = 'pt-highlight';
    // var bubbleID = 'pt_bubble'
    /*--------创建tips框架----------*/
    createBubble: function(){
        //通过循环方式给弹出层添加相对于的Class和ID
        for(var i = 0; i < bubbleDom.length; i++){
            bubbleDomValue = bubbleDom[i]
            bubbleDom[i] = document.createElement('div');
            bubbleDom[i].id = 'pt_' + bubbleDomValue;
            bubbleDom[i].className = 'pt-' + bubbleDomValue;
        }
        //初始化默认隐藏
        bubbleDom[0].style.opacity = '0'
        
        //bubble的结构构造
        //tips容器中添加单词容器和例子容器
        bubbleDom[0].appendChild(bubbleDom[1])
        bubbleDom[0].appendChild(bubbleDom[2])
        //单词容器添加中文解释容器和英文单词背景
        bubbleDom[1].appendChild(bubbleDom[3])
        bubbleDom[1].appendChild(bubbleDom[7])
        //中文解释容器添加中文解释和发音音标和单词类型
        bubbleDom[1].appendChild(bubbleDom[3])
        bubbleDom[1].appendChild(bubbleDom[7])
        //例子容器添加标题和例句
        bubbleDom[2].appendChild(bubbleDom[8])
        bubbleDom[2].appendChild(bubbleDom[9])
        return bubbleDom[0]
    },
    /*--------往tips框架中加入数据----------*/
    bubbleData: function(ele){
        //textContent 属性设置或者返回指定节点的文本内容。
        //获取鼠标hover的文本
        var hoverWord = ele.textContent
        for(var key in allWordsInfo){
            var worldGroup = Object.keys(allWordsInfo[key])
            //获取key值
            // console.log(allWordsInfo[key])
            if(worldGroup[0] == hoverWord){
                var enWord = worldGroup
                // console.log(enWord)
            }
            // for(var key in worldGrop){
            //     if(key == hoverWord){
            //         console.log(worldGrop[key])
            //     }
            // }
            // if(allWords[i].key == hoverWord){
            //     console.log('666')
            // }
        }
    }
}