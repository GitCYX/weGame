import { ResMgr } from "../Resload/ResMgr";
import LevelDetailWindowCtrl from "./LevelDetailWindowCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelItemCtrl extends cc.Component {

    @property(cc.Node)
    levelBtn: cc.Node = null;

    @property
    text: string = 'hello';

    level: number = -1;

    start () {
        this.levelBtn.on("click", this.onLevelBtnClicked, this);
    }

    initItem (level)
    {
        this.level = level;
    }

    onLevelBtnClicked ()
    {
        let self = this;
        ResMgr.instance.getResObjByName("LevelDetailWindow").then((detailWind:cc.Node)=>{
            let levelDetailWindowCtrl = detailWind.getComponent(LevelDetailWindowCtrl);
            levelDetailWindowCtrl.initWindow(self.level);
        });
    }
}
