var navData = null,
    socllNavEvent = null;

// 滚动菜单
var scrollNav = function(){
	this.index = 0;
	// 初始化滚动
	this.iScroll = new iScroll( $(".ui-nav-wrap")[0] , {
        hScroll: true,
        vScroll: false,
        hScrollbar: false,
        vScrollbar: false
    })
    return this;
};

// 切换到某个tab
scrollNav.prototype.switchTo = function( index ) {
	var self = this;
	var $list = $(".ui-nav-list").children();
	$list.eq(index).addClass("action").siblings().removeClass("action");
	self.scrollTo(index);
}

// 滚动动当前Tab的位置
scrollNav.prototype.scrollTo = function(index){
	var self = this;
	var dir  = index > self.index,
		$action = $(".ui-nav-list").children(".action"),
		target = $action[ dir ? 'next' : 'prev' ](),
		offset = target.offset() || $action.offset(),
		within =  $(".ui-nav-wrap").offset(),
		listOffset;

	if ( dir ? offset.left + offset.width > within.left + within.width : offset.left < within.left ) {
        listOffset = $(".ui-nav-list").offset();
        self.iScroll.scrollTo(dir ? within.width - offset.left + listOffset.left - offset.width : listOffset.left - offset.left, 0, 400 );
    }
    self.index = index;
}


var showList = function(){
	// 初始化滚动
	var socllNavEvent = new scrollNav();
	// 遍历列表组参数
	var frames = [];

	_.each(navData.datalist , function(item){
		frames.push({
			name: 'colum' + item.id,
	        url: 'list.html',
	        bgColor: '#FFFFFF',
	        vScrollBarEnabled : false,
	        hScrollBarEnabled : false,
	        pageParam : {
	        	id : item.id,
	        	color : item.color,
	        	magazineid : item.magazineid
	        },
	        animation : {
                type : "fade"
            },
		})
	})

	// 窗口显示完成后创建列表组
	// api.addEventListener({
	// 	name : "viewappear"
	// }, function() {
		api.openFrameGroup({
		    name: 'BookListGroup',
		    frames: frames,
		    background: '#FFFFFF',
		    scrollEnabled: true,
		    preload : 0,
		    index: 0,
		    rect: {
		        x: 0,
		        y: $("header").height() + $("nav").height(),
		    },
		}, function(ret, err) {
		    var index = ret.index;
			socllNavEvent.switchTo(index);
		});
	// });

	// 绑定导航点击事件
	$(".ui-nav-list li").click( function(event){
		event.preventDefault();
		var $that = $(event.currentTarget),
			index = $that.index();
		socllNavEvent.switchTo(index);
		// 滚动列表
		api.setFrameGroupIndex({
		    name: 'BookListGroup',
		    index: index
		});
	});
}

// 关闭窗口
$("#CloseWin").tap(function(){
	api.closeWin();
})


window.apiready = function(){
	// 状态栏
    $api.fixStatusBar( $api.dom('header') );

    // 传递过来的参数
   	var pageParam = api.pageParam;
    // 设置当前期数编号
    $("#BookNum").html(pageParam.number);

    // 读取导航分类
    var Data = api.readFile({
    	sync : true,
    	path : "fs://" + [ CACHEDIR , "magazine" + pageParam.id , "column" , "column1.txt" ].join("/")
    })

    if (Data!="") {
	 	navData = JSON.parse(Data);
	 	// 生成HTML
		var html = template('NavItem', navData );
		$(".ui-nav-list").html(html);
		showList();
    }

}