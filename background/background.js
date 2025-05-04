import { BADGE_COLOR, MESSAGE_PREFIX, MESSAGE_TARGET, MESSAGE_TYPE } from "../consts/const.js";
import { generateMessage, getMessagePrefix, getMessageTarget, getMessageType } from "../helpers/helpers.js";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const messagePrefix = getMessagePrefix(message);
    if (!messagePrefix || messagePrefix !== MESSAGE_PREFIX) return;

    const eventTarget = getMessageTarget(message);
    if (!eventTarget || eventTarget !== MESSAGE_TARGET.BACKGROUND) return;

    const messageType = getMessageType(message);
    switch (messageType) {
        case MESSAGE_TYPE.START:
            timer.start();
            break;
        case MESSAGE_TYPE.RESET:
            timer.reset();
            break;
        default:
            throw new Error(`background.js: ${messageType} is not implemented`);
    }
});

const timer = (() => {
    const DEFAULT_TIMER_VALUE = {
        minutes: 40,
        seconds: 0,
    };

    let currentValue = {...DEFAULT_TIMER_VALUE};
    let hasTimeEnded = false;

    function tick() {
        if (hasTimeEnded) return;

        if (currentValue.seconds === 0) {
            currentValue.minutes--;
            currentValue.seconds = 59;
        } else {
            currentValue.seconds--;
        }

        hasTimeEnded = currentValue.minutes === 0 && currentValue.seconds === 0;
    }

    function alarmBadge() {
        return new Date(Date.now()).getSeconds() % 2 === 0 ? 'red' : 'white';
    }

    function getCurrentValueFormatted() {
        const minutesToStr = `${currentValue.minutes < 10 ? "0" : ""}${currentValue.minutes}`;
        const secondsToStr = `${currentValue.seconds < 10 ? "0" : ""}${currentValue.seconds}`;

        return `${minutesToStr}:${secondsToStr}`;
    }

    let isTimerActivated = false;
    let intervalId;

    function start() {
        if (isTimerActivated) return true;

        isTimerActivated = true;

        chrome.offscreen.createDocument({
            url: "../offscreen/offscreen.html",
            reasons: ['DOM_SCRAPING'],
            justification: "to create an Audio HTML element"
        });

        intervalId = setInterval(() => {
            chrome.action.setBadgeText({
                text: getCurrentValueFormatted()
            });

            chrome.action.setBadgeBackgroundColor({
                color: hasTimeEnded ? alarmBadge() : BADGE_COLOR
            });

            if (hasTimeEnded) {
                chrome.runtime.sendMessage(generateMessage(MESSAGE_TARGET.OFFSCREEN, MESSAGE_TYPE.PLAY));
            }

            tick();
        }, 1000);
    }

    function reset() {
        if (!isTimerActivated) return;

        clearInterval(intervalId);

        currentValue = {...DEFAULT_TIMER_VALUE};
        isTimerActivated = false;
        hasTimeEnded = false;

        chrome.action.setBadgeText({text: ""});

        chrome.runtime.sendMessage(generateMessage(MESSAGE_TARGET.OFFSCREEN, MESSAGE_TYPE.PAUSE))
            .then(() => {
                chrome.offscreen.closeDocument();
            });

        return true;
    }

    return {
        start,
        reset
    }
})();