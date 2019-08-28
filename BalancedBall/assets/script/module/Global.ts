
export class Global{
	static GB_IsUseClientData = true;
	static GB_GameFont = undefined;
	static GB_FBPlacementId = '279052509321456_280353635858010';

	static INFO_MSG = function(s)
	{
		console.info(s);
	}

	static DEBUG_MSG = function(s)
	{
		console.debug(s);
	}

	static ERROR_MSG = function(s)
	{
		console.error(s);
	}

	static WARNING_MSG = function(s)
	{
		console.warn(s);
	}

	static IsNullObject = function(obj)
	{
		for (var i in obj) {
			return false;
		}
		return true;
	}

	static GlobalEventMap = {
		ChangeScene:'ChangeScene',
		ExitStore:'ExitStore',
	};
	
	static PromptBoxMode = cc.Enum({
		OK_CANCLE:1,
		ONLY_OK:2,
		OK_CANCLE_AD_TIP:3,
		OK_CANCLE_SHARE_TIP:4,
		OK_OPEN_AD_TIP:5,
		OK_CANCLE_CHECK:6,
	});

	static PromptBox_Ret = cc.Enum({
		CONTINUE:1,
		RETURN:2,
		OPEN:3,
	});

	static OpenPromptBox = function(mode, text, callback, autoClose = true, loadFinish = undefined)
	{
		cc.loader.loadRes("prefab/common/PromptBox", function (err, prefab) {
			let newNode = cc.instantiate(prefab);
			let controlerComp = newNode.getComponent('PromptBoxController');
			controlerComp.setup(mode,text,callback,autoClose);
			cc.director.getScene().addChild(newNode);
			if (loadFinish)
			{
				loadFinish();
			}
		});
	}

	/**
	 * [min,max)
	 */
	static GetRandomInt = function (min, max)
	{
		var ratio = Math.random();
		return min + Math.floor((max - min) * ratio);cc.instantiate
	};

	static TimeFormt = function (sec:number): string
	{
		if (sec <= 0)
		{
			return "00:00:00"
		}
		let h = parseInt((sec / 3600).toString());
        let m = parseInt(((sec % 3600) / 60).toString());
        let s = sec % 60;
        let hour = '';
        let minute = '';
		let seconds ='';
		hour = h < 10 ? ("0" + h) : h.toString();
		minute = m < 10 ? ("0" + m) : m.toString();
        seconds = s < 10 ? ("0" + s) : s.toString();
		return hour + ":" + minute + ":" + seconds;
	}

	/**
	 * accurate millionsecond
	 */
	static getCurrentTimestamp = function(): number
	{
		return new Date().getTime();
	}
}