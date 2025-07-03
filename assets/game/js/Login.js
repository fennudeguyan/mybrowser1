
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var Animation=laya.display.Animation,Box=laya.ui.Box,Browser=laya.utils.Browser,Button=laya.ui.Button;
	var CheckBox=laya.ui.CheckBox,Event=laya.events.Event,FLoader=compatible.base.FLoader,FTimer=compatible.base.FTimer;
	var GameStepDataManager=compatible.manager.GameStepDataManager,GlobalConstString=Laya.GlobalConstString,GlobalUnitID=compatible.GlobalUnitID;
	var GlobalUtils=compatible.utils.GlobalUtils,GlowFilter=laya.filters.GlowFilter,Image=laya.ui.Image,KefuDataManager=compatible.manager.KefuDataManager;
	var Keyboard=laya.events.Keyboard,Label=laya.ui.Label,Lay=compatible.lay.Lay,Loader=laya.net.Loader,LoaderSound=Laya.LoaderSound;
	var LocalStorage=laya.net.LocalStorage,MConfig=Laya.MConfig,MyHttp=compatible.base.MyHttp,MyPingAndFPS=compatible.panel.net.MyPingAndFPS;
	var Render=laya.renders.Render,Sprite=laya.display.Sprite,Stat=laya.utils.Stat,TLConfig=Laya.TLConfig,TLTools=compatible.tools.TLTools;
	var TextInput=laya.ui.TextInput,URL=laya.net.URL,UtilAlert=compatible.panel.UtilAlert,Utils=laya.utils.Utils;
	var View=laya.ui.View,ViewBase=compatible.panel.base.ViewBase,ViewBaseEx=compatible.panel.base.ViewBaseEx;
//class app.LoginResConst
var LoginResConst=(function(){
	function LoginResConst(){}
	__class(LoginResConst,'app.LoginResConst');
	LoginResConst.UI_PRELOGIN="res/atlas/loginUI/PreLogin.atlas";
	LoginResConst.FGUI_PRELOGIN="res/atlas/loginUI/FG_PreLogin.atlas";
	LoginResConst.FGVUI_PRELOGIN="res/atlas/loginUI/FGV_PreLogin.atlas";
	return LoginResConst;
})()


//class game.FG.FG_OpenVideoView
var FG_OpenVideoView=(function(){
	function FG_OpenVideoView(){
		this.videoElement=null;
		var local=LocalStorage.getItem("openVideo");
		if (local===null || local==="0"){
			this.show();
		}
		;
	}

	__class(FG_OpenVideoView,'game.FG.FG_OpenVideoView');
	var __proto=FG_OpenVideoView.prototype;
	__proto.show=function(){
		this.videoElement=Browser.createElement("video");
		this.videoElement.setAttribute("id","myvideo");
		this.videoElement.setAttribute("webkit-playsinline",true);
		this.videoElement.setAttribute("playsinline",true);
		this.videoElement.setAttribute("x5-video-player-type",'h5');
		this.videoElement.setAttribute("x-webkit-airplay",true);
		this.videoElement.setAttribute("x5-video-orientation","landscape");
		this.videoElement.setAttribute("preload","auto");
		this.videoElement.setAttribute("width","100%");
		this.videoElement.setAttribute("height","100%");
		this.videoElement.setAttribute("autoplay","true");
		this.videoElement.setAttribute("abject-fit","fill");
		this.videoElement.style.zInddex=Render.canvas.style.zIndex+1;
		this.videoElement.src="res/video/video.mp4";
		this.videoElement.autoplay=true;
		this.videoElement.muted=true;
		Browser.document.body.appendChild(this.videoElement);
		console.log("video",Laya.stage.width,Laya.stage.height,TLConfig.stageWidth,TLConfig.stageHeight,Browser.clientWidth,Browser.clientHeight,Browser.width,Browser.height)
		game.FG.FG_OpenVideoView.reference=new Sprite();
		Laya.stage.addChild(game.FG.FG_OpenVideoView.reference);
		game.FG.FG_OpenVideoView.reference.pos(0,0);
		game.FG.FG_OpenVideoView.reference.size(TLConfig.stageWidth,TLConfig.stageHeight);
		game.FG.FG_OpenVideoView.reference.graphics.drawRect(0,0,game.FG.FG_OpenVideoView.reference.width,game.FG.FG_OpenVideoView.reference.height,"#000000");
		var fullscreenButton=Browser.createElement('img');
		fullscreenButton.setAttribute("id","jj");
		fullscreenButton.setAttribute("src","res/video/jump.png");
		fullscreenButton.setAttribute("width","138px");
		fullscreenButton.setAttribute("height","35px");
		Browser.document.body.appendChild(fullscreenButton);
		fullscreenButton.style.zInddex=Render.canvas.style.zIndex+5;
		Laya.stage.on("resize",this,this.fitDOMElements,[this.videoElement,fullscreenButton]);
		Laya.stage.event("resize");
		Browser.getElementById("myvideo").addEventListener('ended',this.__runComplete)
		Browser.getElementById("jj").addEventListener('click',this.__runComplete)
	}

	__proto.fitDOMElements=function(){
		var dom;
		for (var i=0;i < arguments.length;i++){
			dom=arguments[i];
			if(dom.id==="myvideo"){
				Utils.fitDOMElementInArea(dom,game.FG.FG_OpenVideoView.reference,0,0,game.FG.FG_OpenVideoView.reference.width,game.FG.FG_OpenVideoView.reference.height);
				}else if(dom.id==="jj"){
				Utils.fitDOMElementInArea(dom,game.FG.FG_OpenVideoView.reference,0,0,138,35);
			}
		}
	}

	__proto.__runComplete=function(reference){
		var doc=Browser.getElementById("myvideo")
		var doc2=Browser.getElementById("jj")
		console.log("播放结束");
		Laya.stage.removeChild(game.FG.FG_OpenVideoView.reference);
		doc.parentNode.removeChild(doc);
		doc2.parentNode.removeChild(doc2);
		LocalStorage.setItem("openVideo","1");
	}

	FG_OpenVideoView.reference=null;
	return FG_OpenVideoView;
})()


//class app.LoginMain extends laya.display.Sprite
var LoginMain=(function(_super){
	function LoginMain(){
		this._loginView=null;
		this._startupView=null;
		LoginMain.__super.call(this);
		GameStepDataManager.instance.setStep(0);
		this.TheInit();
	}

	__class(LoginMain,'app.LoginMain',_super);
	var __proto=LoginMain.prototype;
	// }
	__proto.onStartupCompolete=function(){
		this._startupView.destroy();
		this._startupView=null;
		this.TheInit();
	}

	__proto.TheInit=function(){
		if(MConfig.isFGMode())
			if(TLConfig.onPC){
			this._loginView=new FGPC_LoginView();
			}else if(TLConfig.mobileVertical){
			this._loginView=new FGV_LoginView();
			}else {
			this._loginView=new FG_LoginView();
		}
		else
		this._loginView=new LoginView();
		this._loginView.on("complete",this,this.onLoginViewCompolete);
		TLTools.instance.mLayerUI.addChild(this._loginView);
	}

	// TLTools.instance.mLayerUI.addChild(video );
	__proto.onLoginViewCompolete=function(){
		this._loginView.off("complete",this,this.onLoginViewCompolete);
		this.event("complete");
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		if (this._loginView){
			this._loginView.destroy();
			this._loginView=null;
		}
		_super.prototype.destroy.call(this,destroyChild);
	}

	return LoginMain;
})(Sprite)


//class game.CQ.LoginView extends compatible.panel.base.ViewBase
var LoginView=(function(_super){
	function LoginView(){
		this.PAGETYPE_MAIN=1;
		//登录界面类型
		this.PAGETYPE_REGISTER=2;
		//注册界面类型
		this.PAGETYPE_OTHER=3;
		//公告
		this.PAGETYPE_EDITPWD=4;
		//修改密码
		this.PAGETYPE_YIJIANSHIWAN=5;
		this.mLoginMC=null;
		// public var url:String;
		this.ipshuru=null;
		this._zs1Eff=null;
		this._zs2Eff=null;
		this._zs3Eff=null;
		this._zs4Eff=null;
		this._zs5Eff=null;
		this._zs6Eff=null;
		LoginView.__super.call(this);
		this.mLoader=new FLoader;
		this.pageType=this.PAGETYPE_MAIN;
		this.TheInit();
	}

	__class(LoginView,'game.CQ.LoginView',_super);
	var __proto=LoginView.prototype;
	__proto.TheInit=function(){
		this.url=this.getLoginUrl();
		this.mLoader.loaderType="atlas";
		this.mLoader.on("complete",this,this.handleLoadingLoaded);
		this.mLoader.load(this.url);
		if (LocalStorage.getItem("zxk_showstat")=="true"){
			Stat.show();
		}
	}

	__proto.getUIClass=function(){
		return FG_PreLoginUI;
	}

	__proto.getLoginUrl=function(){
		return "res/atlas/loginUI/PreLogin.atlas";
	}

	__proto.getBGUrl=function(){
		var name=GlobalUnitID.getAgentBGUrlHead()+"/loginPage/";
		if (TLConfig.mobileVertical){
			name+="mobile_v_bg.jpg";
		}
		else if (TLConfig.UIType==1){
			if (TLConfig.onPC)
				name+="cqpc_bg.jpg";
			else
			name+="cq_bg.jpg";
		}
		else{
			if (TLConfig.onPC)
				name+="pc_bg.jpg";
			else
			name+="mobile_bg.jpg";
		}
		return name;
	}

	__proto.getLocalStorageIPKey=function(){
		var str="txt_local_ip";
		return Browser.window.location.href+str;
	}

	__proto.handleLoadingLoaded=function(e){
		this.mLoader.off("complete",this,this.handleLoadingLoaded);
		this.mLoginMC=new (this.getUIClass());
		if (!(MConfig.debugMode==0)&& !(MConfig.debugMode==2)){
			this.mLoginMC.mcTypeCtn.visible=false;
		}
		else{
			var localUserip=LocalStorage.getItem(this.getLocalStorageIPKey());
			if (localUserip){
				this.mLoginMC.ipshuru.changeText(localUserip);
			}
			else{
				var href=Browser.window.location.href;
				if (href.indexOf("192.168.1.252")!=-1)
					this.mLoginMC.ipshuru.changeText("192.168.1.252");
				else{
					this.mLoginMC.ipshuru.changeText(Browser.window.location.hostname);
				}
			}
			if (MConfig.ServerId !=1){
				var iparr=this.mLoginMC.ipshuru.text.split(",");
				this.mLoginMC.ipshuru.changeText(iparr[0]+","+MConfig.ServerId);
			}
		}
		if (Browser.window.location.hostname=="newqn.3duan.cn"){
			this.mLoginMC.ipshuru.visible=false;
		}
		else
		this.mLoginMC.ipshuru.visible=true;
		this.mLoginMC.bg_img.skin=this.getBGUrl();
		this._zs1Eff=new Animation();
		this._zs1Eff=GlobalUtils.createAtlasAni("res/atlas/anims/","loginEff",83,true,false)[0];
		this.mLoginMC.bg_img.addChild(this._zs1Eff)
		this._zs1Eff.play(0,true);
		this._zs1Eff.pos(130,0);
		this._zs2Eff=new Animation();
		this._zs2Eff=GlobalUtils.createAtlasAni("res/atlas/anims/","loginEff",83,true,false)[0];
		this.mLoginMC.bg_img.addChild(this._zs2Eff);
		this._zs2Eff.play(0,true);
		this._zs2Eff.pos(450,50);
		this._zs3Eff=new Animation();
		this._zs3Eff=GlobalUtils.createAtlasAni("res/atlas/anims/","loginEff",83,true,false)[0];
		this.mLoginMC.bg_img.addChild(this._zs3Eff);
		this._zs3Eff.play(0,true);
		this._zs3Eff.pos(770,150);
		this._zs4Eff=new Animation();
		this._zs4Eff=GlobalUtils.createAtlasAni("res/atlas/anims/","loginEff",83,true,false)[0];
		this.mLoginMC.bg_img.addChild(this._zs4Eff);
		this._zs4Eff.play(0,true);
		this._zs4Eff.pos(300,220);
		this._zs5Eff=new Animation();
		this._zs5Eff=GlobalUtils.createAtlasAni("res/atlas/anims/","loginEff",83,true,false)[0];
		this.mLoginMC.bg_img.addChild(this._zs5Eff);
		this._zs5Eff.play(0,true);
		this._zs5Eff.pos(600,320);
		this._zs6Eff=new Animation();
		this._zs6Eff=GlobalUtils.createAtlasAni("res/atlas/anims/","loginEff",83,true,false)[0];
		this.mLoginMC.bg_img.addChild(this._zs6Eff);
		this._zs6Eff.play(0,true);
		this._zs6Eff.pos(880,320);
		var localUserName=LocalStorage.getItem("txt_local_userName");
		if (localUserName){
			this.mLoginMC.nameInput.changeText(localUserName);
		};
		var localCheckBox=LocalStorage.getItem("checkbox_local_savePwd");
		if (localCheckBox=="2")
			this.mLoginMC.save_pwd.selected=false;
		var localUserPwd="";
		if (this.mLoginMC.save_pwd.selected){
			localUserPwd=LocalStorage.getItem("txt_local_userPwd");
			if (localUserPwd){
				this.mLoginMC.password.changeText(localUserPwd);
			}
		}
		this.mLoginMC.start.label="登录"
		this.mLoginMC.txtVersion.filters=[new GlowFilter("#000000",1,0,0),new GlowFilter("#000000",1,0,0)];
		this.mLoginMC.txtVersion.text="当前版本:V"+GlobalConstString.getVersionString((URL.varsionHeight));
		TLTools.instance.mLayerUI.addChild(this);
		this.addChild(this.mLoginMC);
		this.addEvent();
		this.handlerResize();
		KefuDataManager.instance.showKefuQQView(null,false);
	}

	//隐藏qq客服按钮
	__proto.addEvent=function(){
		Laya.stage.on("resize",this,this.handlerResize);
		this.mLoginMC.start.on("click",this,this.onClickFun);
		this.mLoginMC.save_pwd.on("click",this,this.onClickFun);
		Laya.stage.on("keydown",this,this.handleKeyboardDown);
		if(MConfig.isLANDebug){
			this.mLoginMC.debugCtn.on("mouseover",this,this.onDebugOver);
			this.mLoginMC.debugCtn.on("mouseout",this,this.onDebugOut);
			this.mLoginMC.serverCBox.on("click",this,this.onDebugServerChange);
			this.mLoginMC.clientCBox.on("click",this,this.onDebugClientChange);
			var resUrl=LocalStorage.getItem("debug_client_resstr");
			if(resUrl && resUrl !="0"){
				this.mLoginMC.clientCBox.selected=true;
			}
		}
	}

	__proto.removeEvent=function(){
		Laya.stage.off("resize",this,this.handlerResize);
		this.mLoginMC.start.off("click",this,this.onClickFun);
		this.mLoginMC.save_pwd.off("click",this,this.onClickFun);
		Laya.stage.off("keydown",this,this.handleKeyboardDown);
		this.mLoginMC.debugCtn.off("mouseover",this,this.onDebugOver);
		this.mLoginMC.debugCtn.off("mouseout",this,this.onDebugOut);
		this.mLoginMC.serverCBox.off("click",this,this.onDebugServerChange);
		this.mLoginMC.clientCBox.off("click",this,this.onDebugClientChange);
	}

	//by zxk
	__proto.onDebugOver=function(e){
		this.mLoginMC.debugCtn.alpha=1;
	}

	__proto.onDebugOut=function(e){
		this.mLoginMC.debugCtn.alpha=0.002;
	}

	__proto.onDebugServerChange=function(){
		if(this.mLoginMC.serverCBox.selected){
			var ipstr=this.mLoginMC.serverInput.text || this.mLoginMC.serverInput.prompt;
			var ipArr=ipstr.split(",");
			this.mLoginMC.ipshuru.text=ipArr[0];
			if(ipArr.length > 1){
				MConfig.loginServerPort=ipArr[1];
			}
			if(ipArr.length > 2){
				MConfig.ServerId=ipArr[2];
			}
			LocalStorage.setItem("debug_server_ipstr",this.mLoginMC.serverInput.text);
		}
	}

	__proto.onDebugClientChange=function(){
		if(this.mLoginMC.clientCBox.selected){
			var resstr=this.mLoginMC.clientInput.text || this.mLoginMC.clientInput.prompt;
			LocalStorage.setItem("debug_client_resstr",resstr);
			MConfig.reload();
		}
		else{
			LocalStorage.setItem("debug_client_resstr","");
			MConfig.reload();
		}
	}

	__proto.handleKeyboardDown=function(e){
		if (e.keyCode !=13)
			return;
		switch (this.pageType){
			case this.PAGETYPE_MAIN:{
					this.login();
				}
				break ;
			}
	}

	__proto.onTextInputFocus=function(e){
		Laya.timer.once(100,this,this.onTimer,[e]);
	}

	// (e as TextInput).select();
	__proto.onTimer=function(e){
		(e).select();
	}

	__proto.setSavePwd=function(){
		if (this.mLoginMC.save_pwd.selected){
			LocalStorage.setItem("checkbox_local_savePwd","1");
		}
		else{
			LocalStorage.setItem("checkbox_local_savePwd","2");
		}
	}

	__proto.login=function(){
		if (this.mLoginMC.nameInput.text==''){
			UtilAlert.Instance.alertMessage("请输入帐号名称！");
			return;
		}
		LocalStorage.setItem("txt_local_userName",this.mLoginMC.nameInput.text);
		if (this.mLoginMC.save_pwd.selected){
			LocalStorage.setItem("txt_local_userPwd",this.mLoginMC.password.text);
		}
		else{
			var localUserPwd=LocalStorage.getItem("txt_local_userPwd");
			if (localUserPwd){
				LocalStorage.removeItem("txt_local_userPwd");
			}
		}
		LocalStorage.setItem(this.getLocalStorageIPKey(),this.mLoginMC.ipshuru.text);
		MConfig.opengId=this.mLoginMC.nameInput.text;
		MConfig.passWord=this.mLoginMC.password.text;
		var ipStr=this.mLoginMC.ipshuru.text;
		var ipArr=GlobalUtils.formatOneSplitByStr(ipStr,",");
		if (ipArr.length >=1)
			MConfig.loginServerHost=ipArr[0];
		if (ipArr.length >=2)
			MConfig.ServerId=GlobalUtils.tryToInt(ipArr[1]);
		this.event("complete");
	}

	//
	__proto.onClickFun=function(e){
		switch (e.currentTarget){
			case this.mLoginMC.start:
				LoaderSound.instance().playBtnCommon();
				this.login();
				break ;
			case this.mLoginMC.save_pwd:{
					LoaderSound.instance().playBtnCommon();
					this.setSavePwd();
					break ;
				}
			}
	}

	__proto.onHttpCompolete=function(data){
		var http=data.owner;
		var dic=data.data;
	}

	__proto.handlerResize=function(e){
		if (this.mLoginMC){
			this.graphics.clear();
			this.graphics.drawRect(0,0,TLConfig.stageWidth,TLConfig.stageHeight,"#000000");
			this.mLoginMC.width=TLConfig.stageWidth;
			this.mLoginMC.height=TLConfig.stageHeight;
			this.mLoginMC.bg_img.width=TLConfig.stageWidth;
			this.mLoginMC.bg_img.height=TLConfig.stageHeight;
			var bili=1296 / 600;
			var biliCur=TLConfig.stageWidth / TLConfig.stageHeight;
			if (bili < biliCur){
				var xbili=TLConfig.stageWidth / 1296;
				this.mLoginMC.bg_img.height=xbili *600;
			}
			else{
				var ybili=TLConfig.stageHeight / 600;
				this.mLoginMC.bg_img.width=ybili *1296;
			}
			this.mLoginMC.bg_img.x=TLConfig.stageWidth-this.mLoginMC.bg_img.width >> 1;
			this.mLoginMC.bg_img.y=TLConfig.stageHeight-this.mLoginMC.bg_img.height >> 1;
			this.mLoginMC.loging_ui.x=Math.floor(TLConfig.stageWidth-this.mLoginMC.loging_ui.width >> 1);
			this.mLoginMC.loging_ui.y=Math.floor(TLConfig.stageHeight-this.mLoginMC.loging_ui.height >> 1);
			this.mLoginMC.txtVersion.x=0;
			this.mLoginMC.txtVersion.y=10;
			this.mLoginMC.start.x=(((this.mLoginMC.start.parent)).width-this.mLoginMC.start.width >> 1)+3;
		}
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this.removeEvent();
		if (this.mLoader)
			this.mLoader.dispose();
		if (this._zs1Eff){
			this._zs1Eff.destroy();
			this._zs1Eff=null;
		}
		if (this._zs2Eff){
			this._zs2Eff.destroy();
			this._zs2Eff=null;
		}
		if (this._zs3Eff){
			this._zs3Eff.destroy();
			this._zs3Eff=null;
		}
		if (this._zs4Eff){
			this._zs4Eff.destroy();
			this._zs4Eff=null;
		}
		if (this._zs5Eff){
			this._zs5Eff.destroy();
			this._zs5Eff=null;
		}
		if (this._zs6Eff){
			this._zs6Eff.destroy();
			this._zs6Eff=null;
		}
		FLoader.clearRes(this.url);
		FLoader.clearRes(this.getBGUrl());
		_super.prototype.destroy.call(this,destroyChild);
	}

	__getset(0,__proto,'panel',function(){
		return this.mLoginMC;
	});

	return LoginView;
})(ViewBase)


//class game.CQ.StartupView extends compatible.panel.base.ViewBaseEx
var StartupView=(function(_super){
	function StartupView(url){
		this.mcZizhi=null;
		this.txt1=null;
		this.txt2=null;
		this.txt3=null;
		this._timer=null;
		StartupView.__super.call(this,url);
	}

	__class(StartupView,'game.CQ.StartupView',_super);
	var __proto=StartupView.prototype;
	__proto.getUIClass=function(){
		return StartViewUI;
	}

	__proto.initUI=function(){
		this.createUI(this.getUIClass());
		this.mcZizhi.x=TLConfig.stageWidth-this.mcZizhi.width >> 1;
		this.mcZizhi.y=TLConfig.stageHeight-this.mcZizhi.height >> 1;
		Laya.timer.once(5000,this,this.onDelay);
	}

	__proto.onDelay=function(){
		this.event("complete");
	}

	__proto.addEvent=function(){}
	__proto.removeEvent=function(){}
	__proto.theOpen=function(){
		_super.prototype.theOpen.call(this);
	}

	__proto.theClose=function(){
		_super.prototype.theClose.call(this);
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this);
	}

	return StartupView;
})(ViewBaseEx)


//class game.FG.FG_LoginView extends game.CQ.LoginView
var FG_LoginView=(function(_super){
	function FG_LoginView(){
		FG_LoginView.__super.call(this);
	}

	__class(FG_LoginView,'game.FG.FG_LoginView',_super);
	var __proto=FG_LoginView.prototype;
	__proto.getLoginUrl=function(){
		return "res/atlas/loginUI/FG_PreLogin.atlas";
	}

	return FG_LoginView;
})(LoginView)


//class layaUI.fgv_login.FGV_PreLoginUI extends laya.ui.View
var FGV_PreLoginUI=(function(_super){
	function FGV_PreLoginUI(){
		this._gBg=null;
		this.bg_img=null;
		this._imgLogo=null;
		this._gTop=null;
		this._imgBgUp=null;
		this.txtVersion=null;
		this._gBottom=null;
		this._imgBgDown=null;
		this.loging_ui=null;
		this.nameInput=null;
		this.password=null;
		this.start=null;
		this.mcTypeCtn=null;
		this.ipshuru=null;
		this.save_pwd=null;
		FGV_PreLoginUI.__super.call(this);
	}

	__class(FGV_PreLoginUI,'layaUI.fgv_login.FGV_PreLoginUI',_super);
	var __proto=FGV_PreLoginUI.prototype;
	__proto.createChildren=function(){
		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(FGV_PreLoginUI.uiView);
	}

	FGV_PreLoginUI.uiView={"type":"View","props":{"width":642,"height":1389},"child":[{"type":"Sprite","props":{"y":1,"x":0,"width":642,"var":"_gBg","height":1389},"child":[{"type":"Image","props":{"y":-0.5,"x":-0.5,"var":"bg_img"}}]},{"type":"Image","props":{"y":290,"x":223,"var":"_imgLogo","skin":"loginUI/FGV_PreLogin/v_logo.png"}},{"type":"Box","props":{"y":8,"x":0,"width":642,"var":"_gTop","height":177},"child":[{"type":"Image","props":{"var":"_imgBgUp","skin":"loginUI/FGV_PreLogin/img_bg_up.png"}},{"type":"Label","props":{"y":84,"x":430,"width":179,"var":"txtVersion","text":"当前版本: V99.99.99","stroke":1,"height":18,"fontSize":18,"color":"#ffffff","align":"center"}}]},{"type":"Box","props":{"y":1192,"x":0,"width":642,"var":"_gBottom","height":197},"child":[{"type":"Image","props":{"y":-498,"x":0,"var":"_imgBgDown","skin":"loginUI/FGV_PreLogin/img_bg_down.png"}}]},{"type":"Image","props":{"y":589,"x":152,"var":"loging_ui","skin":"loginUI/FGV_PreLogin/v_img_loginAccountBG.png"},"child":[{"type":"Image","props":{"y":40,"x":42,"skin":"loginUI/FGV_PreLogin/v_img_loginAcc.png"}},{"type":"Image","props":{"y":91,"x":42,"skin":"loginUI/FGV_PreLogin/v_img_loginPass.png"}},{"type":"Image","props":{"y":37,"x":95,"width":190,"skin":"loginUI/FGV_PreLogin/v_img_loginTxtBG.png","sizeGrid":"5,5,5,5","height":30},"child":[{"type":"TextInput","props":{"y":4,"x":2,"width":180,"var":"nameInput","valign":"middle","prompt":"请输入任意账号","height":22,"fontSize":18,"color":"#94907f","align":"center"}}]},{"type":"Image","props":{"y":84,"x":95,"width":190,"skin":"loginUI/FGV_PreLogin/v_img_loginTxtBG.png","sizeGrid":"5,5,5,5","height":30},"child":[{"type":"TextInput","props":{"y":4,"x":2,"width":180,"var":"password","valign":"middle","type":"password","prompt":"请输入任意密码","height":22,"fontSize":18,"color":"#94907f","align":"center"}}]},{"type":"Button","props":{"y":140,"x":98,"var":"start","stateNum":1,"skin":"loginUI/FGV_PreLogin/v_btn_login.png","labelStroke":1,"labelSize":16,"labelColors":"#f1ecdf,#f1ecdf,#f1ecdf"}},{"type":"Box","props":{"y":-27,"x":-86,"width":508,"var":"mcTypeCtn","height":24},"child":[{"type":"TextInput","props":{"y":0,"x":170,"width":168,"var":"ipshuru","valign":"middle","prompt":"请输入任意IP","height":27,"fontSize":16,"color":"#ffffff","align":"center"}}]},{"type":"CheckBox","props":{"y":696,"x":-918,"width":99,"visible":false,"var":"save_pwd","stateNum":2,"skin":"loginUI/FG_PreLogin/gouxuankuang.png","selected":true,"labelSize":14,"labelPadding":"6,0,0,0","labelColors":"#00FF00,#00FF00,#00FF00,#00FF00","label":"保存密码","height":26}}]}]};
	return FGV_PreLoginUI;
})(View)


//class layaUI.login.FG_PreLoginUI extends laya.ui.View
var FG_PreLoginUI=(function(_super){
	function FG_PreLoginUI(){
		this.bg_img=null;
		this.loging_ui=null;
		this.nameInput=null;
		this.password=null;
		this.start=null;
		this.mcTypeCtn=null;
		this.ipshuru=null;
		this.save_pwd=null;
		this.txtVersion=null;
		this.debugCtn=null;
		this.serverCBox=null;
		this.serverInput=null;
		this.clientCBox=null;
		this.clientInput=null;
		FG_PreLoginUI.__super.call(this);
	}

	__class(FG_PreLoginUI,'layaUI.login.FG_PreLoginUI',_super);
	var __proto=FG_PreLoginUI.prototype;
	__proto.createChildren=function(){
		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(FG_PreLoginUI.uiView);
	}

	FG_PreLoginUI.uiView={"type":"View","props":{"width":1920,"height":1080},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"bg_img"}},{"type":"Box","props":{"y":374,"x":749,"width":422,"var":"loging_ui","height":231},"child":[{"type":"Image","props":{"y":25,"x":36,"width":350,"skin":"loginUI/FG_PreLogin/img_loginAccountBG.png","sizeGrid":"8,8,8,8","height":45},"child":[{"type":"Image","props":{"y":5,"x":6,"skin":"loginUI/FG_PreLogin/img_loginAcc.png"}},{"type":"TextInput","props":{"y":3,"x":66,"width":270,"var":"nameInput","valign":"middle","prompt":"请输入任意账号","height":40,"fontSize":20,"color":"#EAE9E4","bold":true,"align":"center"}}]},{"type":"Image","props":{"y":83,"x":35,"width":350,"skin":"loginUI/FG_PreLogin/img_loginAccountBG.png","sizeGrid":"8,8,8,8","height":45},"child":[{"type":"Image","props":{"y":6,"x":7,"skin":"loginUI/FG_PreLogin/img_loginPass.png"}},{"type":"TextInput","props":{"y":2,"x":63,"width":270,"var":"password","valign":"middle","type":"password","prompt":"请输入任意密码","height":40,"fontSize":20,"color":"#8e8e8e","bold":true,"align":"center"}}]},{"type":"Button","props":{"y":185,"x":118,"var":"start","stateNum":1,"skin":"loginUI/FG_PreLogin/btn_login.png","labelSize":24,"labelColors":"#43201A","labelBold":true,"label":"登录"}},{"type":"Box","props":{"y":-4,"x":-43,"width":508,"var":"mcTypeCtn","height":24},"child":[{"type":"TextInput","props":{"y":0,"x":170,"width":168,"var":"ipshuru","valign":"middle","prompt":"请输入任意IP","height":27,"fontSize":16,"color":"#ffffff","align":"center"}}]},{"type":"CheckBox","props":{"y":716,"x":-81,"width":99,"visible":false,"var":"save_pwd","stateNum":2,"skin":"loginUI/FG_PreLogin/gouxuankuang.png","selected":true,"labelSize":14,"labelPadding":"6,0,0,0","labelColors":"#00FF00,#00FF00,#00FF00,#00FF00","label":"保存密码","height":26}},{"type":"Label","props":{"y":377,"x":414,"width":179,"var":"txtVersion","text":"当前版本: V99.99.99","stroke":1,"height":18,"fontSize":16,"color":"#ffffff","align":"center"}},{"type":"Box","props":{"y":290,"x":35,"var":"debugCtn","alpha":0.002},"child":[{"type":"Image","props":{"width":350,"skin":"loginUI/FG_PreLogin/img_loginAccountBG.png","sizeGrid":"8,8,8,8","height":45},"child":[{"type":"CheckBox","props":{"y":8,"x":17,"var":"serverCBox","stateNum":2,"skin":"loginUI/FG_PreLogin/gouxuankuang.png","labelPadding":"5","labelColors":"#00ff00,#00ff00,#00ff00","label":"服务器"}},{"type":"TextInput","props":{"y":2,"x":63,"width":270,"var":"serverInput","valign":"middle","type":"text","prompt":"qn.3duan.cn,8003,1","height":40,"fontSize":16,"color":"#ffffff","bold":true,"align":"center"}}]},{"type":"Image","props":{"y":57,"width":350,"skin":"loginUI/FG_PreLogin/img_loginAccountBG.png","sizeGrid":"8,8,8,8","height":45},"child":[{"type":"CheckBox","props":{"y":8,"x":17,"var":"clientCBox","stateNum":2,"skin":"loginUI/FG_PreLogin/gouxuankuang.png","labelPadding":"5","labelColors":"#00ff00,#00ff00,#00ff00","label":"客户端"}},{"type":"TextInput","props":{"y":2,"x":63,"width":270,"var":"clientInput","valign":"middle","type":"text","prompt":"http://qn.3duan.cn:8001/","height":40,"fontSize":16,"color":"#ffffff","bold":true,"align":"center"}}]}]}]}]};
	return FG_PreLoginUI;
})(View)


//class layaUI.login.StartViewUI extends laya.ui.View
var StartViewUI=(function(_super){
	function StartViewUI(){
		this.mcZizhi=null;
		this.txt1=null;
		this.txt2=null;
		this.txt3=null;
		StartViewUI.__super.call(this);
	}

	__class(StartViewUI,'layaUI.login.StartViewUI',_super);
	var __proto=StartViewUI.prototype;
	__proto.createChildren=function(){
		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(StartViewUI.uiView);
	}

	StartViewUI.uiView={"type":"View","props":{"width":1067,"height":600},"child":[{"type":"Sprite","props":{"y":270,"x":233,"width":600,"var":"mcZizhi","height":59},"child":[{"type":"Label","props":{"y":0,"x":0,"width":600,"var":"txt1","text":" 本网络游戏适合年满16周岁以上的用户使用。为了您的健康，请合理控制游戏时间。","height":18,"fontSize":12,"color":"#ffffff","bold":false,"align":"center"}},{"type":"Label","props":{"y":22,"x":0,"width":600,"var":"txt2","text":"抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。","height":18,"fontSize":12,"color":"#ffffff","bold":false,"align":"center"}},{"type":"Label","props":{"y":43,"x":0,"width":600,"var":"txt3","text":"适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。","height":18,"fontSize":12,"color":"#fdd814","bold":false,"align":"center"}}]}]};
	return StartViewUI;
})(View)


//class game.FG.FGPC_LoginView extends game.FG.FG_LoginView
var FGPC_LoginView=(function(_super){
	function FGPC_LoginView(){
		FGPC_LoginView.__super.call(this);
	}

	__class(FGPC_LoginView,'game.FG.FGPC_LoginView',_super);
	var __proto=FGPC_LoginView.prototype;
	__proto.handlerResize=function(e){
		game.CQ.LoginView.prototype.handlerResize.call(this,e);
		if (this.mLoginMC){
			this.mLoginMC.loging_ui.scaleX=0.85;
			this.mLoginMC.loging_ui.scaleY=0.85;
			this.mLoginMC.loging_ui.x=Math.floor(TLConfig.stageWidth-this.mLoginMC.loging_ui.width*this.mLoginMC.loging_ui.scaleX >> 1);
			this.mLoginMC.loging_ui.y=Math.floor((TLConfig.stageHeight-this.mLoginMC.loging_ui.height*this.mLoginMC.loging_ui.scaleY >> 1)*0.8);
		}
	}

	return FGPC_LoginView;
})(FG_LoginView)


/**
*@Name :fg竖版登录
*@Version :1.0
*@Date :2023/8/30
*@Time :17:13:46
*@Author :一个外星人
*@QQ :1735968022
*/
//class game.FG.FGV_LoginView extends game.FG.FG_LoginView
var FGV_LoginView=(function(_super){
	function FGV_LoginView(){
		FGV_LoginView.__super.call(this);
	}

	__class(FGV_LoginView,'game.FG.FGV_LoginView',_super);
	var __proto=FGV_LoginView.prototype;
	__proto.handleLoadingLoaded=function(e){
		game.CQ.LoginView.prototype.handleLoadingLoaded.call(this,e);
		this.addFps();
	}

	__proto.addFps=function(){
		MyPingAndFPS.instance.showView(false);
		MyPingAndFPS.instance.setBgVisible(false);
		MyPingAndFPS.instance.setOffectPoint(-(642-MyPingAndFPS.instance.panelUI.width)+50,82);
	}

	/**添加布局 */
	__proto.addLayouts=function(){
		Lay.addScale(this.panel2._gTop,[
		Lay.style.WINDOWS_CENTER_X,
		Lay.style.WINDOWS_UP_Y,
		Lay.style.ZOOM_WINDOWSWIDTH]);
		Lay.addScale(this.panel2._gBottom,[
		Lay.style.WINDOWS_CENTER_X,
		Lay.style.WINDOWS_DOWN_Y,
		Lay.style.ZOOM_WINDOWSWIDTH]);
		Lay.addScale(this.panel2._gBg,[
		Lay.style.WINDOWS_CENTER_X,
		Lay.style.WINDOWS_CENTER_Y,
		Lay.style.STRETCH_WINDOWSWIDTH,
		Lay.style.STRETCH_WINDOWSHEIGHT]);
		Lay.addSize(this.panel2._imgLogo,[
		Lay.style.WINDOWS_CENTER_X,
		Lay.style.DOWN_Y,
		Lay.style.ZOOM_RELATIVE_WIDTH,
		Lay.style.ZOOM_RELATIVE_HEIGHT+"@"+642/1389,]);
		Lay.addScale(this.panel2.loging_ui,[
		Lay.style.WINDOWS_CENTER_X,
		Lay.style.WINDOWS_CENTER_Y,
		Lay.style.ZOOM_RELATIVE_WIDTH,]);
		Lay.updateLayoutDelay();
	}

	/**移除布局 */
	__proto.removeLayouts=function(){
		Lay.removeLayout(this.panel2._gTop);
		Lay.removeLayout(this.panel2._gBottom);
		Lay.removeLayout(this.panel2._gBg);
		Lay.removeLayout(this.panel2._imgLogo);
		Lay.removeLayout(this.panel2.loging_ui);
	}

	__proto.addEvent=function(){
		game.CQ.LoginView.prototype.addEvent.call(this);
		this.addLayouts();
	}

	__proto.removeEvent=function(){
		game.CQ.LoginView.prototype.removeEvent.call(this);
		this.removeLayouts();
	}

	__proto.getUIClass=function(){
		return FGV_PreLoginUI;
	}

	__proto.getLoginUrl=function(){
		return "res/atlas/loginUI/FGV_PreLogin.atlas";
	}

	__proto.handlerResize=function(e){}
	__getset(0,__proto,'panel2',function(){
		return this.mLoginMC;
	});

	return FGV_LoginView;
})(FG_LoginView)



})(window,document,Laya);

if (typeof define === 'function' && define.amd){
	define('laya.core', ['require', "exports"], function(require, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        for (var i in Laya) {
			var o = Laya[i];
            o && o.__isclass && (exports[i] = o);
        }
    });
}