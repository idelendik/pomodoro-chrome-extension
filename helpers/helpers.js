import { MESSAGE_PREFIX, MESSAGE_TARGET, MESSAGE_TYPE } from "../consts/const.js";

export const generateMessage = (target, type) => {
    if (!Object.values(MESSAGE_TARGET).includes(target)) {
        throw new Error(`${target} is incorrect message target, should be [${Object.values(MESSAGE_TARGET)}]`);
    }

    if (!Object.values(MESSAGE_TYPE).includes(type)) {
        throw new Error(`${type} is incorrect message type, should be [${Object.values(MESSAGE_TYPE)}]`);
    }

    return { prefix: MESSAGE_PREFIX, target: target, type: type };
};

export const getMessagePrefix = (message) => message['prefix'];
export const getMessageTarget = (message) => message['target'];
export const getMessageType = (message) => message['type'];