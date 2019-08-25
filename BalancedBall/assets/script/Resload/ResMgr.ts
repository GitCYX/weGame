import { Global } from "../Module/Global";

const {ccclass, property} = cc._decorator;
@ccclass
export class ResMgr extends cc.Component {

    static instance: ResMgr = null;
    private resList: cc.Prefab[] = [];
    private readonly mainPrefabFolder: string = "MainScenePrefab/";
    private readonly gamePrefabFolder: string = "GameScenePrefab/";

    start () {
        ResMgr.instance = this;
        cc.game.addPersistRootNode(this.node);
        this.initPreLoad();
    }

    initPreLoad()
    {
        this.preLoadRes("LevelChooseWindow", this.mainPrefabFolder);
        this.preLoadRes("LevelDetailWindow", this.mainPrefabFolder);
        this.preLoadRes("GameClearWindow", this.gamePrefabFolder);
    }

    getPrefabByName(name:string): cc.Prefab
    {
        for (let i = 0; i < this.resList.length; i++)
        {
            if (this.resList[i].name === name){
                return this.resList[i];
            }
        }
        Global.WARNING_MSG('can not find the resource prefab,name = ' + name);
        return null;
    }

    preLoadRes(name:string, defaultRootPath = 'prefab/')
    {
        if (this.resList[name])
        {
            return;
        }
        let path = defaultRootPath;
        cc.loader.loadRes(path + name,  (err, prefab) =>{
            if (err)
            {
                Global.ERROR_MSG(err);
                Global.ERROR_MSG('load prefab error. prefab name is ' + name);
            }
            else
            {
                this.resList[prefab.name] = prefab;
            }
        });
    }

    
    getResAsync(name:string)
    {
        return new Promise((resolve, reject)=>{
            let prefab = this.resList[name];
            if (prefab)
            {
                resolve(prefab);
                return;
            }

            let callback = function () {
                let prefab = this.resList[name];
                if (prefab)
                {
                    this.unschedule(callback);
                    resolve(prefab);
                    return;
                }
            }
            this.schedule(callback, 0.02);
        });
    }

    getResObjByName(name:string)
    {
        return new Promise((resolve, reject) =>
            this.getResAsync(name).then((prefab:cc.Prefab)=>{
                let node = cc.instantiate(prefab);
                let canvas = cc.find("Canvas");
                node.parent = canvas;
                resolve(node);
            })
        );
    }
}