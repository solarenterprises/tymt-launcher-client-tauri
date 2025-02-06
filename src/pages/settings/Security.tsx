import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Box, Button, Divider, Stack } from "@mui/material";

import ComingModal from "../../components/modal/ComingModal";

import { getAccount } from "../../store/AccountSlice";

import { getKeccak256Hash } from "../../lib/helper/EncryptHelper";

import { IAccount } from "../../types/AccountTypes";

import backIcon from "../../assets/setting/BackIcon.svg";
import arrowImg from "../../assets/setting/ArrowRight.svg";

export interface IPropsSecurity {
  view: string;
  setView: (_: string) => void;
}

const Security = ({ view, setView }: IPropsSecurity) => {
  const { t } = useTranslation();

  const accountStore: IAccount = useSelector(getAccount);

  const isGuest = useMemo(() => accountStore?.nickname === "Guest" && accountStore?.password === getKeccak256Hash(""), [accountStore]);

  const [coming, setComing] = useState<boolean>(false);

  const handleBackupClick = () => {
    if (isGuest) {
      return;
    }
    setView("backup");
  };

  return (
    <>
      {view === "security" && (
        <Stack direction={"column"}>
          <input type="file" id="file-input" style={{ display: "none" }} />
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("general")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-14_security-privacy")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            <Button className="common-btn" sx={{ padding: "20px" }} onClick={() => setView("password")}>
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className="fs-h4 white">{t("set-71_change-password")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button className="common-btn" sx={{ padding: "20px" }} onClick={handleBackupClick}>
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className="fs-h4 white">{t("set-89_backup-passphrase")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
          </Stack>
          <ComingModal open={coming} setOpen={setComing} />
        </Stack>
      )}
    </>
  );
};

export default Security;
