/*
targetNode:目标节点
width:目标节点的宽
height:目标节点的高
targetWidth: 最终图片的宽
targetHeight: 最终图片的高
*/
function screenShot(targetNode,width,height, targetWidth,targetHeight){
    let oldPos = targetNode.position;

    //截图子节点必须要有Sprite才能截图
    var newSpriteComp;
    if(!targetNode.getComponent(cc.Sprite)){
        newSpriteComp = targetNode.addComponent(cc.Sprite);
    }

    //调整到世界坐标系的左下角才能截图，否则会黑屏，因为函数visit是世界坐标系)
    targetNode.x = width / 2;
    targetNode.y = height / 2;

    var renderTexture = cc.RenderTexture.create(width, height);

    //把 renderTexture 添加到场景中去，否则截屏的时候，场景中的元素会移动
    targetNode.parent._sgNode.addChild(renderTexture);
    //把 renderTexture 设置为不可见，可以避免截图成功后，移除 renderTexture 造成的闪烁
    renderTexture.setVisible(false);

    //实际截屏的代码
    renderTexture.begin();
    targetNode._sgNode.visit();
    renderTexture.end();
    
    renderTexture.removeFromParent();

    var newSpriteFrame = new cc.SpriteFrame(renderTexture.getSprite().getTexture());
    ///注意:得到新纹理后，由于是原图大小，需要缩放到相应大小再截图一次保证图片大小合适
    newSpriteFrame = _adjustSpriteFrame(targetNode.parent, newSpriteFrame, width,height, targetWidth,targetHeight);

    //还原图片位置
    targetNode.position = oldPos;

    if(newSpriteComp){
        targetNode.removeComponent(newSpriteComp);
    }

    //转base64
    var base64 = spriteFrameToImgBase64(newSpriteFrame,targetWidth,targetHeight,true);

    return base64;
};

function spriteFrameToImgBase64 (theSpriteFrame, width, height, isReverse) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
        let texture = theSpriteFrame._texture;
        let image = texture.getHtmlElementObj();
        ctx.drawImage(image, 0, 0);
    }
    else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
        let buffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
        let texture = theSpriteFrame._texture._glID;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        let data = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow;
            if(isReverse){
                srow = height - 1 - row;
            }
            else{
                srow = row;
            }
            let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
            //let imageData = new ImageData(data2, width, 1);
            let imageData = ctx.createImageData(width,1);
            for(let i=0;i<data2.length;i++){
                imageData.data[i] = data2[i];
            }
            
            ctx.putImageData(imageData, 0, row);
        }
    }
    return canvas.toDataURL('image/png');
};

function _adjustSpriteFrame(parent, spriteFrame, w,h, targetWidth,targetHeight){
    var newNode = new cc.Node();
    newNode.parent = parent;

    var spriteComp = newNode.addComponent(cc.Sprite);
    spriteComp.spriteFrame = spriteFrame;

    newNode.scaleX = targetWidth / w;
    newNode.scaleY = targetHeight / h;

    newNode.x = targetWidth / 2;
    newNode.y = targetHeight / 2;

    newNode.scaleY *= -1;

    var renderTexture = cc.RenderTexture.create(targetWidth, targetHeight);
    newNode.parent._sgNode.addChild(renderTexture);
    renderTexture.setVisible(false);

    renderTexture.begin();
    newNode._sgNode.visit();
    renderTexture.end();
    
    renderTexture.removeFromParent();

    newNode.destroy();

    return new cc.SpriteFrame(renderTexture.getSprite().getTexture());
};

function base64ToSpriteFrameAsync(base,callback){
    var img = new Image();
    img.src = base;

    img.onload = function(){
        var texture = new cc.Texture2D();
        texture.initWithElement(img);
        texture.handleLoadedTexture();
        var newframe = new cc.SpriteFrame(texture);
        if(callback)callback(newframe);
    }
};

// 截屏返回 image base64
function getImgBase64 () {
    let target = cc.find('Canvas');
    let width = 960, height = 640;
    let renderTexture = new cc.RenderTexture(width, height);
    renderTexture.begin();
    target._sgNode.visit();
    renderTexture.end();
    //
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
        let texture = renderTexture.getSprite().getTexture();
        let image = texture.getHtmlElementObj();
        ctx.drawImage(image, 0, 0);
    }
    else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
        let buffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
        let texture = renderTexture.getSprite().getTexture()._glID;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        let data = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
            //let imageData = new ImageData(data2, width, 1);
            let imageData = ctx.createImageData(width,1);
            for(let i=0;i<data2.length;i++){
                imageData.data[i] = data2[i];
            }
            ctx.putImageData(imageData, 0, row);
        }
    }
    return canvas.toDataURL('image/png');
};

module.exports = {
    screenShot : screenShot,
    spriteFrameToImgBase64 : spriteFrameToImgBase64,
    base64ToSpriteFrameAsync : base64ToSpriteFrameAsync,
    getImgBase64 : getImgBase64,
};