interface AppMeta {
  logo: string;
  name: string;
  main_color: string;
}

type DeflyWalletNetwork = "dev" | "testnet" | "mainnet";
type DeflyWalletType = "defly-wallet";
type DeflyWalletPlatformType = "mobile" | null;

// eslint-disable-next-line no-magic-numbers
type AlgorandChainIDs = 416001 | 416002 | 416003 | 4160;

interface DeflyWalletDetails {
  type: DeflyWalletType;
  accounts: string[];
  selectedAccount: string;
}

export type {
  AppMeta,
  DeflyWalletNetwork,
  DeflyWalletType,
  DeflyWalletPlatformType,
  DeflyWalletDetails,
  AlgorandChainIDs
};
