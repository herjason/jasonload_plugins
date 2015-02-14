/**
 * 全局空间 Vcity
 */
var Vcity = {};

/**
 * 静态方法集
 * 
 * @name _m
 */
Vcity._m = {
    /* 获取元素位置 */
    getPos : function(node) {
        var scrollx = document.documentElement.scrollLeft
                || document.body.scrollLeft, scrollt = document.documentElement.scrollTop
                || document.body.scrollTop;
        var pos = node.getBoundingClientRect();
        return {
            top : pos.top + scrollt,
            right : pos.right + scrollx,
            bottom : pos.bottom + scrollt,
            left : pos.left + scrollx
        }
    },
    contains : function(datas, item) {
        for (var i = 0; i < datas.length; i++) {
            if (datas[i] == item) {
                return true;
            }
        }
        return false;
    }
};

String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")),
                replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}

/* 正则表达式 筛选中文城市名、拼音、首字母 */
Vcity.regEx = /^([\u4E00-\u9FA5\uf900-\ufa2d]+)\|(\w*)\|(\w)\w*\|(\d*)$/i;
Vcity.regExChiese = /([\u4E00-\u9FA5\uf900-\ufa2d]+)/;

/* 城市HTML模板 */
Vcity.single_template = ['<p class="tip">支持中文/拼音/简拼输入</p>', '<ul>',
        '<li class="on">热门</li>', '<li>ABCDE</li>', '<li>FGHJk</li>',
        '<li>LMNOP</li>', '<li>QRSTU</li>', '<li>VWXYZ</li>', '</ul>'];

/* 城市HTML模板 */
Vcity.multiple_template = [
        '<p class="tip"><span class="in_btn_f"><a style="cursor:pointer;" confirm-Btn>确认</a></span>',
        '<span class="in_btn_e"><a style="cursor:pointer;" cancel-btn>取消</a></span>',
        '<span class="in_btn_e"><a style="cursor:pointer;" deselect-btn>清除选择</a></span>',
        '</p>', '<div style="height: 10px; clear: both;"></div>', '<ul>',
        '<li class="on">热门</li>', '<li>ABCDE</li>', '<li>FGHJk</li>',
        '<li>LMNOP</li>', '<li>QRSTU</li>', '<li>VWXYZ</li>', '</ul>'];

/*******************************************************************************
 * 城市控件构造函数
 * 
 * @CitySelector
 */

Vcity.CitySelector = function(options) {
    this.single = options.single !== false;
    this.url = options.url;
    this.data = options.data;
    this.maxHot = options.maxHot || 16;
    this.input = document.getElementById(options.input);
    this.placeholder = options.placeholder || "";
    this.render = options.render;
    this.callback = options.callback;
    this.custom = options.custom;
    this._id = Math.random();
    this.allCity = [];

    this.initialize();
};

Vcity.CitySelector.prototype = {
    constructor : Vcity.CitySelector,

    /* 初始化 */
    initialize : function() {
        this.inputEvent();
        this.loadData();
    },

    /**
     * 获取城市id
     * 
     * @returns {*|jQuery}
     */
    getVal : function() {
        return $(this.input).attr("data-value");
    },

    /**
     * 获取城市名称
     * 
     * @returns {*|jQuery}
     */
    getName : function() {
        return $(this.input).val();
    },

    setVal : function(val, name) {
        name = name || val;
        $(this.input).attr("data-value",val).val(name).css("color","#000");
    },

    /**
     * @createWarp 创建城市BOX HTML 框架
     */

    createWarp : function(isShow) {
        var inputPos = Vcity._m.getPos(this.input);
        var div = this.rootDiv = document.createElement('div');
        var that = this;
        
        // 设置DIV阻止冒泡
        $(div).click(function(event) {
            event.stopPropagation
                    ? event.stopPropagation()
                    : event.cancelBubble = true;
        });

        // 设置点击文档隐藏弹出的城市选择框
        $(document).click(function(event) {
            if (event.target == that.input) {
                return false;
            }

            $(that.cityBox).hide();
            $(that.ul).hide();
            $(that.myIframe).hide();

        });

        div.className = 'citySelector';
        div.style.position = 'absolute';
        div.style.left = inputPos.left + 'px';
        div.style.top = inputPos.bottom + 'px';
        div.style.zIndex = 999999;

        // 判断是否IE6，如果是IE6需要添加iframe才能遮住SELECT框
        this.isIE6 = $.browser.msie && $.browser.version == "6.0";
        if (this.isIE6) {
            var myIframe = this.myIframe = document.createElement('iframe');
            myIframe.frameborder = '0';
            myIframe.src = 'about:blank';
            myIframe.style.position = 'absolute';
            myIframe.style.zIndex = '-1';
            this.rootDiv.appendChild(this.myIframe);
        }
        document.body.appendChild(this.rootDiv);

        var childdiv = this.cityBox = document.createElement('div');
        childdiv.className = 'cityBox';
        if (this.custom) {
            childdiv.className = 'cityBox customBorder';
        }
        // childdiv.id = 'cityBox';
        childdiv.innerHTML = (this.single
                ? Vcity.single_template
                : Vcity.multiple_template).join('');
        var hotCity = this.hotCity = document.createElement('div');
        hotCity.className = 'hotCity';
        childdiv.appendChild(hotCity);
        div.appendChild(childdiv);
        this.createHotCity();

        $("a[confirm-Btn]", this.cityBox).click(function() {
                    var values = [], names = [];
                    $(":checkbox:checked", that.hotCity).each(function() {
                                var span = $(this).parents("span");
                                var data = span.attr("data-value");
                                if (!Vcity._m.contains(values, data)) {
                                    values.push(data);
                                    names.push($("a", span).html())
                                }
                            });
                    $(that.input).val(names.join(","));
                    $(that.input).attr("data-value", values.join(","));
                    $(that.input).css("color", "#000");
                    
                    that.callback && that.callback(values.join(","));
                    that.closePanel();
                });
        $("a[cancel-btn]", this.cityBox).click(function() {
                    that.closePanel();
                });
        $("a[deselect-btn]", this.cityBox).click(function() {
                    $(":checkbox:checked", that.hotCity).attr("checked", false);
                });
        if (isShow === false) {
            $(this.cityBox).hide();
            $(this.myIframe).hide();
            $(this.ul).hide();
        }
    },

    closePanel : function() {
        $(this.cityBox).hide();
        $(this.ul).hide();
        $(this.myIframe).hide();
    },

    /***************************************************************************
     * @createHotCity TAB下面DIV：hot,a-h,i-p,q-z 分类HTML生成，DOM操作
     *                {HOT:{hot:[]},ABCDEFGH:{a:[1,2,3],b:[1,2,3]},IJKLMNOP:{},QRSTUVWXYZ:{}}
     */
    createHotCity : function() {
        var odiv, odl, odt, odd, odda = [], str, key, ckey, sortKey, regEx = Vcity.regEx, oCity = this.oCity;
        for (key in oCity) {
            odiv = this[key] = document.createElement('div');
            // 先设置全部隐藏hide
            odiv.className = key + ' ' + 'cityTab hide';
            sortKey = [];
            for (ckey in oCity[key]) {
                sortKey.push(ckey);
                // ckey按照ABCDEDG顺序排序
                sortKey.sort();
            }
            for (var j = 0, k = sortKey.length; j < k; j++) {
                odl = document.createElement('dl');
                odt = document.createElement('dt');
                odd = document.createElement('dd');
                odt.innerHTML = sortKey[j] == 'hot' ? '&nbsp;' : sortKey[j];
                odda = [];
                for (var i = 0, n = oCity[key][sortKey[j]].length; i < n; i++) {
                    var name = oCity[key][sortKey[j]][i];
                    str = '<span class="citylen" data-value="' + oCity.ID[name]
                            + '" style="padding-top:5px;">';
                    //str = '<label class="citylen" data-value="' + oCity.ID[name] + '" style="padding-top:5px;">';
                    if (!this.single) {
                        str += '<input type="checkbox" checked-box style="padding-top:3px;vertical-align:top;" />' +
                        '<a checked-label style="cursor:pointer;line-height:1.5em;" data-value="'+name+'">'
                                + name + "</a>";
                    } else {
                        str += '<a href="javascript:;">' + name + '</a>';
                    }
                    //str += '</label>';
                    str += '</span>';
                    odda.push(str);
                }
                odd.innerHTML = odda.join('');
                odl.appendChild(odt);
                odl.appendChild(odd);
                odiv.appendChild(odl);
            }
            $("a[checked-label]", odiv).click(this.setChecked);
            $("span.citylen", odiv).click(this, this.clickCheckbox);

            // 移除热门城市的隐藏CSS
            $(this.hot).show();
            this.hotCity.appendChild(odiv);
        }
        /* IE6 */
        this.changeIframe();

        this.tabChange();
        this.linkEvent();
    },
    setChecked : function() {
        /*if ($.browser.webkit) {
            return;
        }*/
        var checkbox = $(this).prev();
        var checked = !!checkbox.attr("checked");
        checkbox.attr("checked", !checked);
    },
    clickCheckbox : function(event) {
        event.stopPropagation();
        var that = event.data;
        var value = $(this).attr("data-value");
        var clazz = ".citylen[data-value=" + value + "]";
        var checked = !!$(":checkbox[checked-box]", this).attr("checked");
        $(clazz, that.cityBox).find(":checkbox[checked-box]").attr("checked",
                checked);
    },

    /***************************************************************************
     * tab按字母顺序切换 @ tabChange
     */
    tabChange : function() {
        var lis = $('li', this.cityBox);
        var divs = $('div', this.hotCity);
        var that = this;
        for (var i = 0, n = lis.length; i < n; i++) {
            lis[i].index = i;
            lis[i].onclick = function() {
                for (var j = 0; j < n; j++) {
                    $(lis[j]).removeClass("on");
                    $(divs[j]).hide();
                }
                $(this).addClass("on");
                $(divs[this.index]).show();
                /* IE6 改变TAB的时候 改变Iframe 大小 */
                that.changeIframe();
            };
        }
    },

    /***************************************************************************
     * 城市LINK事件
     * 
     * @linkEvent
     */
    linkEvent : function() {
        var that = this;

        if (this.single) {
            $("span", this.hotCity).click(function() {
                $(that.input).css("color", "#000");
                var text = $("a", this).html();
                if (that.input.value != that.placeholder && !that.single) {
                    var tval = that.input.value;
                    if (tval.indexOf(text) < 0) {
                        that.input.value = that.input.value + "," + text;
                        var val = $(that.input).attr("data-value") + ","
                                + $(this).attr("data-value");
                        $(that.input).attr("data-value", val);
                    }
                } else {
                    that.input.value = text;
                    $(that.input).attr("data-value", $(this).attr("data-value"));
                }
                $(that.input).change();
                $(that.cityBox).hide();
                /* 点击城市名的时候隐藏myIframe */
                $(that.myIframe).hide();

                that.callback && that.callback($(this).attr("data-value"));
            });
        }
    },

    reload : function(url) {
        if (this.url == url) {
            this.showPanel();
            return;
        }
        this.url = url;
        this.allCity.length = 0;
        var that = this;
        this.loadData(function() {
                    that.showPanel(true);
                }, true);
    },
    
    reloadData : function(datas, isShow) {
        var that = this;
        this.putAllData(datas, function() {
                    that.showPanel(true, isShow);
                }, true);
    },

    showPanel : function(refresh, isShow) {
        if (refresh) {
            if (!this.cityBox) {
                this.createWarp(isShow);
            } else {
                $('li', this.cityBox).removeClass("on");
                $('li:eq(0)', this.cityBox).addClass("on");
                this.hotCity.innerHTML = "";
                this.createHotCity();

                if (isShow !== false) {
                    $(this.cityBox).show();
                    $(this.myIframe).show();
                    $(this.ul).show();
                }
            }
        } else {
            if (!this.cityBox) {
                this.createWarp();
            } else if (!!this.cityBox && $(this.cityBox).is(":hidden")) {
                // slideul 不存在或者 slideul存在但是是隐藏的时候 两者不能共存
                if (!this.ul || (this.ul && $(this.ul).is(":hidden"))) {
                    $(this.cityBox).show();

                    /* IE6 移除iframe 的hide 样式 */
                    $(this.myIframe).show();
                    this.changeIframe();
                }
            }
        }
        $(":checkbox:checked", this.hotCity).attr("checked", false);
        var values = $(this.input).attr("data-value");
        var datas=$(this.input).val();//jason：通过名称值判断是否选中
        if (values||datas) {
            var that = this;
            /*values = values.split(",");
            datas=datas.split(",");//jason：通过名称值判断是否选中
            $.each(values, function() {
                        $("span[data-value=" + this + "] :checkbox",that.hotCity).attr("checked", true);
                        $("a[data-value=" + this + "]",that.hotCity).attr("checked", true);
            });*/
            //优化算法时间度，解决选中项比较多时运算缓慢的问题
            values = values?values+",":"";
            datas=datas?datas+",":"";
            $(".citySelector .citylen").each(function(){
                var $obj=$(this);
                if(values.indexOf($obj.data("value")+",")>=0||datas.indexOf($obj.find("a").data("value")+",")>=0)
                    $obj.find("input").attr("checked", true);
            });
        }
    },

    loadData : function(callback, isReload) {
        if (this.data) {
            this.putAllData(this.data, callback, isReload);
            return;
        }
        if (!this.url) {
            return;
        }
        /* 所有城市数据,可以按照格式自行添加（北京|beijing|bj|id），前16条为热门城市 */
        var that = this;
        $.ajax({
                    url : this.url + "&_dc=" + new Date().getTime(),
                    dataType : 'json',
                    context : this,
                    success : function(json) {
                        this.putAllData(json, callback, isReload);
                    }
                });
    },

    putAllData : function(data, callback, isReload) {
        var that = this;
        this.allCity.length = 0;
        for (var p in this.oCity) {
            this.oCity[p] = {};
        }
        $(data).each(function(i, n) {
                    if (that.render) {
                        that.allCity.push(that.render(n));
                    } else {
                        that.allCity.push(that.format(n));
                    }
                });
        this.createTabPanel(callback, isReload);
    },

    format : function(obj) {
        var data = [obj.title, obj.fullcode, obj.shortcode, obj.id];
        return data.join("|");
    },

    /***************************************************************************
     * 格式化城市数组为对象oCity，按照a-h,i-p,q-z,hot热门城市分组：
     * {HOT:{hot:[]},ABCDEFGH:{a:[1,2,3],b:[1,2,3]},IJKLMNOP:{i:[1.2.3],j:[1,2,3]},QRSTUVWXYZ:{}}
     */
    createTabPanel : function(callback, isReload) {
        var citys = this.allCity, match, letter, regEx = Vcity.regEx, reg2 = /^[a-e]$/i, reg3 = /^[f-k]$/i, reg4 = /^[l-p]$/i, reg5 = /^[q-u]$/i, reg6 = /^[v-z]$/i;

        if (!isReload && this.oCity) {
            return;
        }
        this.oCity = {
            hot : {},
            ABCDE : {},
            FGHJk : {},
            LMNOP : {},
            QRSTU : {},
            VWXYZ : {},
            ID : {}
        };
        for (var i = 0, n = citys.length; i < n; i++) {
            var arr = citys[i].split("|");
            var name = arr[0], pingyin = arr[1]; 
            arr[0] = arr[0].replace(/\d+/g, "").replace("（", "").replace("）", "").replace("-", "").replaceAll("、", "").replaceAll("—", "");
            arr[1] = arr[1].replace(/\d+/g, "").replace("（", "").replace("）", "").replace("-", "").replaceAll("、", "").replaceAll("—", "");
            citys[i] = arr.join("|");
            match = regEx.exec(citys[i]);
            if (!match) {
                continue;
            }
            match[1] = name;
            
            // 出现异常的城市则不保存
            if (match == null || match.length != 5)
                continue;
            letter = match[3].toUpperCase();
            if (reg2.test(letter)) {
                if (!this.oCity.ABCDE[letter])
                    this.oCity.ABCDE[letter] = [];
                this.oCity.ABCDE[letter].push(match[1]);
            } else if (reg3.test(letter)) {
                if (!this.oCity.FGHJk[letter])
                    this.oCity.FGHJk[letter] = [];
                this.oCity.FGHJk[letter].push(match[1]);
            } else if (reg4.test(letter)) {
                if (!this.oCity.LMNOP[letter])
                    this.oCity.LMNOP[letter] = [];
                this.oCity.LMNOP[letter].push(match[1]);
            } else if (reg5.test(letter)) {
                if (!this.oCity.QRSTU[letter])
                    this.oCity.QRSTU[letter] = [];
                this.oCity.QRSTU[letter].push(match[1]);
            } else if (reg6.test(letter)) {
                if (!this.oCity.VWXYZ[letter])
                    this.oCity.VWXYZ[letter] = [];
                this.oCity.VWXYZ[letter].push(match[1]);
            }
            // 赋值id
            if (!this.oCity.ID[match[1]])
                this.oCity.ID[match[1]] = '';
            this.oCity.ID[match[1]] = match[4];
            /* 热门城市 前N条 */
            if (i < this.maxHot) {
                if (!this.oCity.hot['hot'])
                    this.oCity.hot['hot'] = [];
                this.oCity.hot['hot'].push(match[1]);
            }
        }
        callback && callback();
    },

    /***************************************************************************
     * INPUT城市输入框事件
     * 
     * @inputEvent
     */
    inputEvent : function() {
        var that = this;
        if (!this.single) {
            $(this.input).attr("readonly", true);
        }
        $(this.input).click(function(event) {
                    if (!that.allCity || !that.allCity.length) {
                        return;
                    }
                    that.showPanel();
                    //关闭其它的弹出框
                    if(typeof(closeWind)=="function"){
                        closeWind();
                    }
                });
        $(this.input).focus(function(event) {
                    that.input.select();
                    if (that.input.value == that.placeholder) {
                        that.input.value = '';
                        $(that.input).css("color", "#000");
                    }
                }).blur(function() {
                    if (that.input.value == '') {
                        that.input.value = that.placeholder;
                        $(that.input).css("color", "#888");
                    }

                    if (that.single) {
                        //判断输入的内容是否存在数组内
                        var exist = false;
                        $(that.cityBox).find("dd a").each(function (i) {
                            if ($(this).html() == $.trim($(that.input).val())) {
                                var cval = $(this).parent().attr("data-value");
                                $(that.input).attr("data-value",cval);
                                $(that.input).change();
                                exist = true;
                                return false;
                            }
                        });

                        if (!exist) {
                            $(that.input).val('').attr("data-value", '');
                            $(that.input).change();
                        }
                    }
                });
        if ($(this.input).attr("readonly") != "readonly") {
            $(this.input).keyup(function(event) {
                        var keycode = event.keyCode;
                        $(that.cityBox).hide();
                        that.createUl();
                        /* 移除iframe 的hide 样式 */
                        $(that.myIframe).show();

                        // 下拉菜单显示的时候捕捉按键事件
                        if (that.ul && !$(that.ul).is(":hidden")
                                && !that.isEmpty) {
                            that.KeyboardEvent(event, keycode);
                        }
                    });
        }

        if (!$(this.input).val()) {
            $(this.input).val(this.placeholder);
            $(this.input).css("color", "#888");
        }
    },

    /***************************************************************************
     * 生成下拉选择列表 @ createUl
     */
    createUl : function() {
        var str;
        var value = $.trim(this.input.value);
        // 当value不等于空的时候执行
        if (value !== '') {
            var reg = new RegExp("^" + value + "|\\|" + value, 'gi');
            // 此处需设置中文输入法也可用onpropertychange
            var searchResult = [];
            for (var i = 0, n = this.allCity.length; i < n; i++) {
                if (reg.test(this.allCity[i])) {
                    var match = Vcity.regEx.exec(this.allCity[i]);
                    if (!match) {
                        continue;
                    }
                    if (searchResult.length !== 0) {
                        str = '<li data-value="#VALUE#"><b class="cityname">'
                                + match[1] + '</b><b class="cityspell">'
                                + match[2] + '</b></li>';
                    } else {
                        str = '<li data-value="#VALUE#" class="on"><b class="cityname">'
                                + match[1]
                                + '</b><b class="cityspell">'
                                + match[2] + '</b></li>';
                    }
                    var _id = this.allCity[i].split("|")[3];
                    searchResult.push(str.replace("#VALUE#", _id));
                }
            }
            this.isEmpty = false;
            // 如果搜索数据为空
            if (searchResult.length == 0) {
                this.isEmpty = true;
                str = '<li class="empty">对不起，没有找到数据 "<em>' + value
                        + '</em>"</li>';
                searchResult.push(str);
            }
            // 如果slideul不存在则添加ul
            if (!this.ul) {
                var ul = this.ul = document.createElement('ul');
                ul.className = 'cityslide';
                this.rootDiv && this.rootDiv.appendChild(ul);
                // 记录按键次数，方向键
                this.count = 0;
            } else if (this.ul && $(this.ul).is(":hidden")) {
                this.count = 0;
                $(this.ul).show();
            }
            this.ul.innerHTML = searchResult.join('');

            /* IE6 */
            this.changeIframe();

            // 绑定Li事件
            this.liEvent();
        } else {
            $(this.ul).hide();
            $(this.cityBox).show();

            $(this.myIframe).show();

            this.changeIframe();
        }
    },

    /* IE6的改变遮罩SELECT 的 IFRAME尺寸大小 */
    changeIframe : function() {
        if (!this.isIE6)
            return;
        this.myIframe.style.width = this.rootDiv.offsetWidth + 'px';
        this.myIframe.style.height = this.rootDiv.offsetHeight + 'px';
    },

    /***************************************************************************
     * 特定键盘事件，上、下、Enter键 @ KeyboardEvent
     */
    KeyboardEvent : function(event, keycode) {
        var lis = $('li', this.ul);
        var len = lis.length;
        switch (keycode) {
            case 40 : // 向下箭头↓
                this.count++;
                if (this.count > len - 1)
                    this.count = 0;
                for (var i = 0; i < len; i++) {
                    $(lis[i]).removeClass("on");
                }
                $(lis[this.count]).addClass("on");
                break;
            case 38 : // 向上箭头↑
                this.count--;
                if (this.count < 0)
                    this.count = len - 1;
                for (i = 0; i < len; i++) {
                    $(lis[i]).removeClass("on");
                }
                $(lis[this.count]).addClass("on");
                break;
            case 13 : // enter键
                this.input.value = Vcity.regExChiese
                        .exec(lis[this.count].innerHTML)[0];
                var value = $(lis[this.count]).attr("data-value");
                $(this.input).attr("data-value", value);
                $(this.input).css("color", "#000");
                $(this.ul).hide();
                /* IE6 */
                $(this.myIframe).hide();
                $(this.input).change();
                this.callback && this.callback(value);
                break;
            default :
                break;
        }
    },

    /***************************************************************************
     * 下拉列表的li事件 @ liEvent
     */
    liEvent : function() {
        var that = this;
        $("li", this.ul).each(function() {
            $(this).click(function(event) {
                $(that.input).css("color", "#000");
                that.input.value = Vcity.regExChiese
                        .exec(event.target.innerHTML)[0];
                var value = $(this).attr("data-value");
                $(that.input).attr("data-value", value);
                $(that.ul).hide();
                /* IE6 下拉菜单点击事件 */
                $(that.myIframe).hide();

                $(that.input).change();
                that.callback && that.callback(value);
            });
            $(this).hover(function(event) {
                        $(event.target).addClass("on");
                    }, function(event) {
                        $(event.target).removeClass("on");
                    });
        });
    }
};
