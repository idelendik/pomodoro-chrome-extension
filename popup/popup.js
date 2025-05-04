import { MESSAGE_TARGET, MESSAGE_TYPE } from "../consts/const.js";
import { generateMessage } from "../helpers/helpers.js";

document.getElementById("start")
    .addEventListener('click', () => {
        const message = generateMessage(MESSAGE_TARGET.BACKGROUND, MESSAGE_TYPE.START);

        chrome.runtime.sendMessage(message);

        window.close();
    });

document.getElementById("reset")
    .addEventListener('click', () => {
        const message = generateMessage(MESSAGE_TARGET.BACKGROUND, MESSAGE_TYPE.RESET);

        chrome.runtime.sendMessage(message);

        window.close();
    });