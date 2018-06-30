/*
 * HaoCalendar
 * 使用原生代码编写，不需要jquery等支持
 * Version:0.7.84
 */
;(function(options,undefined) {
    "use strict"  //使用js严格的模式检查，使语法更规范
    var _global;
       
        var opt = {};
        // 对象合并
        function extend(o,n,override) {
            for(var key in n){
                if(n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)){
                    o[key]=n[key];
                }
            }
            return o;
        }
        function HaoCalendar(options){
            opt = { //参数保存在此对象中
                opts: options,
                selectDays:[],
                isShow:false,
            };
            this.init();
            if (options.show!=false){
                this.show();//初始化
            }
            //return this;
        }
        HaoCalendar.prototype = {
            //填充日历
            fillDate: function (year, month) {
                //本月份第一天是星期几-为显示上个月的天数做铺垫
                var first_day = new Date(year, month, 1).getDay();
                //如果刚好是星期天，则空出一行（显示上个月的天数）
                first_day = first_day == 0 ? 7 : first_day;
                //本月份最后一天是几号
                var final_date = new Date(year, month + 1, 0).getDate(),
                //上个月的最后一天是几号
                    last_date = new Date(year, month, 0).getDate(),
                //剩余的格子数--即排在末尾的格子数
                    surplus = 42 - first_day - final_date;
                /*设置表头的日历*/
                opt.oHeadDate.innerHTML = year + '年' + (month + 1) + '月';
                /*填充日历执行*/
                var html = '';
                //上个月的显示天数
                for (var i = 0; i < first_day; i++) {
                    var prevDate = year+"-"+(month)+"-"+(last_date - (first_day - 1) + i);
                    if (opt.selectDays.indexOf(prevDate)>=0){
                        html += '<span class="prev-date-normal calendar-sel">' + (last_date - (first_day - 1) + i) + '</span>';
                    }else{
                        html += '<span class="prev-date-normal">' + (last_date - (first_day - 1) + i) + '</span>';
                    }
                }
                //本月的显示天数
                for (var j = 0; j < final_date; j++) {
                    var benDate = year+"-"+(month+1)+"-"+(j+1);
                    if (opt.selectDays.indexOf(benDate)>=0){
                        //console.log("find date："+benDate);
                        html += '<span class="date-normal calendar-sel">' + (j + 1) + '</span>';
                    }else{
                        html += '<span class="date-normal">' + (j + 1) + '</span>';
                    }
                }
                //下个月的显示天数
                for (var k = 0; k < surplus; k++) {
                    var nextDate = year+"-"+(month+2)+"-"+(k + 1);
                    if (opt.selectDays.indexOf(nextDate)>=0){
                        html += '<span class="next-date-normal calendar-sel">' + (k + 1) + '</span>';
                    }else{
                        html += '<span class="next-date-normal">' + (k + 1) + '</span>';
                    }
                }
                //fill
                opt.oBody.innerHTML = html;
                // 当天
                if (year == new Date().getFullYear() && month == new Date().getMonth()) {
                    opt.oBody.getElementsByTagName('span')[first_day + opt.date - 1].className = 'calendar-today date-normal';
                }
                //点击赋值ipt得到日期
                var _me = this;
                for (var x = 0, v = opt.oBody.getElementsByTagName('span'), len = v.length; x < len; x++) {
                    v[x].onclick = function () {
                        var now = new Date(year, month, 1), y = 0, m = 0;
                        if (this.className.indexOf('prev-date-normal') > -1) {
                            y = new Date(now.setMonth(now.getMonth() - 1)).getFullYear();
                            m = new Date(now).getMonth();
                        } else if (this.className.indexOf('next-date-normal') > -1) {
                            y = new Date(now.setMonth(now.getMonth() + 1)).getFullYear();
                            m = new Date(now).getMonth();
                        } else if (this.className.indexOf('date-normal') > -1) {
                            y = year;
                            m = month;
                        }
                        var date=y + '-' + (m + 1) + '-' + this.innerHTML;
                        
                        document.getElementById('date1').value = date;
                        
                        //点击标记选中，并写入选中日期列表
                        var ret={};
                        var isSelNumber=opt.selectDays.indexOf(date);
                        ret['operation']='date';
                        ret['date']=date;
                        if (opt.selectDays.indexOf(date)>=0){
                            ret['event']="date-sel";
                            opt.selectDays.splice(isSelNumber,1);
                            //移除  并去除class
                            _me.removeSel(this,"calendar-sel");
                        }else{
                            ret['event']="date-normal";
                            opt.selectDays.push(date);
                            //新增  并加入class
                            _me.addSel(this,"calendar-sel");
                        }
                        //执行回调函数
                        opt.opts.callback(ret);
                        if(_me.listeners.indexOf('click') > -1) {
                            if(!_me.emit({type:'click',target: this, info: ret})) return ;
                        }
                        //opt.oWrap.style.display = 'none';//隐藏日历容器
                    }
                }
            },
            // 下个月
            next: function () {
                var me = this;
                opt.oNext.onclick = function () {
                    opt.month++;
                    if (opt.month > 11) {
                        opt.month = 0;
                        opt.year++;
                    }
                    // 填充日历
                    me.fillDate(opt.year, opt.month);
                    var ret={operation:'switch',event:"month-next",date:opt.year+"-"+opt.month};
                    opt.opts.callback(ret);
                    if(me.listeners.indexOf('month-next') > -1) {
                        if(!me.emit({type:'month-next',target: this, info: ret})) return ;
                    }
                }
            },
            // 上个月
            prev: function () {
                var me = this;
                opt.oPrev.onclick = function () {
                    opt.month--;
                    if (opt.month < 0) {
                        opt.month = 11;
                        opt.year--;
                    }
                    // 填充日历
                    me.fillDate(opt.year, opt.month);
                    var ret={operation:'switch',event:"month-prev",date:opt.year+"-"+opt.month};
                    opt.opts.callback(ret);
                    if(me.listeners.indexOf('month-prev') > -1) {
                        if(!me.emit({type:'month-prev',target: this, info: ret})) return ;
                    }
                }
            },
            // 下一年
            nextYear: function () {
                var me = this;
                opt.oNextYear.onclick = function () {
                    opt.year++;
                    // 填充日历
                    me.fillDate(opt.year, opt.month);
                    var ret={operation:'switch',event:"year-next",date:opt.year+"-"+opt.month};
                    opt.opts.callback(ret);
                    if(me.listeners.indexOf('year-next') > -1) {
                        if(!me.emit({type:'year-next',target: this, info: ret})) return ;
                    }
                }
            },
            // 上一年
            prevYear: function () {
                var me = this;
                opt.oPrevYear.onclick = function () {
                    if (opt.year > 1970) {
                        opt.year--;
                    }
                    // 填充日历
                    me.fillDate(opt.year, opt.month);
                    var ret={operation:'switch',event:"year-prev",date:opt.year+"-"+opt.month};
                    opt.opts.callback(ret);
                    if(me.listeners.indexOf('year-prev') > -1) {
                        if(!me.emit({type:'year-prev',target: this, info: ret})) return ;
                    }
                }
            },
            //获取元素偏移位置
            offset: function (ele) {
                var l = ele.offsetLeft, t = ele.offsetTop, p = ele.offsetParent;
                while (p) {
                    l += p.offsetLeft + p.clientLeft;
                    t += p.offsetTop + p.clientTop;
                    p = p.offsetParent;
                }
                return {left: l, top: t}
            },
            //添加Class sel
            addSel: function (ele, cls){
                var me = this;
                if (!me.hasSel(ele, cls)) {
                    ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
                }
            },
            removeSel: function(ele, cls){
                var me = this;
                if (me.hasSel(ele, cls)) {
                    var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
                    while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                        newClass = newClass.replace(' ' + cls + ' ', ' ');
                    }
                    ele.className = newClass.replace(/^\s+|\s+$/g, '');
                }
            },
            hasSel: function(ele, cls){
                cls = cls || '';
                if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
                return new RegExp(' ' + cls + ' ').test(' ' + ele.className + ' ');
            },
            getSel: function(){
                return opt.selectDays;
            },
            show: function(){
                opt.isShow=true;
                opt.oWrap.style.display = 'block';
            },
            hide: function(){
                opt.isShow=false;
                opt.oWrap.style.display = 'none';
            },
            on: function(type, handler){
                // type: show, shown, hide, hidden, close, confirm
                if(typeof this.handlers[type] === 'undefined') {
                    this.handlers[type] = [];
                }
                this.listeners.push(type);
                this.handlers[type].push(handler);
                return this;
            },
            emit: function(event){
                if(!event.target) {
                    event.target = this;
                }
                if(this.handlers[event.type] instanceof Array) {
                    var handlers = this.handlers[event.type];
                    for(var i = 0, len = handlers.length; i < len; i++) {
                        handlers[i](event);
                        return true;
                    }
                }
                return false;
            },
            init: function () {//初始化
                opt.isInit=true;
                //  初始化参数
                //创建日历容器固定结构，每次切换日期值即可
                var Headdiv = document.createElement("DIV");
                Headdiv.setAttribute('id', opt.opts.wrapId);
                //<button class="calendar-prev-year">&lt;&lt;</button><button class="calendar-next-year">&gt;&gt;</button>
                Headdiv.innerHTML = '<div class="calendar-hd">' +
                        '<div class="calendar-prev">上个月</div><div class="calendar-date"></div>' +
                        '<div class="calendar-next">下个月</div>' +
                        '</div><div class="calendar-tit clear">' +
                        '<span>周日</span><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span>' +
                        '</div><div class="calendar-main clear"></div>';
                document.getElementById("calender").appendChild(Headdiv);
                opt.oWrap = document.getElementById(opt.opts.wrapId);//日历容器
                opt.trigger = document.getElementById(opt.opts.triggerId);//关联Input容器的
                opt.oHeadDate = opt.oWrap.getElementsByClassName('calendar-date')[0];//头部日期
                opt.oBody = opt.oWrap.getElementsByClassName('calendar-main')[0];//日期容器
                opt.oTit = opt.oWrap.getElementsByClassName('calendar-tit')[0];//星期容器
                opt.oPrev = opt.oWrap.getElementsByClassName('calendar-prev')[0];//上月按钮
                opt.oNext = opt.oWrap.getElementsByClassName('calendar-next')[0];//下月按钮
                //opt.oPrevYear = opt.oWrap.getElementsByClassName('calendar-prev-year')[0];//上月按钮
                //opt.oNextYear = opt.oWrap.getElementsByClassName('calendar-next-year')[0];//下月按钮
                opt.year = 0;//年
                opt.month = 0;//月
                opt.date = 0;//日

                // 获取今天的日历时间
                var now = new Date();
                opt.year = now.getFullYear();
                opt.month = now.getMonth();
                opt.date = now.getDate();
                // 初始化--填充日历
                this.fillDate(opt.year, opt.month);
                //切换年月
                this.next();
                //this.nextYear();
                this.prev();
                //this.prevYear();
                this.listeners = []; //自定义事件，用于监听插件的用户交互
                this.handlers = {};
                
                //设置日历容器位置
                //opt.oWrap.style.position = 'absolute';            //可以设置跟随Input
                //opt.oWrap.style.left = this.offset(opt.trigger).left + opt.trigger.offsetWidth + 10 + 'px';
                //opt.oWrap.style.top = this.offset(opt.trigger).top + 'px';
                opt.oWrap.style.display = 'none';//默认隐藏日历容器
                //ipt触发日历选择
                opt.trigger.onclick = function () {
                    //opt.oWrap.style.display = 'none';   //点击日历后 是否隐藏
                }
            }
        };
        
    
    // 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = HaoCalendar;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return HaoCalendar;});
    } else {
        !('HaoCalendar' in _global) && (_global.HaoCalendar = HaoCalendar);
    }

}());