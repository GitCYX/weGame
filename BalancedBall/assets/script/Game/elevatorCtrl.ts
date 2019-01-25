const {ccclass, property} = cc._decorator;
@ccclass
export default class elevatorCtrl extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    leftLift: cc.Node = null;

    @property(cc.Node)
    rightLift: cc.Node = null;

 
    highestY:number = 1570;
    lowestY:number = -67;

    perLiftDis:number = 10;
    totalCanClick:number = 10;
    currClickTimes:number = 0;
    moveTime:number = 0.2;

    isLeftUpFinish:boolean = true;
    isRightUpFinish:boolean = true;
    isRightDownFinish:boolean = true;
    isLeftDownFinish:boolean = true;

    isLeftUpLimited:boolean = false;
    isLeftDownLimited:boolean = false;
    isRightUpLimited:boolean = false;
    isRightDownLimited:boolean = false;
    // onLoad () {}

    start () {
       //this.calculateAngel();
    }

    getMoveTime()
    {
       return this.moveTime;
    }

    getRiseDistance()
    {
       return this.perLiftDis;
    }

    getLeftUpLimited()
    {
        return this.isLeftUpLimited;
    }

    getLeftDownLimited()
    {
        return this.isLeftDownLimited;
    }

    getRightUpLimited()
    {
        return this.isRightUpLimited;
    }

    getRightDownLimited()
    {
        return this.isRightDownLimited;
    }

    initElevator(totalCanClick,perLiftDis,moveTime = 0.2)
    {
        this.totalCanClick = totalCanClick;
        this.perLiftDis = perLiftDis;
        this.moveTime = moveTime;
    }

    canAnticlockRotate()//能否继续逆时针运动
    {
        if(this.currClickTimes-1 < -this.totalCanClick)
        {
           return false;
        }
        else
        {
           return true;
        }
    }

    canClockRotate()//能否继续顺时针运动
    {
        if(this.currClickTimes+1 > this.totalCanClick)
        {
           return false;
        }
        else
        {
           return true;
        }
    }

    dealClickTimes(isAnticlock)//逆时针为减，顺时针为加
    {
        if(isAnticlock)
        {
            this.currClickTimes --;
        }
        else
        {
            this.currClickTimes ++;
        }
    }

    rightMove_up()//右上
    {
        if(!this.isRightUpFinish)
        {
           return;
        }
        this.isRightUpFinish = false;
        this.moveRightLift(true);
        this.dealClickTimes(true);
        this.scheduleOnce(()=>{
           this.isRightUpFinish = true;
        },this.moveTime+0.01);
    }

    leftMove_up()//左上
    {
        if(!this.isLeftUpFinish)
        {
           return;
        }
        this.isLeftUpFinish = false;
        this.moveLeftLift(true);
        this.dealClickTimes(false);
        this.scheduleOnce(()=>{
            this.isLeftUpFinish = true;
         },this.moveTime+0.01);
    }

    rightMove_down()//右下
    {
        if(!this.isRightDownFinish)
        {
           return;
        }
        this.isRightDownFinish = false;
        this.moveRightLift(false);
        this.dealClickTimes(false);
        this.scheduleOnce(()=>{
            this.isRightDownFinish = true;
         },this.moveTime+0.01);
    }

    leftMove_down()//左下
    {
        if(!this.isLeftDownFinish)
        {
           return;
        }
        this.isLeftDownFinish = false;
        this.moveLeftLift(false);
        this.dealClickTimes(true);
        this.scheduleOnce(()=>{
           this.isLeftDownFinish = true;
        },this.moveTime+0.01);
    }

    moveLeftLift(isUp)
    {
        let pos = this.leftLift.position;
        if(isUp)
        {
            pos.y += this.perLiftDis;
            if(pos.y > this.highestY)
            {
                pos.y = this.highestY;
                this.isLeftUpLimited = true;
            }
            this.isLeftDownLimited = false;
        }
        else
        {
            pos.y -= this.perLiftDis;
            if(pos.y < this.lowestY)
            {
                pos.y = this.lowestY;
                this.isLeftDownLimited = true;
            }
            this.isLeftUpLimited = false;
        }
        let action = cc.moveTo(this.moveTime,pos);
        this.leftLift.runAction(action);
    }

    moveRightLift(isUp)
    {
        let pos = this.rightLift.position;
        if(isUp)
        {
            pos.y += this.perLiftDis;
            if(pos.y > this.highestY)
            {
                pos.y = this.highestY;
                this.isRightUpLimited = true;
            }
            this.isRightDownLimited = false;
        }
        else
        {
            pos.y -= this.perLiftDis; 
            if(pos.y < this.lowestY)
            {
                pos.y = this.lowestY;
                this.isRightDownLimited = true;
            }
            this.isRightUpLimited = false;
        }
        let action = cc.moveTo(this.moveTime,pos);
        this.rightLift.runAction(action);
    }

    
    // update (dt) {}
}
