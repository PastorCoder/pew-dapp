import { ChangeEvent, useEffect, useState } from "react";
import { WsProvider, ApiPromise } from "@polkadot/api";
import { getWallets } from "@talismn/connect-wallets";
import { useRecoilState } from "recoil";
import { Link } from "react-router-dom";

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

const App = () => {
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

  const handleModal = () => setShowModal(!showModal);

  const setup = async () => {
    const wsProvider = new WsProvider(GM_WEB_SOCKET);
    const api = await ApiPromise.create({ provider: wsProvider });
    setApi(api);
    // console.log(api);
  };

  {
    /**
async function handleConnect () {
  const provider = new WsProvider(WS_SECOND_ENDPOINT);
  const oneApi = await ApiPromise.create({ provider });
  const [chain, nodeName, nodeVersion] = await Promise.all([
    oneApi.rpc.system.chain(),
    oneApi.rpc.system.name(),
    oneApi.rpc.system.version()
  ]);
await oneApi.connect();
  console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
}

handleConnect().catch(console.error).finally(() => process.exit());

 */
  }

  const handleConnection = async () => {
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

  const handleDisconnect = async () => {
    //  const provider = new WsProvider(GM_WEB_SOCKET);
    //  const api = await ApiPromise.create({ provider });
    //  const signer = api.getSigner();
    //  await signer.disconnect();
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
          <button onClick={handleDisconnect} className="disconnect-btn">
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
            onClick={handleConnection}
          />
          <img
            src={polkadotJsLogo}
            className="select-wallet"
            alt="polkadot{.js} Wallet"
            onClick={handleConnection}
          />

          <img
            src={NovaWalletLogo}
            className="select-wallet"
            alt="Nova Wallet"
            onClick={handleConnection}
          />
          <img
            src={PolkagateLogo}
            className="select-wallet"
            alt="Polkagate Wallet"
            onClick={handleConnection}
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
              Connected Wallet :
              <span className="wallet-name"> {walletName} </span>
            </span>
            <span>
              Your current balance is :{" "}
              <span className="balance">{balance?.toNumber()} Dot </span>
            </span>

            {balance.gt(new BN(0)) ? (
              <Link to="/transfer-fund">
                <button className="send-btn">Transfer</button>
              </Link>
            ) : null}

            {balance.gt(new BN(0)) || "0" ? (
              <button className="no-money">Transfer</button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;
