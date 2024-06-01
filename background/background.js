import { MESSAGE_PREFIX, MESSAGE_TARGET, MESSAGE_TYPE } from "../consts/const.js";
import { generate_message, get_message_prefix, get_message_target, get_message_type } from "../helpers/helpers.js";

let timer = pomodoroTimer();
let intervalId = undefined;

function pomodoroTimer() {
    const DEFAULT_POMODORO_DURATION_MINUTES = 40;
    const DEFAULT_POMODORO_DURATION_SECONDS = 0;

    const DEFAULT_TIMER_VALUE = {
        minutes: DEFAULT_POMODORO_DURATION_MINUTES,
        seconds: DEFAULT_POMODORO_DURATION_SECONDS,
    };

    let currentValue = {...DEFAULT_TIMER_VALUE};

    let isTimerActivated = false;

    return {
        getFormattedValue: () => {
            const minutesToStr = `${currentValue.minutes < 10 ? "0" : ""}${currentValue.minutes}`;
            const secondsToStr = `${currentValue.seconds < 10 ? "0" : ""}${currentValue.seconds}`;

            return `${minutesToStr}:${secondsToStr}`;
        },
        tick: () => {
            if (currentValue.seconds === 0) {
                currentValue.minutes--;
                currentValue.seconds = 59;
            } else {
                currentValue.seconds--;
            }
        },
        getIsTimerActivated: () => isTimerActivated,
        setIsTimerActivated: (status) => {
            isTimerActivated = status;
        },
        getCurrentValueMs: () => (currentValue.minutes * 60) + currentValue.seconds,
        reset: () => {
            currentValue = {...DEFAULT_TIMER_VALUE};
            isTimerActivated = false;
        }
    }
}

async function start() {
    if(!timer.getIsTimerActivated()) {
        timer.setIsTimerActivated(true);

        await chrome.offscreen.createDocument({
            url: "../offscreen/offscreen.html",
            reasons: ['DOM_SCRAPING'],
            justification: "to create an Audio HTML element"
        });

        intervalId = setInterval(async () => {
            await chrome.action.setBadgeText({
                text: timer.getFormattedValue()
            });

            await chrome.action.setBadgeBackgroundColor({
                color: '#8c47b3'
            });

            if (timer.getCurrentValueMs() === 0) {
                await chrome.runtime.sendMessage(generate_message(MESSAGE_TARGET.OFFSCREEN, MESSAGE_TYPE.PLAY));

                clearInterval(intervalId);
            }

            timer.tick();
        }, 1000);
    }

    return true;
}

async function reset() {
    if (!timer.getIsTimerActivated()) return;

    clearInterval(intervalId);

    timer.reset();

    await chrome.action.setBadgeText({text: ""});
    if (chrome.runtime.lastError) {
        setTimeout(async () => {
            await chrome.runtime.sendMessage(generate_message(MESSAGE_TARGET.OFFSCREEN, MESSAGE_TYPE.PAUSE));
            await chrome.offscreen.closeDocument();
        }, 100);
    } else {
        await chrome.runtime.sendMessage(generate_message(MESSAGE_TARGET.OFFSCREEN, MESSAGE_TYPE.PAUSE));
        await chrome.offscreen.closeDocument();
    }

    return true;
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const messagePrefix = get_message_prefix(message);
    if (messagePrefix !== MESSAGE_PREFIX) return;

    const eventTarget = get_message_target(message);
    if (eventTarget !== MESSAGE_TARGET.BACKGROUND) return;

    const messageType = get_message_type(message);
    try {
        switch (messageType) {
            case MESSAGE_TYPE.START:
                await start();
                break;
            case MESSAGE_TYPE.RESET:
                await reset();
                break;
            default:
                throw new Error(`background.js: ${messageType} is not implemented`);
        }
    } catch (e) {
        console.error(e);
    }
});