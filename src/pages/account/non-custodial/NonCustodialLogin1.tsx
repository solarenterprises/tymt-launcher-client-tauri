import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { Grid, Box, Stack, Divider } from "@mui/material";

import AccountHeader from "../../../components/account/AccountHeader";
import AuthIconButtons from "../../../components/account/AuthIconButtons";
import ChooseProfileButton from "../../../components/account/ChooseProfileButton";
import ChooseProfileDrawer from "../../../components/account/ChooseProfileDrawer";
import LoginAccountForm from "../../../components/account/LoginAccountForm";
import DontHaveAccount from "../../../components/account/DontHaveAccount";
import OrLine from "../../../components/account/OrLine";

import { getAccount, setAccount } from "../../../store/AccountSlice";

import { IAccount, IAccountList } from "../../../types/AccountTypes";

import tymt1 from "../../../assets/account/tymt1.png";
import { getAccountList } from "../../../store/AccountListSlice";

const NonCustodialLogin1 = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const accountStore: IAccount = useSelector(getAccount);
  const accountListStore: IAccountList = useSelector(getAccountList);

  const [drawer, setDrawer] = useState<boolean>(false);

  useEffect(() => {
    if (!accountStore?.nickname) {
      dispatch(setAccount(accountListStore?.list[0]));
    }
  }, [accountStore?.nickname, accountListStore]);

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
                    <Grid item xs={12}>
                      <AccountHeader title={t("ncca-63_hello")} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <ChooseProfileButton account={accountStore} onClick={() => setDrawer(true)} />
                    </Grid>
                    <Grid item xs={12} mt={"32px"}>
                      <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
                    </Grid>
                    <Grid item xs={12} mt={"32px"}>
                      <LoginAccountForm />
                    </Grid>
                    <Grid item xs={12} mt={"32px"}>
                      <OrLine />
                    </Grid>
                    <Grid item xs={12} mt={"16px"}>
                      <AuthIconButtons />
                    </Grid>
                    <Grid item xs={12} mt={"64px"}>
                      <DontHaveAccount />
                    </Grid>
                  </Grid>
                </Grid>
              </Stack>
              <Box
                component={"img"}
                src={tymt1}
                sx={{
                  height: "calc(100vh - 64px)",
                }}
              />
            </Stack>
          </motion.div>
        </Grid>
      </Grid>
      <ChooseProfileDrawer view={drawer} setView={setDrawer} />
    </>
  );
};

export default NonCustodialLogin1;
