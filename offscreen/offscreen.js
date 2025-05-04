import { MESSAGE_PREFIX, MESSAGE_TARGET, MESSAGE_TYPE } from "../consts/const.js";
import { getMessagePrefix, getMessageTarget, getMessageType } from "../helpers/helpers.js";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const messagePrefix = getMessagePrefix(message);
    if (!messagePrefix || messagePrefix !== MESSAGE_PREFIX) return false;

    const eventTarget = getMessageTarget(message);
    if (!eventTarget || eventTarget !== MESSAGE_TARGET.OFFSCREEN) return false;

    const messageType = getMessageType(message);
    switch (messageType) {
        case MESSAGE_TYPE.PLAY:
            OFFSCREEN_AUDIO.smoothPlay();
            break;
        case MESSAGE_TYPE.PAUSE:
            OFFSCREEN_AUDIO.pause();
            OFFSCREEN_AUDIO.currentTime = 0;
            break;
        default:
            throw new Error(`offscreen.js: ${messageType} is not implemented`);
    }
});

const OFFSCREEN_AUDIO = (() => {
    const INITIAL_VOLUME = 0.001;
    const MAX_VOLUME = 0.25;
    const VOLUME_STEP = 0.005;

    const audio = new Audio('../audio/alarm.mp3');

    audio.volume = INITIAL_VOLUME;
    audio.loop = true;

    audio.smoothPlay = function () {
        this.play();

        let intervalId = setInterval(() => {
            this.volume += VOLUME_STEP;

            if(this.volume > MAX_VOLUME) {
                clearInterval(intervalId);
            }
        }, 450);
    }

    return audio;
})();