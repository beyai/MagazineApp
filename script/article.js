window.apiready = function(){
    // 传递过来的参数
   	var pageParam = api.pageParam;
    var theme = +( api.getPrefs({sync:true, key : "theme"}) );

    $("header").css({
        "background-color" : theme ? "#333333" : pageParam.color
    })
    // 状态栏
    $api.fixStatusBar( $api.dom('header') );

    // 关闭窗口
    $("#CloseWin").tap(function(){
        api.closeWin();
    })

    // 窗口显示完成后创建列表组
    // api.addEventListener({
    //     name : "viewappear"
    // }, function() {
        api.openFrame({
            name: 'Content',
            url: 'content.html',
            rect: {
                x: 0,
                y: $api.dom('header').offsetHeight,
            },
            bgColor : theme ? "#333333" : "#F3F3F3",
            bounces: false,
            pageParam : api.pageParam,
            vScrollBarEnabled : false,
            hScrollBarEnabled: false,
            animation : {
                type : "fade"
            },
        });
    // });
}
