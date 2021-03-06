const {ccclass, property} = cc._decorator;
import  { levelConfig } from "../Config/Config";
import LevelItemCtrl from "./LevelItemCtrl";

@ccclass
export default class LeveChooseWindowCtrl extends cc.Component {

    @property(cc.Prefab)
    levelItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    bgButton: cc.Node = null;

    start () {
        this.init();
        this.bgButton.on("click", this.OnBgButtonClicked, this);
    }

    init ()
    {
        for (let i = 0; i < levelConfig.length; i++)
        {
            let levelItemNode = cc.instantiate(this.levelItemPrefab);
            this.content.addChild(levelItemNode);
            let levelItemCtrl = levelItemNode.getComponent(LevelItemCtrl);
            levelItemCtrl.initItem(i);
        }
    }

    OnBgButtonClicked()
    {
        this.node.destroy();
    }

    // update (dt) {}
}
