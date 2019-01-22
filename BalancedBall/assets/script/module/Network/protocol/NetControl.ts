const {ccclass, property} = cc._decorator;
//定义全局的变量
import  * as onfire from "./libs/onfire/onfire"; //处理事件的类库
@ccclass
export class netControl extends cc.Component {

    private _sock:WebSocket = null  //当前的webSocket的对象

    private _host:string = '';  
    private _port:string = '';  
    
    connect(host,port){
        if(this._sock ==null || this._sock.readyState!==1){
            //当前接口没有打开
            //重新连接
            this._host = host;
            this._port = port;
            this._sock = new WebSocket(this._host + ":" + this._port);
            
            //this._sock = new WebSocket(netConfig.host+":"+netConfig.port)
            this._sock.onopen = this._onOpen.bind(this)
            this._sock.onclose = this._onClose.bind(this)
            this._sock.onmessage = this._onMessage.bind(this)
            this._sock.binaryType = "arraybuffer"
        }
        return this;
    }

    disconnect(){
        if(this._sock){
            this._sock.close();
        }
    }

    _onOpen(){
        onfire.fire("onopen")
    }
    _onClose(err){
        onfire.fire("onclose",err)
        /* let self = this
        let reVar = setInterval(function(){
            // 先对重连过后的Websocket进行判断，如果重连成功则断开循环
            if(self._sock.readyState == 1){
                clearInterval(reVar)
            }
            self._sock = new WebSocket(self._host+":"+self._port)
        }, 5000)    //每5秒尝试一次重连 */
    }
    _onMessage(obj){
        onfire.fire("onmessage",obj)
    }

    send(msg){
        if(this._sock.readyState == 1){
            this._sock.send(msg);
        }
    }

    protoBufAddtag(tag: number,buffer: Uint8Array){
        let addtag_buffer=new Uint8Array(buffer.length+2)
		let buf = new ArrayBuffer(2)
		let buf1 = new DataView(buf)
		buf1.setInt16(0, tag)
		let tagArray = new Uint8Array(buf1.buffer)
		//b.reverse()
		addtag_buffer.set(tagArray, 0)
        addtag_buffer.set(buffer.subarray(0,buffer.length),2)

        return addtag_buffer
    }

    parseProtoBufId(obj: MessageEvent) :{id:number,data:Uint8Array}  {
        let arrayBuffer:ArrayBuffer = obj.data
		let id = new DataView(arrayBuffer).getInt16(0, false)
        //console.log("receive message id = "+id)
        let dataUnit8Array = new Uint8Array(arrayBuffer)
        if (!Uint8Array.prototype.slice) {
            Object.defineProperty(Uint8Array.prototype, 'slice', {
              value: Array.prototype.slice
            });
        }
        dataUnit8Array = dataUnit8Array.slice(2);
        return {id: id,data:dataUnit8Array}
    }
}