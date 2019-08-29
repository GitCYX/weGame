'use strict';

if (!window.i18n) {
    window.i18n = {};
}

if (!window.i18n.languages) {
    window.i18n.languages = {};
}

window.i18n.languages['en_US'] = {
    // write your key value pairs here
    label: {
        countdown:'Countdown',//倒计时
        winGame:'You Win!',//过关
        loseGame:'You Lose!',//失败
        firstPassLevelTip:"You will Get:",//首次三星通关获得:
        unlockLevelTip:"You must pass level ahead!"
    },
};