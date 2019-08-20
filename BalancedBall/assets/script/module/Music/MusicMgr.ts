const {ccclass, property} = cc._decorator;
@ccclass
export class MusicMgr extends cc.Component{
    static instance = null;

    private soundEffectCtrl: any[];
    private enableEffects: boolean;
    private enableBGMusic: boolean;
    private curBGMusicController: any;

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        this.soundEffectCtrl = [];
        MusicMgr.instance = this;
    }

    start () {
    }

    getCanPlay(isBgMusic)
    {
        if (!this.enableEffects && !isBgMusic){
            return false;
        }

        if (!this.enableBGMusic && isBgMusic)
        {
            return false;
        }

        return true;
    }

    addSoundEffectCtrl(controller)
    {
        this.soundEffectCtrl.push(controller);
    }

    removeSoundEffectCtrl(controller)
    {
        for (var i = 0; i < this.soundEffectCtrl.length; i++)
        {
            if (this.soundEffectCtrl[i] === controller)
            {
               this.soundEffectCtrl.splice(i,1);
               return;
            }
        }
    }

    setBGMusicController(controller)
    {
        this.curBGMusicController = controller;
    }

    getBGMusicController()
    {
        return this.curBGMusicController;
    }

    bgMusicControllerIsValid()
    {
        if (this.getBGMusicController() && this.getBGMusicController().node && this.getBGMusicController().node.isValid)
        {
            return true;
        }

        return false;
    }

    enableMusic(enable)
    {
        this.enableBGMusic = enable;
        if (this.bgMusicControllerIsValid())
        {
            var musicController = this.getBGMusicController();
            if (enable)
            {
                musicController.play();
            }
            else
            {
                musicController.stop();
            }
        }
    }

    enableEffect(enable)
    {
        this.enableEffects = enable;
        if (enable)
        {

        }
        else
        {
            for (var i = 0; i < this.soundEffectCtrl.length; i++)
            {
                this.soundEffectCtrl[i].stop();
            }
        }
    }
};