import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Stack, Box } from "@mui/material";

import CompleteButton from "./CompleteButton";
// import UserAvatar from "../store/UserAvatar";
import Avatar from "../home/Avatar";

import { getAccount, setAccount } from "../../store/AccountSlice";
import { getAccountList } from "../../store/AccountListSlice";

import { getKeccak256Hash } from "../../lib/helper/EncryptHelper";

import { IAccount, IAccountList } from "../../types/AccountTypes";

import closeIcon from "../../assets/setting/XIcon.svg";

export interface IPropsProfileCard {
  account: IAccount;
  removeAccount: () => void;
}

const ProfileCard = ({ account, removeAccount }: IPropsProfileCard) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accountStore: IAccount = useSelector(getAccount);
  const accountListStore: IAccountList = useSelector(getAccountList);

  const isGuest: boolean = useMemo(() => account?.nickname === "Guest" && account?.password === getKeccak256Hash(""), [account]);

  const handleClick = useCallback(() => {
    if (account?.sxpAddress !== accountStore?.sxpAddress) {
      dispatch(setAccount(account));
      accountListStore?.list?.length ? navigate("/non-custodial-login-1") : navigate("/welcome");
    }
  }, [accountStore, accountListStore]);

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          position: "relative", // Add this to allow absolute positioning
          textTransform: "none",
          // width: "100%",
          border: "1px solid #FFFFFF1A",
          padding: "12px 8px 6px",
          borderRadius: "16px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          background: "#8080801A",
          textAlign: "left",
          "&:hover": {
            background: "#8080804D",
            border: "1px solid #7C7C7C",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "8px",
            right: "8px",
            cursor: "pointer",
            fontSize: "16px",
            color: "#FFFFFF",
            "&:hover": {
              color: "#7C7C7C",
            },
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevents the parent click handler from triggering
            removeAccount(); // Call your close function here
          }}
        >
          <img src={closeIcon} />
        </Box>
        <Stack gap={"8px"} width={"100%"}>
          <Stack direction="row" alignItems="center" gap="12px" width={"100%"}>
            <Avatar url={account?.avatar} size={64} onlineStatus={account?.sxpAddress === accountStore?.sxpAddress} status={"active"} />
            <Stack>
              <Box className={"fs-16-regular white"}>{account?.nickname}</Box>
              <Box className={"fs-14-regular light"}>{`non custodial wallet account`}</Box>
              <Box className={"fs-12-regular blue"}>{account?.sxpAddress}</Box>
            </Stack>
          </Stack>
          <Stack>{isGuest && <CompleteButton account={account} />}</Stack>
        </Stack>
      </Box>
    </>
  );
};

export default ProfileCard;
