declare let FBInstant : any;
import {PlatformBase,PlayerProperty,PurchaseFunc} from '../Platform/PlatformBase';

export class PlatformFaceBook extends PlatformBase{

    private paymentsIsReady: boolean = false;

    init(){
        this.playerName = FBInstant.player.getName();
        this.playerID = FBInstant.player.getID();
        this.headURL = FBInstant.player.getPhoto();

        cc.loader.load(this.headURL, (err, texture) => {
            this.headSprite = new cc.SpriteFrame(texture);
        });
        
        this.contextID = FBInstant.context.getID(), // 游戏环境 ID
        this.contextType = FBInstant.context.getType(), // 游戏类型
        this.locale = FBInstant.getLocale(),  // 地区
        this.platform = FBInstant.getPlatform(),// 平台
        this.sdkVersion = FBInstant.getSDKVersion(),// SDK 版本号
        
        FBInstant.onPause(super.onPause);

        FBInstant.payments.onReady( ()=> {
            console.log('Payments Ready!');
            this.paymentsIsReady = true;
        });
    }

    //好友列表
    getConnectedFriendsAsync(callback: PlayerProperty)
    {
        var connectedPlayers = FBInstant.player.getConnectedPlayersAsync()
        .then(function(players) {
            let playersList: any = [];
            for (var i = 0; i < players.length; i++)
            {
                var player = players[i];
                var data = {
                    id: player.getID(),
                    name: player.getName(),
                    photoUrl : player.getPhoto()
                };
                
                if (data.id !== this.getPlayerId())
                {
                    playersList.push(data);
                }
            }
            callback(playersList);
        });
        // [{id: '123456789', name: 'Paul Atreides' , photoUrl：'http://...'}, {id: '987654321', name: 'Duncan Idaho',photoUrl：'http://...'}]
    }

    quitGame ()
    {
        FBInstant.quit();
    }

    shareGame(text:string, imageBase64:string, callback:Function)
    {
        //intent ("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") Indicates the intent of the share.
        FBInstant.shareAsync({
            intent: 'REQUEST',
            image: imageBase64,
            text: text,
            data: {myReplayData: '...'},
        }).then(() => {
            callback();
        });
    }

    //激励广告预加载
    preLoadRewardedVideo(placementId:string, callback:Function)
    {
        var preloadedRewardedVideo = null;

        FBInstant.getRewardedVideoAsync(
            placementId // Your Ad Placement Id
        ).then(function(rewarded) {
            // Load the Ad asynchronously
            preloadedRewardedVideo = rewarded;
            return preloadedRewardedVideo.loadAsync();

        }).then(function() {
            console.log('Rewarded video preloaded');
            callback(preloadedRewardedVideo);
          
        }).catch(function(err){
            console.error('Rewarded video failed to preload: ' + err.code);
            callback(null,err.code);
        });
    }

    //激励广告播放
    showRewardedVideo(rewarded,callback:Function)
    {
        rewarded.showAsync()
        .then(function() {
            // Perform post-ad success operation
            console.log('Rewarded video watched successfully'); 
            callback(true);
        })
        .catch(function(e) {
            console.error(e.message);
            callback(false);
        });
    }

    inviteFriends(text:string, imageBase64:string, callback:Function, entryPointData = null)
    {
        let self = this;
        this.chooseAsync(function(isSuc:boolean){
            if (isSuc)
            {
                self.updateAsync(text, imageBase64, callback, entryPointData);
            }
            else
            {
                callback(false);
            }
        });
    }

    //拉好友一起玩
    chooseAsync(callback:Function)
    {
        //console.log('chooseAsync old = ' + FBInstant.context.getID());
        FBInstant.context
        .chooseAsync()
        .then(function() {
            console.log('chooseAsync resolve call back = ' + FBInstant.context.getID());
            callback(true);
        }).catch(function(e) {
            console.log('chooseAsync reject call back = ' + FBInstant.context.getID());
            callback(false);
        });
    }

    //与指定好友一起玩
    createAsync(userId, callback)
    {
        FBInstant.context
        .createAsync(userId)
        .then(function() {
            console.log('createAsync call back = ' + FBInstant.context.getID());
            callback();
        });
    }

    //与指定环境的好友一起玩
    switchAsync(contextId, callback)
    {
        FBInstant.context
        .switchAsync(contextId)
        .then(function() {
            console.log('switchAsync call back = ' + FBInstant.context.getID());
            callback();
        });
    }

    //随机匹配对手
    matchPlayerAsync(isSwitchContext, callback)
    {
        FBInstant
        .checkCanPlayerMatchAsync()
        .then(canMatch => {
            if (canMatch) {
                FBInstant
                .matchPlayerAsync(null, isSwitchContext)
                .then(function() {
                    console.log('matchPlayerAsync call back = ' + FBInstant.context.getID());
                    callback(true);
                });
            }
            else
            {
                callback(false);
            }
        });
    }

    //获取3个月以来玩过此款游戏的玩家(包括了自己)
    getPlayersAsync(callback:PlayerProperty)
    {
        FBInstant.context.getPlayersAsync()
        .then(function(players) {

            let playersList : any = [];
            for (var i = 0; i < players.length; i++)
            {
                var player = players[i];
                var data = {
                    id: player.getID(),
                    name: player.getName(),
                    photoUrl : player.getPhoto()
                };

                if (data.id !== this.getPlayerId())
                {
                    playersList.push(data);
                }
            }
            callback(playersList);
            // [{id: '123456789', name: 'Paul Atreides' , photoUrl：'http://...'}, {id: '987654321', name: 'Duncan Idaho',photoUrl：'http://...'}]

            /* var photoUrl = player.getPhoto();
            cc.loader.load(photoUrl, (err, texture) => {
                self.otherHead.spriteFrame = new cc.SpriteFrame(texture);
            }); */
                
            /* console.log(players.map(function(player) {
            return {
                id: player.getID(),
                name: player.getName(),
            }
            })); */
        });
    }

    //对同一环境Id组的玩家在messenger上推送消息
    updateAsync(text, imageBase64, callback, entryPointData = null){
        FBInstant.updateAsync({
            action: 'CUSTOM',
            cta: 'Play',
            image: imageBase64,
            text: {
              default: text,
              localizations: {
                en_US: text,
                //es_LA: '\u00A1X acaba de invadir el pueblo de Y!',
              }
            },
            template: 'WORD_PLAYED',
            data: entryPointData,
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH',
          }).then(function() {
            console.log('updateAsync successfully!!!');
            //const entryPointData = FBInstant.getEntryPointData();
            //console.log('updateAsync call getEntryPointData = ' + entryPointData);
            callback(true);
          });
    }

    getEntryPointData(): any
    {
        return FBInstant.getEntryPointData();
    }

    createShortcutAsync(callback){
        FBInstant.canCreateShortcutAsync()
        .then(function(canCreateShortcut) {
            if (canCreateShortcut) {
            FBInstant.createShortcutAsync()
                .then(function() {
                // Shortcut created
                console.log('Shortcut created!!!');
                callback(true);
                })
                .catch(function() {
                // Shortcut not created
                console.log('Shortcut not created!!!');
                callback(false);
                });
            }
            else{
                console.log('can not createShortcutAsync!!!');
                callback(false);
            }
        });
    }

    //获取排行榜
    getLeaderboard(boardName,callback)
    {
        if (FBInstant.context.getID())
        {
            boardName = boardName + '.' + FBInstant.context.getID();
        }
       
        var preLeaderboard = null;

        FBInstant
        .getLeaderboardAsync(boardName)
        .then(leaderboard => {
            console.log(leaderboard.getName());
            //return leaderboard.setScoreAsync(42, '{race: "elf", level: 3}');
            preLeaderboard = leaderboard;
            callback(leaderboard);
        }).catch(error => {
            console.error(error);
            callback(null);
        });

        /*var myLeaderboard = null;
        
        FBInstant.getLeaderboardAsync(boardName)
        .then(leaderboard => {
            console.log('getLeaderboardAsync name = ' + leaderboard.getName()); // 'myleaderboard'
            console.log('getLeaderboardAsync contextID = ' + leaderboard.getContextID()); 

            myLeaderboard = leaderboard;
            return leaderboard.getEntryCountAsync();
        })
        .then(count=>{
            console.log('getLeaderboardAsync getEntryCountAsync = ' + count);
            return myLeaderboard.getPlayerEntryAsync();
        })
        .then(entry=>{
            console.log('getPlayerEntryAsync rank = ' + entry.getRank()); // 2
            console.log('getPlayerEntryAsync score = ' + entry.getScore()); // 42
            console.log('getPlayerEntryAsync extra = ' + entry.getExtraData()); // '{race: "elf", level: 3}'
        }); */
    }

    //在messenger上推送排行榜消息
    leaderboardUpdateAsync(boardName,callback)
    {
        if (FBInstant.context.getID())
        {
            boardName = boardName + '.' + FBInstant.context.getID();
        }

        FBInstant.updateAsync({
            action: 'LEADERBOARD',
            name: boardName
          })
            .then(() => {
                console.log('leaderboardUpdate!!!');
                callback(true);
            })
            .catch(error => {
                console.error(error);
                callback(false);
            });
    }

    //测试当前平台是否支持支付
    canSupportPaymentsPurchase(): boolean
    {
        if (!this.paymentsIsReady)
        {
            console.log('payments onReady not call back!');
            return false;
        }

        var apiList = FBInstant.getSupportedAPIs();
        for (let i = 0; i < apiList.length; i++)
        {
            if (apiList[i] === 'payments.purchaseAsync'){
                console.log('payments.purchaseAsync API is Support!');
                return true;
            }
        }

        console.log('payments.purchaseAsync API is not Support!');
        return false;
    }

    //获取商品目录：
    /*商品结构：
    [
        {
            productID：'1001',
            title : 'Diamond',
            description : 'Pay $0.99 to get 100 Diamond.',
            imageURI : 'https://scontent-sit4-1.xx.fbcdn.net/v/t39.8026-6/38065577_2116085441972909_6358469782014001152_n.jpg?_nc_cat=0&oh=0190c5bee837da72c94e55b1a61c206f&oe=5C0D2C3A',
            price : '￥6.79',
            priceCurrencyCode : 'CNY',
        }
        ...
    ]
    */
    getCatalogAsync(callback)
    {
        FBInstant.payments.getCatalogAsync().then(function (catalog) {
            callback(catalog);
             // [{productID: '12345', ...}, ...]
        });
    }

    //准备购买流程:弹出支付对话框
    /*购买的回调结构：
    {
        developerPayload : 'foobar',
        paymentID : '',
        productID : '12345',
        purchaseTime : '',
        purchaseToken : '54321',
        signedRequest : '',
    }
    */
    purchaseAsync(productID, callback:PurchaseFunc)
    {
        var strProductID = '' + productID;
        FBInstant.payments.purchaseAsync({
            productID: strProductID,
            developerPayload: 'foobar',
        }).then(function (purchase) {
            callback(purchase);
            // {productID: '12345', purchaseToken: '54321', developerPayload: 'foobar', ...}
        });
    }

    //获取玩家拥有的商品，但是尚未消费的
    getPurchasesAsync(callback)
    {
        FBInstant.payments.getPurchasesAsync().then(function (purchases) {
            callback(purchases);
            // [{productID: '12345', ...}, ...]
        });
    }
    
    //消费玩家拥有的商品
    consumePurchaseAsync(purchaseToken:string, callback)
    {
        FBInstant.payments.consumePurchaseAsync(purchaseToken).then(function () {
            // Purchase successfully consumed!
            // Game should now provision the product to the player
            console.log('Purchase successfully consumed!');
            callback(true);

        }).catch(function(error){
            console.error(error);
            callback(false);
        });
    }
};