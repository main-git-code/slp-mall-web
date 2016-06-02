package com.ai.slp.mall.web.controller.shopcart;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.ai.opt.base.exception.BusinessException;
import com.ai.opt.base.exception.SystemException;
import com.ai.opt.sdk.dubbo.util.DubboConsumerFactory;
import com.ai.opt.sdk.web.model.ResponseData;
import com.ai.paas.ipaas.util.JSonUtil;
import com.ai.slp.order.api.shopcart.interfaces.IShopCartSV;
import com.ai.slp.order.api.shopcart.param.CartProd;
import com.ai.slp.order.api.shopcart.param.CartProdInfo;
import com.ai.slp.order.api.shopcart.param.CartProdOptRes;
import com.ai.slp.order.api.shopcart.param.UserInfo;

import net.sf.json.JSONArray;

/**
 * Created by liutong5 on 16/5/30.
 */
@Controller
@RequestMapping("/shopcart")
public class ShopCartController {
    private static final Logger LOG = Logger.getLogger(ShopCartController.class);
    /**
     * 购物车中添加商品
     */
    @RequestMapping("/addProd")
    @ResponseBody
    public ResponseData<CartProdOptRes> addProd(HttpSession session, @RequestParam Long buyNum, @RequestParam String skuId) {
        //获取service
//        IShopCartSV iShopCartSV = DubboConsumerFactory.getService("IShopCartSV");
        //设置参数
        CartProd cartProd = new CartProd();
        cartProd.setBuyNum(buyNum);
        cartProd.setSkuId(skuId);
//		cartProd.setTenantId((String)session.getAttribute("tenantId"));
//		cartProd.setUserId((String)session.getAttribute("userId"));
        ResponseData<CartProdOptRes> responseData = null;
        try{
//            CartProdOptRes cartProdOptRes = iShopCartSV.addProd(cartProd);
            CartProdOptRes cartProdOptRes = new CartProdOptRes();
            cartProdOptRes.setProdTotal(3);
            cartProdOptRes.setProdNum(2);
            LOG.debug("添加购物车商品出参:"+ JSONArray.fromObject(cartProdOptRes).toString());
            responseData = new ResponseData<CartProdOptRes>(ResponseData.AJAX_STATUS_SUCCESS, "添加成功", cartProdOptRes);
        }catch(BusinessException|SystemException e){
            responseData = new ResponseData<CartProdOptRes>(ResponseData.AJAX_STATUS_FAILURE, "添加失败:"+e.getMessage());
            LOG.error("添加购物车商品出错",e);
        }catch (Exception e){
            responseData = new ResponseData<CartProdOptRes>(ResponseData.AJAX_STATUS_FAILURE, "添加失败,出现未知异常");
            LOG.error("添加购物车商品出错",e);
        }
        return responseData;
    }
    /**
     * 查询用户的购物车详细信息
     */
    @RequestMapping("/cartDetails")
    @ResponseBody
    public ModelAndView queryCartDetails(HttpServletRequest request){
    	Map<String, Object> model = new HashMap<String, Object>();
    	try{
//    		String tenantId = request.getParameter("tenantId");
//    		String userId = request.getParameter("userId");
    		IShopCartSV iShopCartSV = DubboConsumerFactory.getService("IShopCartSV");
    		UserInfo userInfo = new UserInfo();
    		userInfo.setTenantId("SLP");
//            userInfo.setUserId(userId);
//            List<CartProdInfo> cartProdInfoList = iShopCartSV.queryCartOfUser(userInfo);
    		List<CartProdInfo> cartProdInfoList = new ArrayList<>();
            CartProdInfo cartProdInfo = new CartProdInfo();
            cartProdInfo.setSkuId("111");
            
            cartProdInfo.setBuyNum(3);
            cartProdInfo.setProductName("小黄鸭");
            cartProdInfo.setSalePrice(300l);
            cartProdInfoList.add(cartProdInfo);
            String cartProdInfoJSON = JSonUtil.toJSon(cartProdInfoList);
            model.put("cartProdList", cartProdInfoJSON);
    	}catch(Exception e){
    		e.printStackTrace();
    		LOG.error("查询购物车商品详情出错",e);
    	}
        return new ModelAndView("jsp/shopcart/shopping_cart",model);
    }
}
