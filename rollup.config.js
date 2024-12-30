import typescript from "rollup-plugin-typescript2";
import {terser} from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";

export default [
  {
    input: {
      index: "src/index.ts"
    },
    output: {
      dir: "dist",
      format: "esm",
      name: "DeflyConnect",
      globals: {
        "@walletconnect/client": "WalletConnect",
        algosdk: "algosdk",
        bowser: "bowser",
        "qr-code-styling": "QRCodeStyling",
        "@evanhahn/lottie-web-light": "lottie"
      }
    },
    external: [
      "@walletconnect/client",
      "@walletconnect/types",
      "algosdk",
      "@evanhahn/lottie-web-light",
      "bowser",
      "qr-code-styling",
      "lottie-web",
      "utf-8-validate"
    ],
    plugins: [
      image(),
      terser(),
      postcss(),
      typescript({
        rollupCommonJSResolveHack: true,
        exclude: "**/__tests__/**",
        clean: true
      }),
      json()
    ]
  }
];
