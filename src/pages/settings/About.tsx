import { useTranslation } from "react-i18next";

import { Box, Button, Divider, Stack } from "@mui/material";

import { CONST_TYMT_LINKS } from "../../const/tymtConsts";

import { openLink } from "../../lib/helper/TauriHelper";

import backIcon from "../../assets/setting/BackIcon.svg";
import externalIcon from "../../assets/setting/ExternalLink.svg";
import twitterIcon from "../../assets/setting/TwitterIcon.svg";
import discordIcon from "../../assets/setting/DiscordIcon.svg";
import TooltipComponent from "../../components/home/TooltipComponent";

export interface IPropsAbout {
  view: string;
  setView: (_: string) => void;
}

const About = ({ view, setView }: IPropsAbout) => {
  const { t } = useTranslation();

  return (
    <>
      {view === "about" && (
        <>
          <Stack direction={"column"}>
            <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} className="p-20">
              <Button className={"setting-back-button"} onClick={() => setView("general")}>
                <Box component={"img"} src={backIcon}></Box>
              </Button>
              <Box className="fs-h3 white">{t("set-50_about")}</Box>
            </Stack>
            <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Stack direction={"column"} justifyContent={""}>
              <TooltipComponent placement="bottom" text={CONST_TYMT_LINKS.documentation}>
                <Button
                  className="common-btn"
                  sx={{ padding: "20px" }}
                  onClick={() => {
                    openLink(CONST_TYMT_LINKS.documentation);
                  }}
                >
                  <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                    <Box className="fs-h4 white">{t("set-51_documentation")}</Box>
                    <Box className="center-align">
                      <img src={externalIcon} />
                    </Box>
                  </Stack>
                </Button>
              </TooltipComponent>

              <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
              <TooltipComponent placement="bottom" text={CONST_TYMT_LINKS.policy}>
                <Button
                  className="common-btn"
                  sx={{ padding: "20px" }}
                  onClick={() => {
                    openLink(CONST_TYMT_LINKS.policy);
                  }}
                >
                  <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                    <Box className="fs-h4 white">{t("set-52_privacy-policy")}</Box>
                    <Box className="center-align">
                      <img src={externalIcon} />
                    </Box>
                  </Stack>
                </Button>
              </TooltipComponent>
              <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
              {/* <Button
                className="common-btn"
                sx={{ padding: "20px" }}
                onClick={() => {
                  openLink(tymtlinks.links.termsofservice);
                }}
              >
                <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                  <Box className="fs-h4 white">{t("set-53_terms-service")}</Box>
                  <Box className="center-align">
                    <img src={externalIcon} />
                  </Box>
                </Stack>
              </Button> */}
              <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
              <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"left"} gap={"20px"} padding={"20px"}>
                <Box className="fs-h4 white">{t("set-54_follow-us")}</Box>
                <Stack direction={"row"} justifyContent={"flex-start"} gap={"10px"}>
                  <TooltipComponent placement="bottom" text={CONST_TYMT_LINKS.twitter}>
                    <Button
                      className="button_navbar_common"
                      sx={{ padding: 0 }}
                      onClick={() => {
                        openLink(CONST_TYMT_LINKS.twitter);
                      }}
                    >
                      <Box className="center-align">
                        <img src={twitterIcon} />
                      </Box>
                    </Button>
                  </TooltipComponent>
                  <TooltipComponent placement="bottom" text={CONST_TYMT_LINKS.discord}>
                    <Button
                      className="button_navbar_common"
                      sx={{ padding: 0 }}
                      onClick={() => {
                        openLink(CONST_TYMT_LINKS.discord);
                      }}
                    >
                      <Box className="center-align">
                        <img src={discordIcon} />
                      </Box>
                    </Button>
                  </TooltipComponent>
                </Stack>
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
        </>
      )}
    </>
  );
};

export default About;
