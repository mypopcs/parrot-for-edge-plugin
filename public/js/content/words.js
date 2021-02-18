var ptWords = {
    /*-----------获取英语单词并存储-----------*/
    do_load_eng_words: function(file_text){
        //获取wordsList的JSON的文件
        //JSON 通常用于与服务端交换数据,在接收服务器数据时一般是字符串。
        //我们可以使用 JSON.parse() 方法将数据转换为 JavaScript 对象。
        var data = JSON.parse(file_text)
        //声明一个数组用于存放所有英语单词
        var enWords = []
        for(var key in data){
            //获取JSON文件中所有英语单词列表
            //wordsList是数据中某个分组下面的所有单词与信息的集合数组
            var allWords = data[key].wordsList
            for(w=0; w < allWords.length; w++){
                //遍历单词对象，获取所有的英语单词
                for(var key in allWords[w]){
                    //push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
                    enWords.push(key)
                }
            }
        }
        //调用Chrome存储API
        local_storage = chrome.storage.local;
        //存储所有单词
        local_storage.set({"match_words": enWords});
        //存储所有单词对象
        local_storage.set({"allWordsObj": allWords})
    },
    /*-----------配置英语单词获取功能，并执行获取-----------*/
    load_eng_words: function(){
        //XMLHttpRequest 对象用于在后台与服务器交换数据
        //XMLHttpRequest 对象有三个重要的属性：onreadystatechange，readyState，status
        //onreadystatechange是存储函数（或函数名），每当readyState属性改变时，就会调用该函数。
        /**
         * readyState存有 XMLHttpRequest 的状态。从 0 到 4 发生变化。
         * 0: 请求未初始化
         * 1: 服务器连接已建立
         * 2: 请求已接收
         * 3: 请求处理中
         * 4: 请求已完成，且响应已就绪
         * **/
        var xhr = new XMLHttpRequest();
        //将扩展安装目录内的文件的相对路径转为FQDN URL
        var file_path = chrome.extension.getURL("../../data/wordsList.json")
        //通过替代单词，将指向this引入下一层级
        var this_ = this
        //在 onreadystatechange 事件中，我们规定当服务器响应已做好被处理的准备时所执行的任务
        xhr.onreadystatechange = function(){
            // 当 readyState 等于 4 且状态为 200 时，表示响应已就绪
            if(xhr.readyState == XMLHttpRequest.DONE){
                //当响应就绪，调用加载词典的函数
                /*
                * 当处理一个异步request的时候，尽管当前请求并没有结束,
                * responseText的返回值是当前从后端收到的内容。
                * 当请求状态readyState变为XMLHttpRequest.DONE (4)，
                * 且status值为200（"OK"）时，responseText是全部后端的返回数据
                */
                this_.do_load_eng_words(xhr.responseText)
            }
        }
        //XMLHttpRequest.open() 方法初始化一个请求
        xhr.open('GET',file_path, true);
        //XMLHttpRequest.send()方法用于实际发出 HTTP 请求
        xhr.send(null)
    },
    /*--------执行匹配----------*/
    do_wordsMatch: function(words){
        //判断是否为空，\s是指空白。如果不为空就执行高亮
        if(words.length > 0 && words.replace(/(\s)/g, '') != '') {
            //执行高亮
            ptHighlight.beginToHighlight(document.body, words, true);
        }
    },
}