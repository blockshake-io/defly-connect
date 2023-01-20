import { shuffleArray } from '../array/arrayUtils';
import fetcher from './fetcher';
import { DeflyWalletConfig } from './deflyWalletConnectApiTypes';

const DEFLY_CONNECT_CONFIG_URL = 'https://static.defly.app/wc-bridge-servers.json';

/**
 * @returns {object} {use_sound: boolean, servers: string[]}
 */
function fetchDeflyConnectConfig() {
  const configURL = DEFLY_CONNECT_CONFIG_URL;

  return fetcher<{
    use_sound: boolean | undefined;
    servers: string[] | undefined;
    silent: boolean | undefined;
  }>(configURL, { cache: 'no-store' });
}


/**
 * @returns {object} {bridgeURL: string, shouldUseSound: boolean}
 */
async function getDeflyConnectConfig() {
  let deflyWalletConfig: DeflyWalletConfig = {
    bridgeURL: '',
    shouldUseSound: true,
    silent: false
  };

  try {
    const response = await fetchDeflyConnectConfig();


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
