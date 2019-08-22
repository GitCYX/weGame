import { ResMgr } from "../Resload/ResMgr";
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUICtrl extends cc.Component {

    @property(cc.Node)
    levelChooseBtn: cc.Node = null;

    @property(cc.Node)
    cover: cc.Node = null;


    onLoad () {
        this.levelChooseBtn.on("click", this.onLevelChooseBtnClicked, this);
    }

    start () {

    }

    onLevelChooseBtnClicked()
    {
        this.showCover();
        ResMgr.instance.getResObjByName("LevelChooseWindow").then((node:cc.Node)=>{
            this.hideCover();
        });
    }

    showCover()
    {
        this.cover.active = true;
    }

    hideCover()
    {
        this.cover.active = false;
    }
    // update (dt) {}
}
