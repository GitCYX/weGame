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

    @property([cc.Node])
    stars: cc.Node[] = [];

    private currentShowStarNum: number = 3;

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
        let oneStarTime = currentLevelConfig.oneStarTime;
        this.countTime.string = Global.TimeFormt(oneStarTime);
        this.elevatorCtrl.setElevatorProperty(currentLevelConfig.platformDeltaMove, currentLevelConfig.platformMostMove);
        this.createExitHole(currentLevelConfig.exitsInfo);
        this.createHole(currentLevelConfig.holesInfo);
        this.createPlayerBall(currentLevelConfig.ballsInfo);
    }

    createExitHole (exitsInfo: any)
    {
        if (exitsInfo)
        {
            for (let i = 0; i < exitsInfo.length; i++)
            {
                let exithole = this.instantObj(this.exitHolePref, this.node, new cc.Vec2(exitsInfo[i].pos.x, exitsInfo[i].pos.y));
                let exitholeComp = exithole.getComponent(holeCtrl);
                exitholeComp.initHole(exitsInfo[i].width);
            }
        }
    }

    createHole (holesInfo: any)
    {
        if (holesInfo)
        {
            for (let i = 0; i < holesInfo.length; i++)
            {
                let hole = this.instantObj(this.holePref, this.node, new cc.Vec2(holesInfo[i].pos.x, holesInfo[i].pos.y));
                let holeComp = hole.getComponent(holeCtrl);
                holeComp.initHole(holesInfo[i].width);
            }
        }
    }

    createPlayerBall (ballsInfo: any)
    {
        if (ballsInfo)
        {
            for (let i = 0; i < ballsInfo.length; i++)
            {
                let ball = this.instantObj(this.ballPref, this.node, new cc.Vec2(ballsInfo[i].pos.x, ballsInfo[i].pos.y));
                let ballComp = ball.getComponent(ballCtrl);
                ballComp.initBall(ballsInfo[i].width, ballsInfo[i].friction, this);

                let physicsComp = ball.getComponent(cc.PhysicsCircleCollider);
                physicsComp.friction = ballsInfo[i].friction;
                physicsComp.apply();
            }
        }
    }

    instantObj (prefab:cc.Prefab, parent:cc.Node, initPos:cc.Vec2): cc.Node
    {
        let obj = cc.instantiate(prefab);
        obj.parent = parent;
        obj.position = initPos;
        return obj;
    }

    setGameOver(isSuccess)
    {
        ResMgr.instance.getResObjByName("GameClearWindow").then((obj:cc.Node)=>{
            obj.getComponent(ClearWindowCtrl).initClearPanel(isSuccess);
        })
    }

    updateGameTime(time: number)
    {
        this.countTime.string = Global.TimeFormt(time);
    }

    showStar(count: number)
    {
        if (this.currentShowStarNum === count)
        {
            return;
        }

        this.currentShowStarNum = count;
        for (let i = 0; i < 3; i++)
        {
            if (i < count)
            {
                this.stars[i].color = new cc.Color(255, 255, 255);
            }
            else
            {
                this.stars[i].color = new cc.Color(126, 66, 66);
            }
        }
    }

    onKeyDown(event)
    {
        if (this.gameLogic.IsGameOver())
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
        if (this.gameLogic.IsGameOver() || !this.elevatorCtrl.canClockRotate() || this.elevatorCtrl.getLeftUpLimited())
        {
           return;
        }

        this.leftScrewCtrl.playRiseAnim();
        this.elevatorCtrl.leftMove_up();
    }

    leftDownBtnClick()
    {
        if (this.gameLogic.IsGameOver() || !this.elevatorCtrl.canAnticlockRotate() || this.elevatorCtrl.getLeftDownLimited())
        {
           return;
        }

        this.leftScrewCtrl.playDescendAnim();
        this.elevatorCtrl.leftMove_down();
    }

    rightUpBtnClick()
    {
        if (this.gameLogic.IsGameOver() || !this.elevatorCtrl.canAnticlockRotate() || this.elevatorCtrl.getRightUpLimited())
        {
           return;
        }

        this.rightScrewCtrl.playRiseAnim();
        this.elevatorCtrl.rightMove_up();
    }

    rightDownBtnClick()
    {
        if (this.gameLogic.IsGameOver() || !this.elevatorCtrl.canClockRotate() || this.elevatorCtrl.getRightDownLimited())
        {
           return;
        }

        this.rightScrewCtrl.playDescendAnim();
        this.elevatorCtrl.rightMove_down();
    }

}
