define('app/jsp/user/qualification/baseinfo', function (require, exports, module) {
    'use strict';
    var $=require('jquery'),
    Widget = require('arale-widget/1.2.0/widget'),
    Dialog = require("artDialog/src/dialog"),
    Uploader = require('arale-upload/1.2.0/index'),
    AjaxController=require('opt-ajax/1.0.0/index');
    
    require("jsviews/jsrender.min");
    require("jsviews/jsviews.min");
    require("treegrid/js/jquery.treegrid.min");
    require("treegrid/js/jquery.cookie");
    require("app/jsp/user/qualification/ajaxfileupload");
    
    //实例化AJAX控制处理对象
    var ajaxController = new AjaxController();
    
    //定义页面组件类
    var QualificationPager = Widget.extend({
    	//属性，使用时由类的构造函数传入
    	attrs: {
    	},
    	Statics: {
    		DEFAULT_PAGE_SIZE: 5,
    		USER_LEFT_MNU_ID: "left_mnu_qualification_identify"
    	},
    	//事件代理
    	events: {
    		//key的格式: 事件+空格+对象选择器;value:事件方法
    		"blur [id='custName']":"_validateName",
    		"focus [id='custName']":"_showUserNameTip",
    		"blur [id='groupWebsite']":"_checkUrl",
    		"focus [id='certAddr']":"_showCertAddrTip",
    		"blur [id='certAddr']":"_checkCertAddr",
    		"blur [id='certNum']":"_checkCertNum",
    		"focus [id='certNum']":"_showCertNumTip",
    		"blur [id='contactMp']":"_checkPhone",
    		"focus [id='contactMp']":"_showCheckPhoneTip",
    		"blur [id='contactEmail']":"_checkEmailFormat",
    		"click [id='sendPhoneCode']":"_sendVerify",
    		"change [id='princeCode']":"_princeCodeChange",
    		"change [id='cityCode']":"_cityCodeChange",
    		"blur [id='contactName']":"_checkContactName",
    		"focus [id='contactName']":"_showContactNameTip",
    		"click [id='toSave']":"_submit"
        },
        init: function(){
        },
    	//重写父类
    	setup: function () {
    		QualificationPager.superclass.setup.call(this);
    		activeUserLeftMenu(QualificationPager.USER_LEFT_MNU_ID);
    	},
    	
    	_showUserNameTip:function(){
    		$("#custNameErrMsg").show();
    		$("#enterpriseErrMsgShow").show();
    		$('#custNameImage').attr('src',_base+'/resources/slpmall/images/icon-d.png');
    		$("#enterpriseErrMsgShow").text("4-60个字符，可用中英文、数字、“-”、”_”、“（）”及”( )”");
    	},
    	_showCertAddrTip:function(){
			$("#certAddrErrMsg").show();
			$("#certAddrText").text("5-120个字符");
    		$('#certAddrImage').attr('src',_base+'/resources/slpmall/images/icon-d.png');
		},
		_showCertNumTip:function(){
			$("#certNumErrMsg").show();
			$("#contactNameText").text('最多20个字符，允许使用英语字母（区分大小写）、数字及“-”');
    		$('#contactNameImage').attr('src',_base+'/resources/slpmall/images/icon-d.png');
		},
		_showContactNameTip:function(){
			$("#contactNameErrMsg").show();
			$("#certNumText").text('最多20个字符，允许使用英语字母（区分大小写）、数字及“-”');
    		$('#certNumImage').attr('src',_base+'/resources/slpmall/images/icon-d.png');
		},
    	_validateName:function(){
			var name = $("#custName").val();
			var reg = /^[\u4e00-\u9fa5a-zA-Z0-9\-\_\(\)\（\）]{4,60}$/;
    		if(name==""){
    			$("#custName").focus();
    			$('#enterpriseErrMsgShow').text("请输入名称");
    			$('#custNameImage').attr('src',_base+'/resources/slpmall/images/icon-a.png');
    			$("#custNameFlag").val("0");
    		}else{
    			if(name.match(reg)){
    				$("#custNameFlag").val("1");
    				
    				var	param={
    						custName:$("#custName").val()
        				   };
            		ajaxController.ajax({
        			        type: "post",
        			        processing: false,
        			        url: _base+"/user/verify/checkCustName",
        			        dataType: "json",
        			        data: param,
        			        message: "正在加载数据..",
        			        success: function (data) {
        			         if(data.responseHeader.resultCode=="100003"){
        			        	   $("#custNameErrMsg").show();
        			        	   $('#custNameImage').show();
        			        	   $('#enterpriseErrMsgShow').show();
        			        	   $('#custNameImage').attr('src',_base+'/resources/slpmall/images/icon-a.png');
        			        	   $('#enterpriseErrMsgShow').text("企业名称已注册");
        						   $('#custNameFlag').val("0");
        							return false;
        			        	}else if(data.responseHeader.resultCode=="000000"){
        			        		$("#custNameErrMsg").show();
        			        		$('#custNameImage').attr('src',_base+'/resources/slpmall/images/icon-b.png');
        			        		$('#enterpriseErrMsgShow').hide();
        			        		$('#errorUserNameFlag').val("1");
        							return true;
        			        	}
        			        	
        			        },
        			        error: function(XMLHttpRequest, textStatus, errorThrown) {
        						 alert(XMLHttpRequest.status);
        						 alert(XMLHttpRequest.readyState);
        						 alert(textStatus);
        						}
        			        
        			    }); 
    			}else{
    				$('#custNameErrMsg').show();
    				$("#enterpriseErrMsgShow").text('4-60个字符，可用中英文、数字、“-”、”_”、“（）”及”( )”');
    				$('#custNameImage').attr('src',_base+'/resources/slpmall/images/icon-a.png');
    				$("#custNameFlag").val("0");
    			}
    		}
		},
		_checkContactName:function(){
			var name = $("#contactName").val();
			var reg = /^[\u4e00-\u9fa5a-zA-Z]{4,24}$/;
    		if(name!=""){
    			if(name.match(reg)){
    				$('#contactNameErrMsg').show();
    				$('#contactNameText').hide();
    				$('#contactNameImage').attr('src',_base+'/resources/slpmall/images/icon-b.png');
    			}else{
    				$('#contactNameErrMsg').show();
    				$("#contactNameImage").show();
        			$('#contactNameText').text("4-24个字符，可用汉字或英语字母");
        			$('#contactNameImage').attr('src',_base+'/resources/slpmall/images/icon-a.png');
    			}
    		}else{
    				$('#contactNameErrMsg').hide();
    				$('#contactNameText').hide();
    				$('#contactNameImage').hide();
    		}
		},
		_checkUrl:function(){
			 var regExp = "^((https|http|ftp|rtsp|mms)?://)"
			        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
			        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
			        + "|" // 允许IP和DOMAIN（域名）
			        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
			        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
			        + "[a-z]{2,6})" // first level domain- .com or .museum
			        + "(:[0-9]{1,4})?" // 端口- :80
			        + "((/?)|" // a slash isn't required if there is no file name
			        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
		    var urlValue = $("#groupWebsite").val();
	        if (urlValue.match(regExp)){
	        	$("#groupWebsitErrMsg").show();
	        	$("#groupWebsiteText").hide();
	        	$('#groupWebsiteImage').attr('src',_base+'/resources/slpmall/images/icon-b.png');
				return true;
	        }else{
	        	$("#groupWebsitErrMsg").show();
	        	$("#groupWebsiteText").show();
	        	$('#groupWebsiteImage').attr('src',_base+'/resources/slpmall/images/icon-a.png');
	        	$("#groupWebsiteText").text("请输入正确的网址");
	        }
		},
		
		//街道地址校验
		_checkCertAddr:function(){
			var certAddr = $("#certAddr").val();
			if(certAddr==null||certAddr==""){
				$("#certAddrErrMsg").show();
				$("#certAddrImage").attr("src",_base+'/resources/slpmall/images/icon-a.png');
				$("#certAddrText").text("请输入街道地址");
				$("#certAddrFlag").val("0");
			}else{
				if(certAddr.length>=5&&certAddr.length<=120){
					$("#certAddrErrMsg").show();
					$("#certAddrImage").attr("src",_base+'/resources/slpmall/images/icon-b.png');
					$("#certAddrText").hide();
					$("#certAddrFlag").val("1");
				}else{
					$("#certAddrErrMsg").show();
					$("#certAddrText").show();
					$("#certAddrImage").attr("src",_base+'/resources/slpmall/images/icon-a.png');
					$("#certAddrText").text("5-120个字符");
					$("#certAddrFlag").val("0");
				}
			}
		},
		//营业执照注册号校验
		_checkCertNum:function(){
			var certNum = $("#certNum").val();
			if(certAddr==null||certAddr==""){
				$("#certNumErrMsg").show();
				$("#certNumImage").attr("src",_base+'/resources/slpmall/images/icon-a.png');
				$("#certNumText").text("请输入营业执照注册号");
				$("#certNumFlag").val("0");
				return false;
			}else{
				var reg = /^[\a-zA-Z0-9\-]{1,20}$/;
				if(certNum.match(reg)){
					$("#certNumErrMsg").show();
					$("#certNumImage").attr("src",_base+'/resources/slpmall/images/icon-b.png');
					$("#certNumText").hide();
					$("#certNumFlag").val("1");
				}else{
					$("#certNumErrMsg").show();
					$("#certNumText").show();
					$("#certNumImage").attr("src",_base+'/resources/slpmall/images/icon-a.png');
					$("#certAddrText").text("最多20个字符，允许使用英语字母（区分大小写）、数字及“-”");
					$("#certNumFlag").val("0");
				}
			}
		},
		_checkPhone: function(){
    		var phone = $('#contactMp').val();
    		if (phone==""){
    			$("#contactMpErrMsg").show();
    			$('#contactMpText').text("请输入手机号码");
    			$('#phoneImage').attr('src',_base+'/resources/slpmall/images/icon-a.png');
    			$("#contactMpFlag").val("0");
				return false;
			}else if( /^0?1[3|4|5|8][0-9]\d{8}$/.test(phone)){
				var	param={
    					userMp:$("#contactMp").val()
    				   };
        		ajaxController.ajax({
    			        type: "post",
    			        processing: false,
    			        url: _base+"/user/verify/checkPhone",
    			        dataType: "json",
    			        data: param,
    			        message: "正在加载数据..",
    			        success: function (data) {
    			         if(data.responseHeader.resultCode=="100005"){
    			        	    $("#contactMpErrMsg").show();
    			        	 	$("#contactMpImage").show();
    			        		$('#contactMpText').text("手机号码已注册");
    			        		$('#contactMpImage').attr('src',_base+'/resources/slpmall/images/icon-a.png');
    							$('#contactMpFlag').val("0");
    							return false;
    			        	}else if(data.responseHeader.resultCode=="000000"){
    			        		$("#contactMpErrMsg").show();
    			        		$("#contactMpText").hide();
    			        		$('#contactMpFlag').val("1");
    			        		$('#contactMpImage').attr('src',_base+'/resources/slpmall/images/icon-b.png');
    			        		return 1;
    			        	}
    			        	
    			        },
    			        error: function(XMLHttpRequest, textStatus, errorThrown) {
    						 alert(XMLHttpRequest.status);
    						 alert(XMLHttpRequest.readyState);
    						 alert(textStatus);
    						}
    			        
    			    }); 
			}else{
				$("#contactMpErrMsg").show();
				$("#contactMpText").show();
    			$('#contactMpText').text("请输入正确的号码");
    			$('#contactMpImage').attr('src',_base+'/resources/slpmall/images/icon-a.png');
				return false;
			}
    	},
    	//检查邮件格式
		_checkEmailFormat: function(){
			var email = jQuery.trim($("#contactEmail").val());
			if(email!=null&&email!=""){
				if(!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email)){
					$("#emailMsgError").show();
					$("#contactEmailText").show();
					$("#emailMsgImage").attr("src",_base+'/resources/slpmall/images/icon-a.png');
					return false;
				}else{
					$("#emailMsgError").show();
					$("#contactEmailText").hide();
					$("#emailMsgImage").attr("src",_base+'/resources/slpmall/images/icon-b.png');
				}
			}else{
				$("#emailMsgError").hide();
				$("#emailMsgImage").hide();
				$("#contactEmailText").hide();
			}
		},
		_sendVerify:function(){
			var _this = this;
			var flag = this._checkPhone();
			if(flag!=undefined){
				return;
			}
			$("#sendPhoneCode").attr("disabled", true);
			var	param={
					userMp:$("#contactMp").val()
				   };
			ajaxController.ajax({
				type : "POST",
				data : param,
				dataType: 'json',
				url :_base+"/user/verify/sendPhoneVerify",
				processing: true,
				message : "正在处理中，请稍候...",
				success : function(data) {
					var resultCode = data.responseHeader.resultCode;
					if(resultCode=="100000"){
						var url = data.data;
						window.location.href = _base+url;
					}else{
						if(resultCode=="000000"){
							var step = 59;
				            $('#sendPhoneCode').val('重新发送60');
				            $("#sendPhoneCode").attr("disabled", true);
				            var _res = setInterval(function(){
				                $("#sendPhoneCode").attr("disabled", true);//设置disabled属性
				                $('#sendPhoneCode').val(step+'s后重新发送');
				                step-=1;
				                if(step <= 0){
				                $("#sendPhoneCode").removeAttr("disabled"); //移除disabled属性
				                $('#sendPhoneCode').val('获取验证码');
				                clearInterval(_res);//清除setInterval
				                }
				            },1000);
						}else{
							$("#sendPhoneCode").removeAttr("disabled");
						}
						if(resultCode=="100002"){
							$("#phoneCodeErrMsg").show();
							$("#phoneCodeText").show();
							$("#phoneCodeImage").attr("src",_base+'/resources/slpmall/images/icon-a.png');
							$("#phoneCodeText").text(data.statusInfo);
			        	}else{
			        		$("#phoneCodeErrMsg").hide();
							$("#phoneCodeText").hide();
							$("#phoneCodeImage").attr("src",_base+'/resources/slpmall/images/icon-b.png');
			        	}
					}
				},
				failure : function(){
					$("#sendPhoneCode").removeAttr("disabled"); //移除disabled属性
				},
				error : function(){
					alert("网络连接超时!");
				}
			}); 
		},
		_princeCodeChange:function(){
			var princeCodeVal = $("#princeCode").val();
			ajaxController.ajax({
				type : "POST",
				data : {
					provinceCode:princeCodeVal
				},
				dataType: 'json',
				url :_base+"/user/qualification/getCityListByProviceCode",
				processing: true,
				message : "正在处理中，请稍候...",
				success : function(data) {
					$("#cityCode").html(data.data);
				}
			})
		},
		_cityCodeChange:function(){
			var cityCode = $("#cityCode").val();
			ajaxController.ajax({
				type : "POST",
				data : {
					countyCode:cityCode
				},
				dataType: 'json',
				url :_base+"/user/qualification/getStreetListByCountyCode",
				processing: true,
				message : "正在处理中，请稍候...",
				success : function(data) {
					$("#countryCode").html(data.data);
				}
			})
		},
		_submit:function(){
			var custNameFlag = $("#custNameFlag").val();
			var certAddrFlag = $("#certAddrFlag").val();
			var certNumFlag = $("#certNumFlag").val();
			var contactMpFlag = $("#contactMpFlag").val();
			var phoneCodeFlag = $("#phoneCodeFlag").val();
			//校验企业名称
			this._validateName();
			//校验注册地址
			var princeCode = $("#princeCode").val();
			var cityCode = $("#cityCode").val();
			var countryCode = $("#countryCode").val();
			if(princeCode=="0"||princeCode==null||cityCode=="0"||cityCode==null||countryCode=="0"||countryCode==null){
				$("#registerAddrErrMsg").show();
			}else{
				$("#registerAddrErrMsg").hide();
			}
			//校验街道地址
			this._checkCertAddr();
			//校验注册号
			this._checkCertNum();
			//检查手机号
			this._checkPhone();
			//校验行业
			var industery = $("#groupIndustery").val();
			if(industery=="0"||industery==null){
				$("#groupIndusteryFlag").val("0");
				$("#groupIndusteryErrMsg").show();
			}else{
				$("#groupIndusteryFlag").val("1");
				$("#groupIndusteryErrMsg").hide();
			}
			//校验公司人数
			var groupMemberScale = $("#groupMemberScale").val();
			if(groupMemberScale=="0"||groupMemberScale==null){
				$("#groupMemberScaleFlag").val("0");
				$("#groupMemberScaleErrMsg").show();
			}else{
				$("#groupMemberScaleFlag").val("1");
				$("#groupMemberScaleErrMsg").hide();
			}
			//校验公司性质
			var groupStype = $("#groupStype").val();
			if(groupStype=="0"||groupStype==null){
				$("#groupStypeFlag").val("0");
				$("#groupStypeErrMsg").show();
			}else{
				$("#groupStypeFlag").val("1");
				$("#groupStypeErrMsg").hide();
			}
			//校验所属部门
			var contactDept = $("#contactDept").val();
			if(contactDept=="0"||contactDept==null){
				$("#contactDeptFlag").val("0");
				$("#contactDeptErrMsg").show();
			}else{
				$("#contactDeptFlag").val("1");
				$("#contactDeptErrMsg").hide();
			}
			var groupIndusteryFlag = $("#groupIndusteryFlag").val();
			var groupMemberScaleFlag = $("#groupMemberScaleFlag").val();
			var groupStypeFlag = $("#groupStypeFlag").val();
			var contactDeptFlag = $("#contactDeptFlag").val();
			
		/*	if(custNameFlag!="0"&&certAddrFlag!="0"&&certNumFlag!="0"&&contactMpFlag!="0"&&phoneCodeFlag!="0"&&groupIndusteryFlag!="0"&&groupMemberScaleFlag!="0"&&groupStypeFlag!="0"&&contactDeptFlag!="0"){
		 
			}*/
			$('#qualificationEnterprise').submit();
			alert(1);
	}
    });
    
    module.exports = QualificationPager
});


function uploadImg(imageId) {
	if(document.getElementById(imageId).value!=""){
	 $.ajaxFileUpload({  
         url:_base+"/user/qualification/uploadImg",  
         secureuri:false,  
         fileElementId:imageId,//file标签的id  
         dataType: "json",//返回数据的类型  
         //data:{imageId:imageId},//一同上传的数据  
         success: function (data, status) {
        	if(data.isTrue==true){
        		document.getElementById("image").src=data.url;
        		$("#idpsId").val(data.idpsId);
        	 }
         },  
         error: function (data, status, e) {  
             alert(e);  
         }  
     });  
	}
}

	function deleteImg(imageId){
		var ipdsId = $("#ipdsId").val();
		if(document.getElementById(imageId).value!=""){
		$.ajax({
	        type: "post",
	        processing: false,
	        url: _base+"/user/qualification/deleteImg",
	        dataType: "json",
	        data: {"ipdsId":ipdsId},
	        message: "正在加载数据..",
	        success: function (data) {
	        	if(data.isTrue==true){
	        		var url = getRealPath();
	        		document.getElementById("image").src=url+'/resources/slpmall/images/fom-t.png';
	        		var obj = document.getElementById(imageId);
	        		obj.outerHTML=obj.outerHTML; 
	        		$("#ipdsId").val("");
	        	}
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown) {
				 alert(XMLHttpRequest.status);
				 alert(XMLHttpRequest.readyState);
				 alert(textStatus);
				}
			    }); 
		}
	}
	
	//获取当前项目根路径
	function getRealPath(){
		  //获取当前网址，如： http://localhost:8083/myproj/view/my.jsp
		   var curWwwPath=window.document.location.href;
		   //获取主机地址之后的目录，如： myproj/view/my.jsp
		  var pathName=window.document.location.pathname;
		  var pos=curWwwPath.indexOf(pathName);
		  //获取主机地址，如： http://localhost:8083
		  var localhostPaht=curWwwPath.substring(0,pos);
		  //获取带"/"的项目名，如：/myproj
		  var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
		 
		 //得到了 http://localhost:8083/myproj
		  var realPath=localhostPaht+projectName;
		  return realPath;
		}

