const {ccclass, property} = cc._decorator;

@ccclass
export default class LimiteCtrl extends cc.Component {

    @property(cc.RigidBody)
    rigidBody:cc.RigidBody = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
