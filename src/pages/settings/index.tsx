import { useState } from "react";

import { Box, SwipeableDrawer } from "@mui/material";

import Main from "./Main";
import Chain from "./Chain";
import General from "./General";
import Language from "./Language";
import Message from "./Message";
import Friend from "./Friend";
import Wallet from "./Wallet";
import Currency from "./Currency";
import Notification from "./Notification";
import Hour from "./Hour";
import About from "./About";
import Fee from "./Fee";
import Profile from "./Profile";
import Security from "./Security";
import Password from "./Password";
import Address from "./Address";
import Backup from "./Backup";
import ChooseProfile from "./ChooseProfile";

import closeImg from "../../assets/setting/CollapsCloseBtn.svg";

type Anchor = "right";

export interface IPropsSettings {
  view: boolean;
  setView: (_: boolean) => void;
}

const Settings = ({ view, setView }: IPropsSettings) => {
  const [state, setState] = useState({ right: false });
  const [panel, setPanel] = useState("main");

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={view}
      // onClose={toggleDrawer("right", false)}
      onClose={() => setView(false)}
      onOpen={toggleDrawer("right", true)}
      // classes={{ paper: classname.setting_container }}
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
          overFlowX: "auto",
          scrollbarWidth: "none",
          position: "relative",
        }}
      >
        <Main view={panel} setView={setPanel} />
        <Chain view={panel} setView={setPanel} />
        <General view={panel} setView={setPanel} />
        <Language view={panel} setView={setPanel} />
        <Message view={panel} setView={setPanel} />
        <Friend view={panel} setView={setPanel} />
        <Wallet view={panel} setView={setPanel} />
        <Currency view={panel} setView={setPanel} />
        <Notification view={panel} setView={setPanel} />
        <Hour view={panel} setView={setPanel} />
        <About view={panel} setView={setPanel} />
        <Fee view={panel} setView={setPanel} />
        <Profile view={panel} setView={setPanel} />
        <Security view={panel} setView={setPanel} />
        <Password view={panel} setView={setPanel} />
        <Address view={panel} setView={setPanel} />
        <Backup view={panel} setView={setPanel} />
        <ChooseProfile view={panel} setView={setPanel} />
      </Box>
    </SwipeableDrawer>
  );
};

export default Settings;
