import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Modal, Fade, Box, Stack, Switch } from "@mui/material";

import StarLabelPanel from "../game/StarLabelPanel";
import InputText from "../account/InputText";
import RedStrokeButton from "../account/RedStrokeButton";

import { FeedbackAPI } from "../../lib/api/FeedbackAPI";

import CloseIcon from "../../assets/setting/XIcon.svg";

import { IGame } from "../../types/GameTypes";

export interface IPropsReviewModal {
  open: boolean;
  setOpen: (_: boolean) => void;
  game: IGame;
  fetchReviewData: (_: number) => void;
}

const ReviewModal = ({ open, setOpen, game, fetchReviewData }: IPropsReviewModal) => {
  const { t } = useTranslation();

  const [star, setStar] = useState<number>(1);
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const starRef = useRef(star);
  const anonymousRef = useRef(anonymous);

  useEffect(() => {
    starRef.current = star;
  }, [star]);
  useEffect(() => {
    anonymousRef.current = anonymous;
  }, [anonymous]);

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const formik = useFormik({
    initialValues: {
      review: "",
    },
    validationSchema: Yup.object({
      review: Yup.string().required(t("cca-63_required")),
    }),
    onSubmit: async () => {
      try {
        setLoading(true);
        const res = await FeedbackAPI.createFeedback({
          gameId: game?._id,
          isAnonymous: anonymousRef.current,
          rating: starRef.current,
          text: formik.values.review,
        });
        if (res) {
          fetchReviewData(1);
        }
        setLoading(false);
        setOpen(false);
      } catch (err) {
        console.error("Failed to onSubmit at ReviewModal: ", err);
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Modal
        open={open}
        style={modalStyle}
        onClose={() => setOpen(false)}
        sx={{
          backdropFilter: "blur(4px)",
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              width: "480px",
              padding: "40px 31px",
              borderRadius: "16px",
              border: "3px solid #ffffff33",
              background: "#8080804d",
              backgroundBlendMode: "luminosity",
              backdropFilter: "blur(10px)",
              "&:focusVisible": {
                outline: "none",
              },
            }}
          >
            <img src={CloseIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
            <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
              <Stack gap={"24px"} textAlign={"center"}>
                <Stack gap={"12px"}>
                  <Box className={"fs-h2 white"}>{t("ga-26_leave-review")}</Box>
                  <Box className={"fs-16-light light"}>{t("ga-31_share-your-thoughts")}</Box>
                </Stack>

                <StarLabelPanel value={star} setValue={setStar} />

                <Stack>
                  <InputText
                    id="review"
                    label={t("ga-33_review")}
                    type="text"
                    name="review"
                    value={formik.values.review}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.review && formik.errors.review ? true : false}
                  />
                  {formik.touched.review && formik.errors.review && <Box className={"fs-16-regular red t-left"}>{formik.errors.review}</Box>}
                </Stack>

                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                  <Box className={"fs-18-regular white"}>{t("ga-34_anonymous")}</Box>
                  <Switch value={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                </Stack>
                <RedStrokeButton text={t("ga-35_submit-review")} isSubmit={true} loading={loading} />
              </Stack>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ReviewModal;
