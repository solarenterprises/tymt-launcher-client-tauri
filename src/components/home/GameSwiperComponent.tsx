import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Box, Skeleton } from "@mui/material";

import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import GameAPI from "../../lib/api/GameAPI";

// import ComingGameCard from "./ComingGameCard";
import ComingGameSwiperButtonGroup from "./ComingGameSwiperButtonGroup";

import foxhead from "../../assets/main/FoxHeadComingSoon.png";
import { IGame } from "../../types/GameTypes";
import { IMetaPagination } from "../../types/APITypes/BasicAPITypes";
import StoreGameCard from "../game/StoreGameCard";

export interface IPropsGameSwiperComponent {
  mode: string; // free, coming soon, recently added,
}

const GameSwiperComponent = ({ mode }: IPropsGameSwiperComponent) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [gamePagination, setGamePagination] = useState<{ data: IGame[]; meta: IMetaPagination } | null>(null);

  const swiperRef = useRef<any | null>(null);

  const handleNextSlide = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slideNext();
  }, []);

  const handlePrevSlide = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slidePrev();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!swiperRef.current) return;

      const totalSlides = swiperRef.current.swiper.slides.length;
      const nextIndex = swiperRef.current.swiper.activeIndex + 3;

      if (nextIndex >= totalSlides - 3) {
        swiperRef.current.swiper.slideTo(0);
      } else {
        swiperRef.current.swiper.slideTo(nextIndex);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [swiperRef.current]);

  // Fetch games when mode changes
  useEffect(() => {
    const fetchGameList = async () => {
      setLoading(true);
      try {
        let response = null;
        switch (mode) {
          case "free":
            response = await GameAPI.fetchFreeGameList();
            break;
          case "recently-added":
            response = await GameAPI.fetchRecentlyAddedGameList();
            break;
          case "coming-soon":
            response = await GameAPI.fetchComingSoonGameList();
            break;
          case "trending":
            response = await GameAPI.fetchTrendingGameList();
            break;
          default:
            setGamePagination(null);
            return;
        }
        setGamePagination(response);
      } catch (err) {
        console.error(`Error fetching ${mode} game list:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameList();
  }, [mode]);

  return (
    <Grid item xs={12} container sx={{ margin: "40px 0px" }}>
      <Box className={mode === "trending" ? `card_trending_container` : mode === "coming-soon" ? `card_coming_container` : `card_normal_container`}>
        <Grid container sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box className={"fs-40-bold"} color={"white"} textTransform={"none"}>
            {mode === "trending"
              ? t("hom-8_trending-games")
              : mode === "free"
              ? t("hom-9_free-games")
              : mode === "recently-added"
              ? t("hom-10_recently-added")
              : t("hom-11_coming-soon")}
          </Box>
        </Grid>
        {loading ? (
          <Swiper
            ref={swiperRef}
            spaceBetween={15}
            slidesPerView={"auto"}
            loop={false}
            style={{
              marginTop: "32px",
              ...(mode === "trending" && { padding: "0px 32px" }),
            }}
          >
            {loading &&
              Array.from({ length: 10 }).map((_, index) => (
                <SwiperSlide style={{ width: "200px" }} key={`skeleton-${index}`}>
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      width: "182px",
                      height: "302px !important", // Ensure height is enforced
                      minHeight: "302px",
                      borderRadius: "16px",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        ) : !gamePagination?.data?.length ? (
          <>
            <Box
              sx={{
                justifyContent: "center",
                display: "flex",
                // marginTop: "32px",
              }}
            >
              <img src={foxhead} width={"220px"} />
            </Box>
            <Box className={"fs-24-regular white"} textAlign={"center"} marginBottom={"30px"}>
              {t("hom-19_more-games")}
            </Box>
          </>
        ) : (
          <>
            <Swiper
              ref={swiperRef}
              spaceBetween={15}
              slidesPerView={"auto"}
              loop={false}
              style={{
                marginTop: "32px",
                ...(mode === "trending" && { padding: "0px 32px" }),
              }}
            >
              {gamePagination?.data?.map((game, index) => (
                <SwiperSlide style={{ width: "200px" }} key={index}>
                  {/* <ComingGameCard key={game?._id} game={game} /> */}
                  <StoreGameCard game={game} isComing={false} mode={mode} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
            <ComingGameSwiperButtonGroup handleNextSlide={handleNextSlide} handlePrevSlide={handlePrevSlide} />
          </>
        )}
      </Box>
    </Grid>
  );
};

export default GameSwiperComponent;
