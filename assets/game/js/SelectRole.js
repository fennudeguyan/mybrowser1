
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var AlertBox=compatible.panel.alert.AlertBox,Animation=laya.display.Animation,Box=laya.ui.Box,Browser=laya.utils.Browser;
	var Button=laya.ui.Button,CsgGetRandName=compatible.protocal.CsgGetRandName,Event=laya.events.Event,FEventDispatcher=compatible.base.FEventDispatcher;
	var FLoader=compatible.base.FLoader,GameStepDataManager=compatible.manager.GameStepDataManager,GlobalUnitID=compatible.GlobalUnitID;
	var GlobalUtils=compatible.utils.GlobalUtils,Handler=laya.utils.Handler,Image=laya.ui.Image,JisumoshiDataManager=compatible.manager.JisumoshiDataManager;
	var Label=laya.ui.Label,Lay=compatible.lay.Lay,Loader=laya.net.Loader,LoaderSound=Laya.LoaderSound,MConfig=Laya.MConfig;
	var M_MyVScroll=compatible.panel.scroll.M_MyVScroll,MsgGetRandName=compatible.protocal.MsgGetRandName,MySDKBase=compatible.sdk.MySDKBase;
	var NetChar=Laya.NetChar,NetSelectRoleClient=compatible.net.NetSelectRoleClient,PixesBkSound=Laya.PixesBkSound;
	var ReportDataManager=compatible.manager.ReportDataManager,SelectRoleDataManager=compatible.manager.selectRole.SelectRoleDataManager;
	var SelectRoleReConnectDataManager=compatible.manager.selectRole.SelectRoleReConnectDataManager,ServerDataManage=compatible.manager.ServerDataManage;
	var ServerItemInfo=compatible.manager.server.ServerItemInfo,Sprite=laya.display.Sprite,TLConfig=Laya.TLConfig;
	var TLTools=compatible.tools.TLTools,TextInput=laya.ui.TextInput,UtilAlert=compatible.panel.UtilAlert,View=laya.ui.View;
	var ViewBaseEx=compatible.panel.base.ViewBaseEx,WeixinMConfig=compatible.agent.weixin.WeixinMConfig,mytrace=Laya.mytrace;
//class app.SelectRoleResConst
var SelectRoleResConst=(function(){
	function SelectRoleResConst(){}
	__class(SelectRoleResConst,'app.SelectRoleResConst');
	SelectRoleResConst.getSelectUIRes=function(){
		var resUrl;
		if(TLConfig.onPC){
			resUrl=["res/atlas/fg_mobile/m_loginUI.atlas","res/atlas/fg_mobile/m_loginPCUI.atlas"];
		}
		else{
			if(TLConfig.mobileVertical){
				resUrl=["res/atlas/fgv_mobile/selectRole.atlas"];
				}else {
				resUrl=["res/atlas/fg_mobile/m_loginUI.atlas","res/atlas/fg_mobile/m_loginModeUI.atlas"]
			}
		}
		return resUrl;
	}

	SelectRoleResConst.getSelctRoleBG=function(){
		var name=GlobalUnitID.getAgentBGUrlHead()+"/selRolePage/";
		if(TLConfig.onPC)
			name+="pc_bg.jpg";
		else
		name+="mobile_bg.jpg";
		return name;
	}

	SelectRoleResConst.TPL_ROLENAMEPOOL="RoleNamePool.mpp";
	SelectRoleResConst.MUI_LOGIN="res/atlas/mobile/m_loginUI.atlas";
	SelectRoleResConst.UI_MLOADING="res/atlas/mobile/m_loadingUI.atlas";
	SelectRoleResConst.FGMUI_MLOADING="res/atlas/mobile/fgm_loadingUI.atlas";
	SelectRoleResConst.FGVUI_MLOADING="res/atlas/mobile/fgv_loding.atlas";
	return SelectRoleResConst;
})()


//class fg_panel.FG_CreateRoleView extends compatible.base.FEventDispatcher
var FG_CreateRoleView=(function(_super){
	function FG_CreateRoleView(owner){
		this._owner=null;
		this.arrBtnSex=null;
		this.curSelectJobIndex=0;
		this.curSelectSexIndex=0;
		this.inputName=null;
		this.btnRandom=null;
		this.btnCreate=null;
		this.btnClose=null;
		this.createModel=null;
		this.boxCreateModel=null;
		FG_CreateRoleView.__super.call(this);
		this._owner=owner;
		this.initView();
	}

	__class(FG_CreateRoleView,'fg_panel.FG_CreateRoleView',_super);
	var __proto=FG_CreateRoleView.prototype;
	__proto.initView=function(){
		this.inputName=this._owner.txtInput;
		if(this.inputName){
			this.inputName.text="";
			this.inputName.maxChars=7;
		}
		this.btnCreate=this._owner.btnCreate;
		this.btnRandom=this._owner.randomBtn;
		this.btnClose=this._owner.btnClose;
		this.boxCreateModel=this._owner.boxCreateModel;
		if(!this.createModel){
			this.createModel=new FG_SelectRoleModel();
			this.createModel.setSelected(0);
			this.boxCreateModel.addChild(this.createModel);
		}
		this.initArrBtnSex();
	}

	__proto.initArrBtnSex=function(){
		this.arrBtnSex=[];
		this.arrBtnSex.push(this._owner.btn_0);
		this.arrBtnSex.push(this._owner.btn_1);
	}

	// }
	__proto.onNetBackName=function(randomName){
		if(this.inputName){
			this.inputName.text=randomName;
		}
	}

	__proto.addEvent=function(){
		var btn;
		for(var $each_btn in this.arrBtnSex){
			btn=this.arrBtnSex[$each_btn];
			btn.on("click",this,this.onBtnSexClick)
		}
		if(this.btnRandom){
			this.btnRandom.on("click",this,this.onBtnRandomNameClick);
		}
		if(this.btnCreate){
			this.btnCreate.on("click",this,this.onBtnCreateClick);
		}
		if(this.btnClose){
			this.btnClose.on("click",this,this.onBtnCloseClick);
		}
		SelectRoleViewManager.instance.on("EVENT_CREATE_RANDOMNAMEBACK",this,this.onNetBackName);
	}

	__proto.removeEvent=function(){
		var btn;
		for(var $each_btn in this.arrBtnSex){
			btn=this.arrBtnSex[$each_btn];
			btn.off("click",this,this.onBtnSexClick)
		}
		if(this.btnRandom){
			this.btnRandom.off("click",this,this.onBtnRandomNameClick);
		}
		if(this.btnCreate){
			this.btnCreate.off("click",this,this.onBtnCreateClick);
		}
		if(this.btnClose){
			this.btnClose.off("click",this,this.onBtnCloseClick);
		}
		SelectRoleViewManager.instance.off("EVENT_CREATE_RANDOMNAMEBACK",this,this.onNetBackName);
	}

	__proto.onBtnCreateClick=function(e){
		LoaderSound.instance().playBtnCommon();
		if(TLTools.instance.mySDKLogin){
			var nameStr=this.inputName.text;
			TLTools.instance.mySDKLogin.checkMsgStr(1,nameStr,{channelId:501},
			Handler.create(this,this.onCheckMsgStrOK),Handler.create(this,this.onCheckMsgStrFaild));
		}
		else
		this.onEnterGame();
	}

	__proto.onCheckMsgStrFaild=function(id,msgStr,param){}
	__proto.onCheckMsgStrOK=function(id,msgStr,param){
		if(id==1){
			this.onEnterGame();
		}
	}

	__proto.onEnterGame=function(){
		SelectRoleViewManager.instance.sendCreateRole(this.inputName.text,this.curSelectJobIndex,this.curSelectSexIndex);
	}

	__proto.onBtnRandomNameClick=function(e){
		LoaderSound.instance().playBtnCommon();
		SelectRoleViewManager.instance.sendRandomName(this.curSelectSexIndex);
	}

	__proto.getUrl=function(){
		return "fg_mobile/m_loginUI/";
	}

	__proto.selectSexByIndex=function(newIndex){
		var oldBtn=this.arrBtnSex[this.curSelectSexIndex];
		if(oldBtn)
			oldBtn.selected=false;
		var newBtn=this.arrBtnSex[newIndex];
		if(newBtn)
			newBtn.selected=true;
		if(this.createModel){
			this.createModel.setInfo(newIndex);
		}
		this.curSelectSexIndex=newIndex;
		SelectRoleViewManager.instance.selectCreateRole(this.curSelectJobIndex,this.curSelectSexIndex);
	}

	// }
	__proto.onBtnCloseClick=function(){
		LoaderSound.instance().playBtnCommon();
		this.theClose();
	}

	// }
	__proto.onBtnSexClick=function(e){
		LoaderSound.instance().playBtnCommon();
		var index=this.arrBtnSex.indexOf(e.target);
		this.selectSexByIndex(index);
	}

	__proto.theOpen=function(){
		this.addEvent();
		this.selectSexByIndex(this.curSelectSexIndex);
		if(this.inputName.text==""){
			SelectRoleViewManager.instance.sendRandomName(this.curSelectSexIndex);
		}
		SelectRoleViewManager.instance.selectCreateRole(this.curSelectJobIndex,this.curSelectSexIndex);
	}

	__proto.theClose=function(){
		this.removeEvent();
		this._owner.viewUI.btnClose.visible=false;
		this._owner.createCtn.visible=false;
		SelectRoleViewManager.instance.closeCreatePanel();
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		if(this.createModel){
			this.createModel.destroy();
			this.createModel=null;
		}
		this.theClose();
	}

	__getset(0,__proto,'visible',function(){
		return this._owner.createCtn.visible;
		},function(vi){
		this._owner.createCtn.visible=vi;
		if(vi){
			this.theOpen();
		}
	});

	return FG_CreateRoleView;
})(FEventDispatcher)


//class manager.SelectRoleViewManager extends compatible.base.FEventDispatcher
var SelectRoleViewManager=(function(_super){
	function SelectRoleViewManager(){
		this._curSelectRole=null;
		SelectRoleViewManager.__super.call(this);
	}

	__class(SelectRoleViewManager,'manager.SelectRoleViewManager',_super);
	var __proto=SelectRoleViewManager.prototype;
	__proto.showCreateRole=function(){
		this.event("EVENT_SHOWCREATEROLE");
	}

	/**选择当前角色*/
	__proto.selectCurRole=function(info,showEff){
		(showEff===void 0)&& (showEff=false);
		this._curSelectRole=info;
		this.event("EVENT_SELECT_SELECTROLE",[info,showEff]);
	}

	__proto.getSelectRole=function(){
		return this._curSelectRole;
	}

	/**删除角色*/
	__proto.deleteRole=function(role){
		var _$this=this;
		if(!role)
			return;
		AlertBox.instance.show({txt:"你确定要删除角色"+role.mName+"吗?",fun:callback});
		function callback (id,alert){
			if(id !=1)return;
			SelectRoleDataManager.instance.delRole(role);
			if(role==_$this._curSelectRole)
				_$this._curSelectRole=null;
		}
	}

	/**创建面板 选择当前职业 性别*/
	__proto.selectCreateRole=function(job,sex){
		this.event("EVENT_CREATE_SELECTROLE",[sex,job]);
	}

	__proto.closeCreatePanel=function(){
		this.event("EVENT_CREATE_CLOSEPANEL");
	}

	/**进入游戏*/
	__proto.sendEnterGame=function(){
		if(!this._curSelectRole)
			return;
		if(!this._curSelectRole)return;
		if(this._curSelectRole.bJinYong==1){
			AlertBox.instance.show({txt:"此角色已被禁用!",fun:callback});
			function callback (id,alert){
				return;
			}
			return;
		}
		TLTools.showMiniLoading(true);
		MConfig.roleLevel=this._curSelectRole.mLevel;
		MConfig.roleName=this._curSelectRole.mName;
		MConfig.RoleId=this._curSelectRole.RoleIndex;
		MConfig.RoleIdString=this._curSelectRole.RoleIndexString;
		SelectRoleDataManager.instance.saveChar(this._curSelectRole);
		SelectRoleDataManager.instance.startGame();
	}

	__proto.sendRandomName=function(sex){
		CsgGetRandName.SendMsg(sex % 2);
	}

	__proto.sendCreateRole=function(name,job,sex){
		var serveInfo=ServerDataManage.instance.getCurServerInfo();
		if(serveInfo && serveInfo.isBaoman()){
			UtilAlert.Instance.alertMessage("本服务器注册人数已满，请返回选择最新的区创建!");
			return;
		}
		TLTools.showMiniLoading(true);
		var result=SelectRoleDataManager.instance.createRole(name,job,sex);
		if(!result){
		}
		LoaderSound.instance().play(102);
	}

	__proto.onNetBackName=function(msg){
		this.event("EVENT_CREATE_RANDOMNAMEBACK",msg.RandName);
	}

	__proto.addEvent=function(){
		NetSelectRoleClient.instance().on("NE_RANDCREATROLENAME",this,this.onNetBackName);
		SelectRoleDataManager.instance.on("EVENT_ENTERROLEGAME",this,this.handleStartPlay);
		SelectRoleDataManager.instance.on("EVENT_DELROLE_OK",this,this.onNetDelChrSucess);
		SelectRoleDataManager.instance.on("EVENT_CREATEROLE_OK",this,this.onCreateRoleOK);
	}

	__proto.removeEvent=function(){
		NetSelectRoleClient.instance().off("NE_RANDCREATROLENAME",this,this.onNetBackName);
		SelectRoleDataManager.instance.off("EVENT_ENTERROLEGAME",this,this.handleStartPlay);
		SelectRoleDataManager.instance.off("EVENT_DELROLE_OK",this,this.onNetDelChrSucess);
		SelectRoleDataManager.instance.off("EVENT_CREATEROLE_OK",this,this.onCreateRoleOK);
	}

	__proto.onNetDelChrSucess=function(){
		this.event("EVENT_SELECT_DELETEROLE");
	}

	__proto.onCreateRoleOK=function(role){
		this._curSelectRole=role;
	}

	//角色选测成功 进入游戏
	__proto.handleStartPlay=function(emParam){
		if(this._curSelectRole)
			MConfig.createRoleTime=this._curSelectRole.createTime;
		ServerDataManage.instance.sendLoginToServer(MConfig.RealServerId);
		this.event("EVENT_SELECT_ENTERGAME");
	}

	__getset(1,SelectRoleViewManager,'instance',function(){
		if (SelectRoleViewManager.m_instance==null){
			SelectRoleViewManager.m_instance=new SelectRoleViewManager;
		}
		return SelectRoleViewManager.m_instance;
	},compatible.base.FEventDispatcher._$SET_instance);

	SelectRoleViewManager.EVENT_CREATE_SELECTROLE="EVENT_CREATE_SELECTROLE";
	SelectRoleViewManager.EVENT_CREATE_RANDOMNAMEBACK="EVENT_CREATE_RANDOMNAMEBACK";
	SelectRoleViewManager.EVENT_SELECT_ENTERGAME="EVENT_SELECT_ENTERGAME";
	SelectRoleViewManager.EVENT_SELECT_SELECTROLE="EVENT_SELECT_SELECTROLE";
	SelectRoleViewManager.EVENT_SELECT_DELETEROLE="EVENT_SELECT_DELETEROLE";
	SelectRoleViewManager.EVENT_CREATE_CLOSEPANEL="EVENT_CREATE_CLOSEPANEL";
	SelectRoleViewManager.EVENT_SHOWCREATEROLE="EVENT_SHOWCREATEROLE";
	SelectRoleViewManager.EVENT_DOUBLECLICK_ENTER_GAME="EVENT_DOUBLECLICK_ENTER_GAME";
	SelectRoleViewManager.m_instance=null;
	return SelectRoleViewManager;
})(FEventDispatcher)


//class app.SelectRoleMain extends laya.display.Sprite
var SelectRoleMain=(function(_super){
	function SelectRoleMain(){
		this._floader=null;
		this.mSelectCharacter=null;
		SelectRoleMain.__super.call(this);
		mytrace("SelectRoleMain 初始化");
		GameStepDataManager.instance.setStep(2);
	}

	__class(SelectRoleMain,'app.SelectRoleMain',_super);
	var __proto=SelectRoleMain.prototype;
	__proto.initSelectRoleMain=function(){
		this._floader=new FLoader();
		this._floader.loaderType="atlas";
		this.startLoadSelect();
	}

	__proto.startLoadSelect=function(){
		mytrace("开始加载选角色面板资源");
		if(this._floader){
			this._floader.on("complete",this,this.onLoadSelectComplete);
			var resUrl;
			resUrl=SelectRoleResConst.getSelectUIRes();
			this._floader.load(resUrl);
		}
	}

	// 测试
	__proto.onLoadSelectComplete=function(e){
		mytrace("选角色面板资源加载完成");
		e.off("complete",this,this.onLoadSelectComplete);
		this.EnterSelectCharacter();
		ReportDataManager.instance.sendEnterSelectRoleMain();
	}

	__proto.EnterSelectCharacter=function(){
		mytrace("显示选角色面板");
		if(!this.mSelectCharacter){
			if(MConfig.isFGMode()){
				this.mSelectCharacter=new FG_ModeSelectCharacter();
			}
			this.addChild(this.mSelectCharacter);
			this.mSelectCharacter.on("complete",this,this.onSelectRoleCompolete);
		}
		this.mSelectCharacter.TheInit();
	}

	__proto.LeaveSelectCharacter=function(){
		FLoader.clearRes("res/atlas/mobile/m_loginUI.atlas");
		if(this._floader){
			this._floader.clear();
			this._floader=null;
		};
		var arrRes=SelectRoleResConst.getSelectUIRes();
		if(arrRes){
			var resStr;
			for(var $each_resStr in arrRes){
				resStr=arrRes[$each_resStr];
				Laya.loader.clearRes(resStr);
			}
		}
		if (this.mSelectCharacter){
			this.mSelectCharacter.destroy();
			this.mSelectCharacter=null;
		}
		if(Browser.onMiniGame){
			WeixinMConfig.clearMiniMemory();
		}
	}

	//用来触发进入游戏
	__proto.onSelectRoleCompolete=function(e){
		this.event("complete");
	}

	return SelectRoleMain;
})(Sprite)


//class fgv_panel.FGV_SpriteRoleItem extends laya.display.Sprite
var FGV_SpriteRoleItem=(function(_super){
	function FGV_SpriteRoleItem(){
		FGV_SpriteRoleItem.__super.call(this);
		this.width=267;
		this.height=359;
	}

	__class(FGV_SpriteRoleItem,'fgv_panel.FGV_SpriteRoleItem',_super);
	return FGV_SpriteRoleItem;
})(Sprite)


//class fg_panel.FG_ModeSelectCharacter extends compatible.panel.base.ViewBaseEx
var FG_ModeSelectCharacter=(function(_super){
	function FG_ModeSelectCharacter(){
		this.mcBG=null;
		this.btnStart=null;
		this.imgTai=null;
		this.boxCreateModel=null;
		this.boxRoleItem=null;
		this.spAvators=null;
		this.createCtn=null;
		this.txtInput=null;
		this.randomBtn=null;
		this.sp_createC=null;
		this.btn_0=null;
		this.btn_1=null;
		this.severNameTxt=null;
		this.btnCreate=null;
		this.btnClose=null;
		this.btnDel=null;
		this.curSelectJobIndex=0;
		this.createRoleView=null;
		this.arrRoleInfoItems=null;
		//角色信息
		this.createModel=null;
		this._model=null;
		this._scaleX=1;
		this._scaleY=1;
		this._zs1Eff=null;
		this._zs2Eff=null;
		this._zs3Eff=null;
		this._zs4Eff=null;
		this._zs5Eff=null;
		this._curRole=null;
		FG_ModeSelectCharacter.__super.call(this);
	}

	__class(FG_ModeSelectCharacter,'fg_panel.FG_ModeSelectCharacter',_super);
	var __proto=FG_ModeSelectCharacter.prototype;
	__proto.getUIClass=function(){
		return FG_SelectRolePanelUI;
	}

	__proto.initUI=function(){
		this.createUI(this.getUIClass());
		this.curSelectJobIndex=0;
		this.arrRoleInfoItems=[];
		this.viewUI.severNameTxt.text=ServerDataManage.instance.getCurServerInfo().menuname;
		if (!this.createRoleView){
			this.createRoleView=new FG_CreateRoleView(this);
			this.createRoleView.visible=false;
		}
		if(TLConfig.onPC){
			this.mcBG.skin=GlobalUnitID.getAgentBGUrlHead()+"/selRolePage/pc_bg.jpg";
		}
		this._zs1Eff=new Animation();
		this._zs1Eff=GlobalUtils.createAtlasAni("res/atlas/anims/selectRoleEff","selectRoleEff1",83,true,false)[0];
		this.viewUI.addChildAt(this._zs1Eff,1);
		this._zs1Eff.play(0,true);
		this._zs1Eff.pos(380,50);
		this._zs2Eff=new Animation();
		this._zs2Eff=GlobalUtils.createAtlasAni("res/atlas/anims/selectRoleEff","selectRoleEff2",83,true,false)[0];
		this.viewUI.addChildAt(this._zs2Eff,2);
		this._zs2Eff.play(0,true);
		this._zs2Eff.pos(430,20);
		this._zs3Eff=new Animation();
		this._zs3Eff=GlobalUtils.createAtlasAni("res/atlas/anims/selectRoleEff","selectRoleEff1",83,true,false)[0];
		this.viewUI.addChildAt(this._zs3Eff,3);
		this._zs3Eff.play(0,true);
		this._zs3Eff.pos(570,10);
		this._zs4Eff=new Animation();
		this._zs4Eff=GlobalUtils.createAtlasAni("res/atlas/anims/selectRoleEff","selectRoleEff1",83,true,false)[0];
		this.viewUI.addChildAt(this._zs4Eff,4);
		this._zs4Eff.play(0,true);
		this._zs4Eff.pos(830,240);
		this._zs5Eff=new Animation();
		this._zs5Eff=GlobalUtils.createAtlasAni("res/atlas/anims/selectRoleEff","selectRoleEff1",83,true,false)[0];
		this.viewUI.addChildAt(this._zs5Eff,5);
		this._zs5Eff.play(0,true);
		this._zs5Eff.pos(480,360);
		this._model=new FG_SelectRoleModel();
		this.viewUI.boxRoleItem.addChild(this._model);
		this.viewUI.btnClose.visible=false;
		this.initRoleList(this.arrRoleInfoItems);
		this.viewUI.boxCreateModel.visible=false;
		this._scaleX=this.viewUI.imgTai.x / 1296;
		this._scaleY=this.viewUI.imgTai.y / 600
		this.resize();
	}

	/**初始化角色列表 */
	__proto.initRoleList=function(arrRoleInfoItems){
		var infoItem;
		var sp;
		for (var i=0;i < 3;i++){
			infoItem=this.clearSeletRoleInfoItem(i);
			infoItem.theOpen();
			sp=this.viewUI.spAvators.getChildAt(i);
			if (sp){
				arrRoleInfoItems.push(infoItem);
				sp.addChild(infoItem);
			}
		}
	}

	// boxRoleItem.width=infoItem.width *SelectRoleDataManager.MAX_ROLE_NUM;
	__proto.clearSeletRoleInfoItem=function(index){
		return new FG_SelectRoleInfoItem(this,index);
	}

	/**
	*
	*@param session_id
	*@param Session_key
	*@param AuthType
	*@param youke_session_id
	*@param authid
	*/
	__proto.TheInit=function(){
		this.addEvent();
		this.loaderFinished();
		this.resize();
	}

	/**
	*加载完成(选择角色)
	*/
	__proto.loaderFinished=function(){
		SelectRoleReConnectDataManager.instance.startConnect(false,true);
	}

	//第一次请求1500
	__proto.showPanel=function(){
		this.showRoleList();
		if (SelectRoleDataManager.instance.getRoleList().length==0){
			this.showCreateView();
		}
		TLTools.instance.leaveSelectServer();
		TLTools.instance.enterSelectRole();
	}

	__proto.showCreateView=function(){
		if (this.createRoleView.visible)
			return;
		if (SelectRoleDataManager.instance.getRoleList().length >=3){
			AlertBox.instance.show({arr:[{name:"确定",id:1}],txt:"角色数超过"+3+"个",fun:null});
			return;
		}
		this.createRoleView.visible=this.viewUI.boxCreateModel.visible=this.viewUI.btnCreate.visible=true;
		this.viewUI.boxRoleItem.visible=this.viewUI.btnDel.visible=this.viewUI.btnStart.visible=this.viewUI.boxRoleItem.visible=false;
		this.resize();
		for (var i=0;i < this.arrRoleInfoItems.length;i++){
			var item=this.arrRoleInfoItems[i];
			item.setDisabled(true);
		}
	}

	__proto.onCreateRoleViewClose=function(target){
		LoaderSound.instance().playBtnCommon();
		var arr=SelectRoleDataManager.instance.getRoleList();
		if (!arr || arr.length==0)
			return;
		this.viewUI.btnStart.disabled=true;
		SelectRoleViewManager.instance.closeCreatePanel();
		this.viewUI.btnCreate.visible=this.viewUI.boxCreateModel.visible=this.viewUI.btnClose.visible=false;
		this.viewUI.btnStart.visible=this.viewUI.boxRoleItem.visible=true;
	}

	__proto.onShowCreateRole=function(){
		this.showCreateView();
	}

	/**展示角色列表*/
	__proto.showRoleList=function(){
		if (this.viewUI.btnStart.disabled)
			return;
		var arr=SelectRoleDataManager.instance.getRoleList();
		this.viewUI.btnCreate.visible=arr.length==0;
		this.viewUI.btnDel.visible=arr.length > 0;
		var selRole=arr[SelectRoleDataManager.instance.lastEntryChar];
		var nullNum=0;
		for (var i=0;i < 3;i++){
			var item=this.arrRoleInfoItems[i];
			var info=arr[i];
			item.showView(info,i);
			if (!selRole){
				selRole=info;
			}
			item.setSelected(selRole==info);
			if (!info){
				nullNum++;
			}
			item.visible=nullNum <=1;
			if (info && selRole==info){
				this._model.setInfo(info.mGender);
				this._model.setSelected(1);
			}
		}
		SelectRoleViewManager.instance.selectCurRole(selRole);
	}

	__proto.onDelClick=function(e){
		LoaderSound.instance().playBtnCommon();
		if (this._curRole){
			SelectRoleViewManager.instance.deleteRole(this._curRole);
		}
	}

	__proto.onSelectCurRole=function(role,showEff){
		this._curRole=role;
		var item;
		for (var i=0;i < this.arrRoleInfoItems.length;i++){
			item=this.arrRoleInfoItems[i];
			item.setSelected(item.getCurNetChar()==role);
			if (item.getCurNetChar()==role){
				if (role)
					this._model.setInfo(item.getCurNetChar().mGender);
			}
		}
	}

	// _model.setSelected(0);
	__proto.onModelClick=function(role){
		if (this.viewUI.createCtn.visible){
			return;
		}
		else{
			SelectRoleViewManager.instance.selectCurRole(role,true);
		}
	}

	__proto.getUrl=function(){
		return "fg_mobile/m_loginModeUI/";
	}

	__proto.addEvent=function(){
		if (this.viewUI.btnDel){
			this.viewUI.btnDel.on("click",this,this.onDelClick);
		}
		if (this.viewUI.btnStart){
			this.viewUI.btnStart.on("click",this,this.onBtnEnterGameClick);
		}
		if (this.viewUI.btnCreate){
			this.viewUI.btnCreate.on("click",this,this.onCreateRoleViewClose);
		}
		SelectRoleDataManager.instance.on("EVENT_SHOW_ROLE",this,this.showPanel);
		SelectRoleDataManager.instance.addEvent();
		SelectRoleViewManager.instance.addEvent();
		SelectRoleViewManager.instance.on("EVENT_SELECT_ENTERGAME",this,this.onEnterGameOK);
		SelectRoleViewManager.instance.on("EVENT_SELECT_DELETEROLE",this,this.onDelRoleOK);
		SelectRoleViewManager.instance.on("EVENT_SELECT_SELECTROLE",this,this.onSelectCurRole);
		SelectRoleViewManager.instance.on("EVENT_CREATE_CLOSEPANEL",this,this.onCloseCreatePanel);
		SelectRoleViewManager.instance.on("EVENT_SHOWCREATEROLE",this,this.onShowCreateRole);
		SelectRoleViewManager.instance.on("EVENT_DOUBLECLICK_ENTER_GAME",this,this.onStartEnterGame);
		this.stage.on("resize",this,this.onResizeFun);
	}

	__proto.removeEvent=function(){
		if (this.viewUI.btnDel){
			this.viewUI.btnDel.off("click",this,this.onDelClick);
		}
		if (this.viewUI.btnStart){
			this.viewUI.btnStart.off("click",this,this.onBtnEnterGameClick);
		}
		if (this.viewUI.btnCreate){
			this.viewUI.btnCreate.off("click",this,this.onCreateRoleViewClose);
		}
		SelectRoleDataManager.instance.off("EVENT_SHOW_ROLE",this,this.showPanel);
		SelectRoleDataManager.instance.removeEvent();
		SelectRoleViewManager.instance.removeEvent();
		SelectRoleViewManager.instance.off("EVENT_SELECT_ENTERGAME",this,this.onEnterGameOK);
		SelectRoleViewManager.instance.off("EVENT_SELECT_DELETEROLE",this,this.onDelRoleOK);
		SelectRoleViewManager.instance.off("EVENT_SELECT_SELECTROLE",this,this.onSelectCurRole);
		SelectRoleViewManager.instance.off("EVENT_CREATE_CLOSEPANEL",this,this.onCloseCreatePanel);
		SelectRoleViewManager.instance.off("EVENT_SHOWCREATEROLE",this,this.onShowCreateRole);
		SelectRoleViewManager.instance.off("EVENT_DOUBLECLICK_ENTER_GAME",this,this.onStartEnterGame);
		this.stage.off("resize",this,this.onResizeFun);
	}

	__proto.onStartEnterGame=function(){
		this.onBtnEnterGameClick();
	}

	__proto.onEnterGameOK=function(){
		this.event("complete");
	}

	__proto.onDelRoleOK=function(){
		this.showPanel();
	}

	__proto.onCloseCreatePanel=function(){
		this.showPanel();
		this.createRoleView.visible=false;
		this.viewUI.boxRoleItem.visible=true;
		this.viewUI.boxCreateModel.visible=false;
		this.viewUI.btnStart.disabled=false;
		this.viewUI.btnStart.visible=true;
		for (var i=0;i < this.arrRoleInfoItems.length;i++){
			var item=this.arrRoleInfoItems[i];
			item.setDisabled(false);
		}
	}

	__proto.onBtnEnterGameClick=function(){
		this.viewUI.btnStart.disabled=true;
		LoaderSound.instance().playBtnCommon();
		PixesBkSound.instance.play("");
		SelectRoleViewManager.instance.sendEnterGame();
	}

	__proto.onBtnCreateClick=function(e){
		LoaderSound.instance().playBtnCommon();
		this.showCreateView();
	}

	__proto.onBtnDeleteClick=function(e){
		LoaderSound.instance().playBtnCommon();
		SelectRoleViewManager.instance.deleteRole(null);
	}

	/**
	*@param e
	*/
	__proto.onResizeFun=function(e){
		this.resize();
	}

	// }
	__proto.clearRoleItems=function(){
		if (this.arrRoleInfoItems){
			for (var i=0;i < this.arrRoleInfoItems.length;i++){
				var item=this.arrRoleInfoItems[i];
				item.destroy();
			}
			this.arrRoleInfoItems.length=0;
		}
	}

	__proto.resize=function(){
		if(TLConfig.onPC){
			this.x=TLConfig.stageWidth-this.width >> 1;
			this.y=TLConfig.stageHeight-this.height >> 1;
			this.viewUI.mcBG.width=TLConfig.stageWidth;
			this.viewUI.mcBG.height=TLConfig.stageHeight;
			this.viewUI.mcBG.x=-1 *this.x;
			this.viewUI.mcBG.y=-1 *this.y;
		}
		else{
			this.viewUI.mcBG.width=TLConfig.stageWidth;
			this.viewUI.mcBG.height=TLConfig.stageHeight;
			var bili=1296 / 600;
			var biliCur=TLConfig.stageWidth / TLConfig.stageHeight;
			if (bili < biliCur){
				var xbili=TLConfig.stageWidth / 1296;
				this.viewUI.mcBG.height=xbili *600;
			}
			else{
				var ybili=TLConfig.stageHeight / 600;
				this.viewUI.mcBG.width=ybili *1296;
			}
			this.viewUI.mcBG.x=TLConfig.stageWidth-this.viewUI.mcBG.width >> 1;
			this.viewUI.mcBG.y=TLConfig.stageHeight-this.viewUI.mcBG.height >> 1;
		}
		this.viewUI.btnClose.x=50;
		this.viewUI.btnClose.y=10;
	}

	// viewUI.spAvators.y=TLConfig.stageHeight-556 >> 1;
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this.removeEvent();
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
		if (this.createRoleView){
			this.createRoleView.destroy();
			this.createRoleView=null;
		}
		this.clearRoleItems();
		_super.prototype.destroy.call(this);
	}

	__getset(0,__proto,'viewUI',function(){
		return this;
	});

	return FG_ModeSelectCharacter;
})(ViewBaseEx)


//class fg_panel.FG_SelectRoleInfoItem extends compatible.panel.base.ViewBaseEx
var FG_SelectRoleInfoItem=(function(_super){
	function FG_SelectRoleInfoItem(owner,index,url){
		this.imgSelectCtn=null;
		this.imgSelectBG=null;
		this.btnDel=null;
		this.imgAvator=null;
		this.btnCreate=null;
		this.labGen=null;
		this.txtName=null;
		this._owner=null;
		this._curNetChar=null;
		this._index=0;
		this._defModelY=0;
		this._owner=owner;
		this._index=index;
		FG_SelectRoleInfoItem.__super.call(this,url);
	}

	__class(FG_SelectRoleInfoItem,'fg_panel.FG_SelectRoleInfoItem',_super);
	var __proto=FG_SelectRoleInfoItem.prototype;
	__proto.getUIClass=function(){
		return FG_SelectRoleInfoItemUI;
	}

	__proto.initUI=function(){
		this.createUI(this.getUIClass());
	}

	__proto.showView=function(netChar,index){
		this._curNetChar=netChar;
		if (netChar){
			this.labGen.visible=this.imgSelectCtn.visible=this.txtName.visible=this.imgAvator.visible=true;
			this.btnCreate.visible=false;
			this.txtName.text=GlobalUtils.removeQuhao(netChar.mName);
			this.imgAvator.visible=true;
			var index=netChar.sex=="男" ? 1 :0;
			this.imgAvator.skin="fg_mobile/m_loginUI/avator_"+index+".png";
			this.labGen.text="等级 "+Math.floor(netChar.mAge / 100);
		}
		else{
			this.labGen.visible=this.imgSelectCtn.visible=this.txtName.visible=this.imgAvator.visible=false;
			this.btnCreate.visible=true;
		}
		this.imgSelectCtn.visible=netChar !=null;
	}

	__proto.isHaveRole=function(){
		return this._curNetChar !=null;
	}

	__proto.getCurNetChar=function(){
		return this._curNetChar;
	}

	__proto.setSelected=function(bo){
		this.imgSelectBG.visible=bo;
		this.txtName.color=bo ? "#DDD9D3" :"#FDF6D5";
		if (!this.isHaveRole()){
			this.imgSelectBG.visible=false;
		}
	}

	__proto.setDisabled=function(vi){}
	__proto.addEvent=function(){
		this.on("click",this,this.onSelectClick);
		this.on("doubleclick",this,this.onDoubleClick);
	}

	__proto.removeEvent=function(){
		this.off("click",this,this.onSelectClick);
		this.off("doubleclick",this,this.onDoubleClick);
	}

	__proto.onDoubleClick=function(){
		this.showSelectRole();
		Laya.timer.once(100,this,function(){
			SelectRoleViewManager.instance.event("EVENT_DOUBLECLICK_ENTER_GAME");
		})
	}

	__proto.onSelectClick=function(e){
		LoaderSound.instance().playBtnCommon();
		switch (e.target){
			case this.btnDel:
				SelectRoleViewManager.instance.deleteRole(this.getCurNetChar());
				break ;
			default :
				this.showSelectRole();
				break ;
			}
	}

	__proto.showSelectRole=function(){
		if (this.isHaveRole()){
			SelectRoleViewManager.instance.selectCurRole(this._curNetChar,true);
		}
		else{
			SelectRoleViewManager.instance.showCreateRole();
		}
	}

	__proto.theOpen=function(){
		_super.prototype.theOpen.call(this);
	}

	__proto.theClose=function(){
		_super.prototype.theClose.call(this);
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		Laya.timer.clearAll(this);
		this.removeEvent();
		_super.prototype.destroy.call(this);
	}

	return FG_SelectRoleInfoItem;
})(ViewBaseEx)


//class fg_panel.FG_SelectRoleModel extends compatible.panel.base.ViewBaseEx
var FG_SelectRoleModel=(function(_super){
	function FG_SelectRoleModel(){
		// protected var _job:int;
		this.roleBox=null;
		this.shadowImg=null;
		this.roleImg=null;
		// protected var aniRoleEff:Animation;
		this._curType=0;
		//当前状态
		this._selected=false;
		this._sex=0;
		// roleImg.skin="fg_mobile/m_loginModeUI/role"+(_sex+1)+".png";
		this.roleEffectIndex=0;
		// }
		this._aniAtlas=null;
		FG_SelectRoleModel.__super.call(this);
	}

	__class(FG_SelectRoleModel,'fg_panel.FG_SelectRoleModel',_super);
	var __proto=FG_SelectRoleModel.prototype;
	__proto.getUIClass=function(){
		return FG_SelectRoleModelUI;
	}

	__proto.initUI=function(){
		this.createUI(this.getUIClass());
		this.roleImg.scaleX=this.roleImg.scaleY=1;
		this.roleImg.skin="";
		this.roleBox.pos(315,90);
	}

	__proto.setInfo=function(sex){
		this._sex=sex;
		this.setSelected(sex);
	}

	__proto.setSelected=function(sex){
		this.roleEffectIndex=0;
		Laya.timer.clear(this,this.onRoleEffect);
		Laya.timer.frameLoop(8,this,this.onRoleEffect);
		this.setAct(sex);
	}

	// _selected=bo;
	__proto.setAct=function(act){
		this.clearRoleAni();
		this._curType=act;
	}

	__proto.onRoleEffect=function(){
		var formattedNumber=this.padLeft(this.roleEffectIndex.toString())
		this.roleImg.skin="engine/res/image/createRole/"+this._sex+"/role1.png"
		this.shadowImg.skin="engine/res/image/createRole/"+this._sex+"/shadow.png"
		this.roleEffectIndex++;
		if (this.roleEffectIndex >=11){
			this.roleEffectIndex=0
		}
	}

	// console.log("formattedNumber:",_sex,roleEffectIndex,formattedNumber);
	__proto.padLeft=function(str){
		var len=5-str.length;
		var l="";
		for (var i=0;i < len;i++){
			l+="0"
		}
		return l+str;
	}

	// }
	__proto.clearRoleAni=function(){}
	__proto.getAnimation=function(atlasUrl){
		return GlobalUtils.createAtlasAni("res/atlas/anims/selectRoleEff",atlasUrl,83,true,false)[0];
	}

	//创建动画
	__proto.addEvent=function(){}
	__proto.removeEvent=function(){}
	__proto.theClose=function(){
		_super.prototype.theClose.call(this);
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this.removeEvent();
		Laya.timer.clear(this,this.onRoleEffect);
		this.clearRoleAni();
		Laya.loader.clearRes(this._aniAtlas);
		_super.prototype.destroy.call(this);
	}

	FG_SelectRoleModel.TYPE_NONE=0;
	FG_SelectRoleModel.TYPE_IDLE=1;
	FG_SelectRoleModel.TYPE_DISABLE=2;
	FG_SelectRoleModel.TYPE_SITDOWN=3;
	FG_SelectRoleModel.TYPE_ACTIVE=4;
	return FG_SelectRoleModel;
})(ViewBaseEx)


//class layaUI.fgv_mobile.FGV_SelectRoleInfoItemUI extends laya.ui.View
var FGV_SelectRoleInfoItemUI=(function(_super){
	function FGV_SelectRoleInfoItemUI(){
		this.imgSelectCtn=null;
		this.txtLevel=null;
		this.yuanQiTxt=null;
		this.txtJob=null;
		this.txtName=null;
		this.btnSelect=null;
		this.btnDel=null;
		this.boxModel=null;
		this.imgCreateCtn=null;
		this.btnCreate=null;
		this.imgSelectBG=null;
		FGV_SelectRoleInfoItemUI.__super.call(this);
	}

	__class(FGV_SelectRoleInfoItemUI,'layaUI.fgv_mobile.FGV_SelectRoleInfoItemUI',_super);
	var __proto=FGV_SelectRoleInfoItemUI.prototype;
	__proto.createChildren=function(){
		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(FGV_SelectRoleInfoItemUI.uiView);
	}

	FGV_SelectRoleInfoItemUI.uiView={"type":"View","props":{"width":267,"height":359},"child":[{"type":"Image","props":{"x":0,"var":"imgSelectCtn","skin":"fgv_mobile/selectRole/img_selecrItemBG2.png"},"child":[{"type":"Image","props":{"y":20,"x":19,"skin":"fgv_mobile/selectRole/attr_bg.png"}},{"type":"Image","props":{"y":297,"x":24,"skin":"fgv_mobile/selectRole/nameBg.png"}},{"type":"Label","props":{"y":29,"x":75,"width":46,"var":"txtLevel","text":"999","stroke":3,"height":14,"fontSize":14,"color":"#fff4e9","align":"center"}},{"type":"Label","props":{"y":28,"x":178,"width":46,"var":"yuanQiTxt","text":"0","stroke":3,"height":14,"fontSize":14,"color":"#fff4e9","align":"center"}},{"type":"Label","props":{"y":175,"x":-266,"visible":false,"text":"职业","stroke":3,"fontSize":16,"color":"#a59484"}},{"type":"Label","props":{"y":175,"x":-208,"width":103,"visible":false,"var":"txtJob","text":"战士","stroke":3,"fontSize":14,"color":"#fff4e9"}},{"type":"Label","props":{"y":306,"x":54,"width":155,"var":"txtName","text":"完美名字七公主","stroke":1,"height":20,"fontSize":14,"color":"#DEDEDE","align":"center"}},{"type":"Button","props":{"y":203,"x":-259,"visible":false,"var":"btnSelect","stateNum":1,"skin":"fg_mobile/m_loginUI/create_game.png","labelStroke":4,"labelSize":18,"labelColors":"#a59484,#a59484,#a59484","label":"选择"}},{"type":"Button","props":{"y":57,"x":200,"var":"btnDel","stateNum":1,"skin":"fg_mobile/m_loginUI/btnDel.png"}},{"type":"Box","props":{"y":-53,"x":-108,"width":485,"var":"boxModel","height":485}}]},{"type":"Image","props":{"x":0,"visible":false,"var":"imgCreateCtn","skin":"fgv_mobile/selectRole/img_selecrItemBG2.png"},"child":[{"type":"Button","props":{"y":118,"x":102,"var":"btnCreate","stateNum":1,"skin":"fgv_mobile/selectRole/img_add.png"}},{"type":"Label","props":{"y":184,"x":26,"width":212,"text":"创建角色","stroke":3,"height":22,"fontSize":16,"color":"#ffffff","align":"center"}}]},{"type":"Image","props":{"y":-3,"x":-5,"visible":false,"var":"imgSelectBG","skin":"fgv_mobile/selectRole/img_selectSelect.png"}}]};
	return FGV_SelectRoleInfoItemUI;
})(View)


//class layaUI.fgv_mobile.FGV_SelectRolePanelUI extends laya.ui.View
var FGV_SelectRolePanelUI=(function(_super){
	function FGV_SelectRolePanelUI(){
		this._gBg=null;
		this.mcBG=null;
		this._gTop=null;
		this.btnOut=null;
		this._gBottom=null;
		this._panel=null;
		this.boxModel0=null;
		this.boxModel1=null;
		this._gMainList=null;
		this.boxRoleItem=null;
		this.btnStart=null;
		this.createCtn=null;
		this.txtInput=null;
		this.randomBtn=null;
		this.sp_createC=null;
		this.btn_0=null;
		this.btn_1=null;
		this.imgSexSelect=null;
		this.btnClose=null;
		this.btnCreate=null;
		this.boxCreateModel=null;
		this.severNameTxt=null;
		FGV_SelectRolePanelUI.__super.call(this);
	}

	__class(FGV_SelectRolePanelUI,'layaUI.fgv_mobile.FGV_SelectRolePanelUI',_super);
	var __proto=FGV_SelectRolePanelUI.prototype;
	__proto.createChildren=function(){
		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(FGV_SelectRolePanelUI.uiView);
	}

	FGV_SelectRolePanelUI.uiView={"type":"View","props":{"width":642,"height":1389},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":642,"var":"_gBg","height":1389},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"mcBG","skin":"fgv_mobile/selectRole/v_mobile_bg.jpg"}}]},{"type":"Sprite","props":{"y":0,"x":0,"width":642,"var":"_gTop","height":243},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"fgv_mobile/selectRole/img_bg_up.png"}},{"type":"Button","props":{"y":79,"x":16,"visible":true,"var":"btnOut","stateNum":1,"skin":"fgv_mobile/selectRole/fanhui.png"}}]},{"type":"Sprite","props":{"y":1202,"x":10,"width":642,"var":"_gBottom","height":200},"child":[{"type":"Image","props":{"y":-496,"x":0,"skin":"fgv_mobile/selectRole/img_bg_down.png"}}]},{"type":"Sprite","props":{"width":642,"var":"_panel","skin":"fgv_mobile/selectRole/v_mobile_bg.jpg","mouseThrough":true,"height":1389},"child":[{"type":"Box","props":{"y":88,"x":1384,"width":274,"visible":false,"var":"boxModel0","height":324}},{"type":"Box","props":{"y":90,"x":1085,"width":274,"visible":false,"var":"boxModel1","height":324}},{"type":"Sprite","props":{"y":243,"x":42,"width":560,"var":"_gMainList","height":876},"child":[{"type":"Box","props":{"width":560,"var":"boxRoleItem","height":780}},{"type":"Button","props":{"y":837,"x":206,"var":"btnStart","stateNum":1,"skin":"fgv_mobile/selectRole/create_game.png","labelStrokeColor":"#000000","labelStroke":1,"labelSize":16,"labelColors":"#f1ecdf"}}]}]},{"type":"Box","props":{"y":22,"x":-648,"width":407,"var":"createCtn","height":520},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"fgv_mobile/selectRole/createBG.png"}},{"type":"Image","props":{"y":282,"x":111,"width":180,"skin":"fgv_mobile/selectRole/nameBg2.png","height":40}},{"type":"TextInput","props":{"y":286,"x":117,"width":170,"var":"txtInput","text":"[S1]角色名最长七个","height":30,"fontSize":16,"color":"#ffffff","align":"center"}},{"type":"Button","props":{"y":284,"x":301,"var":"randomBtn","stateNum":1,"skin":"fgv_mobile/selectRole/beijing.png"},"child":[{"type":"Rect","props":{"y":-15,"x":-15,"width":60,"renderType":"hit","lineWidth":1,"height":60,"fillColor":"#ff0000"}}]},{"type":"Sprite","props":{"y":327,"x":122,"var":"sp_createC"},"child":[{"type":"Button","props":{"y":0,"var":"btn_0","stateNum":1,"skin":"fgv_mobile/selectRole/btnSex_0.png"}},{"type":"Button","props":{"y":0,"x":113,"var":"btn_1","stateNum":1,"skin":"fgv_mobile/selectRole/btnSex_1.png"}},{"type":"Image","props":{"y":0,"x":0,"var":"imgSexSelect","skin":"fgv_mobile/selectRole/img_sexSelect.png"}}]},{"type":"Button","props":{"y":6,"x":337,"var":"btnClose","stateNum":1,"skin":"fgv_mobile/selectRole/fanhui.png"}},{"type":"Button","props":{"y":384,"x":153,"var":"btnCreate","stateNum":1,"skin":"fgv_mobile/selectRole/btnRole.png","labelStrokeColor":"#000000","labelStroke":1,"labelSize":16,"labelColors":"#f1ecdf","label":"创建角色"}},{"type":"Box","props":{"y":-61,"x":-37,"width":485,"var":"boxCreateModel","height":485}}]},{"type":"Label","props":{"y":6,"x":477,"width":120,"visible":false,"var":"severNameTxt","text":"服务器名字","strokeColor":"#0f0b03","stroke":2,"height":20,"fontSize":14,"color":"#bdac5a","align":"center"}}]};
	return FGV_SelectRolePanelUI;
})(View)


//class layaUI.fg_mobile.FG_SelectRoleInfoItemUI extends laya.ui.View
var FG_SelectRoleInfoItemUI=(function(_super){
	function FG_SelectRoleInfoItemUI(){
		this.imgSelectCtn=null;
		this.imgSelectBG=null;
		this.btnDel=null;
		this.imgAvator=null;
		this.btnCreate=null;
		this.labGen=null;
		this.txtName=null;
		FG_SelectRoleInfoItemUI.__super.call(this);
	}

	__class(FG_SelectRoleInfoItemUI,'layaUI.fg_mobile.FG_SelectRoleInfoItemUI',_super);
	var __proto=FG_SelectRoleInfoItemUI.prototype;
	__proto.createChildren=function(){
		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(FG_SelectRoleInfoItemUI.uiView);
	}

	FG_SelectRoleInfoItemUI.uiView={"type":"View","props":{"width":263,"height":67},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"imgSelectCtn","skin":"fg_mobile/m_loginUI/img_selecrItemBG2.png"}},{"type":"Image","props":{"y":-7,"x":-7,"visible":false,"var":"imgSelectBG","skin":"fg_mobile/m_loginUI/img_selectSelect.png"}},{"type":"Button","props":{"y":7,"x":208,"visible":false,"var":"btnDel","stateNum":1,"skin":"fg_mobile/m_loginUI/btnDel.png"},"child":[{"type":"Rect","props":{"y":-9,"x":-16,"width":70,"renderType":"hit","lineWidth":1,"height":70,"fillColor":"#ff0000"}}]},{"type":"Image","props":{"y":-30,"x":1,"var":"imgAvator","skin":"fg_mobile/m_loginUI/avator_0.png"}},{"type":"Button","props":{"y":5,"x":0,"var":"btnCreate","stateNum":1,"skin":"fg_mobile/m_loginUI/img_add.png"}},{"type":"Label","props":{"y":34,"x":101,"width":155,"var":"labGen","text":"根骨 999","height":20,"fontSize":20,"color":"#d7bb8b","align":"right"}},{"type":"Label","props":{"y":12,"x":101,"width":155,"var":"txtName","text":"完美名字七公主","height":20,"fontSize":20,"color":"#DDD9D3","align":"right"}}]};
	return FG_SelectRoleInfoItemUI;
})(View)


//class layaUI.fg_mobile.FG_SelectRoleModelUI extends laya.ui.View
var FG_SelectRoleModelUI=(function(_super){
	function FG_SelectRoleModelUI(){
		this.roleBox=null;
		this.shadowImg=null;
		this.roleImg=null;
		FG_SelectRoleModelUI.__super.call(this);
	}

	__class(FG_SelectRoleModelUI,'layaUI.fg_mobile.FG_SelectRoleModelUI',_super);
	var __proto=FG_SelectRoleModelUI.prototype;
	__proto.createChildren=function(){
		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(FG_SelectRoleModelUI.uiView);
	}

	FG_SelectRoleModelUI.uiView={"type":"View","props":{"width":485,"height":485},"child":[{"type":"Box","props":{"y":97,"x":230,"width":447,"var":"roleBox","height":586,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"var":"shadowImg","skin":"fg_mobile/m_loginModeUI/role2_1.png"}},{"type":"Image","props":{"y":284,"x":229,"var":"roleImg","skin":"fg_mobile/m_loginModeUI/role2.png","anchorY":0.5,"anchorX":0.5}}]}]};
	return FG_SelectRoleModelUI;
})(View)


//class layaUI.fg_mobile.FG_SelectRolePanelUI extends laya.ui.View
var FG_SelectRolePanelUI=(function(_super){
	function FG_SelectRolePanelUI(){
		this.mcBG=null;
		this.btnStart=null;
		this.imgTai=null;
		this.boxCreateModel=null;
		this.boxRoleItem=null;
		this.spAvators=null;
		this.createCtn=null;
		this.txtInput=null;
		this.randomBtn=null;
		this.sp_createC=null;
		this.btn_0=null;
		this.btn_1=null;
		this.severNameTxt=null;
		this.btnCreate=null;
		this.btnClose=null;
		this.btnDel=null;
		FG_SelectRolePanelUI.__super.call(this);
	}

	__class(FG_SelectRolePanelUI,'layaUI.fg_mobile.FG_SelectRolePanelUI',_super);
	var __proto=FG_SelectRolePanelUI.prototype;
	__proto.createChildren=function(){
		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(FG_SelectRolePanelUI.uiView);
	}

	FG_SelectRolePanelUI.uiView={"type":"View","props":{"width":1296,"height":600},"child":[{"type":"Image","props":{"width":1296,"var":"mcBG","skin":"fg_mobile/m_loginModeUI/mobile_bg.jpg","height":600}},{"type":"Button","props":{"y":489,"x":996,"var":"btnStart","stateNum":1,"skin":"fg_mobile/m_loginUI/create_game.png","labelStrokeColor":"#000000","labelStroke":1,"labelSize":16,"labelColors":"#f1ecdf"}},{"type":"Image","props":{"y":315,"x":350,"var":"imgTai"},"child":[{"type":"Box","props":{"y":-114,"x":59,"width":485,"var":"boxCreateModel","height":485}},{"type":"Box","props":{"y":-114,"x":59,"width":485,"var":"boxRoleItem","height":485}}]},{"type":"Image","props":{"width":267,"var":"spAvators","top":129,"left":102,"height":270},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":265,"height":70}},{"type":"Sprite","props":{"y":100,"x":0,"width":265,"height":70}},{"type":"Sprite","props":{"y":200,"x":0,"width":265,"height":70}}]},{"type":"Box","props":{"var":"createCtn","left":141,"bottom":74},"child":[{"type":"Image","props":{"y":87,"x":-4,"width":207,"skin":"fg_mobile/m_loginUI/nameBg.png","sizeGrid":"10,10,10,10","height":40}},{"type":"TextInput","props":{"y":92,"x":-3,"width":167,"var":"txtInput","text":"角色名最长七个","height":30,"fontSize":20,"color":"#D1CFCB","align":"center"}},{"type":"Button","props":{"y":86,"x":164,"var":"randomBtn","stateNum":1,"skin":"fg_mobile/m_loginUI/beijing.png"},"child":[{"type":"Rect","props":{"y":-15,"x":-15,"width":60,"renderType":"hit","lineWidth":1,"height":60,"fillColor":"#ff0000"}}]},{"type":"Sprite","props":{"y":-3,"x":28,"var":"sp_createC"},"child":[{"type":"Button","props":{"y":0,"var":"btn_0","stateNum":2,"skin":"fg_mobile/m_loginUI/btnSex_1.png"}},{"type":"Button","props":{"y":-1,"x":87,"var":"btn_1","stateNum":2,"skin":"fg_mobile/m_loginUI/btnSex_0.png"}}]}]},{"type":"Label","props":{"y":6,"x":588,"width":120,"visible":false,"var":"severNameTxt","text":"服务器名字","height":20,"fontSize":14,"color":"#bdac5a","align":"center"}},{"type":"Button","props":{"y":489,"x":996,"var":"btnCreate","stateNum":1,"skin":"fg_mobile/m_loginUI/create_game.png","labelStrokeColor":"#000000","labelStroke":1,"labelSize":16,"labelColors":"#f1ecdf"}},{"type":"Button","props":{"y":10,"x":50,"var":"btnClose","stateNum":1,"skin":"fg_mobile/m_loginUI/btnBack.png"},"child":[{"type":"Label","props":{"y":10,"x":93,"text":"返回","strokeColor":"#160909","stroke":1,"fontSize":28,"color":"#EAE9E4","bold":true}}]},{"type":"Image","props":{"visible":false,"mouseEnabled":false,"alpha":0.3}},{"type":"Button","props":{"y":478,"x":215,"visible":false,"var":"btnDel","stateNum":1,"skin":"fg_mobile/m_loginUI/btnDel.png"},"child":[{"type":"Rect","props":{"y":-9,"x":-16,"width":70,"renderType":"hit","lineWidth":1,"height":70,"fillColor":"#ff0000"}}]}]};
	return FG_SelectRolePanelUI;
})(View)


//class layaUI.fg_pc.FGPC_SelectRoleInfoItemUI extends laya.ui.View
var FGPC_SelectRoleInfoItemUI=(function(_super){
	function FGPC_SelectRoleInfoItemUI(){
		this.imgSelectCtn=null;
		this.imgSelectBG=null;
		this.btnDel=null;
		this.imgAvator=null;
		this.btnCreate=null;
		this.labGen=null;
		this.txtName=null;
		FGPC_SelectRoleInfoItemUI.__super.call(this);
	}

	__class(FGPC_SelectRoleInfoItemUI,'layaUI.fg_pc.FGPC_SelectRoleInfoItemUI',_super);
	var __proto=FGPC_SelectRoleInfoItemUI.prototype;
	__proto.createChildren=function(){
		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(FGPC_SelectRoleInfoItemUI.uiView);
	}

	FGPC_SelectRoleInfoItemUI.uiView={"type":"View","props":{"width":420,"height":110},"child":[{"type":"Image","props":{"y":-17,"x":0,"var":"imgSelectCtn","skin":"fg_mobile/m_loginUI/img_selecrItemBG2.png"}},{"type":"Image","props":{"y":-17,"x":0,"visible":false,"var":"imgSelectBG","skin":"fg_mobile/m_loginUI/img_selectSelect.png"}},{"type":"Button","props":{"y":44,"x":375,"var":"btnDel","stateNum":1,"skin":"fg_mobile/m_loginUI/btnDel.png"}},{"type":"Image","props":{"y":17,"x":120,"var":"imgAvator","skin":"fg_mobile/m_loginUI/avator_0.png"}},{"type":"Button","props":{"y":13,"x":116,"var":"btnCreate","stateNum":1,"skin":"fg_mobile/m_loginUI/img_add.png"}},{"type":"Label","props":{"y":57,"x":223,"width":155,"var":"labGen","text":"根骨 999","height":20,"fontSize":20,"color":"#d7bb8b","align":"left"}},{"type":"Label","props":{"y":35,"x":223,"width":155,"var":"txtName","text":"完美名字七公主","height":20,"fontSize":20,"color":"#DDD9D3","align":"left"}}]};
	return FGPC_SelectRoleInfoItemUI;
})(View)


//class layaUI.fg_pc.FGPC_SelectRolePanelUI extends laya.ui.View
var FGPC_SelectRolePanelUI=(function(_super){
	function FGPC_SelectRolePanelUI(){
		this.mcBG=null;
		this.btnStart=null;
		this.boxRoleItem=null;
		this.spAvators=null;
		this.createCtn=null;
		this.txtInput=null;
		this.randomBtn=null;
		this.sp_createC=null;
		this.btn_0=null;
		this.btn_1=null;
		this.btnClose=null;
		this.btnCreate=null;
		this.boxCreateModel=null;
		this.severNameTxt=null;
		FGPC_SelectRolePanelUI.__super.call(this);
	}

	__class(FGPC_SelectRolePanelUI,'layaUI.fg_pc.FGPC_SelectRolePanelUI',_super);
	var __proto=FGPC_SelectRolePanelUI.prototype;
	__proto.createChildren=function(){
		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(FGPC_SelectRolePanelUI.uiView);
	}

	FGPC_SelectRolePanelUI.uiView={"type":"View","props":{"width":1296,"height":600},"child":[{"type":"Image","props":{"width":1296,"var":"mcBG","skin":"fg_mobile/m_loginModeUI/mobile_bg.jpg","height":600},"child":[{"type":"Button","props":{"y":467,"x":1041,"var":"btnStart","stateNum":1,"skin":"fg_mobile/m_loginUI/create_game.png","labelStrokeColor":"#000000","labelStroke":1,"labelSize":16,"labelColors":"#f1ecdf"}},{"type":"Box","props":{"y":210,"x":462,"width":485,"var":"boxRoleItem","height":485}},{"type":"Sprite","props":{"y":0,"x":0,"width":251,"var":"spAvators","height":599},"child":[{"type":"Sprite","props":{"y":101,"x":-22,"width":420,"height":110}},{"type":"Sprite","props":{"y":203,"x":26,"width":420,"height":110}},{"type":"Sprite","props":{"y":305,"x":26,"width":420,"height":110}},{"type":"Sprite","props":{"y":407,"x":-22,"width":420,"height":110}}]}]},{"type":"Box","props":{"y":22,"x":-648,"width":371,"var":"createCtn","height":436},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"fg_mobile/m_loginModeUI/createBG.png"},"child":[{"type":"Image","props":{"y":265,"x":80,"width":180,"height":40}}]},{"type":"TextInput","props":{"y":269,"x":86,"width":170,"var":"txtInput","text":"[S1]角色名最长七个","height":30,"fontSize":16,"color":"#ffffff","align":"center"}},{"type":"Button","props":{"y":267,"x":270,"var":"randomBtn","stateNum":1,"skin":"fg_mobile/m_loginUI/beijing.png"},"child":[{"type":"Rect","props":{"y":-15,"x":-15,"width":60,"renderType":"hit","lineWidth":1,"height":60,"fillColor":"#ff0000"}}]},{"type":"Sprite","props":{"y":300,"x":91,"var":"sp_createC"},"child":[{"type":"Button","props":{"y":0,"var":"btn_0","stateNum":2,"skin":"fg_mobile/m_loginUI/btnSex_1.png"}},{"type":"Button","props":{"y":0,"x":113,"var":"btn_1","stateNum":2,"skin":"fg_mobile/m_loginUI/btnSex_0.png"}}]},{"type":"Button","props":{"y":3,"x":290,"var":"btnClose","stateNum":1,"skin":"fg_mobile/m_loginUI/btnClose.png"}},{"type":"Button","props":{"y":367,"x":122,"var":"btnCreate","stateNum":1,"labelStrokeColor":"#000000","labelStroke":1,"labelSize":16,"labelColors":"#f1ecdf","label":"创建角色"}},{"type":"Box","props":{"y":-59,"x":-73,"width":485,"var":"boxCreateModel","height":485}}]},{"type":"Label","props":{"y":6,"x":588,"width":120,"visible":false,"var":"severNameTxt","text":"服务器名字","height":20,"fontSize":14,"color":"#bdac5a","align":"center"}}]};
	return FGPC_SelectRolePanelUI;
})(View)


//class fgv_panel.FGV_ModeSelectCharacter extends fg_panel.FG_ModeSelectCharacter
var FGV_ModeSelectCharacter=(function(_super){
	function FGV_ModeSelectCharacter(){
		this.btnOut=null;
		this._gMainList=null;
		this._gBg=null;
		this._gTop=null;
		this._gBottom=null;
		this._roleVScroll=M_MyVScroll;
		FGV_ModeSelectCharacter.__super.call(this);
	}

	__class(FGV_ModeSelectCharacter,'fgv_panel.FGV_ModeSelectCharacter',_super);
	var __proto=FGV_ModeSelectCharacter.prototype;
	/**初始化角色列表 */
	__proto.initRoleList=function(arrRoleInfoItems){
		var infoItem;
		var hGap=28;
		var vGap=65;
		this._roleVScroll=new M_MyVScroll();
		this._roleVScroll.width=this.viewUI.boxRoleItem.width;
		this._roleVScroll.height=this.viewUI.boxRoleItem.height;
		this._roleVScroll.listBox.itemRender=FGV_SpriteRoleItem;
		this._roleVScroll.listBox.renderHandler=new Handler(this,this.upDataItem);
		this.viewUI.boxRoleItem.addChild(this._roleVScroll);
		this._roleVScroll.listBox.repeatX=2;
		var i=0;
		var rList=[];
		for (i=0;i < 3;i++){
			infoItem=this.clearSeletRoleInfoItem();
			infoItem.theOpen();
			arrRoleInfoItems.push(infoItem);
		}
		this._roleVScroll.listBox.spaceX=hGap;
		this._roleVScroll.listBox.spaceY=vGap;
		this._roleVScroll.listBox.array=arrRoleInfoItems;
	}

	// }
	__proto.upDataItem=function(item,index){
		var infoItem;
		var hGap=28;
		var vGap=65;
		var i=index;
		if (item){
			item.addChild(this._roleVScroll.listBox.array[index]);
		}
	}

	// item.y=(infoItem.height+vGap)*Math.floor((i)/2);
	__proto.resize=function(){}
	/**添加布局 */
	__proto.addLayouts=function(){
		Lay.addScale(this._gTop,[Lay.style.WINDOWS_CENTER_X,Lay.style.WINDOWS_UP_Y,Lay.style.ZOOM_WINDOWSWIDTH]);
		Lay.addScale(this._gBottom,[Lay.style.WINDOWS_CENTER_X,Lay.style.WINDOWS_DOWN_Y,Lay.style.ZOOM_WINDOWSWIDTH]);
		Lay.addScale(this._gBg,[Lay.style.WINDOWS_CENTER_X,Lay.style.WINDOWS_CENTER_Y,Lay.style.STRETCH_WINDOWSWIDTH,Lay.style.STRETCH_WINDOWSHEIGHT]);
		Lay.addScale(this._gMainList,[
		Lay.style.WINDOWS_CENTER_X,Lay.style.WINDOWS_CENTER_Y,Lay.style.ZOOM_RELATIVE_WIDTH,Lay.style.ZOOM_RELATIVE_HEIGHT+"@"+this._gMainList.width / 1389,]);
	}

	/**移除布局 */
	__proto.removeLayouts=function(){
		Lay.removeLayout(this._gTop);
		Lay.removeLayout(this._gBottom);
		Lay.removeLayout(this._gBg);
		Lay.removeLayout(this._gMainList);
	}

	// Lay.removeLayout(_gInfoDesc);
	__proto.addEvent=function(){
		_super.prototype.addEvent.call(this);
		if (this.btnOut){
			this.btnOut.on("click",this,this.onSelRoleClick);
		}
		this.addLayouts();
		Lay.updateLayoutDelay();
	}

	__proto.removeEvent=function(){
		_super.prototype.removeEvent.call(this);
		if (this.btnOut){
			this.btnOut.off("click",this,this.onSelRoleClick);
		}
		this.removeLayouts();
	}

	__proto.onSelRoleClick=function(){
		this.createRoleView.visible=false;
		if (Browser.onMiniGame){
			if (TLTools.instance.mySDKLogin){
				TLTools.instance.mySDKLogin.loginOut();
			}
		}
		else
		Browser.window.location.reload();
	}

	__proto.initUI=function(){
		_super.prototype.initUI.call(this);
	}

	__proto.getUIClass=function(){
		return FGV_SelectRolePanelUI;
	}

	__proto.clearSeletRoleInfoItem=function(index){
		return new FGV_SelectRoleInfoItem(this,index);
	}

	__proto.getUrl=function(){
		return "fgv_mobile/selectRole/";
	}

	return FGV_ModeSelectCharacter;
})(FG_ModeSelectCharacter)


/**
*@author hjh
*提示：
*创建时间：2022-8-17 下午2:34:30
*
*/
//class fgv_panel.FGV_SelectRoleInfoItem extends fg_panel.FG_SelectRoleInfoItem
var FGV_SelectRoleInfoItem=(function(_super){
	function FGV_SelectRoleInfoItem(owner,url){
		this.txtJob=null;
		this.txtLevel=null;
		// public var txtName:Label;
		this.btnSelect=null;
		this.roleNumImg=null;
		FGV_SelectRoleInfoItem.__super.call(this,owner,url);
	}

	__class(FGV_SelectRoleInfoItem,'fgv_panel.FGV_SelectRoleInfoItem',_super);
	var __proto=FGV_SelectRoleInfoItem.prototype;
	__proto.getUIClass=function(){
		return FGV_SelectRoleInfoItemUI;
	}

	// }
	__proto.showView=function(netChar,index){
		_super.prototype.showView.call(this,netChar,index);
	}

	return FGV_SelectRoleInfoItem;
})(FG_SelectRoleInfoItem)


/**
*@author hjh
*提示：
*创建时间：2022-8-17 下午2:33:07
*
*/
//class fg_panel.FGPC_ModeSelectCharacter extends fg_panel.FG_ModeSelectCharacter
var FGPC_ModeSelectCharacter=(function(_super){
	function FGPC_ModeSelectCharacter(){
		this.btnOut=null;
		FGPC_ModeSelectCharacter.__super.call(this);
	}

	__class(FGPC_ModeSelectCharacter,'fg_panel.FGPC_ModeSelectCharacter',_super);
	var __proto=FGPC_ModeSelectCharacter.prototype;
	__proto.resize=function(){
		_super.prototype.resize.call(this);
		if(this.btnOut){
			this.btnOut.x=-this.ui.x+65;
			this.btnOut.y=-this.ui.y+30;
		}
	}

	__proto.addEvent=function(){
		_super.prototype.addEvent.call(this);
		if(this.btnOut){
			this.btnOut.on("click",this,this.onSelRoleClick);
		}
	}

	__proto.removeEvent=function(){
		_super.prototype.removeEvent.call(this);
		if(this.btnOut){
			this.btnOut.off("click",this,this.onSelRoleClick);
		}
	}

	__proto.onSelRoleClick=function(){
		LoaderSound.instance().playBtnCommon();
		this.createRoleView.visible=false;
		if(Browser.onMiniGame){
			if(TLTools.instance.mySDKLogin){
				TLTools.instance.mySDKLogin.loginOut();
			}
		}
		else
		Browser.window.location.reload();
	}

	__proto.initUI=function(){
		_super.prototype.initUI.call(this);
	}

	// this.boxRoleItem.y=(this.height-this.boxRoleItem.height*this.boxRoleItem.scaleY)/2;
	__proto.getUIClass=function(){
		return FGPC_SelectRolePanelUI;
	}

	__proto.clearSeletRoleInfoItem=function(index){
		return new FGPC_SelectRoleInfoItem(this,index);
	}

	__proto.getUrl=function(){
		return "fg_mobile/m_loginPCUI/";
	}

	return FGPC_ModeSelectCharacter;
})(FG_ModeSelectCharacter)


/**
*@author hjh
*提示：
*创建时间：2022-8-17 下午2:34:30
*
*/
//class fg_panel.FGPC_SelectRoleInfoItem extends fg_panel.FG_SelectRoleInfoItem
var FGPC_SelectRoleInfoItem=(function(_super){
	function FGPC_SelectRoleInfoItem(owner,url){
		this.txtJob=null;
		this.txtLevel=null;
		// public var txtName:Label;
		this.btnSelect=null;
		this.roleNumImg=null;
		FGPC_SelectRoleInfoItem.__super.call(this,owner,url);
	}

	__class(FGPC_SelectRoleInfoItem,'fg_panel.FGPC_SelectRoleInfoItem',_super);
	var __proto=FGPC_SelectRoleInfoItem.prototype;
	__proto.getUIClass=function(){
		return FGPC_SelectRoleInfoItemUI;
	}

	// }
	__proto.showView=function(netChar,index){
		_super.prototype.showView.call(this,netChar,index);
	}

	return FGPC_SelectRoleInfoItem;
})(FG_SelectRoleInfoItem)



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