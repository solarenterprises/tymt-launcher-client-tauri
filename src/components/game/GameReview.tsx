import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import numeral from "numeral";

import { Box, Button, Skeleton, Stack } from "@mui/material";

import FeedbackCard from "./FeedbackCard";
import ReviewRating from "./ReviewRating";
import ReviewPagination from "./ReviewPagination";
import ReviewModal from "../modal/ReviewModal";

import { FeedbackAPI } from "../../lib/api/FeedbackAPI";

import noreviews from "../../assets/main/NoReviews.png";

import { IFeedback, IGame } from "../../types/GameTypes";
import { IMetaPagination } from "../../types/APITypes/BasicAPITypes";

export interface IPropsGameReview {
  game: IGame;
}

const GameReview = ({ game }: IPropsGameReview) => {
  const { t } = useTranslation();

  const [view, setView] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [feedbackList, setFeedbackList] = useState<IFeedback[]>([]);
  const [meta, setMeta] = useState<IMetaPagination>();
  const [loading, setLoading] = useState<boolean>(false);

  const averageStar = 3;

  const fetchReviewData = async (currentPage: number = 1) => {
    try {
      setLoading(true);
      const res = await FeedbackAPI.getFeedbacks({ gameId: game?._id, query: { page: currentPage, limit: 5, sort: "-createdAt" } });
      setFeedbackList(res.data);
      setMeta(res.meta);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetchReviewData: ", err);
      setLoading(false);
    }
  };

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
    fetchReviewData(value);
  };

  useEffect(() => {
    fetchReviewData(1);
  }, []);

  return (
    <>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} display={"flex"}>
        <Box className={"fs-40-bold white"}>
          {t("ga-11_review")}
          {!loading && feedbackList?.length > 0 && (
            <Box
              sx={{
                width: 200,
                display: "flex",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <ReviewRating value={averageStar} />
              <Box className={"fs-18-bold white"} marginLeft={"5px"}>
                {numeral(averageStar).format("0,0.[00]")}
              </Box>
            </Box>
          )}
        </Box>
        <Button
          sx={{
            "&.MuiButtonBase-root": {
              textTransform: "none",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "24px" /* 133.333% */,
              letterSpacing: "-0.36px",
              height: "46px",
              borderRadius: "16px",
              backgroundColor: "transparent",
              color: "#52E1F2",
              borderColor: "#EF4444",
              fontFamily: "Cobe",
              boxShadow: "none",
              border: "1px solid",
              paddingTop: "5px",
              "&:hover": {
                borderColor: "#EF4444",
                backgroundColor: "#EF4444",
              },
              "&:active": {
                backgroundColor: "#EF4444",
                boxShadow: "1px 1px #EF44445F",
              },
            },
          }}
          onClick={() => setView(true)}
        >
          <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
            {t("ga-26_leave-review")}
          </Box>
        </Button>
      </Stack>
      {loading && (
        <Stack gap={"24px"} mt={"24px"}>
          {Array.from({ length: 5 })?.map((_item, index) => (
            <Skeleton variant="rounded" key={`${index}-review-skeleton`} height={"140px"} />
          ))}
        </Stack>
      )}
      {!loading && feedbackList?.length === 0 && (
        <Box
          sx={{
            justifyContent: "center",
            marginTop: "24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <img src={noreviews} width={"300px"} height={"300px"} />
          </Box>
          <Box className={"fs-20-regular white"} textAlign={"center"} marginTop={"24px"}>
            {t("ga-27_no-review")}
          </Box>
        </Box>
      )}
      {!loading && feedbackList?.length > 0 && (
        <>
          <Stack gap={"24px"} mt={"24px"}>
            {feedbackList?.map((one, index) => (
              <FeedbackCard feedback={one} key={`${index}-${one?._id}`} />
            ))}
          </Stack>
          <ReviewPagination totalPage={meta.pagination.pageCount} page={page} handlePageChange={handlePageChange} />
        </>
      )}
      <ReviewModal open={view} setOpen={setView} game={game} fetchReviewData={fetchReviewData} />
    </>
  );
};

export default GameReview;
