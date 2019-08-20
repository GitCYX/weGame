declare let FBInstant : any;
const {ccclass, property,executionOrder} = cc._decorator;
import {Global} from '../Global';
import {PlatformBase} from './PlatformBase';
import {PlatformFaceBook} from '../Facebook/PlatformFaceBook';
@ccclass
export class PlatformMgr extends cc.Component {
    @executionOrder(-10)

    @property({
        tooltip:'正常环境下的测试头像',
        type:cc.SpriteFrame,
    })
    testHeadImage: cc.SpriteFrame = null;

    @property({
        tooltip:'正常环境下的测试名字',
    })
    testName = 'hello';

    @property({
        tooltip:'正常环境下的测试ID',
    })
    testId = '001';

    static instance: PlatformMgr = null;

    private curPlatformObj: PlatformBase = null;
    private onPCTest: boolean = false;

    start ()
    {
        PlatformMgr.instance = this;
        cc.game.addPersistRootNode(this.node);

        this.curPlatformObj = this.createPlatformObject();
        if (!this.curPlatformObj)
        {
            Global.ERROR_MSG('can not find platform object!');
            return;
        }

        this.curPlatformObj.init();
    }

    private createPlatformObject()
    {
        if (PlatformMgr.isFaceBookPlatform())
        {
            Global.INFO_MSG('current platform context is facebook!');
            return new PlatformFaceBook();
        }

        let baseObj = new PlatformBase();
        baseObj.setHeadSprite(this.testHeadImage);
        baseObj.setPlayerName(this.testName);
        baseObj.setPlayerId(this.testId);
        baseObj.setHeadURL('test');
        this.onPCTest = true;
        return baseObj;
    }

    static isFaceBookPlatform(): boolean
    {
        if (typeof FBInstant === 'undefined') 
            return false;

        return true;
    }

    static isNativePlatform(): boolean
    {
        return cc.sys.isNative;
    }

    static isWeChatPlatform(): boolean
    {
        return (cc.sys.platform === cc.sys.WECHAT_GAME);
    }

    getPlatform(): PlatformBase
    {
        return this.curPlatformObj;
    }

    isOnPCTest(): boolean
    {
        return this.onPCTest;
    }
}