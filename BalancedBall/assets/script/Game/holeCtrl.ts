const {ccclass, property} = cc._decorator;

@ccclass
export default class HoleCtrl extends cc.Component {

    @property(cc.RigidBody)
    rigidbody: cc.RigidBody = null;

    @property(cc.PhysicsCircleCollider)
    physicsCtrl: cc.PhysicsCircleCollider = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        this.rigidbody.enabledContactListener = true;
    }

    start () {

    }

    initHole(width)
    {
        this.node.width = width;
        this.node.height = width;
        this.physicsCtrl.radius = width/2;
        this.physicsCtrl.apply();
    }
    // update (dt) {}
}
