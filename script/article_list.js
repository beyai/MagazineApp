window.apiready = function(){
    // 传递过来的参数
   	var pageParam = api.pageParam;
    var theme = +( api.getPrefs({sync:true, key : "theme"}) );
    
    // 读取导航分类
    var listData = api.readFile({
        sync : true,
    	path : "fs://" + [ CACHEDIR , "magazine"+ pageParam.magazineid , "itarticlelist" , "itarticlelist"+ pageParam.id +".txt" ].join("/")
    });

	if (listData!="") {
	 	var data = JSON.parse(listData),
	 		dataList = [];
        var fsDir = api.fsDir;

	 	for (var i = 0; i < data.length; i++) {
	 		var item = data[i];
            item.img = (item.img!="") ? [ fsDir , CACHEDIR , item.img ].join("/") : false;
	 		dataList.push(item);
	 	}

	 	// 生成HTML
		var html = template('ArticleItem', {
			list : dataList
		});
		$(".ArticleList").html(html).css({ "opacity" : 1 });
    } else {
        return;
    }

    // 文章点击
    $(document).on('tap',".ArticleList-item",function(el){
        var $el = $(this),
            data = $el.data();
        // 打开窗口
        api.openWin({
            name: 'Article',
            url: './article.html',
            bgColor : theme ? "#333333" : "#F3F3F3",
            vScrollBarEnabled : false,
            hScrollBarEnabled : false,
            bounces : false,
            pageParam: {
                id: data.id,
                color : pageParam.color,
                magazineid : pageParam.magazineid
            },
            animation : ANIMATION(),
            delay : 150,
        });
    })
}
