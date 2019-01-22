const {ccclass, property} = cc._decorator;
import gameUICtrl from './gameUICtrl';
@ccclass
export default class gameLogic extends cc.Component {

    gameUICtrl:gameUICtrl = null;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}

    start () {

    }

    setMainUICtrl(ctrl:gameUICtrl)
    {
        this.gameUICtrl = ctrl;
    }
    // update (dt) {}
}
