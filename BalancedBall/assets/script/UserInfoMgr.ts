import * as onfire from './Module/Network/protocol/libs/onfire/onfire';
import {PlatformMgr} from './Module/Platform/PlatformMgr';
import * as MD_NetworkMgr from './Module/Network/NetworkMgr';
import LanguageMgr from './Module/i18n/LanguageMgr';
import {Global} from './Module/Global';
import ScreenShotController = require('./Module/ScreenShot/ScreenShotController');
const {ccclass, property} = cc._decorator;
export const SceneFlag = cc.Enum({
    None:-1,
    main:1,
    game:2,
    rank:3,
    asseble:4,
    createWorld:5,
    challengeScene:6
});

@ccclass
export class UserInfoMgr extends cc.Component {
    static instance: UserInfoMgr = null;
    private preloadedRewardedVideo: any;
    private connectDisconnected: any;
    private preloadADSErrorCode: string;
    private userMatchResultEvent: any;
    private isServerClose: boolean = false;

    onLoad () 
    {
        cc.game.addPersistRootNode(this.node);
        // UserInfoMgr.instance = this;
        // this.node.on('startLogin', this._startLogin, this);
        // this.node.on('connectSuc', this.installEvents, this);
        // this.connectDisconnected = onfire.on("onclose",this.serverOnClose.bind(this));
        this.scheduleOnce(()=>{
            this.node.emit(Global.GlobalEventMap.ChangeScene, {sceneName:'Main'});
        }, 0);
    }

    start ()
    {
       // this.preLoadADVideo();
    }

    preLoadADVideo()
    {
        if (!PlatformMgr.instance.isOnPCTest())
        {
            Global.INFO_MSG('preloaded RewardedVideo!');
        
            this.preloadedRewardedVideo = undefined;
            PlatformMgr.instance.getPlatform().preLoadRewardedVideo(Global.GB_FBPlacementId, (rewarded, errorCode)=>{
                this.preloadedRewardedVideo = rewarded;
                this.preloadADSErrorCode = errorCode;
            });
        }
    }

    _startLogin()
    {
        
    }

    onDestroy()
    {
        onfire.un(this.connectDisconnected);

    }
    
    serverOnClose(result)
    {
        Global.INFO_MSG('server on close code : ' + result.code);
        this.beKickedOutResult({code:0});
    }
    
    isUnconnect()
    {
        return this.isServerClose;
    }

    beKickedOutResult(result){
        let networkMgr = MD_NetworkMgr.NetworkMgr.instance;
        networkMgr.disConnect();
        if (result.code === 1)
        {
            Global.OpenPromptBox(Global.PromptBoxMode.ONLY_OK, 'You have already logged in.', ()=>{
                this.quitGame();
            });
        }
        else if(result.code === 2)
        {
            Global.OpenPromptBox(Global.PromptBoxMode.ONLY_OK, 'Server Maintening.', ()=>{
                this.quitGame();
            });
        }
        else
        {
            this.isServerClose = true;
            Global.OpenPromptBox(Global.PromptBoxMode.ONLY_OK, 'Connecting failed, hold on please.', ()=>{
                this.quitGame();
            });
        }
    }

    installEvents() 
    {
        let networkMgr = MD_NetworkMgr.NetworkMgr.instance;
    }


    quitGame()
    {
        PlatformMgr.instance.getPlatform().quitGame();
    }
};