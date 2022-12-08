import {isAndroid} from "./device/deviceUtils";

const DEFLY_WALLET_APP_DEEP_LINK = isAndroid() ? "algorand://" : "defly-wc://";

const DEFLY_DOWNLOAD_URL = "https://defly.app/";

export {DEFLY_WALLET_APP_DEEP_LINK, DEFLY_DOWNLOAD_URL};
