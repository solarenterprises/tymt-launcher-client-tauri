import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Box, Button, Divider, Stack } from "@mui/material";

import InputText from "../../components/account/InputText";
import MnemonicRevealPad from "../../components/account/MnemonicRevealPad";

import { getAccount } from "../../store/AccountSlice";

import { getKeccak256Hash, decrypt } from "../../lib/helper/EncryptHelper";

import { IAccount } from "../../types/AccountTypes";

import backIcon from "../../assets/setting/BackIcon.svg";

export interface IPropsBackup {
  view: string;
  setView: (_: string) => void;
}

const Backup = ({ view, setView }: IPropsBackup) => {
  const { t } = useTranslation();

  const accountStore: IAccount = useSelector(getAccount);

  const [passphrase, setPassphrase] = useState<string>("");
  const [blur, setBlur] = useState<boolean>(true);
  const [time, setTime] = useState<number>(10);

  const handleSubmit = useCallback(
    async (password: string) => {
      try {
        const decryptedPassphrase = await decrypt(accountStore?.mnemonic, password);
        setPassphrase(decryptedPassphrase);
      } catch (err) {
        console.error("Failed to handleSubmit: ", err);
      }
    },
    [accountStore]
  );

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required(t("cca-63_required"))
        .test("equals", t("cca-60_wrong-password"), (value) => getKeccak256Hash(value) === accountStore?.password),
    }),
    onSubmit: () => {
      handleSubmit(formik.values.password);
    },
  });

  useEffect(() => {
    if (formik.touched.password && formik.errors.password) {
      setBlur(true);
      setPassphrase("");
      setTime(10);
    }
  }, [formik.touched.password, formik.errors.password]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!blur) {
      intervalId = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1 * 1e3);
    } else {
      if (intervalId) clearInterval(intervalId);
      setTime(10);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [blur]);

  return (
    <>
      {view === "backup" && (
        <Stack direction={"column"}>
          <input type="file" id="file-input" style={{ display: "none" }} />
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button
              className={"setting-back-button"}
              onClick={() => {
                setView("security");
                setBlur(true);
                setPassphrase("");
                setTime(10);
                formik.resetForm();
              }}
            >
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-89_backup-passphrase")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <Stack direction={"column"} justifyContent={""}>
              <Stack direction={"column"} justifyContent={"flex-start"} padding={"20px"}>
                <Box className="fs-h4 white">
                  <InputText
                    id="old-password"
                    name={"password"}
                    label={t("cca-39_your-password")}
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && formik.errors.password ? true : false}
                    showTooltip={false}
                  />
                </Box>
                {formik.touched.password && formik.errors.password && (
                  <Box className={"fs-16-regular red"} ml={"8px"}>
                    {formik.errors.password}
                  </Box>
                )}
              </Stack>
              <Box>
                <MnemonicRevealPad passphrase={passphrase} blur={blur} setBlur={setBlur} />
              </Box>
              <Box
                className={"fs-16-regular white"}
                sx={{
                  textAlign: "center",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  display: "-webkit-box",
                  whiteSpace: "pre-line",
                  margin: "12px 36px",
                }}
              >
                {passphrase && blur && t("set-90_to-reveal-passphrase")}
                {!passphrase && blur && t("set-91_please-input-passphrase")}
                {passphrase && !blur && `${t("set-92_will-blur-again")} ${time} ${t("set-93_seconds")}`}
              </Box>
              <Box padding={"20px"} width={"90%"} sx={{ position: "absolute", bottom: "30px" }}>
                <Button
                  fullWidth
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
                      "&:disabled": {
                        backgroundColor: "#222222", // Example: light gray background
                        color: "#A0A0A0", // Example: gray text color
                        borderColor: "#222222", // Example: gray border color
                      },
                    },
                  }}
                  disabled={formik.errors.password ? true : false}
                  type="submit"
                >
                  {t("ncca-51_confirm")}
                </Button>
              </Box>
            </Stack>
          </form>
        </Stack>
      )}
    </>
  );
};

export default Backup;
