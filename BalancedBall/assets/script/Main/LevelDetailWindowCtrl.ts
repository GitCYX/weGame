import { UserInfoMgr } from "../UserInfoMgr";
import ChangeScene from "../ChangeScene";
import { Global } from "../Module/Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelDetailWindowCtrl extends cc.Component {

    @property(cc.Node)
    playBtn: cc.Node = null;

    @property(cc.Node)
    returnBtn: cc.Node = null;

    level: number = -1;

    start () {
        this.playBtn.on("click", this.onPlayBtnClicked, this);
        this.returnBtn.on("click", this.onReturnBtnClicked, this);
    }

    initWindow (level)
    {
        this.level = level;
    }

    onPlayBtnClicked ()
    {
        UserInfoMgr.instance.setCurrentPlayLevel(this.level);
        let logicNode = cc.find("Logic");
        logicNode.getComponent(ChangeScene).changeScene("Game");
    }

    onReturnBtnClicked ()
    {
        this.node.destroy();
    }
}
