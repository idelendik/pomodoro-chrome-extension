import {MESSAGE_PREFIX, MESSAGE_TARGET, MESSAGE_TYPE} from "../consts/const.js";
import {get_message_prefix, get_message_target, get_message_type} from "../helpers/helpers.js";

const INITIAL_VOLUME = 0.001;
const MAX_VOLUME = 0.4;
const VOLUME_STEP = 0.005;

const OFFSCREEN_AUDIO = (() => {
    const audio = new Audio('../audio/alarm.mp3');

    audio.volume = INITIAL_VOLUME;
    audio.loop = true;

    return audio;
})();

HTMLAudioElement.prototype.smoothPlay = function () {
    this.play();

    let intervalId = setInterval(() => {
        this.volume += VOLUME_STEP;

        if(this.volume > MAX_VOLUME) {
            clearInterval(intervalId);
        }
    }, 300);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const messagePrefix = get_message_prefix(message);
    if (messagePrefix !== MESSAGE_PREFIX) return false;

    const eventTarget = get_message_target(message);
    if (eventTarget !== MESSAGE_TARGET.OFFSCREEN) return false;

    const messageType = get_message_type(message);
    try {
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
    } catch (e) {
        console.error(e);
    }
});