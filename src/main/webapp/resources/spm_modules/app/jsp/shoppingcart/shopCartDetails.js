define('app/jsp/shoppingcart/shopCartDetails', function (require, exports, module) {
    'use strict';
    var $=require('jquery'),
    Widget = require('arale-widget/1.2.0/widget'),
    Dialog = require("artDialog/src/dialog"),
    Paging = require('paging/0.0.1/paging-debug'),
    AjaxController = require('opt-ajax/1.0.0/index');
    require("jsviews/jsrender.min");
    require("jsviews/jsviews.min");
    require("bootstrap-paginator/bootstrap-paginator.min");
    require("app/util/jsviews-ext");
    
    require("opt-paging/aiopt.pagination");
    require("twbs-pagination/jquery.twbsPagination.min");
    var SendMessageUtil = require("app/util/sendMessage");
    
    // 实例化AJAX控制处理对象
    var ajaxController = new AjaxController();
    // 定义页面组件类
    var shopCartDetailsPager = Widget.extend({
    	
    	Implements:SendMessageUtil,
    	// 属性，使用时由类的构造函数传入
    	attrs: {
    	},
    	Statics: {
    	},
    	// 事件代理
    	events: {
            // 全选
    		"click input[name='checkOne']":"_checkOne",
    		"click #deleteSelectProd":"_delSelectProd",
        },
    	// 重写父类
    	setup: function () {
    		shopCartDetailsPager.superclass.setup.call(this);
    		this._renderCartProdTemple();
    	},
    	// 渲染商品信息
    	_renderCartProdTemple:function(){
    		var template = $.templates("#cartProdTemple");
			var htmlOutput = template.render(cartProdList);
			$("#cartProdData").html(htmlOutput);
    	},
    	// 修改数量
    	_changeProdNum:function(prodId,prodNum,salePrice,stockNum){
    		// 获取当前商品数量
			var proNum = $("#"+prodId+"_prodnum");
    		var oldNum = parseInt(proNum.val());
    		// 获取保存数量隐藏域
    		var oldProdNum = $("#"+prodId+"_oldProdNum").val();
    		// 判断数量
    		if(prodNum==-1 && oldNum<=1){
    			//如果是减不能小于1
    			return;
    		}
    		if(prodNum==-1 && oldNum>=stockNum){
    			//如果大于库存量则改为当前库存量
    			oldNum = stockNum;
    			return;
    		}
    		alert(skuNumLimit);
    		if(prodNum==1 && (oldNum>=skuNumLimit || oldNum>=stockNum)){
    			return;
    		}
    		// 重新赋值
    		oldNum+=prodNum;
			proNum.val(oldNum);
    		// 调用后场修改数量
    		this._changeCartNum(prodId,oldNum,oldProdNum);
    		// 计算价格并求和
    		this._computedPrice(prodId,oldNum,salePrice);
    		// 求和
    		this._sumPriceAndNum();
    	},
    	//计算价格
    	_computedPrice:function(prodId,num,salePrice){
    		// 计算金额
    		var moneyLi = this._productNum(salePrice,num);
    		// 获取金额元素转成元
    		var money = this._liToYuan(moneyLi);
    		// 改变金额小计
    		var td = $("#"+prodId+"_prodPriceSubtotal");
    		td.text("¥"+money);
    	},
    	 // 修改数量
        _modifyCartProdQty:function(prodId,btn,salePrice,stockNum){
        	// 获取保存数量隐藏域
    		var oldProdNum = $("#"+prodId+"_oldProdNum").val();
    		// 获取修改后的值
        	var qty = parseInt(btn.value);
        	if(!this._isPosNum(qty)){
				qty = oldProdNum;
        	}
        	if(qty>=skuNumLimit || qty>=stockNum){
        		$("#"+prodId+"_prodnum").val(oldProdNum);
    			return;
    		}
			btn.value=qty;
			//调用后场修改数量
    		this._changeCartNum(prodId,qty,oldProdNum);
			this._computedPrice(prodId,qty,salePrice);
			// 求和
    		this._sumPriceAndNum();
        },
        // 是否为正整数
        _isPosNum:function(num){
        	var re = /^[1-9][0-9]*$/ ; 
        	return re.test(num) ;
        },
        // 格式化金额
    	_fmoneyOf2:function (s, n) {
    		n = n > 0 && n <= 20 ? n : 2;
    		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    		var l = s.split(".")[0].split("").reverse(),
    		r = s.split(".")[1];
    		t = "";
    		for(i = 0; i < l.length; i ++ ){   
    			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    		}
    		return t.split("").reverse().join("") + "." + r;
    	},
    	// 删除商品单个
    	_delCartProd:function(prodId){
    		//移除当前商品列表
    		$("#"+prodId+"_tr").remove();
    		var prodIdList = new Array();
    		prodIdList.push(prodId);
    		// 获取ID调用AJAX删除商品服务
    		this._delPitchOnProd(prodIdList);
    		// 求和
    		this._sumPriceAndNum();
    	},
    	// 删除商品多个
    	_delSelectProd:function(){
    		var prodIdList = new Array();
    		//移除选中商品列表
    		$("input[name='checkOne']").each(function(i){  
			    var isCheck = $(this).prop("checked");
			    if('checked' == isCheck || isCheck){
			        //若被选中则获取ID并添加到list集合
			    	var id = $(this).prop("id");
			    	prodIdList.push(id);
			    	//移除当前商品列表
		    		$("#"+id+"_tr").remove();
			    }
			});
    		//若没有选中的则不往下进行
    		if(prodIdList.length<=0){
    			return;
    		}
    		// 获取ID调用AJAX删除商品服务
    		this._delPitchOnProd(prodIdList);
    		// 求和
    		this._sumPriceAndNum();
    	},
    	// 删除和删除选中
    	_delPitchOnProd:function(prodIdList){
			var prodIds = JSON.stringify(prodIdList);
    		//如果点击的是删除
    		ajaxController.ajax({
				type: "post",
				dataType: "json",
				processing: false,
				// message: "删除中，请等待...",
				url: _base+"/shopcart/deleteProd",
				data:{"skuList":prodIds},
				success: function(data){
					if("0"===data.statusCode){
						var d = Dialog({
							content:"修改失败",
							ok:function(){
								this.close();
							}
						});
						d.show();
					}
				}
			});
    	},
    	//求和-包括商品总量\已选商品量\商品价格
    	_sumPriceAndNum: function(){
			//已选商品总价
    		var prodTotal = 0;
			//选中商品总数量
    		var prodNum = 0;
			//购物中所有商品总数量
    		var allProdNum = 0;
    		//循环计算已选商品量/商品价格
    		$("input[name='checkOne']").each(function(i){  
			    var isCheck = $(this).prop("checked");
			    if('checked' == isCheck || isCheck){
			        //获取ID并添加到list集合
			        var id = $(this).prop("id");
					var prodPrice = $("#"+id+"_prodPriceSubtotal").text().replace("¥", "");
			        var price = parseFloat(prodPrice);
			        //计算价格
			        prodTotal += price;
			        var num = parseInt($("#"+id+"_prodnum").val());
			        //计算购买商品量
			        prodNum += num;
			        //计算总量
			        allProdNum += num;
			    }else{
			    	var id = $(this).prop("id");
			        var num = parseInt($("#"+id+"_prodnum").val());
			        //计算总量
			        allProdNum += num;
			    }
			});
    		$("#cartProdTotal").html(prodTotal);
    		$("#checkProductNum").html(prodNum);
    		//商品总量
    		$("input[name='outOfStockProd']").each(function(i){  
		        //获取ID并添加到list集合
		        var id = $(this).prop("id");
		        var num = parseInt($("#"+id+"_prodnum").val());
		        //计算总量
		        allProdNum += num;
			});
    		$("#allProductNum").html("("+allProdNum+")");
    	},
    	//金额转换（元->厘）
    	_yuanToLi: function(yuan){
    		 var result = '0';
    		 if(isNaN(yuan) || !yuan){
    			 return result;
    		 }
    		 return yuan*1000;
    	},
    	//金额转换（厘->元）
    	_liToYuan:function(li){
    		var result = '0.00';
    		if(isNaN(li) || !li){
    			return result;
    		}
            return this._fmoneyOf2(parseInt(li)/1000, 2);
    	},
    	
    	// 精确计算两数乘积
    	_productNum:function(arg1, arg2) {
    	    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    	    try {
    	        m += s1.split(".")[1].length;
    	    }
    	    catch (e) {
    	    }
    	    try {
    	        m += s2.split(".")[1].length;
    	    }
    	    catch (e) {
    	    }
    	    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    	},
    	
    	// 全选
    	_checkAll:function(btn){
    		if(btn.checked){
    		  $("input[name='checkAll']").prop("checked",true);
    		  $("input[name='checkOne']").prop("checked",true);
    		}else{
    		  $("input[name='checkAll']").prop("checked",false);
    		  $("input[name='checkOne']").prop("checked",false);
    		}
    		//求和
    		this._sumPriceAndNum();
    	},
    	//单个选中或取消
    	_checkOne:function(){
    		$("input[name='checkOne']").each(function(i){  
    			var count = 0;
			    var isCheck = $(this).prop("checked");
			    if('checked' == isCheck || isCheck){
			    	count++;
			    	if(i==count){
			    		$("input[name='checkAll']").prop("checked",true);
			    	}
			    }else{
			    	//如果当前复选框取消选中同时取消全选中
			    	$("input[name='checkAll']").prop("checked",false);
			    }
			});
			//求和
    		this._sumPriceAndNum();
    	},
    	//调整购物车数量
    	_changeCartNum:function(skuId,buyNum,oldNum){
    		ajaxController.ajax({
				type: "post",
				dataType: "json",
				processing: false,
				// message: "调整中，请等待...",
				url: _base+"/shopcart/updateProdNum",
				data:{"skuId":skuId,"buyNum":buyNum},
				success: function(data){
					if("0"===data.statusCode){
						// 失败把原始数据返回
						$("#"+prodId+"_oldProdNum").val(oldNum);
						var d = Dialog({
							content:"修改失败",
							ok:function(){
								this.close();
							}
						});
						d.show();
					}
				}
			});
    	},
    });
    
    module.exports = shopCartDetailsPager
});

