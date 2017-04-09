window.apiready = function(){
    // 状态栏
    $api.fixStatusBar( $api.dom('header') );
}

$(function(){

	// https://github.com/hongymagic/jQuery.serializeObject
	$.fn.serializeObject = function () {
	    "use strict";
	    var a = {}, b = function (b, c) {
	        var d = a[c.name];
	        "undefined" != typeof d && d !== null ? $.isArray(d) ? d.push(c.value) : a[c.name] = [d, c.value] : a[c.name] = c.value
	    };
	    return $.each(this.serializeArray(), b), a
	};

	var username = "",
    	pwd 	= "",
    	$btn = $("#Submit"),
    	$username = $("[name='username']"),
    	$pwd = $("[name='pwd']");

	// 关闭窗口
    $("#CloseWin").tap(function(){
		api.closeWin();
    })

	// 监听用户名输入状态，更新按键样式
	var changeBtn = function(){
		if (username!="" && pwd!="") {
			$btn.addClass('action');
		} else {
			$btn.removeClass('action');
		}
	}

	$username.on("keydown",function(){
		var $el = $(this);
		username = $.trim($el.val());
		changeBtn();
	});

	$pwd.on("keydown",function(){
		var $el = $(this);
		pwd = $.trim($el.val());
		changeBtn();
	});

	// 提交
	$("#FORM").submit(function(){
		var data = $("#FORM").serializeObject();
		if (data.username=="" || data.pwd=="" || !$btn.hasClass("action") ) {
			return false;
		}
		// 邮箱验证
		if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(data.username)) {
			Helper.tips("账号格式不正确！")
			return false;
		}

		// 密码验证
		if ( data.pwd.length < 6 ){
			Helper.tips("密码最少 6 位！")
			return false;
		}



		Helper.userLogin( data ,function(ret , err){
			// 操作提示
			if (ret.code!="1") {
				return Helper.tips(ret.status);
			}
			api.closeWin();
		});

	})
})


