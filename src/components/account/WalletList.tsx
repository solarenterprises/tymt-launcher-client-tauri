import { Grid } from "@mui/material";

import WalletBar from "./WalletBar";

import { IWalletAddresses } from "../../types/WalletTypes";

import solar from "../../assets/chain/Solar.svg";
import binance from "../../assets/chain/Binance.svg";
import ethereum from "../../assets/chain/Ethereum.svg";
import bitcoin from "../../assets/chain/Bitcoin.svg";
import solana from "../../assets/chain/Solana.svg";
import polygon from "../../assets/chain/Polygon.svg";
import avalanche from "../../assets/chain/Avalanche.svg";
import arbitrumOne from "../../assets/chain/Arbitrum.svg";
import optimism from "../../assets/chain/Optimism.svg";

export interface IPropsWalletList {
  wallet: IWalletAddresses;
}

const WalletList = ({ wallet }: IPropsWalletList) => {
  return (
    <Grid container spacing={"12px"}>
      <Grid item xs={12}>
        <WalletBar icon={solar} chain={"Solar"} address={wallet?.solar} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={binance} chain={"Binance"} address={wallet?.binance} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={ethereum} chain={"Ethereum"} address={wallet?.ethereum} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={bitcoin} chain={"Bitcoin"} address={wallet?.bitcoin} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={solana} chain={"Solana"} address={wallet?.solana} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={polygon} chain={"Polygon"} address={wallet?.polygon} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={avalanche} chain={"Avalanche"} address={wallet?.avalanche} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={arbitrumOne} chain={"Arbitrum One"} address={wallet?.arbitrum} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={optimism} chain={"Optimism"} address={wallet?.optimism} />
      </Grid>
    </Grid>
  );
};

export default WalletList;
