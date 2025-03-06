import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { Box, Button, Divider, Stack } from "@mui/material";

import { CONST_SUPPORT_CHAINS } from "../../const/ChainConsts";
import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";

import { useNotification } from "../../providers/NotificationProvider";
import ChainBox from "../../components/home/ChainBox";

import { AppDispatch } from "../../store";
import { setCurrentChain } from "../../store/CurrentChainSlice";

import { ISupportChain } from "../../types/ChainTypes";

import backIcon from "../../assets/setting/BackIcon.svg";

export interface IPropsChain {
  view: string;
  setView: (_: string) => void;
}

const Chain = ({ view, setView }: IPropsChain) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { showNotification } = useNotification();

  const handleChainBoxClick = (one: ISupportChain) => {
    try {
      dispatch(setCurrentChain(one?.native?.name));
      handleBackClick();
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.CHAIN_SELECT_SUCCESS, text: one?.native?.name });
    } catch (err) {
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.CHAIN_SELECT_FAIL, text: one?.native?.name });
    }
  };

  const handleBackClick = () => {
    if (view === "chain-wallet") {
      setView("wallet");
    } else {
      setView("main");
    }
  };

  return (
    <>
      {(view === "chain" || view === "chain-wallet") && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={handleBackClick}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-5_choose-chain")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack>
            {CONST_SUPPORT_CHAINS?.map((one, index) => (
              <ChainBox
                supportChain={one}
                key={index}
                onClick={() => {
                  handleChainBoxClick(one);
                }}
              />
            ))}
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Chain;
