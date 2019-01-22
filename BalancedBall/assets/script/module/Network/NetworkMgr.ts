declare let require : any;
import {netControl} from "./protocol/NetControl"
import * as onfire from './protocol/libs/onfire/onfire';
import {PlatformMgr} from '../Platform/PlatformMgr';
import {Global} from '../Global';
let pbkiller = require('./pbkiller/src/pbkiller');
const {ccclass, property,executionOrder} = cc._decorator;

export const MSG_MAP = {
    Login : 0,
    LoginResult : 1,
    ReqPackage : 2,
    Package : 3,
    ReqCarList : 4,
    CarList : 5,
    ReqUpdatePackage : 6,
    UpdatePackageResult : 7,
    ReqUpdateCars : 8,
    UpdateCarsResult : 9,
    ReqUserMatch : 10,
    UserMatchResult : 11,
    BattleResult : 12,
    BattleResultClient : 13,
    ReqSkip : 14,
    SkipResult : 15,
    //箱子相关
    ReqBoxUnlock : 16,
    BoxUnlockResult : 17,
    ReqBoxOpen : 18,
    BoxOpenResult : 19,
    ReqBoxTimeEnd : 20,
    BoxTimeEndResult : 21,
    ReqBoxCostCoupon : 22,
    BoxCostCouponResult : 23,
    ReqBoxSkipMin : 24,
    BoxSkipMinResult : 25,
    ReqBoxList : 26,
    BoxListResult : 27,
    ReqSaleComp:28,
    SaleCompResult:29,
    ReqCompUpgrade:30,
    CompUpgradeResult:31,
    ReqCompUpstar:32,
    CompUpstarResult:33,
    ReqMarketList:34,
    MarketResult:35,
    ReqBuyItem:36,
    BuyItemResult:37,

    ReqRankList:38,//请求玩家排位列表
    RankListResult:39,
    ReqAllRankMatch:40,
    AllRankMatchResult:41,
    ReqDealAllRankBattle:42,
    DealAllRankBattleResult:43,
    ReqSoloRankMatch:44,
    SoloRankMatchResult:45,
    ReqDealSoloRankBattle:46,
    DealSoloRankBattleResult:47,
    ReqUnlockComponents:48,
    UnlockComponentsResult:49,

    ReqSetRankCar:50,
    SetRankCarResult:51,

    ReqDailyTask:52,//任务系统
    DailyTaskResult:53,
    ReqGetTaskAward:54,//任务系统
    GetTaskAwardResult:55,

    //设置系统
    ReqSettingConfig:56,
    SettingConfigResult:57,
    ReqSetAudio:58,
    SetAudioResult:59,
    ReqSetBackMusic:60,
    SetBackMusicResult:61,
    ReqSetLangEnv:62,
    SetLangEnvResult:63,
    ReqShareComplete:64,
    ShareCompleteResult:65,
    ReqFeedback:66,
    FeedbackResult:67,
    ReqRedeemCode:68,
    RedeemCodeResult:69,

    ReqXpCoinConfig:70,
    XpCoinConfigResult:71,
    ReqHpDamageConfig:72,
    HpDamageConfigResult:73,

    ReqBoxConfig:74,
    BoxConfigResult:75,

    BeKickedOutResult:76,

    ReqComponentTypeDbDatas:77,
    ComponentTypeDbDatasResult:78,

    FinishTutorial:79,

    ReqUserInfo:80,
    UserInfoResult:81,

    ReqComponentComposed:82,
    ComponentComposedResult:83,
    ReqReComponentComposed:84,
    ReComponentComposedResult:85,

    ReqFriendList:86,
    FriendListResult:87,
    ReqSearchFriend:88,
    SearchFriendResult:89,
    ReqAddFriend:90,
    AddFriendResult:91,
    ReqDealFriend:92,
    DealFriendResult:93,
    ReqDeleteFriend:94,
    DeleteFriendResult:95,
    ReqSendFriendCoin:96,
    SendFriendCoinResult:97,
    ReqReceiveFriendCoin:98,
    ReceiveFriendCoinResult:99,
    ReqFriendBattle:100,
    FriendBattleResult:101,
    ReqDirectUpMatch:102,
    DirectUpMatchResult:103,
    ReqDealDirectUpBattle:104,
    DealDirectUpBattleResult:105,

    ReqWatchAdToKeepVictory:106,
    WatchAdToKeepVictoryResult:107,

    ReqSevenDayTask:108,
    SevenDayTaskResult:109,
    ReqGetSevenDayAward:110,
    GetSevenDayAwardResult:111,

    RefreshClient:112,
    KickOutOfRank:113,

    ReqRecordUserOperation:114,

    ClientPing:115,

    ReqWatchAdBoxUp:116,
    WatchAdBoxUpResult:117,
};

@ccclass
export class NetworkMgr extends cc.Component{
    @executionOrder(-9)

    @property
    enableHeartCheck:boolean = true;//是否开启心跳包
    
    static instance : NetworkMgr = null;

    private pb : any;
    private netControl : any;
    private host : string;
    private port : string;
    private _isConnect : boolean;

    private messageList : any[];

    private username : string;
    private userId : string;
    private photoUrl : string;

    private eventMessageFire : any;
    private eventConnectSuc : any;

    private heartCheck:HeartCheck;

    onLoad () {
        cc.game.addPersistRootNode(this.node);

        this._isConnect = false;
        NetworkMgr.instance = this;

        if(!Global.GB_IsUseClientData){
            this.netControl = new netControl();
            if(this.enableHeartCheck){
                this.heartCheck = new HeartCheck();
            }

            cc.loader.loadRes('config/serverInfo' , (err,res)=>{
                if (err) {
                    console.log(err);
                }
                else{
                    this.host = res.json.host;
                    this.port = res.json.port;
                    this.eventConnectSuc = onfire.on("onopen",this.connectSuc.bind(this));
                    this.netControl.connect(this.host, this.port);

                    pbkiller.preload(() => {
                        this.loadMessage();
                    });

                    /* if(this.isNeedPreloadProtobuf()){
                        pbkiller.preload(() => {
                            this.loadMessage();
                        });
                    }
                    else{
                        this.loadMessage();
                    } */
                };
            });
        }
    }

    isNeedPreloadProtobuf():boolean{
        if(PlatformMgr.isNativePlatform() || PlatformMgr.isWeChatPlatform()){
            return true;
        }
        return false;
    }

    loadMessage(){
        if (cc.sys.isNative) {//在native上加载失败，是因为没有找到目录，我们在testProtobuf函数里面添加一个搜索目录:
			cc.log("jsb.fileUtils=" + jsb.fileUtils);
			jsb.fileUtils.addSearchPath("res/raw-assets/resources", true);
        }
        
        this.messageList = [];

        let pb  = pbkiller.loadAll('proto', 'msg');
        this.pb = pb;

        for(let key in MSG_MAP){
            let msgInfo = {object:{},name:''};
            msgInfo.name = key;
            msgInfo.object = new pb[msgInfo.name];

            let msgId = MSG_MAP[key];
            this.messageList[msgId] = msgInfo;
        }
    }

    start () {
        this.username = undefined;
        this.userId = undefined;
        this.photoUrl = undefined;

        this.schedule(this.checkLoadPlatformFinish, 0.02);
    }

    checkLoadPlatformFinish(){
        if(PlatformMgr.instance){
            this.unschedule(this.checkLoadPlatformFinish);

            let loginMgrComp = this.node.getComponent('LoginMgr');
            if(!loginMgrComp.getIsActiveLogin()){
                this.startLogin();
            }
        }
    }

    startLogin(){
        let platformObj = PlatformMgr.instance.getPlatform();
        this.username = platformObj.getPlayerName();
        this.userId = platformObj.getPlayerId();
        this.photoUrl = platformObj.getHeadURL();
        
        this.eventMessageFire = onfire.on("onmessage",this.onMessage.bind(this));

        if(!Global.GB_IsUseClientData){
            this.schedule(this.checkLoadMessageFinish, 0.02);
        }
        else{
            this.node.emit('startLogin');
        }
    }

    checkLoadMessageFinish(){
        if(!this.messageList) return;

        let isLoadFinish = false;
        let msgOKCount = 0;
        for(let key in this.messageList){
            if(this.messageList[key] !== undefined){
                msgOKCount++;
            }
        }
      
        if(msgOKCount === Object.keys(MSG_MAP).length){
            isLoadFinish = true;
        }

        if(isLoadFinish && this.isConnect()){
            this.node.emit('connectSuc');
            this.unschedule(this.checkLoadMessageFinish);
            if(this.heartCheck){
                this.heartCheck.start();
            }
            this.sendMsg(MSG_MAP.Login,{name:this.username, uid:this.userId, photoUrl:this.photoUrl});
            Global.INFO_MSG('Login Request.Time is ' + new Date());
        }
    }

    connectSuc(){
        this._isConnect = true;
    }

    sendMsg(msgType , msgObj : any, includeUserId:boolean = true)
    {
        if(includeUserId){
            msgObj.uid = this.userId;
        }
        
        var messageObject = this.messageList[msgType].object;
      
		for(let key in msgObj){
            if(messageObject[key] === undefined){
                Global.ERROR_MSG('message data setup is error! id =' + msgType + ',key = ' + key);
                continue;
            }
            messageObject[key] = msgObj[key];
        }

        let buffer = messageObject.toArrayBuffer();
        let data = new Uint8Array(buffer);
		
		//leaf 前两位为协议序号，故需包装一下
		let addtag_buffer = this.netControl.protoBufAddtag(msgType, data);

		this.netControl.send(addtag_buffer.buffer);
    }

    disConnect()
    {
        if(this.heartCheck){
            this.heartCheck.reset();
        }

        this._isConnect = false;
        if(this.netControl){
            this.netControl.disconnect();
        }
    }

    onMessage(obj){
        if(obj.data instanceof ArrayBuffer){
            //leaf 前两位为协议序号，需要解一下啊协议序号
            let retdata = this.netControl.parseProtoBufId(obj)  
            let id = retdata.id
            let data = retdata.data
            this.OnGameMessage(id,data)
        }
    }

    OnGameMessage(id,data){
        let msgName = this.messageList[id].name;
        let gameMsg = this.pb[msgName].decode(data);
		onfire.fire(msgName,gameMsg);
    }

    bindMessage(msgType,calback){
        if(Global.GB_IsUseClientData){
            return;
        }
        return onfire.on(this.messageList[msgType].name,calback);
    }

    unbindMessage(msgObject){
        onfire.un(msgObject);
    }

    onDestroy(){
        onfire.un(this.eventMessageFire);
        onfire.un(this.eventConnectSuc);
    }

    isConnect():boolean{
        return this._isConnect;
    }
};

//心跳检测
class HeartCheck {
    private timeout:number = 7000;
    private timeoutObj:any;

    constructor() {
    }
    
    reset(){
        clearTimeout(this.timeoutObj);
    }

    start(){
        this.reset();
        this.timeoutObj = setInterval(function(){
            NetworkMgr.instance.sendMsg(MSG_MAP.ClientPing,{},false);
        }, this.timeout);
    }
}