var ptHighlight = {
    //自定义高亮标签
    highlightTag: 'pthighlight',
    //自定义高亮css类
    highlightClass: 'pt-highlight',
    //自定义每个高亮的ID
    highlightId: 'parrot_id_',
    //高亮单词单个字母标签与CSS类前缀
    highlightWordsTag: 'span',
    highlightWordsClass: 'parrotWords',
    //用于向DOM中高亮单词后id计数
    cur_pt_node_id: 1,
    /*--------初始化正则----------*/
    initRegex: function(keyWord){
        // 针对特殊字符的转义，$1，$2表达的是小括号里面的内容
        keyWord = keyWord.replace(/(\^|\$|\.|\*|\?|\(|\)|\+|\\)/ig, "\\$1");
        /* 参数1是字符串，指定正则表达式的模式或其他正则表达式，参数2是可选字符串
         * g 指定全局匹配
         * i 区分大小写
         * m 多行匹配
         */
        return RegExp('\\b' + keyWord + '\\b', 'i')
     },
     /*--------创建高亮的新元素节点----------*/
    createHighlightNode: function(){
        var node = document.createElement(this.highlightTag);
        // console.log('节点创建成功');
        node.dataTooltip = 'show'
        node.className = this.highlightClass;
        //给匹配到的值添加id
        node.id = this.highlightId + this.cur_pt_node_id
        this.cur_pt_node_id += 1
        // console.log('css类创建成功');
        return node;
    },
    /*--------根据node进行匹配所有关键字高亮----------*/
    highlight: function(node, keyWord){
        var match = node.data.match(this.initRegex(keyWord));
        if (match === null) {
            return false;
        }
        //高度数据备用
        // this.addTopList(node);
        //splitText() 方法按照指定的 offset 把文本节点分割为两个节点
        var newNode = node.splitText(match.index)
        newNode.splitText(match[0].length);
        //高亮节点
        var highlightNode = this.createHighlightNode()
        /* 克隆到其他
         * appendChild 往前面DOM中添加项目
         * cloneNode 拷贝一个列表项到另外一个列表
         */
        highlightNode.appendChild(newNode.cloneNode(true));
        //replaceChild，将某个子节点替换为另一个
        newNode.parentNode.replaceChild(highlightNode, newNode)
    },
    /*--------遍历节点进行高亮----------*/
    mapToHighlight: function(node, keyWord){
        /* nodeType属性返回以数字值返回指定节点的节点类型
         * 如果节点是元素节点，则nodeType属性将返回 1；
         * 如果节点是属性节点，则nodeType属性将返回 2；
         * 如果节点是文本节点，则返回 3；
         * https://www.w3school.com.cn/xmldom/prop_element_nodetype.asp
         */
        // console.log('mapToHighlight:' + this)
        //判断节点是否是文本 
        if(node.nodeType === 3){
            //判断不为空就执行高亮
            if(node.data.replace(/(\s)/g, '') != ''){
                this.highlight(node, keyWord)
            }
        //判断节点是元素节点并包含子集
        } else if((node.nodeType === 1) && node.childNodes &&
        !/(script|style)/i.test(node.tagName) &&
        //判断标签名不和自定义高亮标签同名
        !(node.tagName === this.highlightTag.toUpperCase() &&
        node.className === this.highlightClass)){
            for (var i = 0; i < node.childNodes.length; i++){
                this.mapToHighlight(node.childNodes[i], keyWord);
            }
        }
    },
    /*--------高亮入口----------*/
    beginToHighlight: function(node, keyWord, selectText = false){
        //高亮时去掉首位空格后再匹配
        keyWord = keyWord.replace(/(^\s*)|(\s*$)/g, '');
        //遍历节点高亮
        this.mapToHighlight(node, keyWord);
    },
}