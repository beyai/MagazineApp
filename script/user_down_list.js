window.apiready = function(){
    var BookList = [];
    var fs = api.require("fs");
    // 渲染列表
    var RenderList = function(isEdit){
        // 生成HTML
        var html = template( 'BookItem', { list : BookList, isEdit : isEdit });
        $("body").html(html);
        api.parseTapmode();
    }

    // 循环读取已下载的杂志内容
    var readBook = function( dir ){
        var fsDir = api.fsDir;
        // 读取文件内容
        for (var i = 0; i < dir.length; i++) {
            var magazine = dir[i],
                data = api.readFile({
                    sync : true,
                    path : "fs://" + [ CACHEDIR , magazine , "magazine.txt" ].join("/")
                })
            if ( data && data!="") {
                var data = JSON.parse(data)[0];
                data.img = [ fsDir , CACHEDIR , data.img ].join("/");
                BookList.push(data);
            }
        }

        // 按杂志编号排序
        BookList = _.sortBy(BookList, function( item ){
            return -Number(item.id)
        })
        // 渲染列表
        RenderList();
    }

    // 绑定查看杂志
    $(document).on('tap',".ui-list-item",function(el){
        var $el = $(this);
        var data = $el.data();
        // 打开窗口
        Helper.openWin('./book.html', data );
    })



    // 获取所有已下载的杂志
    Helper.getDown(function(ret,err){
        if (ret.status) {
            readBook(ret.data)
        } else {

        }
    });

    // 选择要删除的杂志
    $(document).on('tap',".ui-list-item-edit,input[type='checkbox']",function(el){
        el.preventDefault();
        var $input = $("input",this)
            value = $input.prop("checked");
        if (value) {
            $input.prop("checked",false)
        } else {
            $input.prop("checked",true)
        }
    })

    // 监听视图切换
    api.addEventListener({
        name : "editDown"
    }, function( ret ) {
        if (ret.value==="edit") {
            RenderList(true);
        } else {
            // 取出所有已选择的杂志
            var checked = [];
            $("input:checked").each(function(){
                checked.push($(this).val());
            })
            // 操作提示
            if (checked.length > 0) {
                api.confirm({
                    title: '提示',
                    msg: '真的要删除?' ,
                    buttons: ['确定', '取消']
                }, function(ret, err) {
                    if (ret.buttonIndex===1) {
                        // 从数据中删除已选
                        var tmpList = _.omit( _.indexBy( BookList , "id" ) , checked );
                        // 按杂志编号排序
                        BookList = _.sortBy( _.values(tmpList), function( item ){
                            return -Number(item.id)
                        })
                        // 全局删除事件
                        api.sendEvent({ name: 'removeBook' , extra : checked.join(",") });
                        // 删除本地缓存
                        checked.forEach(function(id){
                            fs.rmdir({
                                path : "fs://" + [CACHEDIR , "magazine"+id ].join("/")
                            })
                        })
                    } 
                    RenderList();
                });
            } else {
                // 重新渲染列表
                RenderList();
            }

            
        }
    });

}
