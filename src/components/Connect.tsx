import { ChangeEvent, useEffect, useState } from "react";
import { WsProvider, ApiPromise } from "@polkadot/api";
import { getWallets } from "@talismn/connect-wallets";
import { useRecoilState } from "recoil";
import { Link, useNavigate } from "react-router-dom";
import { Keyring } from "@polkadot/keyring";

import TalismanLogo from "../assets/Talisman-Logo.png";
import polkadotJsLogo from "../assets/polkadot{.js} Wallet.jpg";
import PolkagateLogo from "../assets/polkagate.jpg";
import NovaWalletLogo from "../assets/Nova-Wallet-Logo-Update.png";
import WalletsModal from "../components/WalletsModal";
import {
  balanceState,
  walletNameState,
  chainState,
  nodeNameState,
  addressState,
} from "../recoil/WalletAtom";

import "../styles/connect.css";
import "../styles/chosenWallet.css";

import {
  web3Enable,
  web3Accounts,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import BN from "bn.js";

const NAME = "GmOrDie";
type period = "MORNING | NIGHT | MIDONE | MIDTWO";
const AMOUNT = new BN(10).mul(new BN(10).pow(new BN(10)));
const GM_WEB_SOCKET = "wss://ws.gm.bldnodes.org/";
const WS_SECOND_ENDPOINT = "wss://rpc.polkadot.io";
// const WS_SECOND_ENDPOINT = "wss://statemine-rpc-tn.dwellir.com";

const Connect = () => {
  const [api, setApi] = useState<ApiPromise>();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta>();
  const [period, setPeriod] = useState<period>();
  const [balance, setBalance] = useRecoilState<BN>(balanceState);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useRecoilState<string[]>(addressState);
  const [walletName, setWalletName] = useRecoilState<string>(walletNameState);
  const [chain, setChain] = useRecoilState<string>(chainState);
  const [nodeName, setNodeName] = useRecoilState<string>(nodeNameState);
  const [amount, setAmount] = useState<number>(0);
  const [recipientWallet, setRecipientWallet] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);

  const handleModal = () => setShowModal(!showModal);

  const setup = async () => {
    const wsProvider = new WsProvider(GM_WEB_SOCKET);
    const api = await ApiPromise.create({ provider: wsProvider });
    setApi(api);

    const [chain, nodeName] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.name(),
    ]);
    setChain(chain.toString());
    setNodeName(nodeName.toString());
    console.log(`You are connected to chain ${chain} using ${nodeName} `);
  };

  

  const connectTalisman = async () => {
    const extensions = await web3Enable(NAME);

    if (!extensions) {
      throw Error("No_EXTENSION_FOUND");
    }

    const allAccounts = await web3Accounts();

    if (allAccounts.length === 0) {
      setSelectedAccount(allAccounts[0]);
    }

    console.log("Extensions is : ", extensions);

    setAccounts(allAccounts);
  };

  const connectPolkadotjs = async () => {
    const extensions = await web3Enable(NAME);

    if (!extensions) {
      throw Error("No_EXTENSION_FOUND");
    }

    const allAccounts = await web3Accounts();

    if (allAccounts.length === 0) {
      setSelectedAccount(allAccounts[0]);
    }

    setAccounts(allAccounts);
  };

  const connectNovaWallet = async () => {
    const extensions = await web3Enable(NAME);

    if (!extensions) {
      throw Error("No_EXTENSION_FOUND");
    }

    const allAccounts = await web3Accounts();

    if (allAccounts.length === 0) {
      setSelectedAccount(allAccounts[0]);
    }

    setAccounts(allAccounts);
  };

  const connectPolkagate = async () => {
    const extensions = await web3Enable(NAME);

    if (!extensions) {
      throw Error("No_EXTENSION_FOUND");
    }

    const allAccounts = await web3Accounts();

    if (allAccounts.length === 0) {
      setSelectedAccount(allAccounts[0]);
    }

    setAccounts(allAccounts);
  };

  // const handleTransfer = async () => {
  //   const txHash = await api.tx.balances
  //     .transfer(recipientWallet, amount)
  //     .signAndSend(address);
  //   console.log(`Submitted with hash ${txHash}`);
  // };

  {
    /**   
 const handleTransfer = async () => {
   // Create a keyring instance
   const keyring = new Keyring({ type: "sr25519" });

   // Specify the recipient wallet and transfer amount
   const recipientWallet: string = "5F1eD40bb6c5d6C271B997F63865C47B9719cB5d";
   const amount: bigint = BigInt(100000000000); // 1 DOT in Planck

   // Connect to a Polkadot node using an API provider
   const provider = new WsProvider(GM_WEB_SOCKET);
   const api: ApiPromise = await ApiPromise.create({ provider });

   // Sign and send a transfer from Alice to Bob
   const handleTransfer = async () => {
     try {
       const alice = keyring.addFromUri("//Alice", { name: "Alice" });
       const { nonce } = await api.query.system.account(alice.address);

       const tx = api.tx.balances.transfer(recipientWallet, amount);
       const signedTx = tx.sign(alice, { nonce });
       const txHash = await signedTx.send();

       console.log(`Submitted with hash ${txHash}`);
     } catch (err) {
       console.error(err);
     }
   };
 }; */
  }

  async function handleDisconnect(api: ApiPromise): Promise<void> {
    const keyring = new Keyring({ type: "sr25519" }); // or 'ed25519' for Edgeware
    const accounts = keyring.getPairs();
    for (const account of accounts) {
      api.disconnect();
      keyring.removePair(account.address);
    }
  }

  function handleButtonClick(
    api: ApiPromise
  ): (event: React.MouseEvent<HTMLButtonElement>) => void {
    return (event: React.MouseEvent<HTMLButtonElement>): void => {
      handleDisconnect(api);
    };
  }

  const abi = useNavigate();

  // const handleClick = handleButtonClick(api);

  const handleClick = async (): Promise<void> => {
    //    await handleDisconnect(abi);
  };

  const handleAccountSelection = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedAddress = e.target.value;

    const account = accounts.find(
      (account) => account.address === selectedAddress
    );

    if (!account) {
      throw Error("NO_ACCOUNT_FOUND");
    }

    setSelectedAccount(account);
  };

  const handleBurn = async () => {
    if (!api) return;

    if (!selectedAccount) return;

    const injector = await web3FromAddress(selectedAccount.address);

    await api.tx.currencies
      .burnFren(AMOUNT)
      .signAndSend(selectedAccount.address, {
        signer: injector.signer,
      }); //FREN : Unknown word
  };

  useEffect(() => {
    // console.log(AMOUNT.toString());
    setup();
  }, []);

  useEffect(() => {
    if (!api) return;

    (async () => {
      const period = (
        await api.query.currencies.currentTimePeriod()
      ).toPrimitive() as string;

      const parsedPeriod = period.toUpperCase() as period;
      setPeriod(parsedPeriod);
      console.log(period);
    })();
    // (
    //   async () => {
    //     const time = await api.query.timestamp.now();
    //     console.log(time.toPrimitive())
    //   }
    // )();
  }, [api]);

  console.log("Balance outside is : ", balance);

  useEffect(() => {
    if (!api) return;
    if (!selectedAccount) return;

    api.query.system.account(
      selectedAccount.address,
      ({ data: { free } }: { data: { free: BN } }) => {
        setBalance(free);
      }
    );

    console.log("Balance inside is : ", balance);
  }, [api, selectedAccount]);

  return (
    <div>
      <div className="navbar">
        {accounts.length === 0 ? (
          <button
            onClick={() => setShowModal(!showModal)}
            className="connect-btn"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={api ? handleClick : undefined}
            className="disconnect-btn"
          >
            Disconnect Wallet
          </button>
        )}

        {/**
      {accounts.length > 0 && !selectedAccount ? (
        <div>
          <select onChange={handleAccountSelection}>
            <option value="" disabled selected hidden>
              Choose your account
            </option>
            {accounts.map((account) => (
              <option key={account.meta.name} value={account.address}>
                {account.meta.name || account.address}
              </option>
            ))}
          </select>
        </div>
      ) : null}






      {accounts.length > 0 && !selectedAccount ? (
        <div>
         <TalismanChosen />
        </div>
      ) : null}
     */}

        <WalletsModal
          showModal={showModal}
          closeModal={handleModal}
          title="Select Wallet"
        >
          <img
            src={TalismanLogo}
            className="select-wallet"
            alt="Talisman  Wallet"
            onClick={connectTalisman }
          />
          <img
            src={polkadotJsLogo}
            className="select-wallet"
            alt="polkadot{.js} Wallet"
            onClick={connectPolkadotjs}
          />

          <img
            src={NovaWalletLogo}
            className="select-wallet"
            alt="Nova Wallet"
            onClick={connectNovaWallet}
          />
          <img
            src={PolkagateLogo}
            className="select-wallet"
            alt="Polkagate Wallet"
            onClick={connectPolkagate}
          />
        </WalletsModal>
      </div>

      <div>
        {accounts.length > 0 && !selectedAccount ? (
          <div className="select-account select-account-card">
            <select className="select-option" onChange={handleAccountSelection}>
              <option value="" disabled selected hidden>
                Choose your account
              </option>
              {accounts.map((account) => (
                <option key={account.meta.name} value={account.address}>
                  {account.meta.name || account.address}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {selectedAccount ? (
          <div className="talisman-card">
            <span>
              Chain : <span className="wallet-name">{chain} </span> <br />
              Node : <span className="wallet-name">{nodeName}</span>
              <br />
              {/** Connected Wallet :
              <span className="wallet-name"> {walletName} </span> */}
            </span>
            <span>
              Your current balance is :{" "}
              <span className="balance">{balance?.toNumber()} Dot </span>
              <br />
            </span>
            <hr />
            <span>
              <label htmlFor="amount">Amount </label>
              <input
                type="number"
                id="amount"
                className="amount-input"
                placeholder="Enter Amount"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <br />
            </span>
            <span>
              <label htmlFor="amount">Wallet </label>
              <input
                type="text"
                id="wallet"
                className="amount-input"
                placeholder="Enter Recipient's Wallet Address"
                onChange={(e) => setRecipientWallet(e.target.value)}
              />
              <br />
            </span>

            <button
              className={`${
                balance.gt(new BN(0)) && amount && recipientWallet
                  ? "send-btn"
                  : "no-money"
              }`}
            >
              Transfer
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};


export default Connect;




