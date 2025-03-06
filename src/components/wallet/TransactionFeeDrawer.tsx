import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { SwipeableDrawer, Box, Stack, IconButton, Divider, TextField, InputAdornment } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { useWallet } from "../../providers/WalletProvider";

import FeeSwitchButton from "../home/FeeSwitchButton";

import closeImg from "../../assets/setting/CollapsCloseBtn.svg";

type Anchor = "right";

interface props {
  view: boolean;
  setView: (param: boolean) => void;
}

const TransactionFeeDrawer = ({ view, setView }: props) => {
  const { t } = useTranslation();
  const { sxpFee, currentSupportChain, setSxpFeeAsInput } = useWallet();

  const [state, setState] = useState({ right: false });
  const [displaySxpFee, setDisplaySxpFee] = useState<string>(sxpFee.toString());

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    setDisplaySxpFee(sxpFee.toString());
  }, [sxpFee]);

  return (
    <SwipeableDrawer
      key={`transaction-fee-drawer`}
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
          overFlowX: "auto",
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
          <Box className="fs-24-bold white">{t("set-55_transaction-fee")}</Box>
        </Stack>
        <Divider
          sx={{
            backgroundColor: "#FFFFFF1A",
            marginBottom: "24px",
          }}
        />
        <Stack direction={"column"} justifyContent={"space-between"}>
          <Stack direction={"column"}>
            <Box className="center-align" padding={"30px 10px 10px 30px"}>
              <FeeSwitchButton />
            </Box>
            <Box className="center-align" padding={"10px 32px"}>
              <TextField
                type="text"
                id="outlined-adornment-weight"
                placeholder="0.0"
                InputProps={{
                  inputMode: "numeric",
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{
                        "& .MuiBox-root": { color: "white" },
                        "& .MuiTypography-root": { color: "white" },
                      }}
                    >
                      {currentSupportChain?.native?.symbol}
                    </InputAdornment>
                  ),
                }}
                value={displaySxpFee}
                onChange={(e) => {
                  setDisplaySxpFee(e.target.value);
                }}
                onBlur={() => {
                  setSxpFeeAsInput(parseFloat(displaySxpFee));
                }}
                sx={{
                  width: "100%",
                  textAlign: "right",
                  height: "58px",
                  borderRadius: "16px",
                  border: "1px solid #FFFFFF1A",
                  background: "#8080801A",
                  backgroundBlendMode: "luminosity",
                  color: "white",
                  boxShadow: "none",
                  "& .MuiInputBase-input": {
                    font: "unset",
                    color: "white",
                    fontFamily: "Cobe",
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "24px",
                    letterSpacing: "-0.36px",
                    padding: "0px 3px 5px  5px",
                    border: "none",
                    background: "none",
                  },
                  "& .MuiInputBase-root": {
                    font: "unset",
                    height: "58px",
                    borderRadius: "16px",
                    border: "1px solid #FFFFFF1A",
                    background: "#8080801A",
                    backgroundBlendMode: "luminosity",
                    fontFamily: "Cobe",
                    color: "var(--Basic-Light, #AFAFAF)",
                  },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFFFFF33",
                    borderWidth: "3px",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFFFFF33",
                    borderWidth: "3px",
                  },
                }}
              />
            </Box>
            <Box
              className="fs-14-light white"
              sx={{
                whiteSpace: "normal",
                padding: "0px 32px",
              }}
            >
              {t("set-56_transaction-detail")}
            </Box>
          </Stack>
        </Stack>
      </Box>
    </SwipeableDrawer>
  );
};

export default TransactionFeeDrawer;
