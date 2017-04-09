window.apiready = function(){
   // 改变状态栏样式
    api.setStatusBarStyle({ style: 'light' });
    $api.fixStatusBar( $api.dom('header') );

    // 创建子窗口
    api.openFrame({
        name: 'BookList',
        url: './html/main.html',
        rect: {
            x: 0,
            y: $api.dom('header').offsetHeight,
        },
        bgColor : "#F3F3F3",
        bounces: true,
        vScrollBarEnabled : false,
        hScrollBarEnabled: false
    });

    // 进入用户界面
    $("#Login").tap(function(){
        Helper.openWin("./html/user.html")
    })



    // 监听网络状态
    api.addEventListener({
        name:'online'
    }, function(ret, err){        
       Helper.tips("网络已恢复!")
    });

    api.addEventListener({
        name:'offline'
    }, function(ret, err){        
       Helper.tips("网络已断开！")
    });
}