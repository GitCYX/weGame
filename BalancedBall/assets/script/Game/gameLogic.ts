const {ccclass, property} = cc._decorator;
import gameUICtrl from './GameUICtrl';
@ccclass
export default class GameLogic extends cc.Component {

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
