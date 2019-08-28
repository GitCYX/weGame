import { ResMgr } from "../Resload/ResMgr";
import { LocalStorage } from "../GameData/LocalStorage";
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUICtrl extends cc.Component {

    @property(cc.Node)
    levelChooseBtn: cc.Node = null;

    @property(cc.Node)
    cover: cc.Node = null;

    @property(cc.Label)
    energyLabel: cc.Label = null;

    @property(cc.Label)
    coinLabel: cc.Label = null;


    onLoad () {
        this.levelChooseBtn.on("click", this.onLevelChooseBtnClicked, this);
    }

    start () {
        this.initUI();
    }

    initUI ()
    {
        let localStorageInst = LocalStorage.getInst();
        this.energyLabel.string = localStorageInst.GetPlayerEnergy() + "";
        this.coinLabel.string = localStorageInst.GetPlayerCoin() + "";
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
