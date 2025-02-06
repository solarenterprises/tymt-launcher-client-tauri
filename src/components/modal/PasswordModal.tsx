import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import numeral from "numeral";

import { Box, Stack, Modal, Button, TextField, InputAdornment, CircularProgress, Fade } from "@mui/material";

import { useWallet } from "../../providers/WalletProvider";

import InputText from "../account/InputText";
import FeeSwitchButton from "../home/FeeSwitchButton";

import { getAccount } from "../../store/AccountSlice";
import { getWallet } from "../../store/WalletSlice";
import { getWalletSetting } from "../../store/WalletSettingSlice";

import { getKeccak256Hash } from "../../lib/helper/EncryptHelper";

import { IAccount } from "../../types/AccountTypes";
import { IVotingData, IWalletAddresses } from "../../types/WalletTypes";
import { IWalletSetting } from "../../types/SettingTypes";

import SettingStyle from "../../styles/SettingStyle";

import closeIcon from "../../assets/setting/XIcon.svg";
import logo from "../../assets/main/FoxHeadComingSoon.png";
import solarBlockchainIcon from "../../assets/main/SolarBlockchain.png";

export interface IPropsPasswordModal {
  open: boolean;
  setOpen: (status: boolean) => void;
  voteAsset: IVotingData;
}

const PasswordModal = ({ open, setOpen, voteAsset }: IPropsPasswordModal) => {
  const classname = SettingStyle();
  const { t } = useTranslation();
  const { currentCurrencySymbol, currentCurrencyReserve, sxpFee, sxpVote } = useWallet();

  const accountStore: IAccount = useSelector(getAccount);
  const walletStore: IWalletAddresses = useSelector(getWallet);
  const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);

  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const validatePassword = useCallback(() => {
    return getKeccak256Hash(password) === accountStore?.password;
  }, [password, accountStore]);

  const handleVoteClick = useCallback(async () => {
    try {
      setLoading(true);
      const res = await sxpVote(accountStore, walletStore, sxpFee, password, voteAsset);
      if (res.success) {
        setOpen(false);
        setPassword("");
      } else {
        console.error("Failed to handleVoteClick: ", res.error);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to handleVoteClick: ", err);
      setOpen(false);
      setPassword("");
      setLoading(false);
    }
  }, [walletStore, accountStore, walletSettingStore, password]);

  return (
    <Modal
      open={open}
      style={modalStyle}
      onClose={() => setOpen(false)}
      sx={{
        backdropFilter: "blur(4px)",
      }}
    >
      <Fade in={open}>
        <Box className="modal-content oauth-modal">
          <img src={closeIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
          <img
            src={logo}
            alt="tymt icon"
            className="tymt-top-left-icon"
            style={{
              width: "30px",
              height: "30px",
            }}
          />
          <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
            <Stack direction={"column"}>
              <Box className="center-align" padding={"30px 10px 10px 10px"}>
                <FeeSwitchButton />
              </Box>
              <Box className="center-align" padding={"10px"}>
                <TextField
                  type="text"
                  id="outlined-adornment-weight"
                  placeholder="0.0"
                  InputProps={{
                    inputMode: "numeric",
                    endAdornment: (
                      <InputAdornment position="end" classes={{ root: classname.adornment }}>
                        {currentCurrencySymbol}
                      </InputAdornment>
                    ),
                    classes: {
                      input: classname.input,
                    },
                  }}
                  value={numeral(Number(sxpFee) * Number(currentCurrencyReserve)).format("0,0.0000")}
                  // onBlur={(e) => {
                  //   dispatch(
                  //     setWallet({
                  //       ...walletStore,
                  //       status: "input",
                  //       fee: Number(e.target.value) / Number(reserve),
                  //     })
                  //   );
                  // }}
                  onChange={() => {
                    // dispatch(
                    //   setWalletSetting({
                    //     ...walletSettingStore,
                    //     status: "input",
                    //     fee: Number(e.target.value) / Number(reserve),
                    //   })
                    // );
                  }}
                  className={classname.input}
                />
              </Box>
              <Box
                className="fs-14-light white p-10"
                sx={{
                  whiteSpace: "normal",
                }}
              >
                {t("set-56_transaction-detail")}
              </Box>
            </Stack>
            <Box className="center-align">
              <img width={200} src={solarBlockchainIcon} />
            </Box>
            <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
              <InputText
                id="password"
                label={t("cca-3_password")}
                type="password"
                name="password"
                value={password}
                setValue={setPassword}
                error={validatePassword()}
              />
              <Button fullWidth className="red-button" onClick={handleVoteClick} disabled={!validatePassword() || loading}>
                <Box className="fs-18-bold white" padding={"10px 18px"}>
                  {loading && (
                    <CircularProgress
                      sx={{
                        color: "#F5EBFF",
                      }}
                    />
                  )}
                  {!loading && t("ncca-51_confirm")}
                </Box>
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PasswordModal;
