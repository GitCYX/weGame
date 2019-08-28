import { Global } from "../Module/Global";

export class LocalStorage
{
    private static _inst: LocalStorage;
    gameDataKey: string = "__balancedBallData__";

    latestTimeToEnterGame: number = 0;
    isFirstTimeToPlayGame: boolean = true;
    isFirstTimeToPlayGameToday: boolean = true;
    hasSharedToday: boolean = false;
    playerEnergyValue: number = 30;
    playerCoin: number = 1000;
    passLevelTimes: number[] = []; //每一关通关的时间数组

    IsFirstTimeToPlayGame()
    {
        return this.isFirstTimeToPlayGame;
    }

    IsFirstTimeToPlayGameToday()
    {
        return this.isFirstTimeToPlayGameToday;
    }

    GetShareStatusToday()
    {
        return this.hasSharedToday;
    }

    SetSharedToday()
    {
        this.hasSharedToday = true;
        this.saveDataToLocal();
    }

    GetPlayerEnergy()
    {
        return this.playerEnergyValue;
    }

    SetPlayerEnergy(val: number)
    {
        this.playerEnergyValue = val;
        this.saveDataToLocal();
    }

    GetPlayerCoin()
    {
        return this.playerCoin;
    }

    SetPlayerCoin(val: number)
    {
        this.playerCoin = val;
        this.saveDataToLocal();
    }

    GetPassedLevelInfo()
    {
        return this.passLevelTimes;
    }

    AddPassedLevelInfo(span: number)
    {
        this.passLevelTimes.push(span);
        this.saveDataToLocal();
    }

    ChangePassedLevelInfo(index:number, span:number)
    {
        this.passLevelTimes[index] = span;
        this.saveDataToLocal();
    }

    private constructor()
    {
    }

    static getInst():LocalStorage
    {
        if(!this._inst)
        {
            this._inst = new LocalStorage();
        }
        return this._inst;
    }

    remove(key:string)
    {
        cc.sys.localStorage.removeItem(key);
    }

    clear()
    {
        cc.sys.localStorage.clear();
    }

    prepareData()
    {
        let localData = this.getJson(this.gameDataKey, null);
        this.InitData(localData);
    }

    InitData (localData = null)
    {
        if (localData === null)
        {
            let timestamp = Global.getCurrentTimestamp();
            this.latestTimeToEnterGame = timestamp;
            this.isFirstTimeToPlayGame = true;
            this.isFirstTimeToPlayGameToday = true;
            this.hasSharedToday = false;
            this.playerEnergyValue = 30;
            this.playerCoin = 1000;
            this.passLevelTimes = [];
        }
        else
        {
            if (this.isSameDayLogin(localData.latestTimeToEnterGame))
            {
                this.isFirstTimeToPlayGameToday = false;
                this.hasSharedToday = localData.hasSharedToday;
            }
            else
            {
                this.isFirstTimeToPlayGameToday = true;
                this.hasSharedToday = false;
            }
            this.latestTimeToEnterGame = Global.getCurrentTimestamp();
            this.isFirstTimeToPlayGame = false;
            this.playerEnergyValue = localData.playerEnergyValue;
            this.playerCoin = localData.playerCoin;
            this.passLevelTimes = localData.passLevelTimes;
        }
        this.saveDataToLocal();
    }

    isSameDayLogin (latestLoginTimestamp): boolean
    {
        let dataA = new Date(latestLoginTimestamp);
        let dataB = new Date(Global.getCurrentTimestamp());
        return (dataA.setHours(0, 0, 0, 0) === dataB.setHours(0, 0, 0, 0))
    }

    saveDataToLocal ()
    {
        let data = {
            latestTimeToEnterGame: this.latestTimeToEnterGame,
            isFirstTimeToPlayGame: this.isFirstTimeToPlayGame,
            isFirstTimeToPlayGameToday: this.isFirstTimeToPlayGameToday,
            hasSharedToday: this.hasSharedToday,
            playerEnergyValue: this.playerEnergyValue,
            playerCoin: this.playerCoin,
            passLevelTimes: this.passLevelTimes
        }
        this.setJson(this.gameDataKey, data);
    }

    getJson(key:string, defaultValue = null)
    {
        const value = cc.sys.localStorage.getItem(key);
        if(value != null)
        {
            return JSON.parse(value);
        }
        return defaultValue;
    }

    setJson(key:string, value:object)
    {
        cc.sys.localStorage.setItem(key, JSON.stringify(value));
    }
}