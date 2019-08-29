const {ccclass, property} = cc._decorator;
import GameLogic from './GameLogic';

@ccclass
export default class BallCenterCtrl extends cc.Component {

    @property(cc.RigidBody)
    rigidbody: cc.RigidBody = null;

    gameLogic:GameLogic = null;

    onLoad () 
    {
        this.rigidbody.enabledContactListener = true;
    }

    start () {

    }

    initBallCenter(gameLogic)
    {
        this.gameLogic = gameLogic;
    }

    onBeginContact(contact, selfCollider, otherCollider)
    {
        if (otherCollider.node.name === 'hole')
        {
            this.gameLogic.setGameOver(false);
        }
        if (otherCollider.node.name === 'exitHole')
        {
            this.gameLogic.setGameOver(true);
        }
    }
    // update (dt) {}
}
