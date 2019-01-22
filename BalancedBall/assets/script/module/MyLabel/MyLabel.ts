const {ccclass, property} = cc._decorator;
import {Global} from '../Global';
@ccclass
export class MyLabel extends cc.Label{
    @property
    isUseOverFlow = false;

    private hasSetFont : boolean;
    onLoad () 
    {
        this.hasSetFont = false;
        this.isSystemFontUsed = false;
    }

    start () 
    {
       
        if(!this.isSystemFontUsed)
        {
            if(this.isUseOverFlow)
            {
                this.overflow = 3;
            }
            this.font = Global.GB_GameFont;
        }
    }
};