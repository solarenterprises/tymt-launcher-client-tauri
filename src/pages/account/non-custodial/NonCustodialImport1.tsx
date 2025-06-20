import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// import "../../../global.css";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import Stepper from "../../../components/account/Stepper";
import CreateAccountForm from "../../../components/account/CreateAccountForm";

import { getAccountList } from "../../../store/AccountListSlice";

import { IAccountList } from "../../../types/AccountTypes";

import tymt3 from "../../../assets/account/tymt3.png";

export interface ILocationStateNonCustodialImport1 {
  passphrase: string;
}


const NonCustodialImport1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mode } = useParams();

  const { passphrase } = (location.state as ILocationStateNonCustodialImport1) || {};

  const accountListStore: IAccountList = useSelector(getAccountList);

  const handleBackClick = useCallback(() => {
    accountListStore?.list?.length ? navigate("/non-custodial-login-1") : navigate("/welcome");
  }, [accountListStore]);

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
                      <Stepper all={2} now={2} text={t("ncl-11_secure-passphrase")} />
                    </Grid>

                    <Grid item xs={12} mt={"80px"}>
                      <AccountHeader title={t("ncca-65_hello-again")} text={t("ncl-12_type-your-mnemonic")} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <CreateAccountForm
                        title={t("ncca-3_password")}
                        passwordLabel="Create password"
                        confirmPasswordLabel={t("ncca-5_repeat-password")}
                        buttonText={t("ncl-6_next")}
                        showTerms={false}
                        onSubmit={(values) => {
                          navigate(`/non-custodial-signup-4/${mode === "guest" ? "guest" : "signup"}`, {
                            state: { passphrase: passphrase, password: values.password }
                          });
                        }}
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

export default NonCustodialImport1;
