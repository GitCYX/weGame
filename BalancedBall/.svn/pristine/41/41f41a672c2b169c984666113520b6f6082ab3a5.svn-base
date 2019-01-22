const {ccclass, property} = cc._decorator;
import * as MD_MusicMgr from './MusicMgr';
import {Global} from '../Global';
@ccclass
export class MusicController extends cc.Component{
    @property({
        type: cc.AudioClip,
    })
    clipList = [];
   
    @property
    isBgMusic = false;

    @property({
        tooltip:'音量大小(0-1)',
    })
    volume = 1;

    @property({
        tooltip:'是否循环播放',
    })
    loop = false;
    
    @property({
        tooltip:'是否在运行游戏后自动播放',
    })
    playOnLoad = false;

    @property({
        tooltip:'是否收到点击事件后自动播放',
    })
    playOnClick = false;

    private audioID : number;

    start () {
        if(this.playOnLoad){
            this.play();
        }
        
        if(this.playOnClick)
        {
           this.ListenToClick();
        }
    }
    
    ListenToClick(){
        var self = this;
        this.node.on('click',function(){
            self.stop();
            self.play();
        });

        this.node.on('toggle',function(){
            self.stop();
            self.play();
        });
    }

    onDestroy() {
        MD_MusicMgr.MusicMgr.instance.removeSoundEffectCtrl(this);
        this.stop();
    }

    play(){
        if(MD_MusicMgr.MusicMgr.instance.getCanPlay(this.isBgMusic)){

            var curClip = this.randomGetClip();
            if(!curClip){
                Global.ERROR_MSG('music clip list is null!');
                return;
            }

            if(this.isBgMusic){
                this.audioID = cc.audioEngine.playMusic(curClip, this.loop);
                cc.audioEngine.setMusicVolume(this.volume);
            }
            else{
                this.audioID = cc.audioEngine.play(curClip, this.loop, this.volume);
            }

        }

        if(this.isBgMusic){
            MD_MusicMgr.MusicMgr.instance.setBGMusicController(this);
        }
        else
        {
            MD_MusicMgr.MusicMgr.instance.addSoundEffectCtrl(this);
        }
    }

    stop(){
        if(this.isBgMusic){
            cc.audioEngine.stopMusic();
        }
        else{
            if(this.audioID !== undefined){
                cc.audioEngine.stop(this.audioID);
            }
        }
    }

    randomGetClip(){
        if(this.clipList.length <= 1){
            return this.clipList[0];
        }

        var index = Global.GetRandomInt(0,this.clipList.length);
        return this.clipList[index];
    }
};