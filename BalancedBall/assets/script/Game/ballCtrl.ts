const {ccclass, property} = cc._decorator;
import gameUICtrl from './GameUICtrl';
import ballCenterCtrl from './BallCenterCtrl';
@ccclass
export default class BallCtrl extends cc.Component {

    @property(ballCenterCtrl)
    ballCenterCtrl: ballCenterCtrl = null;

    @property(cc.PhysicsCircleCollider)
    physicsCtrl: cc.PhysicsCircleCollider = null;

    start () {

    }


    initBall(width, friction, gameUICtrl:gameUICtrl)
    {
       this.node.width = width;
       this.node.height = width;
       this.physicsCtrl.radius = width/2;
       this.physicsCtrl.friction = friction;
       this.physicsCtrl.apply();
       this.ballCenterCtrl.initBallCenter(gameUICtrl);
    }
}
