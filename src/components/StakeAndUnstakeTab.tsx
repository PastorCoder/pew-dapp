import React, { SyntheticEvent, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useRecoilState } from "recoil";
import BN from "bn.js";

import "../styles/staking.css";

import {
  balanceState,
  walletNameState,
  chainState,
  nodeNameState,
  addressState,
} from "../recoil/WalletAtom";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const NAME = "GmOrDie";

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function StakeAndUnstakeTab() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [balance, setBalance] = useRecoilState<BN>(balanceState);
  const [amount, setAmount] = useState<number>(0);
  const [recipientWallet, setRecipientWallet] = useState<string>("");

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", width: 500 }}>
      <AppBar position="static" style={{ backgroundColor: "#e9ecfa" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Stake" {...a11yProps(0)} style={{ color: "blue" }} />
          <Tab label="Unstake" {...a11yProps(1)} style={{ color: "blue" }} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
        style={{ backgroundColor: "white", height: "450px" }}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <span style={{ color: "black" }}>
            Balance :{" "}
            <span className="stake-balance">{balance?.toNumber()} Dot </span>
            <br />
          </span>
          <br />

          <span className="">
            <label htmlFor="amount" style={{ color: "black" }}>
              Amount{" "}
            </label>
            <input
              type="number"
              id="amount"
              className="amount-input"
              placeholder="Enter Amount to Stake"
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{ width: "370px", height: "40px", marginLeft: "10px" }}
            />
          </span>
          <div>
            {balance.toNumber() < 5 || amount < 5 ? (
              <span style={{ color: "red" }}>
                Insufficient DOT transferable balance. Minimum stake amount is 5
                DOT.
              </span>
            ) : (
              ""
            )}
          </div>
          <br />

          <div className="stake-yield-roi">
            <div className="stake-yield-roi-first-text">
              <span>Mint</span>
              <br />
              <span>
                {81.1239} {NAME}
              </span>
            </div>
            <div className="stake-yield-roi-first-text">
              <span>Flexible Fee</span>
              <br />
              <span>
                {0.0021} {NAME} by {NAME}
              </span>
            </div>
            <hr />
            <div className="protocol-apy">Protocol APY {20.9}%</div>
          </div>

          <button
            className={`${
              balance.gt(new BN(0)) && amount && recipientWallet
                ? "stake-tab-btn"
                : "stake-no-money "
            }`}
          >
            Stake
          </button>
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
          <span style={{ color: "black" }}>
            Balance :{" "}
            <span className="stake-balance">{balance?.toNumber()} Dot </span>
            <br />
          </span>
          <br />

          <span className="">
            <label htmlFor="amount" style={{ color: "black" }}>
              Amount{" "}
            </label>
            <input
              type="number"
              id="amount"
              className="amount-input"
              placeholder="Enter Amount to Stake"
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{ width: "370px", height: "40px", marginLeft: "10px" }}
            />
          </span>
          <div>
            {balance.toNumber() < 5 || amount < 5 ? (
              <span style={{ color: "red" }}>
                Insufficient DOT transferable balance.
              </span>
            ) : (
              ""
            )}
          </div>
          <br />

          <div className="stake-yield-roi">
            <div className="stake-yield-roi-first-text">
              <span>Expected to receive</span>
              <br />
              <span>
                {81.1239} {NAME}
              </span>
            </div>
            <div className="stake-yield-roi-first-text">
              <span>Fast Redeem Fee</span>
              <br />
              <span>
                {0.0021} {NAME} by {NAME}
              </span>
            </div>
            <div className="stake-yield-roi-first-text">
              <span>Flexible Fee</span>
              <br />
              <span>
                {0.0021} {NAME} by {NAME}
              </span>
            </div>
          </div>

          <button
            className={`${
              balance.gt(new BN(0)) && amount && recipientWallet
                ? "stake-tab-btn"
                : "stake-no-money "
            }`}
          >
            Unstake
          </button>
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
