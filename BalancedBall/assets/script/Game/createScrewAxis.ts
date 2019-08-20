const {ccclass, property} = cc._decorator;
import gainUICtrl from './GameUICtrl';
@ccclass
export default class createScrewAxis extends cc.Component {

    @property(cc.Prefab)
    screwPref: cc.Prefab = null;

    @property()
    isLeftScrewAxis:boolean = false;

    @property()
    screwsNum:number = 30;

    offsetY:number = 40;//每个screw的高度
    animStatus:cc.AnimationState = null;

    isRising:boolean = false;
    isDescending:boolean = false;

    
    moveDis:number = 40;//每次移动距离
    moveTime:number = 0.2;//每次移动时间
    gainUICtrl:gainUICtrl = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.createScrew()
    }

    start () {

    }
 
    setMainUICtrl(ctrl:gainUICtrl)
    {
        this.gainUICtrl = ctrl;
        this.moveTime = ctrl.elevatorCtrl.getMoveTime();
    }

    createScrew()
    {
        for (let i = 0; i < this.screwsNum; i++)
        {
          let screw = cc.instantiate(this.screwPref);
          screw.parent = this.node;
          screw.y = i * this.offsetY;
        }
    }

    playRiseAnim()
    {
        if (this.isRising)
        {
           return;
        }

        this.isRising = true;
        let p = this.node.position;
        p.y += this.moveDis;
        let action = cc.moveTo(this.moveTime, p);
        this.node.runAction(action);
      
        this.scheduleOnce(()=>{
            this.isRising = false;
            this.node.y -= this.moveDis;//将该节点移动回原位
        }, this.moveTime)
    }

    playDescendAnim()
    {
        if (this.isDescending)
        {
           return;
        }

        this.isDescending = true;
        let p = this.node.position;
        p.y -= this.moveDis;
        let action = cc.moveTo(this.moveTime, p);
        this.node.runAction(action);
      
        this.scheduleOnce(()=>{
            this.isDescending = false;
            this.node.y += this.moveDis;//将该节点移动回原位
        } ,this.moveTime)
    }
    // update (dt) {}
}
