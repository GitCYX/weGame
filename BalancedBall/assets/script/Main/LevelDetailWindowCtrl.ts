import { UserInfoMgr } from "../UserInfoMgr";
import ChangeScene from "../ChangeScene";
import { Global } from "../Module/Global";
import { LocalStorage } from "../GameData/LocalStorage";
import LanguageMgr from "../Module/i18n/LanguageMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelDetailWindowCtrl extends cc.Component {

    @property(cc.Node)
    playBtn: cc.Node = null;

    @property(cc.Node)
    returnBtn: cc.Node = null;

    @property([cc.Node])
    stars: cc.Node[] = [];

    @property(cc.Node)
    playButtonMask: cc.Node = null;

    @property(cc.Node)
    rewardLayout: cc.Node = null;

    @property(cc.Label)
    levelIndex: cc.Label = null;

    @property(cc.Label)
    tip: cc.Label = null;

    @property(cc.Node)
    playButtonEnergyIcon: cc.Node = null;

    @property(cc.Node)
    playButtonEnergyNum: cc.Node = null;

    level: number = -1;

    start () {
        this.playBtn.on("click", this.onPlayBtnClicked, this);
        this.returnBtn.on("click", this.onReturnBtnClicked, this);
    }

    initWindow (level, gotStar)
    {
        let passLevelTimesArr = LocalStorage.getInst().GetPassedLevelInfo();
        if (level <= passLevelTimesArr.length - 1)
        {
            this.dealLevelLock();
        }
        else
        {
            this.dealLevelUnlock();
        }
        this.levelIndex.string = (level + 1) + "";
        this.level = level;
        this.showStar(gotStar);
    }

    dealLevelUnlock()
    {
        this.tip.string = LanguageMgr.instance.getLabel("unlockLevelTip");
        this.rewardLayout.active = false;
        this.playButtonMask.active = true;
        this.playButtonEnergyIcon.active = false;
        this.playButtonEnergyNum.active = false;
    }

    dealLevelLock()
    {
        this.tip.string = LanguageMgr.instance.getLabel("firstPassLevelTip");
        this.rewardLayout.active = true;
        this.playButtonMask.active = false;
        this.playButtonEnergyIcon.active = true;
        this.playButtonEnergyNum.active = true;
    }

    showStar(count: number)
    {
        for (let i = 0; i < count; i++)
        {
            this.stars[i].color = new cc.Color(255, 255, 255);
        }
    }

    onPlayBtnClicked ()
    {
        UserInfoMgr.instance.setCurrentPlayLevel(this.level);
        this.consumeEnergyToPlayGame();
        let logicNode = cc.find("Logic");
        logicNode.getComponent(ChangeScene).changeScene("Game");
    }

    onReturnBtnClicked ()
    {
        this.node.destroy();
    }

    consumeEnergyToPlayGame()
    {
        let currentEnergy = LocalStorage.getInst().GetPlayerEnergy();
        LocalStorage.getInst().SetPlayerEnergy(currentEnergy - 5);
    }
}
