import { useTranslation } from "react-i18next";
import { Stack, Box } from "@mui/material";

import ReviewRating from "./ReviewRating";
// import UserAvatar from "./UserAvatar";

import { formatDateAsMMDDYYYY } from "../../lib/helper/DateHelper";

import { IFeedback } from "../../types/GameTypes";

import TimerIcon from "../../assets/wallet/TimerIcon.svg";
import Avatar from "../home/Avatar";

export interface IPropsFeedbackCard {
  feedback: IFeedback;
}

const FeedbackCard = ({ feedback }: IPropsFeedbackCard) => {
  const { t } = useTranslation();
  return (
    <>
      <Stack
        gap={"12px"}
        sx={{
          padding: "16px 24px",
          border: "1px solid #FFFFFF1A",
          borderRadius: "16px",
        }}
      >
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
            <Avatar onlineStatus={feedback?.userOnlineStatus || true} url={feedback?.userAvatar} size={40} status="active" />
            <Box className={"fs-h4 white"}>{feedback?.userNickname ?? t("ga-34_anonymous")}</Box>
          </Stack>
          <Stack direction={"row"} gap={"8px"} alignItems={"center"}>
            <Box component={"img"} src={TimerIcon} width={"12px"} height={"12px"} />
            <Box className={"fs-12-regular light"}>{formatDateAsMMDDYYYY(feedback?.createdAt.toString())}</Box>
          </Stack>
        </Stack>
        <Stack direction={"row"} gap={"16px"} alignItems={"center"}>
          <Stack direction={"row"} gap={"4px"} alignItems={"center"}>
            <ReviewRating value={feedback?.rating} />
            <Box className={"fs-h5 white"}>{feedback?.rating}</Box>
          </Stack>
        </Stack>
        <Box className={"fs-14-regular white"}>{feedback?.text}</Box>
      </Stack>
    </>
  );
};

export default FeedbackCard;
