import { shuffleArray } from '../array/arrayUtils';
import { DeflyWalletNetwork } from '../deflyWalletTypes';
import fetcher from './fetcher';
import { DeflyWalletConfig } from './deflyWalletConnectApiTypes';

const DEFLY_CONNECT_CONFIG_URL = 'https://static.defly.app/wc-bridge-servers.json';
const DEFLY_CONNECT_CONFIG_STAGING_URL = 'https://static.defly.app/wc-bridge-servers.json';

/**
 * @returns {object} {use_sound: boolean, servers: string[]}
 */
function fetchDeflyConnectConfig(network: DeflyWalletNetwork) {
  const configURL =
    network === 'mainnet' ? DEFLY_CONNECT_CONFIG_URL : DEFLY_CONNECT_CONFIG_STAGING_URL;

  return fetcher<{
    use_sound: boolean;
    servers: string[];
    silent: boolean | undefined;
  }>(configURL, { cache: 'no-store' });
}


/**
 * @returns {object} {bridgeURL: string, shouldUseSound: boolean}
 */
async function getDeflyConnectConfig(network: DeflyWalletNetwork) {
  let deflyWalletConfig: DeflyWalletConfig = {
    bridgeURL: '',
    shouldUseSound: true,
    silent: false
  };

  try {
    const response = await fetchDeflyConnectConfig(network);


    if (typeof response.use_sound !== 'undefined') {
      deflyWalletConfig.shouldUseSound = response.use_sound!;
    }

    if (typeof response.silent !== 'undefined') {
      deflyWalletConfig.silent = response.silent!;
    }
    deflyWalletConfig = {
      ...deflyWalletConfig,
      bridgeURL: shuffleArray(response.servers || [])[0] || ''
    };
  } catch (error) {
    console.log(error);
  }

  return deflyWalletConfig;
}

export { getDeflyConnectConfig, fetchDeflyConnectConfig };
