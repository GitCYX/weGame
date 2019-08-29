const {ccclass, property} = cc._decorator;
import gameUICtrl from './GameUICtrl';
import { ResMgr } from '../Resload/ResMgr';
import { Global } from '../Module/Global';
import { levelConfig } from '../Config/Config';
import { UserInfoMgr } from '../UserInfoMgr';
import { LocalStorage } from '../GameData/LocalStorage';
@ccclass
export default class GameLogic extends cc.Component {

    gameUICtrl: gameUICtrl = null;
    private isGameOver: boolean = false;
    private playingTime: number = 0;
    private oneStarTime: number = 0;
    private twoStarTime: number = 0;
    private threeStarTime: number = 0;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}

    start () {
        let level = UserInfoMgr.instance.getCurrentPlayLevel();
        let currentLevelConfig = levelConfig[level];
        this.playingTime = currentLevelConfig.oneStarTime;
        this.oneStarTime = currentLevelConfig.oneStarTime;
        this.twoStarTime = currentLevelConfig.twoStarTime;
        this.threeStarTime = currentLevelConfig.threeStarTime;
        this.updateTime();
    }

    setMainUICtrl(ctrl:gameUICtrl)
    {
        this.gameUICtrl = ctrl;
    }

    
    /**
     * 倒计时
     */
    updateTime()
    {
        this.schedule(function(){
            this.dealTime();
        }, 1);
    }

    dealTime()
    {
        if (this.isGameOver)
        {
            this.unscheduleAllCallbacks();
            return;
        }

        if (this.playingTime <= 0)
        {
            this.unscheduleAllCallbacks();
            this.setGameOver(false);
            return;
        }
        this.playingTime -= 1;
        this.gainStarByTime();
        this.gameUICtrl.updateGameTime(this.playingTime);
    }

    gainStarByTime()
    {
        let passTime = this.oneStarTime - this.playingTime;
        if (passTime < this.threeStarTime)
        {
            this.gameUICtrl.showStar(3);
        }
        else if (passTime < this.twoStarTime)
        {
            this.gameUICtrl.showStar(2);
        }
        else
        {
            this.gameUICtrl.showStar(1);
        }
    }

    setGameOver(isSuccess)
    {
        this.isGameOver = true;
        this.gameUICtrl.setGameOver(isSuccess);
    }

    dealGameOver()
    {
        let level = UserInfoMgr.instance.getCurrentPlayLevel();
        if (this.IsLatestLevel())
        {
            //最新一关处理 是否解锁下一关，是否三星过关
        }
        else
        {
            //是否第一次三星过关
        }
        //更新记录
    }

    IsLatestLevel()
    {
        let level = UserInfoMgr.instance.getCurrentPlayLevel();
        return level === LocalStorage.getInst().GetPassedLevelInfo().length - 1;
    }

    IsGameOver()
    {
        return this.isGameOver;
    }
    // update (dt) {}
}
