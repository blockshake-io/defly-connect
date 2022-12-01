import {shuffleArray} from "../array/arrayUtils";
import {DeflyWalletNetwork} from "../deflyWalletTypes";
import fetcher from "./fetcher";

const DEFLY_CONNECT_CONFIG_URL = "https://static.defly.app/wc-bridge-servers.json";
const DEFLY_CONNECT_CONFIG_STAGING_URL = "https://static.defly.app/wc-bridge-servers.json";

/**
 * @returns {object} {use_sound: boolean, servers: string[]}
 */
function fetchDeflyConnectConfig(network: DeflyWalletNetwork) {
  const configURL =
    network === "mainnet" ? DEFLY_CONNECT_CONFIG_URL : DEFLY_CONNECT_CONFIG_STAGING_URL;

  return fetcher<{
    use_sound: boolean;
    servers: string[];
  }>(configURL, {cache: "no-store"});
}



/**
 * @returns {object} {bridgeURL: string, shouldUseSound: boolean}
 */
async function getDeflyConnectConfig(network: DeflyWalletNetwork) {
  const response = await fetchDeflyConnectConfig(network);

  return {
    bridgeURL: shuffleArray(response.servers)[0],
    shouldUseSound: response.use_sound
  };
}

export {getDeflyConnectConfig, fetchDeflyConnectConfig};
