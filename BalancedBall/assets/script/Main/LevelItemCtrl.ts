import { ResMgr } from "../Resload/ResMgr";
import LevelDetailWindowCtrl from "./LevelDetailWindowCtrl";
import { levelConfig } from "../Config/Config";
import { LocalStorage } from "../GameData/LocalStorage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelItemCtrl extends cc.Component {

    @property(cc.Node)
    levelBtn: cc.Node = null;

    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property([cc.Node])
    starArr: cc.Node [] = [];

    @property(cc.Node)
    lock: cc.Node = null;

    level: number = -1;
    Gotstar: number = 0;

    start () {
        this.levelBtn.on("click", this.onLevelBtnClicked, this);
    }

    initItem (level: number)
    {
        this.level = level;
        this.levelLabel.string = (level + 1) + "";
        let passLevelTimesArr = LocalStorage.getInst().GetPassedLevelInfo();
        if (level <= passLevelTimesArr.length - 1)
        {
            if (passLevelTimesArr[level] === -1)
            {
                this.lock.active = false;
                return;
            }

            if(passLevelTimesArr[level] < levelConfig[level].threeStarTime)
            {
                this.showStar(3);
            }
            else if (passLevelTimesArr[level] < levelConfig[level].twoStarTime)
            {
                this.showStar(2);
            }
            else
            {
                this.showStar(1)
            }
        }
         
    }

    showStar(count: number)
    {
        this.Gotstar = count;
        for (let i = 0; i < count; i++)
        {
            this.starArr[i].color = new cc.Color(255, 255, 255);
        }
    }

    onLevelBtnClicked ()
    {
        let self = this;
        ResMgr.instance.getResObjByName("LevelDetailWindow").then((detailWind:cc.Node)=>{
            let levelDetailWindowCtrl = detailWind.getComponent(LevelDetailWindowCtrl);
            levelDetailWindowCtrl.initWindow(self.level, this.Gotstar);
        });
    }
}
