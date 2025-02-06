import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { Box, SwipeableDrawer, Stack, Button, Divider } from "@mui/material";

import ChainBox from "../home/ChainBox";

import { CONST_SUPPORT_CHAINS } from "../../const/ChainConsts";

import { setCurrentChain } from "../../store/CurrentChainSlice";

import { ISupportChain } from "../../types/ChainTypes";

import SettingStyle from "../../styles/SettingStyle";

import closeImg from "../../assets/setting/CollapsCloseBtn.svg";
import backIcon from "../../assets/setting/BackIcon.svg";

type Anchor = "right";

export interface IPropsChooseChainDrawer {
  view: boolean;
  setView: (param: boolean) => void;
}

const ChooseChainDrawer = ({ view, setView }: IPropsChooseChainDrawer) => {
  const classname = SettingStyle();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [state, setState] = useState({ right: false });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleChainBoxClick = (one: ISupportChain) => {
    dispatch(setCurrentChain(one?.native?.name));
    setView(false);
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={view}
      onClose={() => setView(false)}
      onOpen={toggleDrawer("right", true)}
      classes={{ paper: classname.setting_container }}
      slotProps={{
        backdrop: {
          onClick: toggleDrawer("right", false),
        },
      }}
      sx={{
        "& .MuiBox-root": {
          overflow: "auto", // Enable scrolling
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari
          },
        },
      }}
    >
      <Box className={classname.collaps_pan}>
        <img src={closeImg} className={classname.close_icon} onClick={() => setView(false)} />
      </Box>
      <Box className={classname.setting_pan}>
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
