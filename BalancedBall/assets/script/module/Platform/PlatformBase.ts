const {ccclass, property} = cc._decorator;
import {Global} from '../Global';

export interface PlayerProperty{
    (playersList:[{id:string, name:string, photoUrl:string}]) : any;
}

export interface PurchaseFunc{
    (param:{developerPayload?:string, paymentID?:string, productID?:string, purchaseTime?:string, purchaseToken?:string, signedRequest?:string}) : any;
}

@ccclass
export class PlatformBase{
    protected playerName: string;
    protected playerID: string;
    protected headURL: string;
    protected headSprite: cc.SpriteFrame;

    protected contextID: string; // 游戏环境 ID
    protected contextType: any;  // 游戏类型
    protected locale: any;  // 地区/语言
    protected platform: any;// 运行环境:IOS,Android
    protected sdkVersion: any; // SDK 版本号

    init()
    {

    }

    onPause()
    {
        Global.INFO_MSG('Pause event was triggered!');
    }

    setHeadSprite(head:cc.SpriteFrame)
    {
        this.headSprite = head;
    }

    getHeadSprite(): cc.SpriteFrame 
    {
        return this.headSprite;
    }

    setPlayerId(id:string)
    {
        this.playerID = id;
    }

    getPlayerId(): string
    {
        return this.playerID;
    }

    setPlayerName(name:string)
    {
        this.playerName = name;
    }

    getPlayerName(): string
    {
        return this.playerName;
    }

    setHeadURL(url:string)
    {
        this.headURL = url;
    }

    getHeadURL(): string
    {
        return this.headURL;
    }

    resURLIsValid(url:string): boolean
    {
        if (url === 'test' || url === '' || url === undefined){
            return false;
        }

        return true;
    }

    getLocale()
    {
        return this.locale; // 'en_US'
    }

    //获取好友列表
    getConnectedFriendsAsync(callback:PlayerProperty)
    {

    }

    //获取3个月以来玩过此款游戏的玩家(不包括自己)
    getPlayersAsync(callback:PlayerProperty)
    {

    }

    quitGame()
    {
        cc.director.loadScene('Start');
    }

    //激励广告预加载
    preLoadRewardedVideo(placementId:string, callback:Function)
    {

    }

    //激励广告播放
    showRewardedVideo(rewarded, callback:Function)
    {

    }

    //当前平台是否支持支付
    canSupportPaymentsPurchase(): boolean
    {
        return false;
    }

    purchaseAsync(productID, callback:PurchaseFunc)
    {

    }

    consumePurchaseAsync(purchaseToken:string, callback)
    {

    }

    //邀请好友玩游戏
    inviteFriends(text:string, imageBase64:string, callback:Function, entryPointData = null)
    {

    }

    //分享游戏
    shareGame(text:string, imageBase64:string, callback:Function)
    {

    }

    getEntryPointData(): any
    {

    }
}
