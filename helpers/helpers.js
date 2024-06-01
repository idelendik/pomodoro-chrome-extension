import { MESSAGE_PREFIX, MESSAGE_TARGET, MESSAGE_TYPE } from "../consts/const.js";

const generate_message = (target, type) => {
    if (!Object.values(MESSAGE_TARGET).includes(target)) {
        throw new Error(`${target} is incorrect message target, should be [${Object.values(MESSAGE_TARGET)}]`);
    }

    if (!Object.values(MESSAGE_TYPE).includes(type)) {
        throw new Error(`${type} is incorrect message type, should be [${Object.values(MESSAGE_TYPE)}]`);
    }

    return { prefix: MESSAGE_PREFIX, target: target, type: type };
};

const get_message_prefix = (message) => message['prefix'];
const get_message_target = (message) => message['target'];
const get_message_type = (message) => message['type'];

export {
    generate_message,
    get_message_prefix,
    get_message_target,
    get_message_type
}