import { Button, Box, Stack } from "@mui/material";

import Avatar from "../home/Avatar";
// import UserAvatar from "../store/UserAvatar";

import RightArrow from "../../assets/arrow/ChevronRight.svg";

import { IAccount } from "../../types/AccountTypes";

export interface IPropsChooseProfileButton {
  account: IAccount;
  onClick: () => void;
}

const ChooseProfileButton = ({ account, onClick }: IPropsChooseProfileButton) => {
  return (
    <>
      <Button
        onClick={onClick}
        sx={{
          textTransform: "none",
          width: "100%",
          border: "1px solid #52E1F233",
          padding: "16px 16px",
          borderRadius: "50ch",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "var(--bg-stroke-white-10-stroke-default, #FFFFFF1A)",
            border: "1px solid #ffffff33",
          },
        }}
      >
        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
          <Stack direction="row" alignItems="center" gap="16px">
            <Avatar url={account?.avatar} size={40} onlineStatus={true} status={"active"} />
            <Box className={"fs-18-regular white"}>{account?.nickname}</Box>
          </Stack>
          <Box component={"img"} src={RightArrow} width={"24px"} height={"24px"} />
        </Stack>
      </Button>
    </>
  );
};

export default ChooseProfileButton;
