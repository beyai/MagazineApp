window.apiready = function(){
    // 状态栏
    $api.fixStatusBar( $api.dom('header') );
    // 关闭窗口
    $("#CloseWin").tap(function(){
        api.closeWin();
    })

    // 夜间模式
    var theme = +( api.getPrefs({sync:true, key : "theme"}) );

    if (theme) {
        $("#theme").prop("checked", true )
    }
    // 修改夜间模式
    $("#theme").change(function(el){
        var value = $(this).prop("checked");
        value = value ? 1 : 0;
        api.setPrefs({
            key : "theme" ,
            value : value
        });
    })


}
