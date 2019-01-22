const {ccclass, property} = cc._decorator;
import gameUICtrl from './gameUICtrl';
import ballCenterCtrl from './ballCenterCtrl';
@ccclass
export default class ballCtrl extends cc.Component {

    @property(ballCenterCtrl)
    ballCenterCtrl: ballCenterCtrl = null;

    @property(cc.PhysicsCircleCollider)
    physicsCtrl: cc.PhysicsCircleCollider = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    initBall(width,gameUICtrl:gameUICtrl)
    {
       this.node.width = width;
       this.node.height = width;
       this.physicsCtrl.radius = width/2;
       this.physicsCtrl.apply();
       this.ballCenterCtrl.initBallCenter(gameUICtrl);
    }
    // update (dt) {}
}
