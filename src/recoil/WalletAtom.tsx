import { atom } from "recoil";
import BN from "bn.js";






export const walletNameState = atom<string>({
  key: "walletNameState",
  default: "",
});

export const chainState = atom<string>({
  key: "chainState",
  default: "",
});

export const nodeNameState = atom<string>({
  key: "nodeNameState",
  default: "",
});

export const selectedAccountState = atom<string>({
  key: "selectedAccountState",
  default: "",
});

export const accountState = atom<string[]>({
  key: "accountState",
  default: [],
});

export const apiState = atom<string[]>({
  key: "apiState",
  default: [],
});

export const addressState = atom<string[]>({
  key: "addressState",
  default: [],
});


{
  /**export const balanceState = atom<number>({
  key: "balanceState",
  default: 0,
}); */
}

export const balanceState = atom<BN>({
  key: "balancestate",
  default: new BN(0),
});


