import ChangeScene from "../ChangeScene";
import LanguageMgr from "../Module/i18n/LanguageMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClearWindowCtrl extends cc.Component {

    @property(cc.Label)
    clearLabel: cc.Label = null;

    @property(cc.Node)
    confirmBtn: cc.Node = null;

    start () {
        this.confirmBtn.on("click", this.onConfirmBtnClicked, this);
    }

    initClearPanel (isWin:boolean)
    {
        if (isWin)
        {
            this.clearLabel.string =  LanguageMgr.instance.getLabel('winGame');
        }
        else
        {
            this.clearLabel.string =  LanguageMgr.instance.getLabel('loseGame');
        }
    }

    onConfirmBtnClicked ()
    {
        let logicNode = cc.find("Logic");
        logicNode.getComponent(ChangeScene).changeScene("Main");
    }
}
