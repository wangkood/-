//定时输出器 调试用
//var t1=window.setInterval(function() {
//	console.log(main_x+"  "+page_width+"  "+menu_isOpen);
//}, 100);



//全局数据 静态
var xin_menu; 	//菜单dom
var xin_main;	//主界面dom
var main_head;
var main_center;
var main_foot;
var menu_autoOpen;

var menu_width;	//菜单宽度
var change_value;//模式改变值  在手机 和 pc 间变化模式
var touchArea	//开始触摸位置
//全局数据 动态
var page_width;	//页面宽度
var page_height;//高度
var menu_isOpen;//菜单打开了吗
var main_x;		//主界面x坐标
var mode;






// 初始化侧边栏组件
function initXinSidebar(mySidebar){

	
	//遍历赋值
	var sidebarChildNodes = document.getElementById(mySidebar.id).childNodes
	for( var i in sidebarChildNodes){
		if(sidebarChildNodes[i].id == "xin_menu"){
			xin_menu = sidebarChildNodes[i];
		}
		if(sidebarChildNodes[i].id == "xin_main"){
			xin_main = sidebarChildNodes[i];
			for(x in xin_main.childNodes){
				if(xin_main.childNodes[x].id == "main_head"){
					main_head = xin_main.childNodes[x];
				}
				if(xin_main.childNodes[x].id == "main_center"){
					main_center = xin_main.childNodes[x];
				}
				if(xin_main.childNodes[x].id == "main_foot"){
					main_foot = xin_main.childNodes[x];
				}
			}
		}
	}
	menu_width	= mySidebar.width;
	change_value= mySidebar.change;
	touchArea 	= mySidebar.touchArea;
	menu_isOpen	= mySidebar.menu_isOpen;
	menu_autoOpen=mySidebar.menu_autoOpen;
	
	
	//当模式改变时触发此方法
	function onModeChange(mode){
		if(menu_autoOpen){
			if(mode == 'PC'){
				openMenu('fast');
			}else{
				closeMenu('fast');
			}
		}
		
	}
	
	//刷新数据
	function refreshData(status){
		//动态值
		page_width =  document.documentElement.clientWidth;  //刷新页面宽
		page_height = document.documentElement.clientHeight; //刷新页面高
		
		
		//初始化body  宽和高
		document.getElementsByTagName('body')[0].style.width = page_width+'px';
		document.getElementsByTagName('body')[0].style.height = page_height+'px';
		
		//初始化 菜单 宽和高
		xin_menu.style.width  = menu_width+"px";
		xin_menu.style.height = page_height+'px';
		
		//初始化 主界面 高
		xin_main.style.height = page_height+'px';
		main_center.style.height = page_height - main_head.scrollHeight  - main_foot.scrollHeight +'px';
		//初始化 主界面 宽
		if(page_width >= change_value){//如果页面宽度 大于 用户模式改变值
			if(status == 'refresh'){//当是刷新，而不是初始化
				if(mode == 'MOBILE'){
					onModeChange('PC');
				}
			}
			mode = 'PC';
			main_head.style.width = 
			main_center.style.width = 
			main_foot.style.width = 
			xin_main.style.width = page_width - menu_width +"px";
			
			if(menu_isOpen){
				setMainX(menu_width);
				menu_isOpen = true;
			}else{
				setMainX(0);
				menu_isOpen = false;
			}
			
			
		}else{
			if(status == 'refresh'){//当是刷新，而不是初始化
				if(mode == 'PC'){
					onModeChange('MOBILE');
				}
			}
			mode = 'MOBILE';
			main_head.style.width = 
			main_center.style.width = 
			main_foot.style.width = 
			xin_main.style.width= page_width +"px";
			
			if(menu_isOpen){
				setMainX(menu_width);
				menu_isOpen = true;
			}else{
				setMainX(0);
				menu_isOpen = false;
			}
		}
	}
	
	refreshData('init');
	
	//当页面大小改变时调用此方法 进行 刷新操作
	window.onresize = function(){
		refreshData('refresh');
	}
	
	
	/*
		实现滑动功能
	*/
	
	var start_x; //开始触摸的x坐标
	var start_y; //开始触摸的y坐标
	
	var activeSwap = false; //是否激活了滑动
	
	
	
	// 控制main移动
	function doSwap (move_x){
		
		
		//算出移动距离
		var distance = move_x  - start_x;
		
		//为了让 主界面 在限定位置移动
		if( (distance < 0 && distance > -menu_width && menu_isOpen) ){ //关闭菜单
			setMainX(menu_width + distance);
		}
		
		if(  (distance > 0 && distance < menu_width && !menu_isOpen) ){//打开菜单
			setMainX(distance);
		}
	}
	
	//触摸开始
	xin_main.addEventListener("touchstart", function(e){
		start_x = e.targetTouches[0].pageX;
		start_y = e.targetTouches[0].pageY;
	});
	
	
	//触摸移动
	xin_main.addEventListener("touchmove", function(e){
		//判断开始坐标是否在所规定滑动区域内    菜单关闭 || 菜单打开
		if( (start_x > 0 && start_x < touchArea && !menu_isOpen)  ||  (start_x>menu_width && menu_isOpen)  ){
			activeSwap = true;
			
			//交给setMainX
			doSwap( e.touches[0].pageX);
			
			
		}else{activeSwap = false;}
	});


	//触摸停止
	xin_main.addEventListener("touchend", function(e){
		
		
		if(activeSwap){
			var end_x = e.changedTouches[0].pageX;
			var end_y = e.changedTouches[0].pageY;

			if(menu_isOpen){//菜单为开启状态
				if(  ((start_x - end_x) > ( menu_width/2)) ){ //符合规定滑动距离
					closeMenu();
				}else{
					openMenu();
				}

			}else{//关闭状态
				if(  ((end_x - start_x) > menu_width/2) ){
					openMenu();
				}else{
					closeMenu();
				}
			}
		}
		activeSwap = false; //关闭滑动
	});

	
	
	
	
}

//关闭菜单
function closeMenu(style){
	if(style == "fast"){
		setMainX(0);
		menu_isOpen = false;
	}else{
		var t1=window.setInterval(function() {
			if(main_x <= 0){
				setMainX(0);
				
				window.clearInterval(t1); 
				menu_isOpen = false;
				return;
			}else{
				moveMain(-4);
			}
		}, 1);
	}
}

//打开菜单
function openMenu(style){
	if(style == "fast"){
		setMainX(menu_width);
		menu_isOpen = true;
		return;
	}else{
		var t2=window.setInterval(function() {
			if(main_x >= menu_width){
				setMainX(menu_width);
				window.clearInterval(t2); 
				menu_isOpen = true;
				return;
			}else{
				moveMain(4);
			}
		}, 1);
	}
	
}


// 移动主界面   x：移动值  +or-
function moveMain(x){
	var x = parseInt(x);
	main_x = parseInt(  xin_main.style.transform.split("(")[1].split("p")[0]  );
	
	xin_main.style.transform = "translateX("+(x+main_x)+"px)";
	
	main_x = parseInt(  xin_main.style.transform.split("(")[1].split("p")[0]  );
	
	//刷新主界面宽度
	if(page_width >= change_value){
		main_head.style.width = 
		main_center.style.width = 
		main_foot.style.width = 
		xin_main.style.width = page_width - main_x +"px";
	}
	
}

// 设置主界面位置   x：相对于父节点 -
function setMainX(input_main_x){

	
	main_x = parseInt(input_main_x);
	xin_main.style.transform = "translateX("+main_x+"px)";
	//刷新主界面宽度
	if(page_width >= change_value){
		main_head.style.width = 
		main_center.style.width = 
		main_foot.style.width = 
		xin_main.style.width = page_width - main_x +"px";
	}
}
			