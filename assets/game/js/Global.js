
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var CommonKeyValueGroup=compatible.base.dic.CommonKeyValueGroup,Dictionary=laya.utils.Dictionary,GameLoader=Laya.GameLoader;
	var GlobalSystemConfig=compatible.system.GlobalSystemConfig,GlobalUtils=compatible.utils.GlobalUtils,LoaderSound=Laya.LoaderSound;
	var MConfig=Laya.MConfig,mytrace=Laya.mytrace;
//class app.GlobalMain
var GlobalMain=(function(){
	function GlobalMain(){
		this._gameLoader=null;
		mytrace("GlobalMain初始化");
	}

	__class(GlobalMain,'app.GlobalMain');
	return GlobalMain;
})()


//class myGlobal.base.info.LevelNeedInfo
var LevelNeedInfo=(function(){
	function LevelNeedInfo(str,need){
		// 解锁条件1.武功数量2.修为值3.角色等级4.战力5.江湖之路层数6.坐骑等级7.星宿等级8.强化次数
		this.arrNeedLevel1=null;
		this.arrNeedLevel2=null;
		this.need=0;
		(need===void 0)&& (need=0);
		this.need=need;
		this.initByStr(str);
	}

	__class(LevelNeedInfo,'myGlobal.base.info.LevelNeedInfo');
	var __proto=LevelNeedInfo.prototype;
	/**是否满足*/
	__proto.IsLevelOK=function(commonDic){
		if (commonDic==null || commonDic.isEmpty())
			return true;
		if (this.arrNeedLevel1==null && this.arrNeedLevel2==null)
			return false;
		var val=0;
		var arr=commonDic.getList();
		var tempGroup=new CommonKeyValueGroup();
		if(this.arrNeedLevel1 !=null){
			tempGroup.initData(this.arrNeedLevel1);
			var item;
			for(var $each_item in arr){
				item=arr[$each_item];
				val=tempGroup.getValById(item[0]);
				if (item[1] > val)
					return false;
			}
			return true;
		}
		if(this.arrNeedLevel2 !=null){
			tempGroup.initData(this.arrNeedLevel2);
			var item;
			for(var $each_item in arr){
				item=arr[$each_item];
				val=tempGroup.getValById(item[0]);
				if (item[1] > val)
					return false;
			}
			return true;
		}
		return false;
	}

	__proto.initByStr=function(str){
		if(!str)
			return;
		if(str.indexOf("_")!=-1)
			this.format(str);
		else
		this.formatCQ(str);
	}

	/**格式化 C#那套的计算等级方式*/
	__proto.format=function(str){
		var arrStr=GlobalUtils.formatOneSplitByStr(str,"$");
		if(arrStr[0])
			this.arrNeedLevel1=GlobalUtils.formatCommonSplitByStr(arrStr[0]);
		if(arrStr[1])
			this.arrNeedLevel2=GlobalUtils.formatCommonSplitByStr(arrStr[1]);
	}

	/**格式化传奇那套的方式*/
	__proto.formatCQ=function(str){
		var val=GlobalUtils.tryToInt(str);
		var arr;
		switch(this.need){
			case 10:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[1001,arr[0]],[0,arr[1]]];
				break ;
			case 11:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[1001,arr[0]],[1,arr[1]]];
				break ;
			case 12:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[1001,arr[0]],[2,arr[1]]];
				break ;
			case 13:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[1001,arr[0]],[3,arr[1]]];
				break ;
			case 40:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[4,arr[0]],[0,arr[1]]];
				break ;
			case 41:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[4,arr[0]],[1,arr[1]]];
				break ;
			case 42:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[4,arr[0]],[2,arr[1]]];
				break ;
			case 43:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[4,arr[0]],[3,arr[1]]];
				break ;
			case 44:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[4,arr[0]],[5,arr[1]]];
				break ;
			case 81:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[88,arr[0]],[87,arr[1]]];
				break ;
			case 82:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[89,arr[0]],[87,arr[1]]];
				break ;
			case 50:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[0,arr[0]],[5,arr[1]]];
				break ;
			case 51:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[1,arr[0]],[5,arr[1]]];
				break ;
			case 52:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[2,arr[0]],[5,arr[1]]];
				break ;
			case 53:
				arr=this.getCQParamsByVal(val);
				this.arrNeedLevel1=[[3,arr[0]],[5,arr[1]]];
				break ;
			default :
				this.arrNeedLevel1=[[this.need,val]]
				break ;
			}
	}

	__proto.getCQParamsByVal=function(val){
		var param1=val % 65536;
		var param2=Math.floor(val / 65536);
		return [param1,param2];
	}

	//---------------------传奇的方式
	__proto.clone=function(){
		var info=new LevelNeedInfo("");
		if(this.arrNeedLevel1){
			info.arrNeedLevel1=GlobalUtils.cloneTwoArr(this.arrNeedLevel1);
		}
		if(this.arrNeedLevel2){
			info.arrNeedLevel2=GlobalUtils.cloneTwoArr(this.arrNeedLevel2);
		}
		return info;
	}

	__proto.equipType=function(){
		if(this.arrNeedLevel1 && this.arrNeedLevel1.length > 1)
			return this.arrNeedLevel1[0][0];
		return-1
	}

	LevelNeedInfo.NEED_LEVEL=0;
	LevelNeedInfo.NEED_DC=1;
	LevelNeedInfo.NEED_MC=2;
	LevelNeedInfo.NEED_SC=3;
	LevelNeedInfo.NEED_SOUL=4;
	LevelNeedInfo.NEED_MAIN_TASK=18;
	LevelNeedInfo.NEED_JOB=1001;
	LevelNeedInfo.NEED_JOBLEVEL=10;
	LevelNeedInfo.NEED_JOBDC=11;
	LevelNeedInfo.NEED_JOBMC=12;
	LevelNeedInfo.NEED_JOBSC=13;
	LevelNeedInfo.NEED_SOULLEVEL=40;
	LevelNeedInfo.NEED_SOULDC=41;
	LevelNeedInfo.NEED_SOULMC=42;
	LevelNeedInfo.NEED_SOULSC=43;
	LevelNeedInfo.NEED_SOULSW=44;
	LevelNeedInfo.NEED_SHENGWANG=5;
	LevelNeedInfo.NEED_HAVEGUILD=6;
	LevelNeedInfo.NEED_GUILDMASTER=60;
	LevelNeedInfo.NEED_SHABAKE_MEMBER=7;
	LevelNeedInfo.NEED_SHABAKE_MASTER=70;
	LevelNeedInfo.NEED_GUIZU=8;
	LevelNeedInfo.NEED_GUIZU_CONSTTYPE_LEVEL=81;
	LevelNeedInfo.NEED_GUIZU_TYPE_LEVEL=82;
	LevelNeedInfo.NEED_GUIZU_TYPE=89;
	LevelNeedInfo.NEED_GUIZU_CONST_TYPE=88;
	LevelNeedInfo.NEED_GUIZU_LEVEL=87;
	LevelNeedInfo.NEED_CONST_LEVEL=14;
	LevelNeedInfo.NEED_SeverDayBefore=15;
	LevelNeedInfo.NEED_SeverDayAfter=16;
	LevelNeedInfo.NEED_MONEY=17;
	LevelNeedInfo.NEED_TASK=18;
	LevelNeedInfo.NEED_JunGongTitle=19;
	LevelNeedInfo.NEED_MAX_WUXUE_COUNT=20;
	LevelNeedInfo.NEED_LEVEL_SW=50;
	LevelNeedInfo.NEED_DC_SW=51;
	LevelNeedInfo.NEED_MC_SW=52;
	LevelNeedInfo.NEED_SC_SW=53;
	LevelNeedInfo.NEED_ENERGY=9;
	LevelNeedInfo.TYPE_NEEDGUIZULEVEL=3;
	LevelNeedInfo.TYPE_NEEDTASKVIPLEVEL=4;
	LevelNeedInfo.TYPE_NEEDOPENDAY=5;
	LevelNeedInfo.TYPE_NEEDRENPINLEVEL=6;
	LevelNeedInfo.TYPE_NEEDJINGJIELEVEL=7;
	LevelNeedInfo.TYPE_CHONGZHIDAYU=8;
	LevelNeedInfo.NEED_WG_COUNT=54;
	LevelNeedInfo.NEED_XIUWEI=55;
	LevelNeedInfo.NEED_ZL=56;
	LevelNeedInfo.NEED_JHZL=57;
	LevelNeedInfo.NEED_ZQLV=58;
	LevelNeedInfo.NEED_XXLV=59;
	LevelNeedInfo.NEED_QH_COUNT=60;
	LevelNeedInfo.NEED_TASK_INDEX=61;
	return LevelNeedInfo;
})()


//class myGlobal.base.info.UIModelInfo
var UIModelInfo=(function(){
	function UIModelInfo(str,iconLooksArr){
		this.uiModel=0;
		//内观 男
		this.uiModelGender=0;
		//内观 女
		this.uiFrame=0;
		// 内观帧数
		this.effModel=0;
		//内观特效
		this.effFrame=0;
		if(!iconLooksArr)iconLooksArr=[];
		this.initByStr(str,iconLooksArr);
	}

	__class(UIModelInfo,'myGlobal.base.info.UIModelInfo');
	var __proto=UIModelInfo.prototype;
	__proto.initByStr=function(str,iconLooksArr){
		if(str && str.indexOf("_")!=-1)
			this.format(str);
		else
		this.formatCQ(iconLooksArr);
	}

	/**C#这套内观*/
	__proto.format=function(str){
		var arr=GlobalUtils.formatCommonSplitByStr(str);
		if(arr && arr.length > 0){
			this.uiModel=arr[0][0];
			this.uiModelGender=this.uiModel+1;
			this.uiFrame=arr[0][1];
			if(arr.length > 1){
				this.effModel=arr[1][0];
				this.effFrame=arr[1][1];
			}
		}
	}

	/**传奇内观*/
	__proto.formatCQ=function(iconLooksArr){
		this.uiModel=iconLooksArr[0] ? iconLooksArr[0]:0;
		if(iconLooksArr.length >=2)
			this.uiModelGender=iconLooksArr[1] ? iconLooksArr[1]:0;
		else
		this.uiModelGender=this.uiModel;
	}

	__proto.clone=function(){
		var info=new UIModelInfo(null);
		info.uiFrame=this.uiFrame;
		info.uiModelGender=this.uiModelGender;
		info.uiModel=this.uiModel;
		info.effModel=this.effModel;
		info.effFrame=this.effFrame;
		return info;
	}

	return UIModelInfo;
})()


//class myGlobal.base.system.SystemConfig
var SystemConfig=(function(){
	function SystemConfig(){}
	__class(SystemConfig,'myGlobal.base.system.SystemConfig');
	/**隐藏自己翅膀*/
	/**隐藏自己翅膀*/
	__getset(1,SystemConfig,'myWing',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.myWing)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.myWing,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mSkillOpenYanlongbaoji',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mSkillOpenYanlongbaoji)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mSkillOpenYanlongbaoji,Val);
	});

	/**音效音量*/
	/**音效音量*/
	__getset(1,SystemConfig,'mSoundValue',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mSoundValue);
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mSoundValue,Val);
		GlobalSystemConfig.mSoundValue=Val;
	});

	/**背景音乐音量*/
	//Boolean=true;Number=1;//背景音乐量
	__getset(1,SystemConfig,'mBGSoundValue',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mBGSoundValue);
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mBGSoundValue,Val);
		GlobalSystemConfig.mBGSoundValue=Val;
	});

	//Boolean=true;
	//Boolean=true;
	__getset(1,SystemConfig,'mPickZS',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mPickZS)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mPickZS,Val);
	});

	/**自动穿戴更好装备*/
	/**自动穿戴更好装备*/
	__getset(1,SystemConfig,'autoEquip',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.autoEquip)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.autoEquip,Val);
	});

	__getset(1,SystemConfig,'showShenqi',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.shenqiShowType)==1;
	});

	//Boolean=true;Boolean=false;//手机刘海是否打开
	//Boolean=true;Boolean=false;//手机刘海是否打开
	__getset(1,SystemConfig,'mobileFPSHight',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mobileFPSHight)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mobileFPSHight,Val);
	});

	__getset(1,SystemConfig,'mPickYB',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mPickYB)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mPickYB,Val);
	});

	//Boolean=true;int=30;//血量百分比
	//Boolean=true;int=30;//血量百分比
	__getset(1,SystemConfig,'autoUseMofayaoTime',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.autoUseMofayaoTime);
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.autoUseMofayaoTime,Val);
	});

	/**背景音乐开关*/
	/**背景音乐开关*/
	__getset(1,SystemConfig,'playMusic',function(){
		return GlobalSystemConfig.playMusic;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.playMusic,Val);
		GlobalSystemConfig.playMusic=Val;
	});

	/**免SHIFT*/
	/**免SHIFT*/
	__getset(1,SystemConfig,'noShift',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.noShift)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.noShift,Val);
	});

	/**隐藏翅膀*/
	/**隐藏翅膀*/
	__getset(1,SystemConfig,'hideWing',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.hideWing)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.hideWing,Val);
	});

	//Boolean=true;int=2000;//使用间隔 单位毫秒
	//Boolean=true;int=2000;//使用间隔 单位毫秒
	__getset(1,SystemConfig,'autoUseMofayaoID',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.autoUseMofayaoID);
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.autoUseMofayaoID,Val);
	});

	/**音效开关*/
	/**音效开关*/
	__getset(1,SystemConfig,'playSound',function(){
		return GlobalSystemConfig.playSound;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.playSound,Val);
		GlobalSystemConfig.playSound=Val;
	});

	/**是否隐藏物品飞入背包效果*/
	__getset(1,SystemConfig,'hideFlyItem',function(){
		return SystemConfig.getSystemKey(111)==1;
	});

	//Boolean=true;Boolean=false;
	//辅助基本设置
	__getset(1,SystemConfig,'mShowItemName',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mShowItemName)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mShowItemName,Val);
	});

	//Boolean=true;Boolean=true;
	//Boolean=true;Boolean=true;
	__getset(1,SystemConfig,'mPickEquip',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mPickEquip)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mPickEquip,Val);
	});

	//Boolean=true;Boolean=true;//0是点击地面模式 1是摇杆模式
	__getset(1,SystemConfig,'mHideTextHP',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.hideTextHP)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.hideTextHP,Val);
	});

	//Boolean=true;Boolean=true;
	//Boolean=true;Boolean=true;
	__getset(1,SystemConfig,'mPickDJ',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mPickDJ)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mPickDJ,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mSkillOpenLieyankuangwu',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mSkillOpenLieyankuangwu)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mSkillOpenLieyankuangwu,Val);
	});

	__getset(1,SystemConfig,'mFightMode',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mFightMode)==1;
	});

	//Boolean=true;Boolean=true;//是否挂机自动拾取
	// public static function get mAutoPick(){return getSystemKey(SytemKeyValue.xxxxxxxxxx)==1;}//Boolean=true;Boolean=true;
	__getset(1,SystemConfig,'mPickEquipIndex',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mPickEquipIndex);
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mPickEquipIndex,Val);
	});

	/**玩家简装*/
	/**玩家简装*/
	__getset(1,SystemConfig,'playerSimple',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.playerSimple)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.playerSimple,Val);
	});

	/**全屏显名*/
	/**全屏显名*/
	__getset(1,SystemConfig,'mShowName',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mShowName)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mShowName,Val);
	});

	/**清理尸体*/
	/**清理尸体*/
	__getset(1,SystemConfig,'mShowBody',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mShowBody)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mShowBody,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mSkillOpenZhurijianfa',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mSkillOpenZhurijianfa)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mSkillOpenZhurijianfa,Val);
	});

	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mHideFashion',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mHideFashion)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mHideFashion,Val);
	});

	// public static function set autoUseYaoItem(val:int):void{setSystemKey(SytemKeyValue.autoUseYaoItem,val);}
	//
	__getset(1,SystemConfig,'autoUseMofayaoPercent',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.autoUseMofayaoPercent);
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.autoUseMofayaoPercent,Val);
	});

	//Boolean=true;Boolean=true;//是否开启使用大补丹
	//Boolean=true;Boolean=true;//是否开启使用魔法药
	__getset(1,SystemConfig,'mobileLiuhai',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mobileLiuhai)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mobileLiuhai,Val);
	});

	//Boolean=true;Boolean=false;//手机是否开启高帧率
	// public static function get mobileControlType():Boolean{return getSystemKey(SytemKeyValue.mobileControlType)==1;}//Boolean=true;Boolean=true;//0是点击地面模式 1是摇杆模式
	__getset(1,SystemConfig,'mobileControlType',function(){
		return true;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mobileControlType,Val);
	});

	__getset(1,SystemConfig,'mSkillOpenCisha',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mSkillOpenCisha)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mSkillOpenCisha,Val);
	});

	//Boolean=true;Boolean=true;
	//Boolean=true;Boolean=true;
	__getset(1,SystemConfig,'mSkillOpenCishaEx',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mSkillOpenCishaEx)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mSkillOpenCishaEx,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mSkillOpenBanyue',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mSkillOpenBanyue)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mSkillOpenBanyue,Val);
	});

	/**自动使用经验丹和元宝*/
	/**挂机自动使用*/
	__getset(1,SystemConfig,'autoUseItem',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.autoUseItem)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.autoUseItem,Val);
	});

	/**复活戒指buff可以触发是不回城*/
	/**复活戒指buff可以触发是不回城*/
	__getset(1,SystemConfig,'fuhuojiezhiCD',function(){
		return SystemConfig.getSystemKey(99)==1;
		},function(val){
		SystemConfig.setSystemKey(99,val);
	});

	/**显示称号*/
	/**显示称号*/
	__getset(1,SystemConfig,'showTitle',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.showTitle)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.showTitle,Val);
	});

	//Boolean=true;Boolean=true;
	//Boolean=true;Boolean=true;
	__getset(1,SystemConfig,'mSkillOpenGongsha',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mSkillOpenGongsha)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mSkillOpenGongsha,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mSkillOpenLiehuo',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mSkillOpenLiehuo)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mSkillOpenLiehuo,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mSkillOpenShuangyue',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mSkillOpenShuangyue)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mSkillOpenShuangyue,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mSkillOpenKaitianzhan',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mSkillOpenKaitianzhan)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mSkillOpenKaitianzhan,Val);
	});

	/**隐藏他人神器模型*/
	/**隐藏他人神器模型*/
	__getset(1,SystemConfig,'hideFabao',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.hideFabao)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.hideFabao,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mSkillOpenQiege',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mSkillOpenQiege)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mSkillOpenQiege,Val);
	});

	/**屏蔽玩家打怪飘字*/
	/**屏蔽玩家打怪飘字*/
	__getset(1,SystemConfig,'playerPiaoZi',function(){
		return SystemConfig.getSystemKey(101)==1;
		},function(val){
		SystemConfig.setSystemKey(101,val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mAutoTask',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mAutoTask)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mAutoTask,Val);
	});

	/**可否交易*/
	/**可否交易*/
	__getset(1,SystemConfig,'canTrade',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.canTrade)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.canTrade,Val);
	});

	/**可否组队*/
	/**可否组队*/
	__getset(1,SystemConfig,'canTeam',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.canTeam)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.canTeam,Val);
	});

	/**可否好友请求*/
	/**可否好友请求*/
	__getset(1,SystemConfig,'canFriend',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.canFriend)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.canFriend,Val);
	});

	/**隔位刺杀*/
	/**隔位刺杀*/
	__getset(1,SystemConfig,'spaceKill',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.spaceKill)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.spaceKill,Val);
	});

	/**显示公会名字*/
	/**显示公会名字*/
	__getset(1,SystemConfig,'showGuildName',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.showGuildName)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.showGuildName,Val);
	});

	/**挂机自动回收*/
	/**挂机自动回收*/
	__getset(1,SystemConfig,'autoRecover',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.autoRecover)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.autoRecover,Val);
	});

	/**
	*回收体验一小时，服务端记录的时间戳
	*/
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'huishuiTiyanCd',function(){
		return SystemConfig.getSystemKey(102);
		},function(val){
		SystemConfig.setSystemKey(102,val);
	});

	/**显示装备比较TIPS*/
	/**显示装备比较TIPS*/
	__getset(1,SystemConfig,'showEquipTips',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.showEquipTips)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.showEquipTips,Val);
	});

	/**怪物简装*/
	/**怪物简装*/
	__getset(1,SystemConfig,'monsterSimple',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.monsterSimple)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.monsterSimple,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'hideOtherYanhua',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.hideOtherYanhua)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.hideOtherYanhua,Val);
	});

	/**关闭屏幕抖动*/
	/**关闭屏幕抖动*/
	__getset(1,SystemConfig,'closeShake',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.closeShake)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.closeShake,Val);
	});

	/**挂机 优先分解*/
	/**挂机 优先分解*/
	__getset(1,SystemConfig,'autoFenjie',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.autoFenjie)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.autoFenjie,Val);
	});

	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mHideOtherPet',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mHideOtherPet)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mHideOtherPet,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mHideOtherLong',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mHideOtherLong)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mHideOtherLong,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mHideOtherRole',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mHideOtherRole)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mHideOtherRole,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mHideAllBlood',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mHideAllBlood)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mHideAllBlood,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mHidePetBlood',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mHidePetBlood)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mHidePetBlood,Val);
	});

	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mHideWabaoMode',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mwabaoMode)==1;
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mHideHudun',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mHideHudun)==1;
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mHideHudun,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mSysKeyBit1',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.sysKeyBit1);
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.sysKeyBit1,Val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'mHuishouPinzhiIndex',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.mHuishouPinzhiIndex);
		},function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mHuishouPinzhiIndex,Val);
	});

	/**复活后马上回城*/
	/**复活后马上回城*/
	__getset(1,SystemConfig,'fuhuoHuiCheng',function(){
		return SystemConfig.getSystemKey(100)==1;
		},function(val){
		SystemConfig.setSystemKey(100,val);
	});

	//Boolean=true;Boolean=false;
	//Boolean=true;Boolean=false;
	__getset(1,SystemConfig,'dalulibaoCd',function(){
		return SystemConfig.getSystemKey(103);
		},function(val){
		return SystemConfig.setSystemKey(103,val);
	});

	/**怪物显名*/
	//Boolean=true;Boolean=true;
	__getset(1,SystemConfig,'mShowMonsterName',function(){
		return SystemConfig.getSystemKey(104)==1;
		},function(Val){
		SystemConfig.setSystemKey(104,Val);
	});

	/**地图缩放*/
	//Boolean=true;Number=1;//背景音乐量
	__getset(1,SystemConfig,'mMapScaleValue',function(){
		return SystemConfig.getSystemKey(108);
		},function(Val){
		SystemConfig.setSystemKey(108,Val);
	});

	//Boolean=true;Boolean=true;
	__getset(1,SystemConfig,'mWaBaoMode',null,function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.mwabaoMode,Val);
	});

	__getset(1,SystemConfig,'showshenqiNum',null,function(Val){
		SystemConfig.setSystemKey(SytemKeyValue.shenqiShowType,Val);
	});

	/**是否取消点击屏幕移动*/
	__getset(1,SystemConfig,'actScreenMove',function(){
		return SystemConfig.getSystemKey(105)==1;
	});

	/**摇杆是否跟随*/
	__getset(1,SystemConfig,'yaoganGensui',function(){
		return SystemConfig.getSystemKey(107)==1;
	});

	/**第二个keybit*/
	/**第二个keybit*/
	__getset(1,SystemConfig,'mSysKeyBit2',function(){
		return SystemConfig.getSystemKey(114);
		},function(val){
		return SystemConfig.setSystemKey(114,val);
	});

	/**第三个keybit*/
	/**第三个keybit*/
	__getset(1,SystemConfig,'mSysKeyBit3',function(){
		return SystemConfig.getSystemKey(116);
		},function(val){
		return SystemConfig.setSystemKey(116,val);
	});

	/**显示帧率*/
	/**显示帧率*/
	__getset(1,SystemConfig,'mShowFPS',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.showFPS);
		},function(val){
		return SystemConfig.setSystemKey(SytemKeyValue.showFPS,val);
	});

	/**显示辅助攻击按钮*/
	/**显示辅助攻击按钮*/
	__getset(1,SystemConfig,'mShowFuZhu',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.showFuZhu);
		},function(val){
		return SystemConfig.setSystemKey(SytemKeyValue.showFuZhu,val);
	});

	/**是否显示昼夜效果*/
	/**是否显示昼夜效果*/
	__getset(1,SystemConfig,'mShowNight',function(){
		return SystemConfig.getSystemKey(SytemKeyValue.isShowNight)> 0 ? true :false;
		},function(val){
		return SystemConfig.setSystemKey(SytemKeyValue.isShowNight,val ? 1 :0);
	});

	/**当前挂机距离*/
	__getset(1,SystemConfig,'autoActivityRange',function(){
		var rangeId=SystemConfig.getSystemKey(106);
		if (rangeId==-1){
			rangeId=50;
			return rangeId;
		}
		else{
			return rangeId;
		}
	});

	SystemConfig.getSystemKey=function(_index){
		if (!SystemConfig.LocalSystemKeyArr){
			SystemConfig.LocalSystemKeyArr=[];
			for (var i=0;i < 170;i++)
			SystemConfig.LocalSystemKeyArr.push(0);
			SystemConfig.LocalSystemKeyArr[SytemKeyValue.mobileFPSHight]=1;
		}
		return SystemConfig.LocalSystemKeyArr[_index];
	}

	SystemConfig.setSystemKey=function(_index,_Value,isQuickly){
		(isQuickly===void 0)&& (isQuickly=false);
		if (_Value==true)
			_Value=1;
		else if (_Value==false)
		_Value=0;
		if (!SystemConfig.LocalSystemKeyArr){
			SystemConfig.LocalSystemKeyArr=[];
			for (var i=0;i < 170;i++)
			SystemConfig.LocalSystemKeyArr.push(0);
			SystemConfig.LocalSystemKeyArr[SytemKeyValue.mobileFPSHight]=1;
		};
		var oldVal=SystemConfig.LocalSystemKeyArr[_index];
		if (!isQuickly){
			if (oldVal !=_Value){
				SystemConfig.LocalSystemKeyArr[_index]=_Value;
				if (SystemConfig.SaveFunc !=null){
					SystemConfig.SendServerKey.set(_index,_Value);
					Laya.timer.once(100,null,myGlobal.base.system.SystemConfig.delaySendServer);
				}
			}
		}
		else{
			SystemConfig.LocalSystemKeyArr[_index]=_Value;
			if (SystemConfig.SaveFunc !=null){
				SystemConfig.SendServerKey.set(_index,_Value);
				SystemConfig.delaySendServer();
			}
		}
	}

	SystemConfig.delaySendServer=function(){
		var index;
		for(var $each_index in SystemConfig.SendServerKey.keys){
			index=SystemConfig.SendServerKey.keys[$each_index];
			var value=SystemConfig.SendServerKey.get(index);
			SystemConfig.SaveFunc(index,value);
		}
		SystemConfig.SendServerKey.clear();
	}

	SystemConfig.InitServerKey=function(SystemKeyArr,_SaveFunc){
		for (var i=0;i < 170;i++){
			SystemConfig.LocalSystemKeyArr[i]=SystemKeyArr[i];
		}
		SystemConfig.SaveFunc=_SaveFunc;
		if (SystemConfig.isInit){
			myGlobal.base.system.SystemConfig.setBoolVal(SytemKeyValue.mFightMode,false);
			SystemConfig.isInit=true;
		}
	}

	SystemConfig.getBGSoundValue=function(isLoginMusic){
		(isLoginMusic===void 0)&& (isLoginMusic=false);
		return GlobalSystemConfig.getBGSoundValue(isLoginMusic);
	}

	SystemConfig.getBoolVal=function(key){
		return SystemConfig.getSystemKey(key)==1 || SystemConfig.getSystemKey(key)==-1;
	}

	SystemConfig.setBoolVal=function(key,val){
		SystemConfig.setSystemKey(key,val ? 1 :0);
	}

	SystemConfig.SaveFunc=null;
	SystemConfig.LocalSystemKeyArr=null;
	SystemConfig.MAXNUM=170;
	SystemConfig.isInit=true;
	__static(SystemConfig,
	['SendServerKey',function(){return this.SendServerKey=new Dictionary();}
	]);
	return SystemConfig;
})()


/**
*数量 150 个
*@author Administrator
*
*/
//class myGlobal.base.system.SytemKeyValue
var SytemKeyValue=(function(){
	function SytemKeyValue(){}
	__class(SytemKeyValue,'myGlobal.base.system.SytemKeyValue');
	SytemKeyValue.Init=function(){
		SytemKeyValue.KeyToValue["mShowItemName"]=["123",SytemKeyValue.mShowItemName];
	}

	SytemKeyValue.KeyToValue=[];
	SytemKeyValue.mShowItemName=2;
	SytemKeyValue.mPickYB=3;
	SytemKeyValue.mPickZS=4;
	SytemKeyValue.mPickDJ=5;
	SytemKeyValue.mPickEquip=6;
	SytemKeyValue.mPickEquipIndex=7;
	SytemKeyValue.mShowName=8;
	SytemKeyValue.mShowBody=9;
	SytemKeyValue.mHideFashion=10;
	SytemKeyValue.AutoXiulianHuTi=11;
	SytemKeyValue.AutoXiulianBuFa=12;
	SytemKeyValue.AutoXiulianXinFa=13;
	SytemKeyValue.AutoXiulianWuGong=14;
	SytemKeyValue.maxHuTiChange=15;
	SytemKeyValue.maxBuFaChange=16;
	SytemKeyValue.maxXinFaChange=17;
	SytemKeyValue.maxWuGongChange=18;
	SytemKeyValue.useWuGongId=19;
	SytemKeyValue.mobileLiuhai=33;
	SytemKeyValue.mobileFPSHight=34;
	SytemKeyValue.mobileControlType=35;
	SytemKeyValue.mSoundValue=36;
	SytemKeyValue.mBGSoundValue=37;
	SytemKeyValue.playMusic=38;
	SytemKeyValue.playSound=39;
	SytemKeyValue.mSkillOpenCisha=40;
	SytemKeyValue.mSkillOpenCishaEx=41;
	SytemKeyValue.mSkillOpenBanyue=42;
	SytemKeyValue.mSkillOpenGongsha=43;
	SytemKeyValue.mSkillOpenLiehuo=44;
	SytemKeyValue.mSkillOpenShuangyue=45;
	SytemKeyValue.mSkillOpenLieyankuangwu=46;
	SytemKeyValue.mSkillOpenYanlongbaoji=47;
	SytemKeyValue.mSkillOpenKaitianzhan=48;
	SytemKeyValue.mSkillOpenZhurijianfa=49;
	SytemKeyValue.mSkillOpenQiege=50;
	SytemKeyValue.mAutoTask=51;
	SytemKeyValue.canTrade=52;
	SytemKeyValue.canTeam=53;
	SytemKeyValue.canFriend=54;
	SytemKeyValue.spaceKill=55;
	SytemKeyValue.showGuildName=56;
	SytemKeyValue.showTitle=57;
	SytemKeyValue.hideWing=58;
	SytemKeyValue.myWing=59;
	SytemKeyValue.hideFabao=60;
	SytemKeyValue.showEquipTips=61;
	SytemKeyValue.noShift=62;
	SytemKeyValue.monsterSimple=63;
	SytemKeyValue.playerSimple=64;
	SytemKeyValue.closeShake=65;
	SytemKeyValue.autoRecover=66;
	SytemKeyValue.autoFenjie=67;
	SytemKeyValue.autoEquip=68;
	SytemKeyValue.mHideOtherPet=70;
	SytemKeyValue.mHideOtherLong=71;
	SytemKeyValue.mHideOtherRole=72;
	SytemKeyValue.hideOtherYanhua=73;
	SytemKeyValue.mHideAllBlood=74;
	SytemKeyValue.mHidePetBlood=75;
	SytemKeyValue.mHideHudun=76;
	SytemKeyValue.mHuishouPinzhiIndex=78;
	SytemKeyValue.mPickCailiao=79;
	SytemKeyValue.mPickHuobi=80;
	SytemKeyValue.mPickXiaohaopin=81;
	SytemKeyValue.autoUseItem=82;
	SytemKeyValue.autoUseYaoItem=83;
	SytemKeyValue.mFightMode=84;
	SytemKeyValue.autoUseMofayaoID=85;
	SytemKeyValue.autoUseMofayaoPercent=86;
	SytemKeyValue.autoUseMofayaoTime=87;
	SytemKeyValue.autoFlyPackage=91;
	SytemKeyValue.mwabaoMode=92;
	SytemKeyValue.packageHideBaoshi=93;
	SytemKeyValue.shenqiShowType=94;
	SytemKeyValue.hideLevelName=95;
	SytemKeyValue.hideLevelVal=96;
	SytemKeyValue.hideTextHP=98;
	SytemKeyValue.fuhuojiezhiCD=99;
	SytemKeyValue.fuhuoHuiCheng=100;
	SytemKeyValue.playerPiaoZi=101;
	SytemKeyValue.huishoutiyanCD=102;
	SytemKeyValue.dalulibaoCD=103;
	SytemKeyValue.monsterName=104;
	SytemKeyValue.actScreenMove=105;
	SytemKeyValue.autoActivityRange=106;
	SytemKeyValue.yaoganGensui=107;
	SytemKeyValue.mapScale=108;
	SytemKeyValue.aotoBuyDrug=109;
	SytemKeyValue.hideWangling=110;
	SytemKeyValue.hideFlyItem=111;
	SytemKeyValue.hideShixueTiaozhan=112;
	SytemKeyValue.hideYanhua=113;
	SytemKeyValue.sysKeyBit2=114;
	SytemKeyValue.autoBuyJian=115;
	SytemKeyValue.sysKeyBit3=116;
	SytemKeyValue.sysKeyBit1=117;
	SytemKeyValue.showFPS=118;
	SytemKeyValue.showFuZhu=119;
	SytemKeyValue.fenjie_0=120;
	SytemKeyValue.fenjie_1=122;
	SytemKeyValue.fenjie_2=123;
	SytemKeyValue.fenjie_3=124;
	SytemKeyValue.fenjie_4=125;
	SytemKeyValue.fenjie_5=126;
	SytemKeyValue.fenjie_6=127;
	SytemKeyValue.fenjie_7=128;
	SytemKeyValue.fenjie_8=129;
	SytemKeyValue.fenjie_9=130;
	SytemKeyValue.fenjie_10=131;
	SytemKeyValue.fenjie_11=132;
	SytemKeyValue.fenjie_12=133;
	SytemKeyValue.fenjie_13=134;
	SytemKeyValue.fenjie_14=135;
	SytemKeyValue.fenjie_15=136;
	SytemKeyValue.yunGuaJiSet=137;
	SytemKeyValue.isAutoFenJie=138;
	SytemKeyValue.isShowNight=139;
	SytemKeyValue.isAutoUseQunGong=140;
	__static(SytemKeyValue,
	['fenjieInfo',function(){return this.fenjieInfo=[SytemKeyValue.fenjie_0,SytemKeyValue.fenjie_1,SytemKeyValue.fenjie_2,SytemKeyValue.fenjie_3,SytemKeyValue.fenjie_4,SytemKeyValue.fenjie_5,SytemKeyValue.fenjie_6,SytemKeyValue.fenjie_7,SytemKeyValue.fenjie_8,SytemKeyValue.fenjie_9,SytemKeyValue.fenjie_10,SytemKeyValue.fenjie_11,SytemKeyValue.fenjie_12,SytemKeyValue.fenjie_13,SytemKeyValue.fenjie_14,SytemKeyValue.fenjie_15];}
	]);
	return SytemKeyValue;
})()


/**
*游戏通用配置ID
*@author karl
*/
//class myGlobal.GameID
var GameID=(function(){
	//
	function GameID(){}
	__class(GameID,'myGlobal.GameID');
	GameID.getWakuangMp3=function(){
		return Math.random()> 0.5 ? 105 :105+1
	}

	GameID.INT_MAXVAL=2147483647;
	GameID.SHIELDMAX=1000;
	GameID.AutoUpLvTime=100;
	GameID.JOB_COMMON=-1;
	GameID.JOB_ZHANSHI=0;
	GameID.JOB_FASHI=1;
	GameID.JOB_DAOSHI=2;
	GameID.CellWidth=48;
	GameID.CellHeight=32;
	GameID.SHOWAOINPCSIZE=20;
	GameID.NPCFASTVIEWSIZE=4;
	GameID.DealItemGridCount=12;
	GameID.ITEMID_HANGHUIZHAOJILING=1425;
	GameID.ITEMID_QIANGHUABAOHUFU=944;
	GameID.ITEMID_JINGYANZHU_DI=268;
	GameID.ITEMID_JINGYANZHU_ZHONG=269;
	GameID.ITEMID_JINGYANZHU_GAO=270;
	GameID.ITEMID_HUICHENGSHI=0;
	GameID.ITEMID_SUIJICHUANSONGSHI=0;
	GameID.ITEM_TEMPID_TEAM=0;
	GameID.ITEM_TEMPID_GUILD=0;
	GameID.ITEMID_BIBAOZHIXUAN_0=805;
	GameID.ITEMID_BIBAOZHIXUAN_1=806;
	GameID.ITEMID_BIBAOZHIXUAN_2=807;
	GameID.IIEMID_ZIZHUNZHIYU=658;
	GameID.IIEMID_WOLONGLINGPAI=661;
	GameID.ITEMID_JIXUESHI=39700;
	GameID.ITEMID_SHEHUNFAN=2003;
	GameID.ITEMID_SHEHUNSUO=2004;
	GameID.ITEMID_TOUSHIFU=2037;
	GameID.ITEMID_JINYUAN=79900;
	GameID.ITEMID_SHUANGBEIDAN=2002;
	GameID.YAO_ATTR=null;
	GameID.ZUANSHI_STR="龙钻";
	GameID.LONGZUAN_STR="屠龙币";
	GameID.BANGDINGLONGZUAN_STR="绑定钻石";
	GameID.YUANBAO_ID=0;
	GameID.ZUANSHI_ID=9;
	GameID.Jinbi_ID=43;
	GameID.LONGZUAN_ID=-1;
	GameID.BANGDINGLONGZUAN_ID=44;
	GameID.SHENGWANG_ID=18;
	GameID.XIANGMODIAN_STR="降魔点";
	GameID.SHENGWANG_STR="声望";
	GameID.NEIGONGEXP_STR="内功经验";
	GameID.LONGBI_STR="龙币";
	GameID.RONGYAOJIFEN_STR="荣耀积分";
	GameID.HAOJIAO="沃玛号角";
	GameID.JINGYANZHI="经验";
	GameID.FUWENSUIPIAN="符文碎片";
	GameID.GUILDDEVOTE_STR="行会贡献";
	GameID.BAGUATOUZIZHENSHU="八卦投资证书";
	GameID.SAODANGLINGPAI="扫荡令牌";
	GameID.TULONGCHAN_STR="屠龙铲";
	GameID.JINGZHILUOYANGCHAN_STR="精制洛阳铲";
	GameID.SHENMIREN_NAMESTR="神秘人";
	GameID.ITEMID_WEAPPON_NEWPLAYER_CLOTH=4900;
	GameID.ITEMID_WEAPPON_NEWPLAYER_0=4400;
	GameID.ITEMID_WEAPPON_NEWPLAYER_1=4500;
	GameID.ITEMID_WEAPPON_NEWPLAYER_2=4600;
	GameID.ITEMID_WEAPPON_NEWPLAYER_3=4700;
	GameID.ITEMID_WEAPPON_NEWPLAYER_4=4800;
	GameID.ITEMID_WEAPPON_NEWPLAYER_5=17300;
	GameID.ITEMID_WEAPPON_NEWPLAYER_6=17400;
	GameID.ITEMID_LANGRENBAOGUO=80810;
	GameID.ITEMID_JIAN=4000;
	GameID.ITEMID_FEIDAO=4001;
	GameID.ITEMID_HAIR_NEWPLAYER=21000;
	GameID.ITEMID_CHONGZHIDUIHUANQUAN=91410;
	GameID.REWARDTYPE_NONE=0;
	GameID.REWARDTYPE_REWARD=1;
	GameID.REWARDTYPE_REWARDED=2;
	GameID.MenPaiFaXinBao="门派发型包";
	GameID.ITEMNAME_JIANDINGFU="鉴定符";
	GameID.ITEMNAME_XUEYUJINGSHI="五色石";
	GameID.ITEMNAME_CuiLianSha="洗炼砂";
	GameID.ITEMNAME_FULING="附灵石";
	GameID.ITEMNAME_CUIGUJINGSHI="翠谷晶石";
	GameID.ITEMNAME_SuoDingFu="锁定符";
	GameID.ITEMNAME_JICHENGFU="继承符";
	GameID.ITEMNAME_SHIWEIZHAOHAN="侍卫召唤令";
	GameID.ITEMNAME_TAIGUYUANSHI="太古原石";
	GameID.ITEMNAME_XinYunFu="强化幸运符";
	GameID.ITEMNAME_HuiChengShi="回城石";
	GameID.ITEMNAME_BinTie="镔铁";
	GameID.ITEMNAME_TanHeLing="弹劾令";
	GameID.ITEMNAME_HUIHUNDAN="回魂丹";
	GameID.ITEMNAME_ChouShaZhaoShangLing="仇杀昭赏令";
	GameID.ITEMNAME_MenPaiXunZhang="门派徽章";
	GameID.AUTO_HANDLE_NULL=1;
	GameID.AUTO_HANDLE_USE=2;
	GameID.AUTO_HANDLE_UNDO=3;
	GameID.SOUND_ROCK_BUTTON_CLICK="click";
	GameID.SOUND_NORM_BUTTON_CLICK="click";
	GameID.SOUND_YANHUA=119;
	GameID.Sound_horse_walk=160;
	GameID.Sound_horse_run=162;
	GameID.Sound_bingpaoxiao=10331;
	GameID.Sound_widehit=133;
	GameID.Sound_yedo_man=1111;
	GameID.Sound_yedo_woman=1112;
	GameID.Sound_longhit=1132;
	GameID.Sound_chediding=11147;
	GameID.Sound_huoqiang=10220;
	GameID.Sound_kaitian="kaitian";
	GameID.Sound_firehit=11137;
	GameID.Sound_zhaohuanshenshou=10332;
	GameID.Sound_leidianshu=10112;
	GameID.Sound_mofadun=10310;
	GameID.Sound_chuansong=2002;
	GameID.Sound_hit_fist=1200;
	GameID.Sound_hit_Weapon=1201;
	GameID.Sound_meiPaiDaZhan=13002;
	GameID.Sound_sitdown=105;
	GameID.Sound_huoqiushu=10132;
	GameID.Sound_zhiliaoshu=10202;
	GameID.Sound_jiguang=10100;
	GameID.Sound_yinshenshu=11141;
	GameID.Sound_shidushu=11143;
	GameID.Sound_fuzhouhushen=11146;
	GameID.Sound_quntiyinshen=11142;
	GameID.Sound_huolongqiyan=11151;
	GameID.Sound_login_opendoor=11153;
	GameID.Sound_diyumoyan=11147;
	GameID.Sound_zhenyushengguang=11148;
	GameID.Sound_kangjuhuohuan=10331;
	GameID.Sound_goHomeAndRandom=22001;
	GameID.Sound_mon_idle=0;
	GameID.Sound_mon_hit=1;
	GameID.Sound_mon_die=2;
	GameID.Sound_mon_entermap=3;
	GameID.Sound_mon_injury=4;
	GameID.Sound_actType_idle=0;
	GameID.Sound_actType_hit=1;
	GameID.Sound_actType_die=2;
	GameID.Sound_actType_entermap=3;
	GameID.Sound_actType_injury=4;
	GameID.Sound_swim_run=8;
	GameID.Sound_swim_attack=9;
	GameID.Sound_swim_injury=10;
	GameID.Sound_CDCompolete="skillCDCompolete";
	GameID.Sound_drumbeat="drumbeat";
	GameID.MAX_JM_LEVEL=10;
	GameID.MAX_HOT_KEYS_COUNT=10;
	GameID.MAX_MOUNT_EQUIP_COUNT=6;
	GameID.MAX_RANKING_PAGE=10;
	GameID.MAX_EQUIP_INTENSIFY_LV=10;
	GameID.MAX_EQUIP_INLAY_COUNT=5;
	GameID.MAX_ROLE_ICON_COUNT=10;
	GameID.MAX_HUNT_TREASURE_COUNT=16;
	GameID.MAX_VIP_LV=12;
	GameID.MAX_CHAT_COUNT=30;
	GameID.MAX_MINICHAT_COUNT=20;
	GameID.MAX_TIRO_BOOK_LV=40;
	GameID.MAX_SHENSHOU_COUNT=2;
	GameID.YuanSuEquipCount=6;
	GameID.MenPaiUpLevelItemId=2025;
	__static(GameID,
	['CellWidthHalf',function(){return this.CellWidthHalf=48 >> 1;},'CellHeightHalf',function(){return this.CellHeightHalf=32 >> 1;},'BIBAOZHIXUAN_ARR',function(){return this.BIBAOZHIXUAN_ARR=[GameID.ITEMID_BIBAOZHIXUAN_1,GameID.ITEMID_BIBAOZHIXUAN_0,GameID.ITEMID_BIBAOZHIXUAN_2];},'STONE_ATTR',function(){return this.STONE_ATTR=[GameID.ITEMID_HUICHENGSHI,GameID.ITEMID_SUIJICHUANSONGSHI];},'ITEMID_WEAPPON_NEWPLAYER_ATTR',function(){return this.ITEMID_WEAPPON_NEWPLAYER_ATTR=[4400,4500,4600,4700,4800,17300,17400];},'SKILL_KEY_ARR',function(){return this.SKILL_KEY_ARR=[49,50,51,52,53,81,87,69,65,83];},'LangRenEquipIds',function(){return this.LangRenEquipIds=[4400,4500,4600,4700,4800];}
	]);
	return GameID;
})()


//class myGlobal.SoundID
var SoundID=(function(){
	//菜单
	function SoundID(){}
	__class(SoundID,'myGlobal.SoundID');
	SoundID.playBtnCommon=function(){
		LoaderSound.instance().playBtnCommon();
	}

	SoundID.playBtnClose=function(){
		LoaderSound.instance().play(103);
	}

	SoundID.playBtnCaidan=function(){
		LoaderSound.instance().play(105);
	}

	SoundID.Sound_SkillTenLevelup=4000;
	SoundID.bmg_intro='Game over2';
	SoundID.bmg_select='main_theme';
	SoundID.bmg_field='Field2';
	SoundID.bmg_gameover='game over2';
	SoundID.OPEN_DOOR=100;
	SoundID.SELCT_ROLE=101;
	SoundID.SOUND_Level_Up=146;
	SoundID.Sound_run_left="run_left";
	SoundID.Sound_run_right="run_right";
	SoundID.Sound_walk_left="walk_left";
	SoundID.Sound_walk_right="walk_right";
	SoundID.Sound_horse_run="162";
	SoundID.Sound_horse_walk="walk_horse";
	SoundID.Sound_task_finish="task_finish";
	SoundID.Sound_action_open="action_open";
	SoundID.Sound_transmit="transmit";
	SoundID.Sound_settlement="settlement";
	SoundID.s_hit_short=50;
	SoundID.s_hit_wooden=51;
	SoundID.s_hit_sword=52;
	SoundID.s_hit_do=53;
	SoundID.s_hit_axe=54;
	SoundID.s_hit_club=55;
	SoundID.s_hit_long=56;
	SoundID.s_hit_fist=57;
	SoundID.s_money=106;
	SoundID.s_click_weapon=111;
	SoundID.s_click_armor=112;
	SoundID.s_click_ring=113;
	SoundID.s_click_armring=114;
	SoundID.s_click_necklace=115;
	SoundID.s_click_helmet=116;
	SoundID.s_click_grobes=117;
	SoundID.s_itmclick=118;
	SoundID.SOUND_NORM_BUTTON_CLICK=103;
	SoundID.SOUND_GLASS_BUTTON_CLICK=105;
	return SoundID;
})()


/**
*单位配置ID
*@author karl
*/
//class myGlobal.UnitID
var UnitID=(function(){
	function UnitID(){}
	__class(UnitID,'myGlobal.UnitID');
	UnitID.getModeStrByModeId=function(modeId){
		var index=UnitID.UNIT_ATK_MODE_ARR.indexOf(modeId);
		if (index==-1)
			index=0;
		return UnitID.UNIT_ATK_MODE_STR_ARR[index];
	}

	UnitID.UNIT_SHORTCUT_TYPE_SKILL=0;
	UnitID.UNIT_SHORTCUT_TYPE_ITEM=1;
	UnitID.UNIT_TIMECDE_TYPE_MMDB=2;
	UnitID.MOVETYPE_WALK=0;
	UnitID.MOVETYPE_RUN=1;
	UnitID.MOVETYPE_HORSERUN=2;
	UnitID.MOVETYPE_TURN=3;
	UnitID.BAGTYPE_PACKAGE=3;
	UnitID.U_DRESS=0;
	UnitID.U_WEAPON=1;
	UnitID.U_YUPEI=2;
	UnitID.U_NECKLACE=3;
	UnitID.U_HUTUI=4;
	UnitID.U_TOUSHI=5;
	UnitID.U_HUWAN=6;
	UnitID.U_RINGL=7;
	UnitID.U_XIEZI=8;
	UnitID.U_YAOPAI=9;
	UnitID.U_BELT=10;
	UnitID.U_BOOTS=11;
	UnitID.U_SHIZHUANG=12;
	UnitID.U_HUWAN2=13;
	UnitID.U_RUYU=14;
	UnitID.U_XUNZHANG=15;
	UnitID.U_ZHANSHENLING=16;
	UnitID.U_DASHENBIAN=17;
	UnitID.U_YUPEI2=18;
	UnitID.U_MIJI3=19;
	UnitID.U_MIJI4=20;
	UnitID.U_MIJI5=21;
	UnitID.U_ZhuFu=22;
	UnitID.U_FuFu=23;
	UnitID.U_JULINGSHI=24;
	UnitID.U_FABAO_WANDAO=25;
	UnitID.U_FABAO_SHENZHONG=26;
	UnitID.U_FABAO_HULU=27;
	UnitID.U_FABAO_HUFU=28;
	UnitID.U_MOXUESHI=29;
	UnitID.MAX_POSITON_COUNT=30;
	UnitID.MAX_FZPOSITON_COUNT=80;
	UnitID.U_FZ_WEAPON=0;
	UnitID.U_FZ_DRESS=1;
	UnitID.U_FZ_HELMET=2;
	UnitID.U_FZ_NECKLACE=3;
	UnitID.U_FZ_ARMRINGL=4;
	UnitID.U_FZ_ARMRINGR=5;
	UnitID.U_FZ_RINGL=6;
	UnitID.U_FZ_RINGR=7;
	UnitID.U_FZ_BELT=8;
	UnitID.U_FZ_BOOTS=9;
	UnitID.U_QC_TIETI=0;
	UnitID.U_QC_MAAN=1;
	UnitID.U_QC_LINGDANG=2;
	UnitID.U_QC_HUKUI=3;
	UnitID.U_QC_JIANGSHENG=4;
	UnitID.EQUIP_HUNQI_POSITION_ARR=[];
	UnitID.EQUIP_QICHONGPOSITION_COMMON_STR={};
	UnitID.EQUIP_POSITION_ARR=[];
	UnitID.UNIT_FROM_PACKAGE=1;
	UnitID.UNIT_FROM_ROLE=2;
	UnitID.UNIT_FROM_FZROLE=3;
	UnitID.UNIT_FROM_MIJI=4;
	UnitID.UNIT_FROM_DEPOT=5;
	UnitID.UNIT_FROM_NianKaCangKu=6;
	UnitID.UNIT_FROM_EQRECYCLING=7;
	UnitID.UNIT_FROM_Fashion=9;
	UnitID.UNIT_FROM_SHENBINGBAOHE=8;
	UnitID.UNIT_FROM_ChuanQiFaQiItem=10;
	UnitID.UNIT_FROM_XunBaoCangKu=11;
	UnitID.UNIT_FROM_SHENGJIANG=13;
	UnitID.UNIT_FROM_PETPACK=14;
	UnitID.UNIT_FROM_SHENGZHUANG=15;
	UnitID.UNIT_FROM_HUNQI=16;
	UnitID.UNIT_FROM_YUANSUHE=17;
	UnitID.UNIT_FROM_WEAPONBOX=18;
	UnitID.UNIT_FROM_QICHONG19=19;
	UnitID.UNIT_FROM_QICHONG20=20;
	UnitID.UNIT_FROM_QICHONG21=21;
	UnitID.UNIT_FROM_QICHONG22=22;
	UnitID.UNIT_FROM_QICHONG23=23;
	UnitID.UNIT_FROM_QICHONG24=24;
	UnitID.UNIT_FROM_QICHONG25=25;
	UnitID.UNIT_FROM_QICHONG26=26;
	UnitID.UNIT_FROM_QICHONG27=27;
	UnitID.UNIT_FROM_QICHONG28=28;
	UnitID.UNIT_FROM_QICHONG29=29;
	UnitID.UNIT_FROM_QICHONG30=30;
	UnitID.UNIT_FROM_QICHONG31=31;
	UnitID.UNIT_FROM_QICHONG32=32;
	UnitID.UNIT_FROM_QICHONG33=33;
	UnitID.UNIT_FROM_QICHONG34=34;
	UnitID.UNIT_FROM_QICHONG35=35;
	UnitID.UNIT_FROM_QICHONG36=36;
	UnitID.UNIT_FROM_QICHONG37=37;
	UnitID.UNIT_FROM_QICHONG38=38;
	UnitID.UNIT_FROM_QICHONG39=39;
	UnitID.UNIT_FROM_QICHONG40=40;
	UnitID.UNIT_FROM_QICHONG41=41;
	UnitID.UNIT_FROM_QICHONG42=42;
	UnitID.UNIT_FROM_QICHONG43=43;
	UnitID.UNIT_FROM_QICHONG44=44;
	UnitID.UNIT_FROM_QICHONG45=45;
	UnitID.UNIT_FROM_QICHONG46=46;
	UnitID.UNIT_FROM_QICHONG47=47;
	UnitID.UNIT_FROM_QICHONG48=48;
	UnitID.UNIT_FROM_QICHONG49=49;
	UnitID.UNIT_FROM_YUANSUTEJIE50=50;
	UnitID.UNIT_FROM_YUANSUTEJIE51=51;
	UnitID.UNIT_FROM_YUANSUTEJIE52=52;
	UnitID.UNIT_FROM_YUANSUTEJIE53=53;
	UnitID.UNIT_FROM_YUANSUTEJIE54=54;
	UnitID.UNIT_FROM_YUANSUTEJIE55=55;
	UnitID.UNTI_FROM_Consign=59;
	UnitID.UNIT_FROM_QUICK_USE=60;
	UnitID.UNIT_FROM_TESHUHUISHOU=11;
	UnitID.UNIT_FROM_SHENZHUANGHUISHOU=12;
	UnitID.UNIT_FROM_GUILD=1001;
	UnitID.MAFA_BAOZANG=10000;
	UnitID.UNIT_FROM_QICHONG_BACK=1000;
	UnitID.UNIT_FROM_NONE=999;
	UnitID.UNIT_FROM_OTHERROLE=998;
	UnitID.UNIT_FROM_TRANSFER=997;
	UnitID.UNIT_FROM_TRANSFEREQUIP=996;
	UnitID.UNIT_FROM_CONSIGN=995;
	UnitID.UNIT_FROM_DEPOTPP=994;
	UnitID.UNIT_FROM_TRADE=993;
	UnitID.UNIT_FROM_BAGUA=992;
	UnitID.UNIT_FROM_CHAT=991;
	UnitID.UNIT_FROM_BATCHUSE=990;
	UnitID.UNIT_FROM_ShengJiangPETEQUIPPACK=989;
	UnitID.UNIT_FROM_BAOSHI=988;
	UnitID.UNIT_FROM_BAOSHIYEMIAN=987;
	UnitID.UNIT_FROM_RMBHUISHOU=986;
	UnitID.UNIT_FROM_MoJiangPETEQUIPPACK=985;
	UnitID.UNIT_FROM_SHENGZHUANG_PACK=984;
	UnitID.UNIT_FROM_GUILD_CANGKU=983;
	UnitID.UNIT_FROM_UseGrid=982;
	UnitID.UNIT_FROM_ITEM_BAOSHI=981;
	UnitID.UNIT_FROM_ITEM_Yao=980;
	UnitID.UNIT_FROM_ITEM_Yao_PC=-200;
	UnitID.UNIT_FROM_EQUIP_BAOSHI=979;
	UnitID.UNIT_FROM_SCRIPTPACKAGE=978;
	UnitID.UNIT_FROM_MifaJueJi=977;
	UnitID.UNIT_FROM_MifaJueJi_Panel=976;
	UnitID.UNIT_FROM_RanSeItemBag=975;
	UnitID.UNIT_FROM_TianCanSiItemBag=974;
	UnitID.UNIT_FROM_JianDingEquipBag=973;
	UnitID.UNIT_FROM_JianDingItemBag=4018;
	UnitID.UNIT_FROM_StrongEquipBag=971;
	UnitID.UNIT_FROM_StrongItemBag=970;
	UnitID.UNIT_FROM_CuiHuoItemBag=969;
	UnitID.UNIT_FROM_JianDingFuItemBag=968;
	UnitID.UNIT_FROM_DEAL=967;
	UnitID.UNIT_FROM_CuihuofenBag=966;
	UnitID.UNIT_FROM_StrongStoneBag=965;
	UnitID.UNIT_FROM_MenPaiRongy=964;
	UnitID.UNIT_FROM_MenQi=963;
	UnitID.UNIT_FROM_ItemName=962;
	UnitID.UNIT_FROM_SHOWVIEWNONE=961;
	UnitID.UNIT_FROM_StrongItem=960;
	UnitID.UNIT_FROM_FuLingBag=959;
	UnitID.UNIT_FROM_KuangGongBag=958;
	UnitID.UNIT_FROM_XinYunFuBag=957;
	UnitID.UNIT_FROM_EquipJiJieBag=956;
	UnitID.UNIT_FROM_CaiLiaoJiJieBag=955;
	UnitID.UNIT_FROM_MountEquipBag=1002;
	UnitID.UNIT_FROM_HeChengEquipBag=1003;
	UnitID.UNIT_FROM_TaskRunView=1004;
	UnitID.UNIT_FROM_DaZaoBag=1005;
	UnitID.UNIT_FROM_FateChartBag=1006;
	UnitID.UNIT_GRID_TYPE_PACKAGE=1;
	UnitID.UNIT_GRID_TYPE_EQUIP=2;
	UnitID.UNIT_GRID_TYPE_ROLE_EQUIP=3;
	UnitID.UNIT_GRID_TYPE_MOUNT_EQUIP=4;
	UnitID.UNIT_GRID_TYPE_INTENSIFY_EQUIP=5;
	UnitID.UNIT_GRID_TYPE_SKILL=6;
	UnitID.UNIT_GRID_TYPE_TRADE=7;
	UnitID.UNIT_GRID_TYPE_SHORTCUT=8;
	UnitID.UNIT_GRID_TYPE_TREASURE=9;
	UnitID.UNIT_PANEL_EQUIP=1;
	UnitID.UNIT_PANEL_PACKAGE=2;
	UnitID.UNIT_PANEL_TEAM=4;
	UnitID.UNIT_PANEL_OTHERPLAYER=6;
	UnitID.UNIT_PANEL_FRIEND=7;
	UnitID.UNIT_PANEL_SHOP=9;
	UnitID.UNIT_PANEL_WuGuSHOP=10;
	UnitID.UNIT_PANEL_SETTING=11;
	UnitID.UNIT_PANEL_JiBen=12;
	UnitID.UNIT_PANEL_HELPER=13;
	UnitID.UNIT_PANEL_MAP=14;
	UnitID.UNIT_PANEL_PAY=20;
	UnitID.UNIT_PANEL_MAIL=21;
	UnitID.UNIT_PANEL_CaoZuo=23;
	UnitID.UNIT_PANEL_FIRSTPAY=25;
	UnitID.UNIT_PANEL_SHORTCUT=32;
	UnitID.UNIT_PANEL_DIALOG=33;
	UnitID.UNIT_PANEL_MINITASK=34;
	UnitID.UNIT_PANEL_MINIMAP=36;
	UnitID.UNIT_PANEL_RECOVERY=39;
	UnitID.UNIT_PANEL_CHAT=40;
	UnitID.UNIT_PANEL_ZuDuiYaoQing=42;
	UnitID.UNIT_PANEL_BATCH=44;
	UnitID.UNIT_PANEL_NPCDIALOGUE=47;
	UnitID.UNIT_PANEL_XYCMNPCDIALOUGUE=48;
	UnitID.UNIT_PANEL_GOHOMEANDRANDOM=49;
	UnitID.UNIT_PANEL_DEPOT=51;
	UnitID.UNIT_PANEL_EQUIPBETTER=52;
	UnitID.UNIT_PANEL_PLAYEREQUIPMENT=53;
	UnitID.UNIT_PANEL_SELFROLE=54;
	UnitID.UNIT_PANEL_TRADE=59;
	UnitID.UNIT_PANEL_BOSSSIDE=60;
	UnitID.UNIT_PANEL_DiePanel=62;
	UnitID.UNIT_PANEL_YINDAO=63;
	UnitID.UNIT_PANEL_SuiShenShop=64;
	UnitID.UNIT_PANEL_SuiShenHuiShou=65;
	UnitID.UNIT_PANEL_WuPin=69;
	UnitID.UNIT_PANEL_ZHANLI=70;
	UnitID.UNIT_PANEL_Enemy=73;
	UnitID.UNIT_PANEL_BlackList=74;
	UnitID.UNIT_PANEL_ZongQinList=76;
	UnitID.UNIT_PANEL_WENJUANDIAOCHA=78;
	UnitID.UNIT_PANEL_WuPinXinXi=85;
	UnitID.UNIT_PANEL_FENJIE=87;
	UnitID.UNIT_PANEL_AUTOFENJIE=88;
	UnitID.UNIT_PANEL_LIXIANGUAJI=94;
	UnitID.UNIT_PANEL_SMITH_HECHENG=97;
	UnitID.UNIT_PANEL_YUEKA=99;
	UnitID.UNIT_PANEL_ONLINE=106;
	UnitID.UNIT_PANEL_JIHUOMA=108;
	UnitID.UNIT_PANEL_OFFLINE=109;
	UnitID.UNIT_PANEL_OFFLINE_SET=110;
	UnitID.UNIT_PANEL_OFFLINE_RESULT=111;
	UnitID.UNIT_PANEL_SHIZHUANG=118;
	UnitID.UNIT_PANEL_JJTEHUI=126;
	UnitID.UNIT_PANEL_RANKING_ZHANLI=130;
	UnitID.UNIT_PANEL_RANKING_CAIFU=131;
	UnitID.UNIT_PANEL_RANKING_JUANXIAN=132;
	UnitID.UNIT_PANEL_RANKING_GONGXIAN=133;
	UnitID.UNIT_PANEL_ACTIVESCREEN=141;
	UnitID.UNIT_PANEl_CHONGZhiAward=153;
	UnitID.UNIT_PANEL_SVIP=156;
	UnitID.UNIT_PANEL_CHUANQIDUOBAO=182;
	UnitID.UNIT_PANEL_TanCha=186;
	UnitID.UNIT_PANEL_SKILLSHORTCUT=201;
	UnitID.UNIT_KUAFU=207;
	UnitID.UNIT_PANEL_CAIDAN=210;
	UnitID.UNIT_PANEL_HEFU=216;
	UnitID.UNIT_PANEL_GREQTEQUIP=245;
	UnitID.UNIT_PANEL_SKILLSET=268;
	UnitID.UNIT_PANEL_WuGongKey=269;
	UnitID.UNIT_PANEL_CAIDANLAN_FG=306;
	UnitID.UNIT_PANLE_ZhaoCaiMao=313;
	UnitID.UNIT_PANLE_CunQianGuan=314;
	UnitID.UNIT_PANEL_OLR_Sign=321;
	UnitID.UNIT_PANEL_SHIZHUANGTEHUI=328;
	UnitID.UNIT_PANEL_EquipJianDingTips=332;
	UnitID.UNIT_PANEL_EquipAttShow=333;
	UnitID.UNIT_PANEL_ITEMSHOWPANEL=334;
	UnitID.UNIT_PANEL_AttSHOWPANEL=335;
	UnitID.UNIT_PANEL_BaoXiangTiShi=336;
	UnitID.UNIT_PANEL_ItemTiShi=337;
	UnitID.UNIT_PANEL_XINLUOGUTA=338;
	UnitID.UNIT_PANEL_WEIXINGUANZHU=346;
	UnitID.UNIT_PANEL_YUANBAOSHOP=358;
	UnitID.UNIT_PANEL_VIP_TEQUAN=367;
	UnitID.UNIT_PANEL_DuanZao=370;
	UnitID.UNIT_PANEL_FULIDATING=478;
	UnitID.UNIT_PANEL_KuangHuanLiBao=488;
	UnitID.UNIT_PANEL_MenPaiDaZhanEff=508;
	UnitID.UNIT_PANEL_JingLian=509;
	UnitID.UNIT_PANEL_AllTask=518;
	UnitID.UNIT_PANEL_ShiHoGong=519;
	UnitID.UNIT_PANEL_JiCheng=520;
	UnitID.UNIT_PANEL_CuiHuo=521;
	UnitID.UNIT_PANEL_JianDing=522;
	UnitID.UNIT_PANEL_RanSe=523;
	UnitID.UNIT_PANEL_ZhangHao=524;
	UnitID.UNIT_PANEL_FuZhu=525;
	UnitID.UNIT_PANEL_MiJing=526;
	UnitID.UNIT_PANEL_XinFaMiJing=527;
	UnitID.UNIT_PANEL_JingJie=528;
	UnitID.UNIT_PANEL_TEAM_EASY=530;
	UnitID.UNIT_PANEL_CONSIGN=244;
	UnitID.UNIT_PANEL_CONSIGN_SELF=147;
	UnitID.UNIT_PANEL_CONSIGN_HISTROY=531;
	UnitID.UNIT_PANEL_MenPaiLog=533;
	UnitID.UNIT_PANEL_MenPaiJoinList=534;
	UnitID.UNIT_PANEL_MenPaiAnnoun=535;
	UnitID.UNIT_PANEL_MenPai=536;
	UnitID.UNIT_PANEL_MenPaiMsg=537;
	UnitID.UNIT_PANEL_MenPaiMartiaLarts=538;
	UnitID.UNIT_PANEL_MenPaiList=539;
	UnitID.UNIT_PANEL_MenPaiReqList=540;
	UnitID.UNIT_PANEL_MenPaicons=541;
	UnitID.UNIT_PANEL_MenPaiTangKou=542;
	UnitID.UNIT_PANEL_MenPaiHuoDong=543;
	UnitID.UNIT_PANEL_HuoDongReward=544;
	UnitID.UNIT_PANEL_MenPaiShop=547;
	UnitID.UNIT_PANEL_Establishsects=548;
	UnitID.UNIT_PANEL_MenPaiShengJi=549;
	UnitID.UNIT_PANEL_MenPaiAppointed=550;
	UnitID.UNIT_PANEL_MenPaiTangKouShengJi=551;
	UnitID.UNIT_PANEL_MenPaiTangKouSheZhi=552;
	UnitID.UNIT_PANEL_MenPaiTangKouJuanXian=553;
	UnitID.UNIT_PANEL_MenPaiMenWuCJian=554;
	UnitID.UNIT_PANEL_MenPaiMenWuJIGe=555;
	UnitID.UNIT_PANEL_MenWuIntrod=556;
	UnitID.UNIT_PANEL_MenPaiRrappings=557;
	UnitID.UNIT_PANEL_MenPaiGuildGrade=558;
	UnitID.UNIT_PANEL_QuitTangKou=559;
	UnitID.UNIT_PANEL_MenPaiMartial=660;
	UnitID.UNIT_PANEL_MenPaiPkDetail=661;
	UnitID.UNIT_PANEL_ActivityHallView=662;
	UnitID.UNIT_PANEL_ActivityCopy=663;
	UnitID.UNIT_PANEL_ExitLiaoArmyView=664;
	UnitID.UNIT_PANEL_MilitarySupplies=665;
	UnitID.UNIT_PANEL_WuGuBattlefield=666;
	UnitID.UNIT_PANEL_DeliverySupplies=667;
	UnitID.UNIT_PANEL_GuardTown=669;
	UnitID.UNIT_PANEL_RandomBoss=670;
	UnitID.UNIT_PANEL_JunXuReward=671;
	UnitID.UNIT_PANEL_WuGuReward=672;
	UnitID.UNIT_PANEL_WuGuList=673;
	UnitID.UNIT_PANEL_XinfaMijingUseItem=674;
	UnitID.UNIT_PANEL_ZIYUANZHAOHUI=676;
	UnitID.UNIT_PANEL_BANGSHANGYOUMMING=677;
	UnitID.UNIT_PANEL_YAOQINGFULI=678;
	UnitID.UNIT_PANEL_FENGCEFULI=679;
	UnitID.UNIT_PANEL_JOINTSNGKOU=680;
	UnitID.UNIT_PANEL_FENGCHONGBSO=681;
	UnitID.UNIT_PANEL_MOBAIZZHAO=682;
	UnitID.UNIT_PANEL_QIANLICHUANYIN=683;
	UnitID.UNIT_PANEL_BXSEQUIP=684;
	UnitID.UNIT_PANEL_BXSSHENGWANG=685;
	UnitID.UNIT_PANEL_ChengJiuXiTong=675;
	UnitID.UNIT_PANEL_CHENGJIUSHENGWU=686;
	UnitID.UNIT_PANEL_CHENGJIUNIALING=687;
	UnitID.UNIT_PANEL_CHENGJIUJINGJIE=688;
	UnitID.UNIT_PANEL_CHENGJIUSHEJIAO=689;
	UnitID.UNIT_PANEL_CHENGJIUDUANZAO=690;
	UnitID.UNIT_PANEL_CHENGJIUXUANSAM=691;
	UnitID.UNIT_PANEL_CHENGJIUWUGONG=692;
	UnitID.UNIT_PANEL_CHENGJIUJUNGONG=693;
	UnitID.UNIT_PANEL_CAIJIZHONG=694;
	UnitID.UNIT_PANEL_JANKEFULINGHAOLI=695;
	UnitID.UNIT_PANEL_MENPAICHENGYUAN=696;
	UnitID.UNIT_PANEL_HECHONGQINGTTONG=697;
	UnitID.UNIT_PANEL_BAIYOUXIJIEHSOU=698;
	UnitID.UNIT_PANEL_ZHUANGBENJIEHSOU=699;
	UnitID.UNIT_PANEL_NPCJIESHOU=700;
	UnitID.UNIT_PANEL_GUAIWUJIESHOU=701;
	UnitID.UNIT_PANEL_BOSSJIESHOU=702;
	UnitID.UNIT_PANEL_JIANGHUMENPAI=703;
	UnitID.UNIT_PANEL_MEIRICHOGNZHI=704;
	UnitID.UNIT_PANEL_LEIJITIANSHU=705;
	UnitID.UNIT_PANEL_LEIJICHOGNZHIFULI=706;
	UnitID.UNIT_PANEL_JINGMAIXIAOZHOU=707;
	UnitID.UNIT_PANEL_JINGMAIDAZHOU=708;
	UnitID.UNIT_PANEL_WUGUPMINGXQING=709;
	UnitID.UNIT_PANEL_FULIMEIRIHUOYUE=710;
	UnitID.UNIT_PANEL_CHONGBANGHUODONG=711;
	UnitID.UNIT_PANEL_CHONGBANGXQING=712;
	UnitID.UNIT_PANEL_ZiXuanLiBao=713;
	UnitID.UNIT_PANEL_XINLUOGUTARANK=714;
	UnitID.UNIT_PANEL_WODEXUANSHANG=716;
	UnitID.UNIT_PANEL_XUANSHNAGZHUIJISA=717;
	UnitID.UNIT_PANEL_XUANGSHANGRANDBANG=718;
	UnitID.UNIT_PANEL_FABUXUANGSHANG=719;
	UnitID.UNIT_PANEL_XIANSHIZHEKOG=720;
	UnitID.UNIT_PANEL_QITIANXIANSHIZHEKOU=721;
	UnitID.UNIT_PANEL_XIANSHIJIANGLI=722;
	UnitID.UNIT_PANEL_XIANHAOLINGQU=723;
	UnitID.UNIT_PANLE_XianShiQiangGou=724;
	UnitID.UNIT_PANLE_XianShiZongLang=725;
	UnitID.UNIT_PANLE_BaiXiaoSheng_WUgong=726;
	UnitID.UNIT_PANLE_KaiFuLiBao=727;
	UnitID.UNIT_PANLE_ZhuLiLiBao=728;
	UnitID.UNIT_PANLE_WUXUEJINGJIE=729;
	UnitID.UNIT_PANLE_HuoDong_RiChang=730;
	UnitID.UNIT_PANLE_ZheKouFuli=731;
	UnitID.UNIT_PANLE_XianShiQiangGouView=732;
	UnitID.UNIT_PANLE_RongYaoYaoPai=733;
	UnitID.UNIT_PANLE_LianGongLiBao=734;
	UnitID.UNIT_PANLE_ChongZhiMenWu=735;
	UnitID.UNIT_PANLE_GeRenPaiHangBang=736;
	UnitID.UNIT_PANEL_Sanduanhutong=737;
	UnitID.UNIT_PANLE_MenPaiPaiHangBang=738;
	UnitID.UNIT_PANLE_ZhuGouLiBaO=739;
	UnitID.UNIT_PANLE_ZhuLiJinJie=740;
	UnitID.UNIT_PANLE_ShouJiZiTie=741;
	UnitID.UNIT_PANLE_BossShouBao=742;
	UnitID.UNIT_PANLE_ZhuangBenShouBao=743;
	UnitID.UNIT_PANLE_YuanBaoQianZhuang=744;
	UnitID.UNIT_PANLE_SanTian=745;
	UnitID.UNIT_PANLE_XuYuanDiandeng=746;
	UnitID.UNIT_PANLE_YiBenWanLi=747;
	UnitID.UNIT_PANLE_KuaFuZhengBa=748;
	UnitID.UNIT_PANLE_ChenHao=749;
	UnitID.UNIT_PANLE_KuaFuBoss=750;
	UnitID.UNIT_PANLE_RankShiXue=751;
	UnitID.UNIT_PANEL_WUXUEXIUWEI=753;
	UnitID.UNIT_PANEL_MenPaiTask=754;
	UnitID.UNIT_PANEL_WUXUEWUXINGJIEJIE=755;
	UnitID.UNIT_PANEL_WuGongSHop=756;
	UnitID.UNIT_PANEL_HuoDeLaiYuan=757;
	UnitID.UNIT_PANEL_TuoGuanYueKa=758;
	UnitID.UNIT_PANEL_QiangHuaFengYin=759;
	UnitID.UNIT_PANEL_YuanBaoHongBao=760;
	UnitID.UNIT_PANEL_LuoHanTang=761;
	UnitID.UNIT_PANEL_WuxuexindeHuishou=762;
	UnitID.UNIT_PANEL_WuXueJingJie=763;
	UnitID.UNIT_PANEL_JiangHuLiLian=764;
	UnitID.UNIT_PANLE_RankShiXueTiaozhan=765;
	UnitID.UNIT_PANLE_QuanMinXiuLian=766;
	UnitID.UNIT_PANEL_ShixueTiaozhanAlert=767;
	UnitID.UNIT_PANEL_YaBiao=768;
	UnitID.UNIT_PANEL_ChongJing=770;
	UnitID.UNIT_PANEL_KaiZongLiPai=771;
	UnitID.UNIT_PANLE_QuanMinBoBao=772;
	UnitID.UNIT_PANEL_XinfamijingUseWudu=774;
	UnitID.UNIT_PANEL_MiJiDuiHuan=775;
	UnitID.UNIT_PANEL_FUCHOU=776;
	UnitID.UNIT_PANEL_XinfamijingKickOutAlert=777;
	UnitID.UNIT_PANEL_RankDouKui=778;
	UnitID.UNIT_ZhaoMuSheZhi=779;
	UnitID.UNIT_ZhaoMuShenQing=780;
	UnitID.UNIT_XINFADUIHUAN=781;
	UnitID.UNIT_RANKMEIRIBUGI=782;
	UnitID.UNIT_MEIRIFULIINT=783;
	UnitID.UNIT_TEST_PANEL=9999;
	UnitID.UNIT_JieRiHuoDong_PANEL=785;
	UnitID.UNIT_PANEL_SHIWUHUISHOU=786;
	UnitID.UNIT_PANEL_JieRiDengLu=787;
	UnitID.UNIT_PANEL_XingYunZhuanPan=788;
	UnitID.UNIT_PANEL_NIASHOULAIXZI=789;
	UnitID.UNIT_PANEL_XUANSHANGXTONG=790;
	UnitID.UNIT_PANEL_MEIRIRWUXUANSHANG=715;
	UnitID.UNIT_PANEL_GUTASHOP=791;
	UnitID.UNIT_PANEL_DUIBAODUIHUAN=792;
	UnitID.UNIT_PANEL_ZHOUMEIHUODONG=793;
	UnitID.UNIT_PANEL_ZHOUMEIHONGBAO=794;
	UnitID.UNIT_PANEL_CHAGONGJIEQ=795;
	UnitID.UNIT_PANEL_WeekDengLuHaoLi=797;
	UnitID.UNIT_PANEL_WeekXianShiQiangGou=798;
	UnitID.UNIT_PANEL_HuoDeTip=799;
	UnitID.UNIT_PANEL_WeekEndBoss=800;
	UnitID.UNIT_PANEL_HEFUXUXIAXINSYUN=801;
	UnitID.UNIT_PANEL_HEFUEMRISHOUCHOGFN=802;
	UnitID.UNIT_PANEL_HEFUEBOSS=803;
	UnitID.UNIT_PANEL_HEFUXIANSHIQG=805;
	UnitID.UNIT_PANEL_HEFUQIANNIA=806;
	UnitID.UNIT_PANEL_GAIMINGKA=807;
	UnitID.UNIT_PANEL_HEFUMENPAIJPAI=808;
	UnitID.UNIT_PANEL_HEFUBAOZANG=809;
	UnitID.UNIT_PANEL_HEFUJUANXIAN=810;
	UnitID.UNIT_PANEL_HEFUJUANXIANAll=811;
	UnitID.UNIT_PANEL_WUYIQINLAOJIA=812;
	UnitID.UNIT_PANEL_WUYIXIANLI=813;
	UnitID.UNIT_PANEL_WUYISHOP=814;
	UnitID.UNIT_PANEL_WUYILIANCHONG=815;
	UnitID.UNIT_PANEL_WUYIRANKALL=816;
	UnitID.UNIT_PANEL_JUANZLIABAO=817;
	UnitID.UNIT_PANEL_WEEKZHIGOU=818;
	UnitID.UNIR_WULIZHEBA_GERENSAI=819;
	UnitID.UNIR_WULIZHENBA_PAIHANGBANG=820;
	UnitID.UNIR_WULIZHENBA_PKSAI=821;
	UnitID.UNIR_WULIZHENBA_PAIMINGJIANGLI=822;
	UnitID.UNIR_MAILYINGXIONGTIE=823;
	UnitID.UNIR_WULIZHENBA_JIESUAN=824;
	UnitID.UNIT_PANEL_TJGUIWU=825;
	UnitID.UNIT_PANEL_TJTUWEI=826;
	UnitID.UNIT_PANEL_TJTESHU=827;
	UnitID.UNIR_MieMenRank=828;
	UnitID.UNIR_MiniMieMenRank=829;
	UnitID.UNIR_DUANZAOFULING=830;
	UnitID.UNIR_MieMenRankReward=831;
	UnitID.UNIR_FuLingPanel=832;
	UnitID.UNIR_BuMieTiPanel=833;
	UnitID.UNIR_SouthMapPanel=834;
	UnitID.UNIR_XiangDaoPanel=835;
	UnitID.UNIR_TuiJianPanel=836;
	UnitID.UNIR_WuXueSellPanel=837;
	UnitID.UNIR_YaoQianShu=838;
	UnitID.UNIR_LianXuChongZhi=839;
	UnitID.UNIR_DanBiChongZhi=840;
	UnitID.UNIR_YuanBaoZhuanPan=841;
	UnitID.UNIR_MonthXianShiQiangGou=842;
	UnitID.UNIR_QuanMinShaGuai=843;
	UnitID.UNIR_MAP_VIEW=844;
	UnitID.UNIR_DuanWuJuBao=845;
	UnitID.UNIR_DuanWuQiFu=846;
	UnitID.UNIR_DuanWuLianChong=847;
	UnitID.UNIR_DuanWuQiaoZong=848;
	UnitID.UNIR_DuanWuDuiHuan=849;
	UnitID.UNIR_DuanWuQiangZong=850;
	UnitID.UNIR_WULIZHENBA_ANIMATION=851;
	UnitID.UNIR_WuXingType=852;
	UnitID.UNIR_WULIZHENBAPK_JIESUAN=853;
	UnitID.UNIT_PANEL_YANZHENGMA=854;
	UnitID.UNIT_PANEL_ZIYUANZHENGDUO=855;
	UnitID.UNIT_PANEL_QIANNIAQINGDIAN=856;
	UnitID.UNIT_PANEL_QIANBGFHUAHUIKUI=857;
	UnitID.UNIT_PANEL_JINIUYINGQING=858;
	UnitID.UNIT_PANEL_MIAOSHALIBAO=859;
	UnitID.UNIT_PANEL_QINGDIANBOSS=860;
	UnitID.UNIT_PANEL_QINGDIANLIANCHONG=861;
	UnitID.UNIT_PANEL_QINGDIANWABAO=862;
	UnitID.UNIT_PANEL_QIANNIAZHUANGPAN=863;
	UnitID.UNIT_PANEL_ZIYUANZHENGDUO_DESC=864;
	UnitID.UNIT_PANEL_QD_MIAOSHALIBAO=865;
	UnitID.UNIT_PANEL_ZIYUANZHENGDUO_PAIQIAN=866;
	UnitID.UNIT_PANEL_TUJIANLIBAO=867;
	UnitID.UNIT_PANEL_ROLEBOSS=868;
	UnitID.UNIT_PANEL_9377WEB_FULI=869;
	UnitID.UNIT_PANEL_9377WEB_WEIXING=870;
	UnitID.UNIT_PANEL_9377WEB_SHOUJI=871;
	UnitID.UNIT_PANEL_9377WEB_SHIMING=872;
	UnitID.UNIT_PANEL_ShiZhuangJiBan=873;
	UnitID.UNIT_PANEL_ShiZhuangJiaCheng=999;
	UnitID.UNIT_PANEL_ShiWeiBaoBao=874;
	UnitID.UNIT_PANEL_TaiGuYuanShi=875;
	UnitID.UNIT_PANEL_WeiDuan=876;
	UnitID.UNIT_PANEL_WeiDuan360=877;
	UnitID.UNIT_PANEL_WeiDuanQianDao=878;
	UnitID.UNIT_PANEL_FengCeDengLu=879;
	UnitID.UNIT_PANEL_FengCeShuoMing=880;
	UnitID.UNIT_PANEL_FengCeFangLi=881;
	UnitID.UNIT_PANEL_MenPaiPaiMaiHang=882;
	UnitID.UNIT_PANEL_ShenBingYuHe=883;
	UnitID.UNIT_PANEL_ZhuanHua=884;
	UnitID.UNIT_PANEL_ShenXing=885;
	UnitID.UNIT_PANEL_EquipJiJie=886;
	UnitID.UNIT_PANEL_ZhuanHuaPanel=887;
	UnitID.UNIT_PANEL_ShenXingPanel=888;
	UnitID.UNIT_PANEL_TanHeMenZhuPanel=889;
	UnitID.UNIT_PANEL_TanHeChuLiPanel=890;
	UnitID.UNIT_PANEL_ZhuanHuaShowPanel=891;
	UnitID.UNIT_PANEL_WoYaoBianQianPanel=892;
	UnitID.UNIT_PANEL_WoYaoBianQianPOPPanel=893;
	UnitID.UNIT_PANEL_BaiTanSelfPanel=900;
	UnitID.UNIT_PANEL_BaiTanMsgPanel=901;
	UnitID.UNIT_PANEL_BaiTanOtherPanel=902;
	UnitID.UNIT_PANEL_MOUNTSET=903;
	UnitID.UNIT_PANEL_MountLevelPanel=904;
	UnitID.UNIT_PANEL_MountQualityPanel=905;
	UnitID.UNIT_PANEL_NPC_Shop=906;
	UnitID.UNIT_PANEL_ShenQingPanel=907;
	UnitID.UNIT_PANEL_DiQuPanel=908;
	UnitID.UNIT_PANEL_RankAwardPanel=909;
	UnitID.UNIT_PANEL_GongFuTuPoPanel=910;
	UnitID.UNIT_PANEL_DuMenWuXuePanel=911;
	UnitID.UNIT_PANEL_HECHENG=912;
	UnitID.UNIT_PANEL_JiangHuLiLianLevel=913;
	UnitID.UNIT_PANEL_GM=915;
	UnitID.UNIT_PANEL_JiangHuBaoZhuangPanel=916;
	UnitID.UNIT_PANEL_JiangHuFuLiPanel=917;
	UnitID.UNIT_PANEL_ActivityNationalHuntingView=918;
	UnitID.UNIT_PANEL_JiJiangKaiQiView=919;
	UnitID.UNIT_PANEL_Sign14DayPanel=920;
	UnitID.UNIT_PANEL_WULINZHENGBA=921;
	UnitID.UNIT_PANEL_WULINZHENGBARANK=922;
	UnitID.UNIT_PANEL_WULINZHENGBAJIESUAN=923;
	UnitID.UNIT_PANEL_TOPTIMEREFFPANEL=924;
	UnitID.UNIT_PANLE_ChongJingHaoLi=925;
	UnitID.UNIT_PANLE_WuGongChongBang=926;
	UnitID.UNIT_PANLE_LianGongChongBang=927;
	UnitID.UNIT_PANLE_WuLiChongBang=928;
	UnitID.UNIT_PANLE_DengJiChongBang=929;
	UnitID.UNIT_PANLE_XianShiJingXiPanel=930;
	UnitID.UNIT_PANLE_MenPaiWuXuePanel=931;
	UnitID.UNIT_PANLE_MenPaiHuoDongRank=932;
	UnitID.UNIT_PANLE_AutoLiangGong=933;
	UnitID.UNIT_PANLE_WorldBoss=934;
	UnitID.UNIT_PANLE_TeamBoss=935;
	UnitID.UNIT_PANLE_XiuWeiBoss=936;
	UnitID.UNIT_PANEL_JiangHuJieYuanPanel=937;
	UnitID.UNIT_PANEL_DaZao=938;
	UnitID.UNIT_PANEL_XiLianQiangDu=939;
	UnitID.UNIT_PANEL_XiLianDaShi=940;
	UnitID.UNIT_PANEL_Program=1001;
	UnitID.UNIT_PANEL_JiangHuYouLi=941;
	UnitID.UNIT_PANEL_JiangHuYouLi_GuaJi=942;
	UnitID.UNIT_PANEL_Common_GongXiHuoDe=943;
	UnitID.UNIT_PANEL_JiangHuYouLi_ShouYi=944;
	UnitID.UNIT_PANEL_CopyCountDown=945;
	UnitID.UNIT_PANEL_FateChart=946;
	UnitID.UNIT_PANEL_FateChartBag=947;
	UnitID.UNIT_PANEL_YangMingLeiStart=948;
	UnitID.UNIT_PANEL_ACT_CD_PANEL=949;
	UnitID.UNIT_PANEL_YangMingLeiPlayerTopPanel=950;
	UnitID.UNIT_PANEL_YangMingLeiAwardPanel=951;
	UnitID.UNIT_PANEL_YangMingLeiShopPanel=952;
	UnitID.UNIT_PANEL_YangMingLeiRankPanel=953;
	UnitID.UNIT_PANEL_YangMingLeiJieSuanPanel=954;
	UnitID.UNIT_PANEL_JuDianOverPanel=955;
	UnitID.UNIT_PANEL_JuDianTongJiPanel=956;
	UnitID.UNIT_PANEL_HuoDongYangMingLeiPanel=957;
	UnitID.UNIT_PANEL_JuDianMapPanel=958;
	UnitID.UNIT_PANEL_JuDianLiShiPanel=959;
	UnitID.UNIT_PANEL_JuDianAwardPanel=960;
	UnitID.UNIT_PANEL_ActRankPanel=961;
	UnitID.UNIT_PANEL_TeamBloodPanel=962;
	UnitID.UNIT_PANEL_ActAwardLookPanel=963;
	UnitID.UNIT_PANEL_JuDianRankAwardPanel=964;
	UnitID.UNIT_PANEL_QunXiongPanel=965;
	UnitID.UNIT_PANEL_ActCdTimePanel=966;
	UnitID.UNIT_PANEL_TradeBagPanel=967;
	UnitID.UNIT_PANEL_JinJunPanel=968;
	UnitID.UNIT_PANEL_FengMoPanel=969;
	UnitID.UNIT_PANEL_DuanTiJiQiaoPanel=970;
	UnitID.UNIT_PANEL_BUBU_Panel=971;
	UnitID.UNIT_PANEL_JiangHuYouLiRankPanel=972;
	UnitID.UNIT_PANEL_ChuangSongPanel=973;
	UnitID.UNIT_PANEL_DungeonTaskPanel=974;
	UnitID.UNIT_PANEL_WenQuan_Panel=975;
	UnitID.UNIT_PANLE_RoleHead=976;
	UnitID.UNIT_PANEL_QiangHuaAuto_Panel=977;
	UnitID.UNIT_PANEL_PcMiniTeam_Panel=978;
	UnitID.UNIT_PANEL_TEAM_NEARYTEAM=0;
	UnitID.UNIT_PANEL_TEAM_NEARYPLAYER=1;
	UnitID.UNIT_PANEL_TEAM_APPLYJOINPLAYER=2;
	UnitID.UNIT_GUIDE_MENU_BAR=1;
	UnitID.UNIT_GUIDE_NPC_DIALOG=2;
	UnitID.UNIT_GUIDE_TASK_BAR=3;
	UnitID.UNIT_GUIDE_PACKAGE=4;
	UnitID.UNIT_GUIDE_ROLE_PANEL=5;
	UnitID.UNIT_GUIDE_ROLE_SELF=6;
	UnitID.UNIT_GUIDE_MINI_MAP=7;
	UnitID.ATTACK_MISS=0;
	UnitID.ATTACK_CRIT=1;
	UnitID.ATTACK_REBOUND=2;
	UnitID.UNIT_MAX_PICKITEM=20;
	UnitID.UNIT_ATTACK_MODE_0=0;
	UnitID.UNIT_ATTACK_MODE_1=1;
	UnitID.UNIT_ATTACK_MODE_2=2;
	UnitID.UNIT_ATTACK_MODE_3=3;
	UnitID.UNIT_ATTACK_MODE_4=4;
	UnitID.UNIT_ATTACK_MODE_5=5;
	UnitID.UNIT_ATTACK_MODE_6=6;
	UnitID.UNIT_ATTACK_MODE_STR_QUANTI="全体";
	UnitID.UNIT_ATTACK_MODE_STR_HEPING="和平";
	UnitID.UNIT_ATTACK_MODE_STR_HANGHUI="行会";
	UnitID.UNIT_ATTACK_MODE_STR_SHANE="善恶";
	UnitID.UNIT_ATTACK_MODE_STR_ZHENYING="阵营";
	UnitID.UNIT_PANEL_DEBUG=2000;
	__static(UnitID,
	['posName',function(){return this.posName=["衣服","武器","玉佩","项链","下装","头饰","护腕","戒指","靴子","腰牌"];},'BodyShapPos',function(){return this.BodyShapPos=[0,1,2,4,11,9,12];},'EQUIP_POSITION_FZ_ARR',function(){return this.EQUIP_POSITION_FZ_ARR=[0,1,2,3,4,5,6,7,8,9];},'EQUIP_POSITION_COMMON',function(){return this.EQUIP_POSITION_COMMON=[0,1,3,4,5,6,7,8,10,11];},'EQUIP_POSITEM_ATHER',function(){return this.EQUIP_POSITEM_ATHER=[2,14,28,27,26,25,22,23];},'EQUIP_POSITEM_JINGLIAN',function(){return this.EQUIP_POSITEM_JINGLIAN=[2,14,15,27];},'EQUIP_TESHU_POSITION_ARR',function(){return this.EQUIP_TESHU_POSITION_ARR=[16,17];},'EQUIP_POSITION_COMMON_ARR',function(){return this.EQUIP_POSITION_COMMON_ARR=[0,1,3,4,5,6,7,8,10,11,16,17,18];},'EQUIP_POSITION_BAOSHI',function(){return this.EQUIP_POSITION_BAOSHI=[1,0,3,4,5,6,7,8,10,11];},'EQUIP_QICHONG_POS',function(){return this.EQUIP_QICHONG_POS=[0,1,2,3,4];},'DieCanOpenPanels',function(){return this.DieCanOpenPanels=[509,761,757,118,537,
		521,370,522,707,1,13,2,9,
		62,367,40,699,724,25,776,
		824,853,923,943,892,
		954];},'UNIT_ATK_MODE_ARR',function(){return this.UNIT_ATK_MODE_ARR=[0,1,2,3,4,5];},'UNIT_ATK_MODE_STR_ARR',function(){return this.UNIT_ATK_MODE_STR_ARR=["全体","和平",UnitID.UNIT_ATTACK_MODE_STR_ZUDUI,"行会","善恶"];},'UNIT_ATTACK_MODE_STR_ZUDUI',function(){return this.UNIT_ATTACK_MODE_STR_ZUDUI=(MConfig.isYWMode()|| MConfig.isFGMode())? "队伍" :"编组";},'JOB_ZIMU_ATTR',function(){return this.JOB_ZIMU_ATTR=["Z","F","D"];}
	]);
	return UnitID;
})()



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