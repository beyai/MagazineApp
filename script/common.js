(function (doc, win) {
    // api服务端地址
    win.SERVER_ROOT = 'http://127.0.0.1/api.php';
    // 缓存目录
    win.CACHEDIR = "magazine";
    // 动画效果
    window.ANIMATION = function(){
        if  ( (/android/gi).test(navigator.appVersion) ) {
            return {
                type : "fade",
                duration : 150
            }
        } else {
            return {
                type : "push",
                subType : "from_right",
                duration : 300,
            }
        }
    }

    // rem单位计算
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 14 * (clientWidth / 320) + 'px';
        };
 
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);


    win.Helper = {
        showLoading : function(){
            // 加载提示
            api.showProgress({ animationType: 'fade', title: '加载中...', modal: false });
        },
        hideLoading : function(){
            api.hideProgress();
        },
        showDowning : function(){
            api.showProgress({ animationType: 'fade', title: '下载中...', modal: false });
        },
        tips : function(text){
            text = text || "操作成功！"
            api.toast({
                msg: text,
                duration: 2000,
                location: 'middle'
            }); 
        },
        showLogin : function( file ){
            file = file || "./login.html"
            // 打开窗口
            api.openWin({
                name    : 'Login',
                url     : file,
                bgColor : "#F3F3F3",
                vScrollBarEnabled : false,
                hScrollBarEnabled : false,
                bounces : false,
                animation : {
                    type : "movein",
                    subType:"from_bottom",
                }
            });
        },

        getUserInfo : function( fn ){
            api.getPrefs({
                key: 'user'
            }, fn );
        },

        // 获取收藏
        getFav : function( fn ){
            api.getPrefs({ key: 'fav' }, fn );
        },
        // 获取已下载
        getDown : function(fn){
            var fs  = api.require('fs');
            fs.readDir({
                path : "fs://" + win.CACHEDIR
            }, fn )
        },
        // 打开新窗口
        openWin : function(url , data) {
            if (!url) return;
            data = data || {};
            // 打开窗口
            api.openWin({
                name: url,
                url:  url,
                bgColor : "#F3F3F3",
                vScrollBarEnabled : false,
                hScrollBarEnabled : true,
                animation : ANIMATION(),
                delay : 150,
                pageParam: data,
                bounces : false
            });
        },
        // 加载数据
        get : function( data , fn  ){
            data = data || {};
            fn  = fn || (function(){});
            api.ajax({
                url: SERVER_ROOT,
                method: 'get',
                dataType : "json",
                cache : true,
                data: {
                    values: data
                }
            }, fn );
        },
        
        // 提交数据
        post : function( data , fn  ){
            data = data || {};
            fn  = fn || (function(){});
            api.ajax({
                url: SERVER_ROOT,
                method: 'post',
                dataType : "json",
                data: {
                    values: data
                }
            }, fn );
        },

        // 登录请求
        userLogin : function( userInfo , fn ) {
            if (!userInfo || typeof userInfo!="object" ) return;
            fn = fn || (function(){});
            var self = this;
            self.post({
                m : "user",
                a : "login",
                operat_syx : 0,
                deviceToken : api.deviceId,
                username : userInfo.username,
                pwd : userInfo.pwd,
            },function( ret, err ){
                // 请求错误提示
                if (err) return self.tips(err.msg);
                // 缓存用户信息
                if (ret.code=="1") {
                    api.setPrefs({
                        key: 'user',
                        value: JSON.stringify({
                            username : ret.username,
                            pwd : userInfo.pwd,
                            uid : ret.user_id
                        })
                    });
                    
                    // 发送全局登录事件
                    api.sendEvent({
                        name: 'Login', 
                        extra: {
                            username : ret.username,
                            pwd : userInfo.pwd,
                            uid : ret.user_id
                        }
                    });
                }
                fn( ret , err );
            })
        }

        
    }


})(document, window);