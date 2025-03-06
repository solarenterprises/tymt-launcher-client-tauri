import { useState } from "react";
import { useTranslation } from "react-i18next";
// import { useSelector } from "react-redux";

import { SwipeableDrawer, Box, Stack, Button, Divider, IconButton } from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import closeImg from "../../assets/setting/CollapsCloseBtn.svg";

// import { selectAddress } from "../../features/settings/AddressSlice";

type Anchor = "right";

interface props {
  view: boolean;
  setView: (param: boolean) => void;
  setAddress: (address: string) => void;
}

const AddressBookDrawer = ({ view, setView, setAddress }: props) => {
  const { t } = useTranslation();
  // const addressData = useSelector(selectAddress);
  const addressData = [
    {
      name: "test",
      address: "test",
    },
  ];

  const [state, setState] = useState({ right: false });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <SwipeableDrawer
      key={`address-book-drawer`}
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
      <Box sx={{ width: "45px", height: "100%", position: "relative" }} key={`address-book-drawer-collapse-pan`}>
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
        key={`address-book-drawer-setting-pan`}
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
          <Box className="fs-24-bold white">{t("set-32_address-book")}</Box>
        </Stack>
        <Divider
          sx={{
            backgroundColor: "#FFFFFF1A",
          }}
        />
        {addressData.map((data, index) => (
          <div key={`address-contact-${index}`}>
            <Button
              fullWidth
              sx={{
                textTransform: "none",
              }}
              onClick={() => {
                setAddress(data.address);
                setView(false);
              }}
              key={`address-book-drawer-data-${index}`}
            >
              <Stack padding={"16px"} width={"100%"}>
                <Box className="fs-18-regular white t-left">{data.name}</Box>
                <Box className="fs-14-regular light t-left">{data.address}</Box>
              </Stack>
            </Button>
            <Divider
              sx={{
                backgroundColor: "#FFFFFF1A",
              }}
            />
          </div>
        ))}
      </Box>
    </SwipeableDrawer>
  );
};

export default AddressBookDrawer;
