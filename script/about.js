window.apiready = function(){
    $api.fixStatusBar( $api.dom('header') );

    // 关闭窗口
    $("#CloseWin").tap(function(){
        api.closeWin();
    })
    api.openFrame({
        name: 'AboutContent',
        url: './about_content.html',
        rect: {
            x: 0,
            y: $api.dom('header').offsetHeight,
        },
        bgColor : "#F3F3F3",
        bounces: true,
        vScrollBarEnabled : false,
        hScrollBarEnabled: false
    });
}
