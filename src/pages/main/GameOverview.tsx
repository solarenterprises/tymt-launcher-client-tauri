import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Grid } from "@mui/material";

import AnimatedComponent from "../../components/home/AnimatedComponent";
import SwitchButton from "../../components/home/SwitchButton";
import GameOverViewPlatform from "../../components/game/GameOverViewPlatform";
import GameOverViewNative from "../../components/game/GameOverViewNative";
import GameOverViewSystemRequirement from "../../components/game/GameOverViewSystemRequirement";
import GameOverViewReleaseName from "../../components/game/GameOverViewReleaseName";
import GameOverViewTags from "../../components/game/GameOverViewTags";
import GameOverViewShortDescription from "../../components/game/GameOverViewShortDescription";
import GameOverViewFollow from "../../components/game/GameOverViewFollow";
import GameOverViewSwiper from "../../components/game/GameOverViewSwiper";
import GameOverViewHeader from "../../components/game/GameOverViewHeader";
import GameOverViewDownloadSize from "../../components/game/GameOverViewDownloadSize";
import GameOverViewInstallSize from "../../components/game/GameOverViewInstallSize";
import GameOverViewJumbo from "../../components/game/GameOverViewJumbo";
import GameOverViewDescription from "../../components/game/GameOverViewDescription";
import GameReview from "../../components/game/GameReview";
import BuyGameModal from "../../components/modal/BuyGameModal/BuyGameModal";

import GameAPI from "../../lib/api/GameAPI";

import { IGame } from "../../types/GameTypes";

import gradient1 from "../../assets/main/GradientGameOverview.svg";

export interface IPropsGameOverview {
  game: IGame;
}

const GameOverview = ({ game }: IPropsGameOverview) => {
  const { t } = useTranslation();

  const [src, setSrc] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentSwitchIndex, setCurrentSwitchIndex] = useState<number>(0);
  const [openBuyGameModal, setOpenBuyGameModal] = useState<boolean>(false);
  const [purchased, setPurchased] = useState<boolean>(false);
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);

  const textList: string[] = [t("ga-10_overview"), t("ga-11_review")];

  useEffect(() => {
    if (game?.projectMeta?.type === "browser") return;
    if (game?.price === 0) {
      setPurchased(true);
      return;
    }

    setPurchaseLoading(true);
    GameAPI.verifyPurchase(game?._id)
      .then((res) => {
        setPurchased(res?.data ?? false);
      })
      .catch((err) => {
        console.log("Failed to verifyPurchase: ", err);
        setPurchased(false);
      })
      .finally(() => {
        setPurchaseLoading(false);
      });
  }, [game]);

  return (
    <>
      <Grid
        item
        xs={12}
        container
        sx={{
          marginBottom: "32px",
          borderRadius: "var(--Angle-Number, 32px)",
          background: "rgba(29, 29, 29, 0.50)",
          backgroundBlendMode: "luminosity",
          backdropFilter: "blur(50px)",
          padding: "24px",
          flexShrink: 0.3,
          position: "relative",
          overflow: "hidden",
        }}
        mb={"32px"}
      >
        <AnimatedComponent threshold={0}>
          <img src={gradient1} style={{ position: "absolute", right: 0, top: 0 }} />
          <Grid item xs={12} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
            <Grid item xs={12} flexDirection={"row"} justifyContent={"space-between"} display={"flex"}>
              <GameOverViewHeader game={game} purchased={purchased} setOpenBuyGameModal={setOpenBuyGameModal} purchaseLoading={purchaseLoading} />
            </Grid>
          </Grid>
          <Grid item xs={12} container display={"flex"} justifyContent={"space-between"} marginTop={"32px"}>
            <Grid item paddingRight={"25px"} sx={{ width: "calc(100% - 320px)" }}>
              <Grid item xs={12}>
                <GameOverViewJumbo type={type} src={src} />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  marginTop: "12px",
                  display: "flex",
                  justifyContent: "left",
                  overflow: "hidden",
                }}
              >
                <GameOverViewSwiper
                  game={game}
                  currentImageIndex={currentImageIndex}
                  setSrc={setSrc}
                  setType={setType}
                  setCurrentImageIndex={setCurrentImageIndex}
                />
              </Grid>

              <Grid item xs={12} container mt={"32px"}>
                <SwitchButton currentIndex={currentSwitchIndex} setCurrentIndex={setCurrentSwitchIndex} texts={textList} />
              </Grid>

              <Grid item xs={12} marginTop={"32px"}>
                {currentSwitchIndex === 0 && <GameOverViewDescription game={game} />}
                {currentSwitchIndex === 1 && <GameReview game={game} />}
              </Grid>
            </Grid>
            <Grid item sx={{ width: "320px" }}>
              <GameOverViewShortDescription game={game} />
              <GameOverViewTags game={game} />
              <GameOverViewPlatform game={game} />
              <GameOverViewNative game={game} />
              <GameOverViewReleaseName game={game} />
              <GameOverViewDownloadSize game={game} />
              <GameOverViewInstallSize game={game} />
              <GameOverViewSystemRequirement game={game} />
              <GameOverViewFollow game={game} />
            </Grid>
          </Grid>
        </AnimatedComponent>
      </Grid>
      <BuyGameModal open={openBuyGameModal} setOpen={setOpenBuyGameModal} game={game} setPurchased={setPurchased} />
    </>
  );
};

export default GameOverview;
