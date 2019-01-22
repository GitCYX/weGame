const {ccclass, property} = cc._decorator;

@ccclass
export default class limiteCtrl extends cc.Component {

    @property(cc.RigidBody)
    rigidBody:cc.RigidBody = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
