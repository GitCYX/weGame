const {ccclass, property} = cc._decorator;
import elevatorCtrl from './ElevatorCtrl';
import createScrewAxis from './CreateScrewAxis';
import gameLogic from './GameLogic';
import ballCtrl from './BallCtrl';
import LanguageMgr from '../Module/i18n/LanguageMgr';
import holeCtrl from './HoleCtrl';
import { Global } from '../Module/Global';
import { UserInfoMgr } from '../UserInfoMgr';
import { levelConfig } from '../Config/Config';
import { ResMgr } from '../Resload/ResMgr';
import ClearWindowCtrl from './ClearWindowCtrl';
@ccclass
export default class GameUICtrl extends cc.Component {

    @property(createScrewAxis)
    leftScrewCtrl: createScrewAxis = null;

    @property(createScrewAxis)
    rightScrewCtrl: createScrewAxis = null;

    @property(elevatorCtrl)
    elevatorCtrl: elevatorCtrl = null;

    @property(gameLogic)
    gameLogic: gameLogic = null;

    @property(cc.Prefab)
    ballPref:cc.Prefab = null;

    @property(cc.Prefab)
    holePref:cc.Prefab = null;

    @property(cc.Prefab)
    exitHolePref:cc.Prefab = null;

    @property(cc.Label)
    countTime:cc.Label = null;

    @property(cc.Camera)
    mainCamera: cc.Camera = null;

    @property(cc.Node)
    rightUpBtn: cc.Node = null;

    @property(cc.Node)
    rightDownBtn: cc.Node = null;

    @property(cc.Node)
    leftUpBtn: cc.Node = null;

    @property(cc.Node)
    leftDownBtn: cc.Node = null;

    isGameOver:boolean = false;
    def_BallPos:cc.Vec2 = cc.v2(0,-300);
    _timeNow:number = 0;

    onLoad () 
    {
        let manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        manager.gravity =  cc.v2(0, -300);
        //manager.debugDrawFlags = 1;
        this.leftScrewCtrl.setMainUICtrl(this);
        this.rightScrewCtrl.setMainUICtrl(this);
        this.gameLogic.setMainUICtrl(this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.leftUpBtn.on(cc.Node.EventType.TOUCH_START, ()=>{
            this.leftUpBtnClick();
        });
        this.leftDownBtn.on(cc.Node.EventType.TOUCH_START, ()=>{
            this.leftDownBtnClick();
        });
        this.rightUpBtn.on(cc.Node.EventType.TOUCH_START, ()=>{
            this.rightUpBtnClick();
        });
        this.rightDownBtn.on(cc.Node.EventType.TOUCH_START, ()=>{
            this.rightDownBtnClick();
        });
    }

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }


    start () {
        this.initGame()
    }

    initGame () 
    {
        let level = UserInfoMgr.instance.getCurrentPlayLevel();
        let currentLevelConfig = levelConfig[level];
        this._timeNow = currentLevelConfig.gameTime;
        this.updateTime();
        this.elevatorCtrl.setElevatorProperty(currentLevelConfig.platformDeltaMove, currentLevelConfig.platformMostMove);
        if (currentLevelConfig.exitsInfo)//创建出口
        {
            for (let i = 0; i < currentLevelConfig.exitsInfo.length; i++)
            {
                let exithole = cc.instantiate(this.exitHolePref);
                exithole.parent = this.node;
                exithole.position = new cc.Vec2(currentLevelConfig.exitsInfo[i].pos.x, currentLevelConfig.exitsInfo[i].pos.y);
                let exitholeComp = exithole.getComponent(holeCtrl);
                exitholeComp.initHole(currentLevelConfig.exitsInfo[i].width);
            }
        }
  
        if (currentLevelConfig.holesInfo)//创建洞口
        {
            for (let i = 0; i < currentLevelConfig.holesInfo.length; i++)
            {
                let hole = cc.instantiate(this.holePref);
                hole.parent = this.node;
                hole.position = new cc.Vec2(currentLevelConfig.holesInfo[i].pos.x, currentLevelConfig.holesInfo[i].pos.y);
                let holeComp = hole.getComponent(holeCtrl);
                holeComp.initHole(currentLevelConfig.holesInfo[i].width);
            }
        }

        if (currentLevelConfig.ballsInfo)//创建球
        {
            for (let i = 0; i < currentLevelConfig.ballsInfo.length; i++)
            {
                let ball = cc.instantiate(this.ballPref);
                ball.parent = this.node;
                ball.position = new cc.Vec2(currentLevelConfig.ballsInfo[i].pos.x, currentLevelConfig.ballsInfo[i].pos.y);
                let ballComp = ball.getComponent(ballCtrl);
                ballComp.initBall(currentLevelConfig.ballsInfo[i].width, currentLevelConfig.ballsInfo[i].friction, this);

                let physicsComp = ball.getComponent(cc.PhysicsCircleCollider);
                physicsComp.friction = currentLevelConfig.ballsInfo[i].friction;
                physicsComp.apply();
            }
        }
    }

    setGameOver(result)
    {
        this.isGameOver = true;
        ResMgr.instance.getResObjByName("GameClearWindow").then((obj:cc.Node)=>{
            obj.getComponent(ClearWindowCtrl).initClearPanel(result);
        })
    }

    onKeyDown(event)
    {
        if (this.isGameOver)
        {
           return;
        }

        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.leftUpBtnClick();
                break;
            case cc.macro.KEY.s:
                this.leftDownBtnClick();
                break;
            case cc.macro.KEY.o:
                this.rightUpBtnClick();
                break;
            case cc.macro.KEY.l:
                this.rightDownBtnClick();
                break;
        }
    }

    leftUpBtnClick()
    {
        if (this.isGameOver || !this.elevatorCtrl.canClockRotate() || this.elevatorCtrl.getLeftUpLimited())
        {
           return;
        }

        this.leftScrewCtrl.playRiseAnim();
        this.elevatorCtrl.leftMove_up();
    }

    leftDownBtnClick()
    {
        if (this.isGameOver || !this.elevatorCtrl.canAnticlockRotate() || this.elevatorCtrl.getLeftDownLimited())
        {
           return;
        }

        this.leftScrewCtrl.playDescendAnim();
        this.elevatorCtrl.leftMove_down();
    }

    rightUpBtnClick()
    {
        if (this.isGameOver || !this.elevatorCtrl.canAnticlockRotate() || this.elevatorCtrl.getRightUpLimited())
        {
           return;
        }

        this.rightScrewCtrl.playRiseAnim();
        this.elevatorCtrl.rightMove_up();
    }

    rightDownBtnClick()
    {
        if (this.isGameOver || !this.elevatorCtrl.canClockRotate() || this.elevatorCtrl.getRightDownLimited())
        {
           return;
        }

        this.rightScrewCtrl.playDescendAnim();
        this.elevatorCtrl.rightMove_down();
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

        if (this._timeNow <= 0)
        {
            this.unscheduleAllCallbacks();
            this.setGameOver(false);
            return;
        }
        this._timeNow -= 1;  
        this.countTime.string = Global.TimeFormt(this._timeNow);
    }
}
