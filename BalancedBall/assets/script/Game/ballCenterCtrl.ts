const {ccclass, property} = cc._decorator;
import gameUICrtl from './GameUICtrl';
@ccclass
export default class BallCenterCtrl extends cc.Component {

    @property(cc.RigidBody)
    rigidbody: cc.RigidBody = null;

    gameUICrtl:gameUICrtl = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.rigidbody.enabledContactListener = true;
    }

    start () {

    }

    initBallCenter(ctrl)
    {
        this.gameUICrtl = ctrl;
    }

    onBeginContact(contact,selfCollider,otherCollider)
    {
        if (otherCollider.node.name === 'hole')
        {
            this.gameUICrtl.setGameOver(false);
        }
        if (otherCollider.node.name === 'exitHole')
        {
            this.gameUICrtl.setGameOver(true);
        }
    }
    // update (dt) {}
}
