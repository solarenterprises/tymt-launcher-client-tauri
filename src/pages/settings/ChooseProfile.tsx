import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, Stack, Divider, IconButton } from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import RedStrokeButton from "../../components/account/RedStrokeButton";
import ProfileCard from "../../components/account/ProfileCard";

import { getAccount } from "../../store/AccountSlice";
import { getAccountList, setAccountList } from "../../store/AccountListSlice";

import { IAccount, IAccountList } from "../../types/AccountTypes";
import { setAuth } from "../../store/AuthSlice";

export interface IPropsChooseProfile {
  view: string;
  setView: (_: string) => void;
}

const ChooseProfile = ({ view, setView }: IPropsChooseProfile) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accountStore: IAccount = useSelector(getAccount);
  const accountListStore: IAccountList = useSelector(getAccountList);

  const handleAddNewProfileButtonClick = () => {
    navigate("/non-custodial-login-2");
  };

  const handleLogout = useCallback(() => {
    dispatch(
      setAuth({
        isLoggedIn: false,
        accessToken: "",
        refreshToken: "",
      })
    );
  }, [accountListStore]);

  const handleRemoveAccount = useCallback(
    (account: IAccount) => {
      try {
        const newAccountList = accountListStore?.list?.filter((one) => one?.sxpAddress !== account?.sxpAddress);
        dispatch(setAccountList(newAccountList));
        if (accountStore?.sxpAddress === account?.sxpAddress) {
          handleLogout();
          navigate("/");
        }
      } catch (err) {
        console.error(err);
      }
    },
    [accountStore, accountListStore, handleLogout]
  );

  return (
    view === "chooseProfile" && (
      <>
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
              onClick={() => setView("main")}
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
      </>
    )
  );
};

export default ChooseProfile;
