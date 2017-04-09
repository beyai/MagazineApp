window.apiready = function(){
     // 传递过来的参数
    var pageParam = api.pageParam;
    // 状态栏
    $api.fixStatusBar( $api.dom('header') );
    // 关闭窗口
    $("#CloseWin").tap(function(){
        api.closeWin();
    })

    // 切换成编辑状态
    $("#EditBtn").tap(function(){
        var $el = $(this);
        if ($el.hasClass("action")) {
            $el.text("编辑").removeClass('action')
            // 发送确定事件
            api.sendEvent({ name: 'editDown' , extra : "done"});
        } else {
            $el.text("删除").addClass('action')
            // 发送编辑事件
            api.sendEvent({ name: 'editDown' , extra : "edit" });
        }
    })

    // 窗口显示完成后创建列表组
    // api.addEventListener({
    //     name : "viewappear"
    // }, function() {
        api.openFrame({
            name: 'DownList',
            url: './user_down_list.html',
            vScrollBarEnabled : false,
            hScrollBarEnabled : false,
            rect: {
                x: 0,
                y: $api.dom('header').offsetHeight,
            },
            bgColor : "#FFFFFF",
            bounces: true,
        });
    // })

}
