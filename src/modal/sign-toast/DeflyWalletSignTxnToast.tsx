import "./_defly-wallet-sign-txn-toast.scss";

import CloseIcon from "../../asset/icon/Close--small.svg";
import animationData from "./lotties/Animation.json";

import React from "react";
import Lottie from "lottie-react";

interface DeflyWalletSignTxnToastProps {
  onClose: () => void;
}

function DeflyWalletSignTxnToast({onClose}: DeflyWalletSignTxnToastProps) {
  return (
    <div className={"defly-wallet-sign-txn-toast"}>
      <div className={"defly-wallet-sign-txn-toast__header"}>
        <button
          className={"defly-wallet-sign-txn-toast__header__close-button"}
          onClick={onClose}>
          <img src={CloseIcon} />
        </button>
      </div>

      <div className={"defly-wallet-sign-txn-toast__content"}>
        <Lottie
          className={"defly-wallet-sign-txn-toast__content__lottie-animation"}
          animationData={animationData}
          width={200}
          height={200}
        />

        <p className={"defly-wallet-sign-txn-toast__content__description"}>
          {"Please launch "}

          <b>{"Defly Wallet"}</b>

          {" on your iOS or Android device to sign this transaction."}
        </p>
      </div>
    </div>
  );
}

export default DeflyWalletSignTxnToast;
