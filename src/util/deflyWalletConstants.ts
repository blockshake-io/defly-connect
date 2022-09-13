import {isAndroid} from "./device/deviceUtils";

const DEFLY_WALLET_APP_DEEP_LINK = isAndroid() ? "algorand://" : "defly-wc://";

export {DEFLY_WALLET_APP_DEEP_LINK};
