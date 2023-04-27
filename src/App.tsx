import { ChangeEvent, useEffect, useState } from 'react';
import { WsProvider, ApiPromise } from '@polkadot/api';
import { getWallets } from '@talismn/connect-wallets';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { web3Enable, web3Accounts, web3FromAddress } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import BN from "bn.js";


const NAME = "GmOrDie";
type period = "MORNING | NIGHT | MIDONE | MIDTWO";
const AMOUNT = new BN(10).mul(new BN(10).pow(new BN(10)))
const WS_ENDPOINT = "wss://ws.gm.bldnodes.org/";
const WS_SECOND_ENDPOINT = "wss://rpc.polkadot.io";
// const WS_SECOND_ENDPOINT = "wss://statemine-rpc-tn.dwellir.com";


const App = () => {
  const [api, setApi] = useState<ApiPromise>();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta>();
  const [period, setPeriod] = useState<period>()
  const [balance, setBalance] = useState<BN>();




  const setup = async () => {
    const wsProvider = new WsProvider(WS_ENDPOINT);
    const api = await ApiPromise.create({ provider: wsProvider });
    setApi(api);
    // console.log(api);
  };
 



{/**
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

 */}

  
  
  
  

  
  
  
  
  

  const handleConnection = async () => {
    const extensions = await web3Enable(NAME);

       

    if (!extensions) {
      throw Error("No_EXTENSION_FOUND")
    };

    const allAccounts = await web3Accounts();

        

    if (allAccounts.length === 0) {
      setSelectedAccount(allAccounts[0]);
    }

    console.log("Extensions is : ", extensions)

    setAccounts(allAccounts);
  };



 

 
  const handleAccountSelection = async (e: ChangeEvent<HTMLSelectElement>) => { 
    const selectedAddress = e.target.value;

    const account = accounts.find((account) => account.address === selectedAddress);

    if (!account) {
      throw Error("NO_ACCOUNT_FOUND");
    }

    setSelectedAccount(account);
  };


  const handleBurn = async () => { 
    if (!api) return;

    if (!selectedAccount) return;

    const injector = await web3FromAddress(selectedAccount.address);

    await api.tx.currencies.burnFren(AMOUNT).signAndSend(selectedAccount.address, {
      signer: injector.signer
    }); //FREN : Unknown word
  };





  useEffect(() => {
    // console.log(AMOUNT.toString());
    setup();
  }, []);
  

  useEffect(() => {
    if (!api) return;

    (
      async () => {
        const period = (await api.query.currencies.currentTimePeriod()).toPrimitive() as string;
       

        const parsedPeriod = period.toUpperCase() as period;
        setPeriod(parsedPeriod);
        console.log(period)
      }
    )();
    // (
    //   async () => {
    //     const time = await api.query.timestamp.now();
    //     console.log(time.toPrimitive())
    //   }
    // )();
  }, [api]);


 console.log("Balance outside is : ", balance)

  useEffect(() => {
    if (!api) return;
    if (!selectedAccount) return;

    api.query.system.account(selectedAccount.address, ({ data: { free } }: { data: { free: BN } }) => {
      setBalance(free);
    }
    );

    console.log("Balance inside is : ", balance)


  },[api, selectedAccount]);
  



  return (
    <div>
     


      


      {accounts.length === 0 ? <button onClick={handleConnection}>Connect</button> : null}

      {accounts.length > 0 && !selectedAccount ? (
        <>
          <select onChange={handleAccountSelection}>
            <option value="" disabled selected hidden>
              Choose your account
            </option>
          {accounts.map((account) => <option key={account.meta.name} value={account.address}>{account.meta.name || account.address}</option>)}
        </select>
        </>) : null}

      {/**{accounts.length > 0 && selectedAccount ? selectedAccount.address : null} */}
      {selectedAccount ?
        <>
          <button onClick={handleBurn}>Burn 10 $FREN</button>
          <span>BALANCE: {balance?.toNumber()}</span>
      </> : null}
    </div>
  )
}

export default App
