const {ccclass, property, executionOrder} = cc._decorator;
import {Global} from '../Global';
@ccclass
class LoadConfig extends cc.Component{
    @executionOrder(-15)
    
    static instance : LoadConfig = null;
    
    onLoad (){
        cc.game.addPersistRootNode(this.node);
        LoadConfig.instance = this;

        var path = 'font/Cuprum-Bold';
        cc.loader.loadRes(path,function(err,prefab)
        {
             if(err)
             {
                Global.ERROR_MSG('font load fail');
             }
             else
             {
                Global.GB_GameFont = prefab;
             }
        });
    }

    start () {
    }
};