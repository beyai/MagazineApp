// 数据
var Years = [],
	Magazines = [],
	isLoaded = false,
	isDownload = false;

// 加载数据
var getData = function(fn){
	fn = fn || (function(){});
	if (isLoaded) return;
	isLoaded = true;
	var year = Years.pop();
	// 加载提示
	var $loadingDom = $("#Loading");
	$loadingDom.show();

	// 加载默认数据
	Helper.get({
		m : "magazine",
		a : "datalist",
		year : year
	} , function( ret , err ){
		// 隐藏加载提示
		$loadingDom.hide();
		isLoaded = false;
		// 载失败
		if (err) {
			Years.push(year);
			return Helper.tips(err.msg)
		} else if ( !ret.status ){
			Years.push(year);
			return Helper.tips(ret.msg)
		} else if ( ret.data.length===0 ) {
			return;
		}

		// 遍历杂志是否已下载
		var data = _.map( ret.data , function(item){
			item.isDown = _.indexOf( Magazines , item.id ) >= 0 ? true : false;
			return item;
		})

		// 生成列表 HTML
		var html = template('bookGroup', { data : data, year : year });
		$('#BookWrap').append(html);

		// 图片延时加载
		echo.init({
		    offset: 100,
		    throttle: 250,
		    callback: function (element, op , src) {
		    	$(element).css({
		    		"background-image" : 'url('+ src +')',
		    		"opacity" : 1
		    	})
		    }
		});
	})

}

// 下载文件
var downFile = function( $el , data ){
	// 加载模块
	var zip = api.require('zip'),
		fs 	= api.require('fs');
	// 开始下载
	var savePath = "fs://" + [ CACHEDIR, data.id +".zip"].join("/");
	isDownload = true;
	api.download({
		url : data.zip,
		savePath : savePath,
		report : true,
		cache : false,
		allowResume : true
	}, function(ret , err){

		if (!ret || err ) {
			isDownload = false;
			return false;
		}
		// 下载进度
		if ( ret.state === 0) {
			$el.css({
				height : 100 - ret.percent+"%"
			})
		}
		// 下载成功
		else if ( ret.state === 1 ){
			zip.unarchive({
			    file: savePath
			}, function(ret, err) {
				// 解压成功
			    if (ret.status) {
					Helper.tips("第 "+ data.number +" 期下载成功！");
			    	$el.hide();
			    	$("#magazine"+data.id).addClass("action");
			    } else {
			    	Helper.tips("第"+ data.number +" 期下载失败！");
					$el.css({ height : "100%" })
			    }
			    // 删除下载包
			    fs.remove({ path : savePath })
				isDownload = false;
			});
		} 
		// 下载失败
		else {
			Helper.tips("第 "+ data.number +" 期下载失败！");
			$el.css({ height : "100%" })
			isDownload = false;
		}
	})
}


window.apiready = function(){

	
		userInfo = api.getPrefs({ sync : true , key : "user" });

	// 监听全局登录事件
    api.addEventListener({
        name: 'Login'
    }, function(ret, err) {
        userInfo = ret.value;
    });

	// 监听全局退出事件
    api.addEventListener({
        name: 'Logout'
    }, function(ret, err) {
        userInfo = "";
    });

	try {
		userInfo = JSON.parse(userInfo)
	}catch(err){
		userInfo = "";
	}


	// 读取所有已下载的杂志
	Helper.getDown(function(ret , err){
		if (ret.status && ret.data ) {
			_.each( ret.data , function(value){
				if (/^magazine/.test(value)) Magazines.push( /\d{1,1000}$/.exec(value)[0] );
			})
		}
	})

	// 自动登录
	Helper.userLogin(userInfo);

	// 加载年份
	Helper.get({
		m: 'magazine',
	    a : "yearlist",	
	}, function(ret , err){
		// 加载失败
		if (err) {
			return Helper.tips(err.msg)
		} else if ( !ret.status ){
			return Helper.tips(ret.msg)
		} else if (ret.data.length===0) {
			return Helper.tips("无法获取年份分类数据！")
		}
		Years = ret.data;
		// 加载默认数据
		getData();
	})

	// 上拉加载
	api.addEventListener({
        name:"scrolltobottom",
        extra : {
        	threshold : -60
        }
    },function(ret,err){
    	// 没有年份时，取消事件绑定 , 否则加载数据
    	_.isEmpty(Years) ?   api.removeEventListener({ name:"scrolltobottom" }) : getData();
    });

	// 杂志点击事件
	$(document).on("tap",".BookList-item", function(el){

		var $el = $(this),
			$down = $(".BookList-item-down",this),
			data = $el.data();


		if ($el.hasClass("action")) { 
			Helper.openWin("./book.html" , data); // 查看杂志
		} else { // 下载杂志

			// 未登录
			if (!userInfo || typeof userInfo!="object" ) {
				return Helper.showLogin("./login.html");
			} else if (isDownload) {
				return Helper.tips("有未完成的下载！")
			};

			// 判断用户是否有下载权限
			Helper.post({
				m : "magazine",
				a : "getzip",
				mid : data.id,
				uid : userInfo.uid
			}, function( ret, err ){
				if (err) {
					return Helper.tips(err.msg)
				} else if ( ret.status!==2 ){
					return Helper.tips( ret.msg )
				}
				// 下载地址
				data.zip = ret.data;
				// 检查网络
			    var connectionType = $.trim(api.connectionType);
			    // 非wifi网络下给出提示
		    	if ( connectionType==="none" ) {
		    		Helper.tips("您没有连接到网络！")
		    	} else if ( connectionType!="wifi" ) {
					api.confirm({
					    title: '提示',
					    msg: '是否使用 ' + connectionType.toUpperCase() + " 网络下载？" ,
					    buttons: ['确定', '取消']
					}, function(ret, err) {
					    if (ret.buttonIndex===1)  downFile( $down , data );
					});
				} else {
					downFile( $down , data )
				}
			})
		}
	})

	// 监听杂志删除
    api.addEventListener({
        name : "removeBook"
    }, function( ret ) {
    	if (ret.value=="") return;
        var value = ret.value.split(",");
        _.each( value , function(id){
        	var $el = $("#magazine"+id);
        	$el.removeClass('action');
        	$(".BookList-item-down",$el).show().css({ height : "100%" });
       		Magazines = _.without( Magazines , id );
        })
    });

}