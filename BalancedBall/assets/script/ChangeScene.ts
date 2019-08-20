const {ccclass, property} = cc._decorator;
import {Global} from './Module/Global';
@ccclass
export default class ChangeScene extends cc.Component {

    @property(
        {
            tooltip:'预加载场景列表',
            type:cc.String,
        }
    )
    preloadSceneList = [];

    @property
    preLoadOnLoad: boolean = true;
    onLoad () {
        
        this.node.on(Global.GlobalEventMap.ChangeScene, this._changeScene.bind(this), this.node);

        if (this.preloadSceneList.length <= 0)
        {
            Global.WARNING_MSG('preload scene list is null! please setup the preload scene.');
        }

        if (this.preLoadOnLoad)
        {
            this.preLoad();
        }
    }

    private _changeScene(event) 
    { 
        if (!event.sceneName)
        {
            Global.ERROR_MSG('change scene failed! scene name is null!');
            return;
        }

        cc.director.loadScene(event.sceneName);
    }

    preLoad()
    {
        for (let i = 0; i < this.preloadSceneList.length; i++){
            cc.director.preloadScene(this.preloadSceneList[i], function () {});
        }
    }

    // update (dt) {}
}
