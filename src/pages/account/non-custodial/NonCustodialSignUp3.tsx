import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import MnemonicRandomPad from "../../../components/account/MnemonicRandomPad";
import MnemonicConfirm from "../../../components/account/MnemonicConfirm";

import { getAccountList } from "../../../store/AccountListSlice";

import { IAccountList } from "../../../types/AccountTypes";

import tymt3 from "../../../assets/account/tymt3.png";

const NonCustodialSignUp3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const { passphrase, password } = location.state || {}; // Destructure the variable

  const [loading, setLoading] = useState<boolean>(false);
  const [confirmedPassphrase, setConfirmedPassphrase] = useState<string[]>(["", "", ""]);
  const [selectedInput, setSelectedInput] = useState<number>(1);

  const accountListStore: IAccountList = useSelector(getAccountList);

  const splitPassphrase = useMemo<string[]>(() => passphrase?.split(" ") ?? [], [passphrase]);
  const passphraseIsConfirmed = useMemo<boolean>(
    () => confirmedPassphrase[0] === splitPassphrase[2] && confirmedPassphrase[1] === splitPassphrase[5] && confirmedPassphrase[2] === splitPassphrase[8],
    [passphrase, confirmedPassphrase]
  );

  const handleBackClick = useCallback(() => {
    accountListStore?.list?.length ? navigate("/non-custodial-login-1") : navigate("/welcome");
  }, [accountListStore]);

  const handleNextClick = useCallback(async () => {
    try {
      setLoading(true);
      navigate("/non-custodial-signup-4/signup", { state: { passphrase: passphrase, password: password } });
      setLoading(false);
    } catch (err) {
      console.error("Failed to handleNextClick: ", err);
      setLoading(false);
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
                      <Stepper all={4} now={3} text={t("ncca-30_confirm-recovery-phrase")} />
                    </Grid>

                    <Grid item xs={12} mt={"80px"}>
                      <AccountHeader title={t("ncca-13_secure-passphrase")} text={t("ncca-14_here-your-mnemonic")} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <MnemonicConfirm confirmedPassphrase={confirmedPassphrase} selectedInput={selectedInput} setSelectedInput={setSelectedInput} />
                    </Grid>
                    <Grid item xs={12} mt={"40px"}>
                      <MnemonicRandomPad
                        passphrase={passphrase}
                        confirmedPassphrase={confirmedPassphrase}
                        setConfirmedPassphrase={setConfirmedPassphrase}
                        selectedInput={selectedInput}
                        setSelectedInput={setSelectedInput}
                      />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <AccountNextButton
                        text={t("ncca-44_verify-and-complete")}
                        disabled={loading || !confirmedPassphrase[0] || !confirmedPassphrase[1] || !confirmedPassphrase[2] || !passphraseIsConfirmed}
                        loading={loading}
                        onClick={handleNextClick}
                      />
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
    </>
  );
};

export default NonCustodialSignUp3;
