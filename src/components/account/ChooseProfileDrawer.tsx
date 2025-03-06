import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { SwipeableDrawer, Box, Stack, IconButton, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import RedStrokeButton from "./RedStrokeButton";
import ProfileCard from "./ProfileCard";

import { getAccountList, setAccountList } from "../../store/AccountListSlice";
import { getAccount, setAccount } from "../../store/AccountSlice";

import { IAccount, IAccountList } from "../../types/AccountTypes";

import closeImg from "../../assets/setting/CollapsCloseBtn.svg";

type Anchor = "right";

interface props {
  view: boolean;
  setView: (param: boolean) => void;
}

const ChooseProfileDrawer = ({ view, setView }: props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accountListStore: IAccountList = useSelector(getAccountList);
  const accountStore: IAccount = useSelector(getAccount);

  const [state, setState] = useState({ right: false });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleAddNewProfileButtonClick = () => {
    navigate("/welcome");
  };

  const handleRemoveAccount = useCallback(
    (account: IAccount) => {
      try {
        const newAccountList = accountListStore?.list?.filter((one) => one?.sxpAddress !== account?.sxpAddress);
        dispatch(setAccountList(newAccountList));
        if (accountStore?.sxpAddress === account?.sxpAddress) {
          if (newAccountList?.length === 0) navigate("/");
          else {
            dispatch(setAccount(newAccountList[0]));
          }
        }
      } catch (err) {
        console.error(err);
      }
    },
    [accountStore, accountListStore]
  );

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
        <Stack direction={"row"} alignItems={"center"} spacing={"16px"} padding={"18px 16px"}>
          <IconButton
            className="icon-button"
            sx={{
              width: "24px",
              height: "24px",
              padding: "4px",
            }}
            onClick={() => setView(false)}
          >
            <ArrowBackOutlinedIcon className="icon-button" />
          </IconButton>
          <Box className="fs-24-regular white">{`Which one do you want to use?`}</Box>
        </Stack>
        <Divider
          sx={{
            backgroundColor: "#FFFFFF1A",
            marginBottom: "24px",
          }}
        />
        <Stack direction={"column"} justifyContent={"space-between"} padding={"0px 16px"} minHeight={"calc(100% - 110px)"}>
          <Stack direction={"column"} gap={"16px"}>
            {accountListStore?.list?.map((one, index) => (
              <ProfileCard account={one} key={index} removeAccount={() => handleRemoveAccount(one)} />
            ))}
          </Stack>
          <Stack mt={"16px"} mb={"16px"}>
            <RedStrokeButton text="Add new profile" onClick={handleAddNewProfileButtonClick} />
          </Stack>
        </Stack>
      </Box>
    </SwipeableDrawer>
  );
};

export default ChooseProfileDrawer;
