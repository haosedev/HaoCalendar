#HaoCalendar

####说明：
想做一款日历插件的初衷是自己的项目需要在移动端使用一个可以多选（不连续）日期的插件。由于在线上找了众多插件后都不能完全符合项目的要求，要么就是纯E文，Kalendae.js需要改语言，或者类似其他不支持动态宽度，移动端尺寸受手机屏幕影响。要么其他条件符合又不支持多选。反正在尝试过各种插件后发现无论哪款都要修改他们的源码。虽然各作者都非常慷慨的贡献了自己的源码，但是直接修改他们的源文件总是我们作为开发者所不愿意做的。所以打算自己写一个！当然为了发扬节约精神，基础代码也是参考了无私作者的webNick分享的源码和思路。在他的基础上继续调整和开发。现在的版本暂时只为了满足自己项目的需要，但是源码的可读性和注释都非常丰富，只要大家喜欢可以随意修改并据为己有！

###版本
Version:0.7.83

###使用说明
####调用配置
点击日期会有回调回传（并且选中）<br>
点击换月份按钮会也有回调回传<br>
也可以使用on方式来绑定方法。
可以绑定的方法有：<br>
1. month-next  下个月按钮触发<br>
2. month-prev  上个月按钮触发<br>
3. click       点击日期触发<br>
4. 
<pre><code>
    &lt;link rel="stylesheet" type="text/css" href="./HaoCalendar.css" /&gt;
    &lt;script type="text/javascript" src="./HaoCalendar.js"&gt;&lt;/script&gt;
    //调用
    var Cale;
    Cale=new HaoCalendar({
        //show:false,             //默认值为true，默认显示
        wrapId: 'HaoCalendar',  //日历容器id
        triggerId: 'date1',     //跟随变化的Input ID
        callback:function(ret){ //回调函数
            console.log(ret);
        }
    });
    Cale.on('month-next',function(ev){
        console.log(ev);
        // 写你的确定之后的逻辑代码...
    });
    Cale.on('month-prev',function(ev){
        console.log(ev);
        // 写你的确定之后的逻辑代码...
    });
    Cale.on('click',function(ev){
        console.log(ev);
        // 写你的确定之后的逻辑代码...
    });  
    //Cale.show();    //显示，必须先init
    //Cale.hide();	  //隐藏，必须先init
</code></pre>

