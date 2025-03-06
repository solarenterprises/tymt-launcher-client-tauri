import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { Box, SwipeableDrawer, Stack, Button, Divider } from "@mui/material";

import { useNotification } from "../../providers/NotificationProvider";
import ChainBox from "../home/ChainBox";

import { CONST_SUPPORT_CHAINS } from "../../const/ChainConsts";

import { setCurrentChain } from "../../store/CurrentChainSlice";

import { ISupportChain } from "../../types/ChainTypes";

import closeImg from "../../assets/setting/CollapsCloseBtn.svg";
import backIcon from "../../assets/setting/BackIcon.svg";
import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";

type Anchor = "right";

export interface IPropsChooseChainDrawer {
  view: boolean;
  setView: (param: boolean) => void;
}

const ChooseChainDrawer = ({ view, setView }: IPropsChooseChainDrawer) => {
  // const classname = SettingStyle();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { showNotification } = useNotification();

  const [state, setState] = useState({ right: false });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleChainBoxClick = (one: ISupportChain) => {
    try {
      dispatch(setCurrentChain(one?.native?.name));
      setView(false);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.CHAIN_SELECT_SUCCESS, text: one?.native?.name });
    } catch (err) {
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.CHAIN_SELECT_FAIL, text: one?.native?.name });
    }
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={view}
      onClose={() => setView(false)}
      onOpen={toggleDrawer("right", true)}
      slotProps={{
        backdrop: {
          onClick: toggleDrawer("right", false),
        },
      }}
      sx={{
        "& .MuiPaper-root": {
          height: "98% !important",
          minWidth: "550px",
          display: "flex",
          borderRadius: "32px",
          backgroundColor: "#8080804D !important",
          backgroundBlendMode: "luminosity",
          backdropFilter: "blur(4px)",
          margin: "10px",
          position: "fixed",
          flexDirection: "row", // No need for "&.MuiPaper-root" here
        },
        "& .MuiBox-root": {
          overflow: "auto", // Enable scrolling
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari
          },
        },
      }}
    >
      <Box sx={{ width: "45px", height: "100%", position: "relative" }}>
        <img src={closeImg} style={{ cursor: "pointer", position: "absolute", bottom: "40px" }} onClick={() => setView(false)} />
      </Box>
      <Box
        sx={{
          maxWidth: "505px",
          width: "100%",
          height: "100%",
          overflow: "scroll",
          borderRadius: "24px",
          backgroundColor: "#071516",
          whiteSpace: "nowrap",
          overFlowX: "auth",
          scrollbarWidth: "none",
          position: "relative",
        }}
      >
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView(false)}>
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
      </Box>
    </SwipeableDrawer>
  );
};

export default ChooseChainDrawer;
