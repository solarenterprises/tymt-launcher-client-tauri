import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Snackbar, Stack, Box } from "@mui/material";
import Slide from "@mui/material/Slide";

import { INotificationContent } from "../../types/NotificationTypes";

import FailedIcon from "../../assets/alert/FailedIcon.svg";
import SuccessIcon from "../../assets/alert/SuccessIcon.svg";
import WarningIcon from "../../assets/alert/WarningIcon.svg";
import AlertIcon from "../../assets/alert/AlertIcon.png";
import CloseIcon from "../../assets/setting/XIcon.svg";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export interface IPropsPushNotification {
  content: INotificationContent;
  text: string;
  link: string;
  open: boolean;
  setOpen: (_: boolean) => void;
}

const PushNotification = ({ content, text, link, open, setOpen }: IPropsPushNotification) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [border, setBorder] = useState("");
  const [bg, setBg] = useState("");
  const [logo, setLogo] = useState<any>();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (content && open) {
      timer = setTimeout(() => {
        setOpen(false);
      }, content?.duration);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [open, content?.duration]);

  useEffect(() => {
    if (content?.status === "failed") {
      setLogo(FailedIcon);
      setBorder("#5A3937");
      setBg("#5A39374D");
    }
    if (content?.status === "success") {
      setLogo(SuccessIcon);
      setBorder("#45583A");
      setBg("#45583A4D");
    }
    if (content?.status === "warning") {
      setLogo(WarningIcon);
      setBorder("#564E35");
      setBg("#564E354D");
    }
    if (content?.status === "alert") {
      setLogo(AlertIcon);
      setBorder("#485B61");
      setBg("#485B614D");
    }
  }, [content?.status]);

  return (
    <>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={SlideTransition}
        sx={{
          maxWidth: "800px",
          zIndex: 5000,
          cursor: "pointer",
          transition: "transform 0.3s",
          "&:active": {
            transform: "scale(0.9)",
          },
        }}
        onClick={() => {
          if (link) navigate(link);
          else if (content?.link) navigate(content?.link);
        }}
      >
        <Stack
          direction={"column"}
          sx={{
            border: `2px solid ${border}`,
            backdropFilter: "blur(4px)",
            background: bg,
            padding: "12px 16px 12px 16px",
            borderRadius: "24px",
            gap: "15px",
          }}
        >
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Stack direction={"row"} gap={"12px"} alignItems={"center"}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <img src={logo} />
              </Box>

              <Stack direction={"column"} gap={"8px"}>
                <Box className={"fs-h4 white"}>{t(content?.title)}</Box>
                <Box className={"fs-16-regular white"}>{text ?? t(content?.text)}</Box>
              </Stack>
            </Stack>
            <Box onClick={() => setOpen(false)}>
              <img src={CloseIcon} />
            </Box>
          </Stack>
        </Stack>
      </Snackbar>
    </>
  );
};
export default PushNotification;
