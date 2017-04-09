window.apiready = function(){
    // 传递过来的参数
   	var pageParam = api.pageParam;
    var theme = +( api.getPrefs({sync:true, key : "theme"}) );
    
    // 读取文章内容
    var data  = api.readFile({
        sync : true,
    	path : "fs://" + [ CACHEDIR , "magazine" + pageParam.magazineid , "itarticle" , "itarticle"+ pageParam.id +".txt" ].join("/")
    })

    if (data!="") {
        data = JSON.parse(data)[0];
        if (data.img!="") {
            var fsDir = api.fsDir;
            data.img = [ fsDir , CACHEDIR , data.img ].join("/");
        };
        // 生成HTML
        var html = template('Article', data );
        $(".ArticleWrap").html( html );

        // 设置标题栏颜色
        $(".ArticleWrap-header").css({
            "background-color" : theme ? "#333" : pageParam.color
        })

        $("body").css({
            "background-color" : theme ? "#333" : "#FFF",
            "color" :  theme ? "#EEE" : "#333"
        })
      
    }
}
