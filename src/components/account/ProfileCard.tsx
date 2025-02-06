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

export interface IPropsProfileCard {
  account: IAccount;
}

const ProfileCard = ({ account }: IPropsProfileCard) => {
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
          textTransform: "none",
          width: "100%",
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
