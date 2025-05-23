import { useTranslation } from "react-i18next";
import { Box, Button, Divider, Stack } from "@mui/material";
import { CONST_TYMT_LINKS } from "../../const/tymtConsts";
import { openLink } from "../../lib/helper/TauriHelper";
import TooltipComponent from "../../components/home/TooltipComponent";
import backIcon from "../../assets/setting/BackIcon.svg";
import followLink from "../../assets/setting/FollowLink.svg";
import followX from "../../assets/setting/FollowX.svg";
import followDiscord from "../../assets/setting/FollowDiscord.svg";
import followTelegram from "../../assets/setting/FollowTelegram.svg";
import followMedium from "../../assets/setting/FollowMedium.svg";
import followInstagram from "../../assets/setting/FollowInstagram.svg";
import followFacebook from "../../assets/setting/FollowFacebook.svg";
import externalIcon from "../../assets/setting/ExternalIcon.svg";

export interface IPropsAbout {
  view: string;
  setView: (_: string) => void;
}

const linkButtons = [
  {
    key: "documentation",
    labelKey: "set-51_documentation",
    url: CONST_TYMT_LINKS.documentation,
  },
  {
    key: "policy",
    labelKey: "set-52_privacy-policy",
    url: CONST_TYMT_LINKS.policy,
  },
];

const socialLinks = [
  { key: "website", icon: followLink, url: CONST_TYMT_LINKS.website },
  {
    key: "twitter",
    icon: followX,
    url: CONST_TYMT_LINKS.twitter,
  },
  {
    key: "discord",
    icon: followDiscord,
    url: CONST_TYMT_LINKS.discord,
  },
  {
    key: "telegram",
    icon: followTelegram,
    url: CONST_TYMT_LINKS.telegram,
  },
  {
    key: "medium",
    icon: followMedium,
    url: CONST_TYMT_LINKS.medium,
  },
  {
    key: "instagram",
    icon: followInstagram,
    url: CONST_TYMT_LINKS.instagram,
  },
  {
    key: "facebook",
    icon: followFacebook,
    url: CONST_TYMT_LINKS.facebook,
  },
];

const About = ({ view, setView }: IPropsAbout) => {
  const { t } = useTranslation();

  if (view !== "about") return null;

  return (
    <Stack direction="column">
      <Stack flexDirection="row" justifyContent="flex-start" gap="10px" alignItems="center" textAlign="center" className="p-20">
        <Button className="setting-back-button" onClick={() => setView("general")}>
          <Box component="img" src={backIcon} />
        </Button>
        <Box className="fs-h3 white">{t("set-50_about")}</Box>
      </Stack>
      <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />

      <Stack direction="column">
        {linkButtons.map(({ key, labelKey, url }) => (
          <TooltipComponent placement="bottom" text={url} key={key}>
            <>
              <Button className="common-btn" sx={{ padding: "20px" }} onClick={() => openLink(url)}>
                <Stack direction="row" justifyContent="space-between" textAlign="center">
                  <Box className="fs-h4 white">{t(labelKey)}</Box>
                  <Box className="center-align">
                    <img src={externalIcon} alt="" />
                  </Box>
                </Stack>
              </Button>
              <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            </>
          </TooltipComponent>
        ))}

        <Stack direction="column" justifyContent="flex-start" textAlign="left" gap="20px" padding="20px">
          <Box className="fs-h4 white">{t("set-54_follow-us")}</Box>
          <Stack direction="row" justifyContent="flex-start" gap="10px">
            {socialLinks.map(({ key, icon, url }) => (
              <TooltipComponent placement="bottom" text={url} key={key}>
                <Button
                  className="button_navbar_common"
                  sx={{ padding: 0 }}
                  onClick={() => {
                    console.log(url);
                    openLink(url);
                  }}
                >
                  <Box className="center-align">
                    <img src={icon} alt={key} />
                  </Box>
                </Button>
              </TooltipComponent>
            ))}
          </Stack>
        </Stack>
      </Stack>

      <Box
        className="fs-16-regular light"
        sx={{
          position: "absolute",
          bottom: "40px",
          left: "16px",
        }}
      >
        {/* {`${t("set-84_app-version")} v${tymt_version}`} */}
      </Box>
    </Stack>
  );
};

export default About;
