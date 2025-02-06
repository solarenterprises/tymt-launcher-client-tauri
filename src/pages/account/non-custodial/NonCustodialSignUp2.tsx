import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import MnemonicComboBox from "../../../components/account/MnemonicComboBox";
import MnemonicPad from "../../../components/account/MnemonicPad";
import PassphraseModal from "../../../components/account/PassphraseModal";

import { getAccountList } from "../../../store/AccountListSlice";

import { getMnemonic } from "../../../lib/helper/WalletHelper";

import { IAccountList } from "../../../types/AccountTypes";

import tymt3 from "../../../assets/account/tymt3.png";

const NonCustodialSignUp2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const { password } = location.state || {};
  const [open, setOpen] = useState(false);
  const [length, setLength] = useState<number>(12);
  const [passphrase, setPassphrase] = useState<string>(getMnemonic(12));

  const accountListStore: IAccountList = useSelector(getAccountList);

  useEffect(() => {
    setPassphrase(getMnemonic(length));
  }, [length]);

  const handleBackClick = useCallback(() => {
    accountListStore?.list?.length ? navigate("/non-custodial-login-1") : navigate("/welcome");
  }, [accountListStore]);

  const handleNextClick = useCallback(async () => {
    try {
      if (!passphrase) return;
      // const newRsaPubKey = (await getRsaKeyPair(passphrase))?.publicKey;
      // dispatch(
      //   setTempAccount({
      //     ...tempAccountStore,
      //     mnemonic: passphrase,
      //     publicKey: newRsaPubKey,
      //   })
      // );
      setOpen(true);
    } catch (err) {
      // console.log("Failed to handleNextClick: ", err);
    }
  }, [passphrase]);

  return (
    <>
      <Grid container className="basic-container">
        <Grid item xs={12} container justifyContent={"center"}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              alignSelf: "center",
            }}
          >
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} gap={"64px"}>
              <Stack alignItems={"center"} justifyContent={"center"}>
                <Grid container justifyContent={"center"}>
                  <Grid
                    item
                    container
                    sx={{
                      width: "520px",
                      padding: "10px 0px",
                    }}
                  >
                    <Grid item xs={12} container justifyContent={"space-between"}>
                      <Back onClick={handleBackClick} />
                      <Stepper all={4} now={2} text={t("ncca-12_secure-wallet")} />
                    </Grid>
                    <Grid item xs={12} mt={"80px"}>
                      <AccountHeader title={t("ncca-13_secure-passphrase")} text={t("ncca-14_here-your-mnemonic")} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <MnemonicComboBox text="want" length={length} setLength={setLength} />
                    </Grid>
                    <Grid item xs={12} mt={"24px"}>
                      <MnemonicPad editable={true} length={length} passphrase={passphrase} setPassphrase={setPassphrase} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <AccountNextButton text={t("ncl-6_next")} onClick={handleNextClick} />
                    </Grid>
                  </Grid>
                </Grid>
              </Stack>
              <Box
                component={"img"}
                src={tymt3}
                sx={{
                  height: "calc(100vh - 64px)",
                }}
              />
            </Stack>
          </motion.div>
        </Grid>
      </Grid>
      <PassphraseModal open={open} setOpen={setOpen} passphrase={passphrase} password={password} />
    </>
  );
};

export default NonCustodialSignUp2;
