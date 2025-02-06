import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { CONFIG_TYMT_BACKEND_URL } from "../../config/MainConfig";

import { Tooltip, Stack, Box } from "@mui/material";

import { getCurrentChain } from "../../store/CurrentChainSlice";

import { getSupportChainByName } from "../../lib/helper/WalletHelper";

import { ICurrentChain } from "../../types/ChainTypes";

import onlineframe from "../../assets/chat/OnlineFrame.svg";
import offlineframe from "../../assets/chat/OfflineFrame.svg";
import donotdisturbframe from "../../assets/chat/DoNotDisturbFrame.svg";
import mask from "../../assets/account/Mask.png";
import accountIcon from "../../assets/wallet/Account.svg";

export interface IPropsAvatar {
  url: string;
  size: number;
  onlineStatus: boolean;
  status: string;
  isChain?: boolean;
  userid?: string;
}

const Avatar = ({ size, url, onlineStatus, isChain, status }: IPropsAvatar) => {
  const { t } = useTranslation();

  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);
  const currentSupportChain = useMemo(() => getSupportChainByName(currentChainStore?.chain), [currentChainStore]);

  // const [user, setUser] = useState<ICurrentChatroomMember>();

  // useEffect(() => {
  //   if (userid) {
  //     const init = async () => {
  //       const res = await UserAPI.getUserById(userid);
  //       if (!res?.data?.result?.data) {
  //         return;
  //       }
  //       setUser(res?.data?.result?.data);
  //     };
  //     init();
  //   }
  // }, [userid]);

  return (
    <>
      <Tooltip
        placement="bottom-start"
        title={
          <Stack
            spacing={"10px"}
            sx={{
              left: "10px",
              backgroundColor: "rgb(49, 53, 53)",
              padding: "6px 8px",
              borderRadius: "32px",
              border: "1px solid rgb(71, 76, 76)",
            }}
          >
            <Box className="fs-16-regular white">
              {onlineStatus && status === "active"
                ? t("tol-4_online")
                : onlineStatus && status === "do-not-disturb"
                ? t("tol-6_donotdisturb")
                : onlineStatus && status === undefined
                ? t("tol-4_online")
                : t("tol-5_offline")}
            </Box>
          </Stack>
        }
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -10],
              },
            },
          ],
          sx: {
            [`& .MuiTooltip-tooltip`]: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          },
        }}
      >
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            position: "relative",
            display: "inline-block",
            border: "transparent",
          }}
        >
          {onlineStatus === false && (
            <img
              src={offlineframe}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 5,
                overflow: "hidden",
              }}
            />
          )}
          {onlineStatus === true && (
            <img
              src={status === "do-not-disturb" ? donotdisturbframe : onlineframe}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 5,
                overflow: "hidden",
              }}
            />
          )}
          {isChain && (
            <img
              src={currentSupportChain?.native?.logo}
              style={{
                position: "absolute",
                width: "18px",
                top: "75%",
                left: "75%",
                transform: "translate(-50%, -50%)",
                zIndex: 7,
              }}
            />
          )}
          <Box
            component={"img"}
            src={`${CONFIG_TYMT_BACKEND_URL}${url}`}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              borderColor: "transparent",
              maskImage: `url(${mask})`,
              maskPosition: "center",
              maskSize: "cover",
              zIndex: 1,
              opacity: 0.9,
              transition: "all 0.5s",
            }}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = accountIcon;
            }}
          />
        </div>
      </Tooltip>
    </>
  );
};

export default Avatar;
