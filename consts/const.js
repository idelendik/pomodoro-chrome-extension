const MESSAGE_PREFIX = "ANOTHER_POMODORO";

const message_target_internal = {
    OFFSCREEN: "OFFSCREEN",
    BACKGROUND: "BACKGROUND"
}

const MESSAGE_TARGET = Object.freeze(message_target_internal);

const message_type_internal = {
    START: "START",
    RESET: "RESET",
    PLAY: "PLAY",
    PAUSE: "PAUSE",
}
const MESSAGE_TYPE = Object.freeze(message_type_internal);

const BADGE_COLOR = "#8c47b3";

export {
    MESSAGE_PREFIX,
    MESSAGE_TARGET,
    MESSAGE_TYPE,
    BADGE_COLOR,
}