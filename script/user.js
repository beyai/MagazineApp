window.apiready = function(){
    // 传递过来的参数
   	var pageParam = api.pageParam;
    // 状态栏
    $api.fixStatusBar( $api.dom('header') );

    // 获取登录信息
    var getUserInfo = function(){
        var userinfo = api.getPrefs({ sync : true , key: 'user' });
            data = userinfo!="" ?  JSON.parse(userinfo) : {};
            var htmlString = template("UserInfo" ,  data );
            $(".user-header-info").html( htmlString );
    };

    getUserInfo();

    // 关闭窗口
    $("#CloseWin").tap(function(){
        api.closeWin();
    })

    // 登录
    $(document).on("tap","#Login",function(){
        Helper.showLogin();
    })

    // 退出
    $(document).on("tap","#Logout",function(){
        api.removePrefs({ key: 'user' });
        Helper.tips("您已成功退出")
        // 发送全局登录事件
        api.sendEvent({name: 'Logout', extra: {} });
        getUserInfo();
    })

    // 监听全局登录事件
    api.addEventListener({ name: 'Login' }, function(ret, err) {
        getUserInfo();
    });

    // 窗口显示完成后创建列表组
    api.openFrame({
        name: 'UserInfo',
        url: './user_info.html',
        rect: {
            x: 0,
            y: $api.dom('header').offsetHeight + $api.dom('.user-header').offsetHeight,
        },
        bgColor : "#FFFFFF",
        bounces: true,
        pageParam : api.pageParam,
        vScrollBarEnabled : false,
        hScrollBarEnabled: false
    });
}
