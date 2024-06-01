import { MESSAGE_TARGET, MESSAGE_TYPE } from "../consts/const.js";
import { generate_message } from "../helpers/helpers.js";

document.getElementById("start")
    .addEventListener('click', async () => {
        const message = generate_message(MESSAGE_TARGET.BACKGROUND, MESSAGE_TYPE.START);

        try {
            await chrome.runtime.sendMessage(message);
        } catch (e) {
            throw new Error(`an error occurred while sending ${MESSAGE_TYPE.START} message`)
        }

        window.close();
    });

document.getElementById("reset")
    .addEventListener('click', async () => {
        const message = generate_message(MESSAGE_TARGET.BACKGROUND, MESSAGE_TYPE.RESET);

        try {
            await chrome.runtime.sendMessage(message);
        } catch (e) {
            throw new Error(`an error occurred while sending ${MESSAGE_TYPE.RESET} message`)
        }

        window.close();
    });