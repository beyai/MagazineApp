window.apiready = function(){
    // 获取收藏数据
    Helper.getFav(function(ret,err){
        var favData = 0;
        if (ret.value!="") {
            _.each( JSON.parse(ret.value) , function(value){
                if (/^magazine/.test(value)) favData++;
            })
        }
        $("#Fav").html(favData);
    });

    // 获取下载的数据
    Helper.getDown(function(ret,err){
        var downCount = 0;
        if (ret.status) {
            downCount = ret.data.length;
        }
        $("#Down").html(downCount);
    });
    
    // 打开窗口
    $(".ui-list-item").tap(function(){
        var page = $(this).data("page");
        Helper.openWin(page);
    })
    
    // 监听杂志删除
    api.addEventListener({
        name : "removeBook"
    }, function( ret ) {
        if (ret.value=="") return;
        var $down = $("#Down");
        var value = ret.value.split(",");
        $down.html( +($("#Down").text()) - value.length );
    });

}
