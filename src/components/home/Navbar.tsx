import { useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import { openLink } from "../../lib/helper/TauriHelper";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Grid, Button, TextField, InputAdornment, Stack, Box } from "@mui/material";

import { useWallet } from "../../providers/WalletProvider";

// import MetamaskButton from "./MetamaskButton";
import Avatar from "./Avatar";
import Back from "./Back";
import TooltipComponent from "./TooltipComponent";
import Settings from "../../pages/settings";
import ComingModal from "../modal/ComingModal";
import CardModal from "../modal/CardModal";

import { getAccount } from "../../store/AccountSlice";
import { getNotificationSetting } from "../../store/NotificationSettingSlice";
import { getCurrentLogo } from "../../store/tymtLogoSlice";

import { IAccount } from "../../types/AccountTypes";
import { INotificationSetting } from "../../types/SettingTypes";
import { tymtLogoType } from "../../types/HomeTypes";

import newlogo from "../../assets/main/NewLogo.png";
import newlogohead from "../../assets/main/NewLogoHead.png";
import searchlg from "../../assets/main/SearchLg.svg";
import { useConstVar } from "../../providers/ConstVarProvider";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5733",
    },
    secondary: {
      main: "#9e9e9e",
      light: "#F5EBFF",
      contrastText: "#47008F",
    },
  },
});

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { constTymtLinks } = useConstVar();
  const { currentChainWalletAddress } = useWallet();

  const currentlogo: tymtLogoType = useSelector(getCurrentLogo);
  const accountStore: IAccount = useSelector(getAccount);
  const notificationSettingStore: INotificationSetting = useSelector(getNotificationSetting);

  const [showSetting, setShowSetting] = useState(false);
  // const [showAlert, setShowAlert] = useState(false);
  const [value, setValue] = useState<string>("");
  const [cardModalOpen, setCardModalOpen] = useState<boolean>(false);
  const [coming, setComing] = useState<boolean>(false);

  const handleChange = useCallback(
    (value: string) => {
      navigate(`/store?key=${value}`);
    },
    [setValue, navigate]
  );

  const debouncedChangeHandler = useCallback(debounce(handleChange, 1000), [handleChange]);

  const setView = useCallback(
    (view: boolean) => {
      setShowSetting(view);
    },
    [showSetting]
  );

  const handleCardEnter = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "white");
  };
  const handleCardLeave = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "#AFAFAF");
  };
  const handleWalletEnter = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "white");
  };
  const handleWalletLeave = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "#AFAFAF");
  };
  const handleAlarmEnter = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "white");
  };
  const handleAlarmLeave = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("stroke", "#AFAFAF");
  };

  return (
    <>
      <Grid item width={"95%"} className="navbar" container sx={{ backdropFilter: "blur(30px)" }}>
        {currentlogo.isDrawerExpanded === true && (
          <img src={newlogo} alt={"tymtlogo-1"} loading="lazy" style={{ cursor: "pointer" }} onClick={() => navigate("/home")} />
        )}
        {currentlogo.isDrawerExpanded === false && (
          <img src={newlogohead} alt={"tymtlogo-2"} loading="lazy" style={{ cursor: "pointer" }} onClick={() => navigate("/home")} />
        )}

        <Stack flexDirection={"row"} alignItems={"center"} sx={{ position: "fixed", left: "20%" }}>
          {location.pathname.indexOf("home") === -1 && (
            <Back
              onClick={() => {
                navigate(-1);
              }}
            />
          )}
          <ThemeProvider theme={theme}>
            <TextField
              // disabled
              className="searchbar"
              color="secondary"
              placeholder={t("hom-4_search")}
              value={value}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={searchlg} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {value !== "" && (
                      <Button
                        className={"clear_filter"}
                        onClick={() => {
                          setValue("");
                          navigate(`/store`);
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 7L7 17M7 7L17 17" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Button>
                    )}
                  </InputAdornment>
                ),
                style: { color: "#FFFFFF" },
              }}
              onChange={(e) => {
                if (setValue) setValue(e.target.value);
                debouncedChangeHandler(e.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  navigate(`/store?key=${value}`);
                }
              }}
            />
          </ThemeProvider>
        </Stack>
        <Grid item className="button_group">
          <TooltipComponent placement="top" text={t("tol-8_solar-card")}>
            <Button
              className="button_navbar_common"
              onClick={() => {
                // setCardModalOpen(true);
                openLink(constTymtLinks?.solarcard);
              }}
            >
              <svg
                onMouseEnter={handleCardEnter}
                onMouseLeave={handleCardLeave}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 10H2M2 8.2L2 15.8C2 16.9201 2 17.4802 2.21799 17.908C2.40973 18.2843 2.71569 18.5903 3.09202 18.782C3.51984 19 4.07989 19 5.2 19L18.8 19C19.9201 19 20.4802 19 20.908 18.782C21.2843 18.5903 21.5903 18.2843 21.782 17.908C22 17.4802 22 16.9201 22 15.8V8.2C22 7.0799 22 6.51984 21.782 6.09202C21.5903 5.7157 21.2843 5.40974 20.908 5.21799C20.4802 5 19.9201 5 18.8 5L5.2 5C4.0799 5 3.51984 5 3.09202 5.21799C2.7157 5.40973 2.40973 5.71569 2.21799 6.09202C2 6.51984 2 7.07989 2 8.2Z"
                  stroke="#AFAFAF"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </TooltipComponent>
          <TooltipComponent placement="top" text={t("tol-1_wallet")}>
            <Button
              className="button_navbar_common"
              onClick={async () => {
                navigate("/wallet");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="20"
                viewBox="0 0 24 20"
                fill="none"
                onMouseEnter={handleWalletEnter}
                onMouseLeave={handleWalletLeave}
              >
                <path
                  d="M0.859375 2.4V17.6C0.859375 18.1039 1.06093 18.5872 1.41969 18.9435C1.77846 19.2998 2.26505 19.5 2.77242 19.5H21.9029C22.1565 19.5 22.3998 19.3999 22.5792 19.2218C22.7586 19.0436 22.8594 18.802 22.8594 18.55V5.25C22.8594 4.99804 22.7586 4.75641 22.5792 4.57825C22.3998 4.40009 22.1565 4.3 21.9029 4.3H2.77242C2.26505 4.3 1.77846 4.09982 1.41969 3.7435C1.06093 3.38718 0.859375 2.90391 0.859375 2.4ZM0.859375 2.4C0.859375 1.89609 1.06093 1.41282 1.41969 1.0565C1.77846 0.700178 2.26505 0.5 2.77242 0.5H19.0333"
                  stroke="#AFAFAF"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.3594 13.5C18.1878 13.5 18.8594 12.8284 18.8594 12C18.8594 11.1716 18.1878 10.5 17.3594 10.5C16.5309 10.5 15.8594 11.1716 15.8594 12C15.8594 12.8284 16.5309 13.5 17.3594 13.5Z"
                  fill="#AFAFAF"
                />
              </svg>
            </Button>
          </TooltipComponent>
          <TooltipComponent placement="top" text={t("tol-2_alert")}>
            <Button
              className="button_navbar_common"
              sx={{ position: "relative" }}
              onClick={() => {
                // setShowAlert(!showAlert);
                setComing(true);
              }}
            >
              {/* {alertListStore.unread.length > 0 && <span className={"notification_dot"}></span>} */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                onMouseEnter={handleAlarmEnter}
                onMouseLeave={handleAlarmLeave}
              >
                <path
                  d="M14.0008 21H10.0008M18.0008 8C18.0008 6.4087 17.3686 4.88258 16.2434 3.75736C15.1182 2.63214 13.5921 2 12.0008 2C10.4095 2 8.88333 2.63214 7.75811 3.75736C6.63289 4.88258 6.00075 6.4087 6.00075 8C6.00075 11.0902 5.22122 13.206 4.35042 14.6054C3.61588 15.7859 3.24861 16.3761 3.26208 16.5408C3.27699 16.7231 3.31561 16.7926 3.46253 16.9016C3.59521 17 4.19334 17 5.38961 17H18.6119C19.8082 17 20.4063 17 20.539 16.9016C20.6859 16.7926 20.7245 16.7231 20.7394 16.5408C20.7529 16.3761 20.3856 15.7859 19.6511 14.6054C18.7803 13.206 18.0008 11.0902 18.0008 8Z"
                  stroke="#AFAFAF"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </TooltipComponent>
          {/* <MetamaskButton /> */}
          <Button className="button_navbar_profile" onClick={() => setShowSetting(!showSetting)}>
            <Stack direction={"row"} alignItems={"center"} marginLeft={"0px"} justifyContent={"left"} spacing={"8px"} height={"32px"}>
              <Avatar url={accountStore?.avatar} size={32} isChain={true} onlineStatus={true} status={notificationSettingStore?.status} />
              <Stack direction={"column"} width={"110px"} alignItems={"flex-start"}>
                <Box className={"fs-16-regular white"}>
                  {accountStore?.nickname?.length > 11 ? `${accountStore?.nickname?.substring(0, 10)}...` : accountStore?.nickname}
                </Box>
                <Box className={"fs-14-regular light"}>{`${currentChainWalletAddress?.substring(0, 5)}...${currentChainWalletAddress?.substring(
                  currentChainWalletAddress?.length - 4
                )}`}</Box>
              </Stack>
            </Stack>
          </Button>
        </Grid>
        <Settings view={showSetting} setView={setView} />
      </Grid>
      <ComingModal open={coming} setOpen={setComing} />
      <CardModal open={cardModalOpen} setOpen={setCardModalOpen} />
    </>
  );
};

export default Navbar;
