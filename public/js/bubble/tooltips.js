var options = {
    'width' : 200,
    'height' : 'auto',
    'boxOffsetX' : 20,
    'boxOffsetY' : 5,
    'arrowSize' : 10,
    'trigger' : 'hover'
};

//目标元素尺寸
function computeEleSize(element){
    return {
        'width' : element.offsetWidth,
        'height' : element.offsetHeight
    }
}

//获取元素与文档上边距离
function getEleTop(element) {
    var actualTop = element.offsetTop;
    var parent = element.offsetParent;
    while(parent !== null){
        actualTop = actualTop + parent.offsetTop;
        parent = parent.offsetParent;
    }
    return actualTop
}

//获取元素与文档左边距离
function getEleLeft(element) {
    var actualLeft = element.offsetLeft;
    var parent = element.offsetParent;
    while(parent !== null){
        actualLeft = actualLeft + parent.offsetLeft;
        parent = parent.offsetParent;
    }
    return actualLeft
}

//获取目标元素在浏览器视口中的相对位置
function getElePosInView(element,eleInfo){
    var scroll = getDocScroll(element),
        eleTop = eleInfo.marginT- scroll.scrollTop,
        eleLeft = eleInfo.marginL - scroll.scrollLeft,         
        viewSize = getViewport();
        return {
            'top' : eleTop,
            'left' : eleLeft,
            'right' : viewSize.viewWidth - eleInfo.elementSize.width - eleLeft,
            'bottom': viewSize.viewHeight - eleInfo.elementSize.height - eleTop
    };
}

//获取浏览器视口大小
function getViewport() {
    var w = (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth;
    var h = (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight;
    return {'viewWidth':w,'viewHeight':h};
}
//获取文档滚动高度与宽度
function getDocScroll(){
    if(document.compatMode == 'BackCompat'){
        return {
        'scrollTop' : document.body.scrollTop,
        'scrollLeft' : document.body.scrollLeft
        };
    }
    else{
        return {
        'scrollTop' : document.body.scrollTop+document.documentElement.scrollTop,
        'scrollLeft' : document.body.scrollLeft+document.documentElement.scrollLeft
        };           
    }
}

function testBoxPosition(tp, needSize){
    var arr = [
        {'realW': tp.right,'realH': tp.top},
        {'realW': tp.left,'realH': tp.top},
        {'realW': tp.right,'realH': tp.bottom},
        {'realW': tp.left,'realH': tp.bottom}
    ];
    for(var i = 0; i < arr.length; i++){
        if(needSize.needWidth <= arr[i].realW && needSize.needHeight <= arr[i].realH){
            return i
        }
    }
}

function getBoxCurrentPositions(element,box){
    //高亮单词的位置信息
    var eleInfo = {
        'marginL': getEleLeft(element), //tooltips元素与文档左边距离
        'marginT': getEleTop(element),  //tooltips元素与文档上边距离
        'elementSize': computeEleSize(element) //tooltips元素尺寸
    }
    var opt = options
    //tooltips元素在窗口中的相对位置
    targetPosition = getElePosInView(self, eleInfo);
    if(opt.width != 'auto'){
        box.style.width = opt.width+ 'px'
    }
    if(opt.height != 'auto'){
        box.style.height = opt.height + 'px'
    }
    var boxSize = computeEleSize(box),
        //提示框需要占用的位置尺寸
        boxNeedSize = {
            'needWidth': boxSize.width - (eleInfo.elementSize.width - parseInt(opt.boxOffsetX)),
            'needHeight': boxSize.height + parseInt(opt.boxOffsetY) + opt.arrowSize
        },
        //获取提示框位置
        boxTestResult = testBoxPosition(targetPosition, boxNeedSize),
        boxLLeft = eleInfo.marginL - opt.boxOffsetX - (eleInfo.marginL)/5,
        boxRLeft = eleInfo.marginL - boxNeedSize.needWidth,
        boxTTop = eleInfo.marginT - opt.boxOffsetY - boxSize.height - opt.arrowSize,
        boxBTop = eleInfo.marginT + opt.boxOffsetY + eleInfo.elementSize.height + opt.arrowSize,
        boxLeft = 0,
        boxTop = 0;
        box.targetEle =  element;
    //parseInt() 函数可解析一个字符串，并返回一个整数。
    switch(parseInt(boxTestResult)){
        case 0: //右上
            boxLeft = boxLLeft;
            boxTop = boxTTop;
            box.className = 'm-tipboxT m-tipboxR pt-bubbleWrap';
            break;
        case 1:                           //左上
            boxLeft = boxRLeft;
            boxTop = boxTTop;
            box.className = 'm-tipboxT m-tipboxL pt-bubbleWrap';
            break;
        case 2:                           //右下
            boxLeft = boxLLeft;
            boxTop = boxBTop;
            box.className = 'm-tipboxB m-tipboxR pt-bubbleWrap';
            break;
        case 3:                           //左下
            boxLeft = boxRLeft;
            boxTop = boxBTop;
            box.className = 'm-tipboxB m-tipboxL pt-bubbleWrap';
            break;
    }
    var boxCurrentPos = {
        'boxTop':boxTop,
        'boxLeft':boxLeft
    };
    return boxCurrentPos;
}

//设置box的位置
function setBoxPosition(box, top, left){
    box.style.position = 'absolute';
    box.style.top = top + 'px';
    box.style.left = left + 'px';
}
var ptTooltips = {
    /*-----------设置tooltip的显示隐藏与位置-----------*/
    setBox: function(element){
        //获取tooltips信息
        var tooltip = document.getElementById('pt_bubbleWrap');
        if(!tooltip){
            return
        } else {
            if(tooltip.style.opacity == 0){
                tooltip.style.opacity = 1;
                tooltip.style.display = 'inline-block'; //隐藏后不占用位置，防止遮住下方
                boxCurrentPos = getBoxCurrentPositions(element, tooltip);
                setBoxPosition(tooltip, boxCurrentPos.boxTop, boxCurrentPos.boxLeft)
            } else if(tooltip.style.opacity == 1){
                tooltip.style.opacity = 0;
                tooltip.style.display = 'none';
            } else {
                if(element !== tooltip.targetEle){
                    setContent(tooltip, content);
                    boxCurrentPos = getBoxCurrentPositions(element, tooltip);
                    setBoxPosition(tooltip, boxCurrentPos.boxTop, boxCurrentPos.boxLeft)
                }
                else{
                    tooltip.style.opacity = 0;
                    tooltip.style.display = 'none';
                }
            }
        }
    },
    /*-----------box显示-----------*/
    hoverShow: function(){
        console.log('显示了')
        var element = element || window.event, element = element.target || element.srcElement;
        //设置tooltip位置
        ptTooltips.setBox(element)
        return
    },
    /*-----------box隐藏-----------*/
    hoverHide: function(){
        console.log('隐藏了')
        ptTooltips.setBox()
        return
    },
    /*-----------判断点击或hover使用不同方式呈现-----------*/
    doTipsProcess: function(){
        //获取DOM中所有带有pthighlight的标签名
        //getElementsByTagName() 方法可返回带有指定标签名的对象的集合
        var elementArray = document.getElementsByClassName("pt-highlight");
        /*--------创建浮层用于显示单词详情----------*/
        var bubbleDOM = ptBubble.createBubble();
        //向页面注入
        document.body.appendChild(bubbleDOM)

        //开始判断是否hover
        for(var i = 0; i < elementArray.length; i++){
            /*addEventListener(event,fn,useCaption)
            * fn回调函数，useCaption用于描述是冒泡还是捕获。默认值是false，即冒泡传递。 当值为true，就是捕获传递
            */
            elementArray[i].addEventListener('mouseenter', this.hoverShow, false)
            elementArray[i].addEventListener('mouseout', this.hoverHide, false)
        }
    },
    /*-----------总调用入口-----------*/
    tipsProcess: function(){
        /* instanceof 运算符用来检测 constructor.prototype 是否存在于参数 object 的原型链上
        * object(要检测的对象) instanceof constructor(某个构造函数)，
        */
        // if(!(this instanceof tipsProcess)){
        //     return new ptTooltips.tipsProcess()
        // }
        this.doTipsProcess()
    }
}