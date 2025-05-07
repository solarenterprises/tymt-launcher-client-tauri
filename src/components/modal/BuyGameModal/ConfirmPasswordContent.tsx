import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputText from "../../account/InputText";
import { getAccount } from "../../../store/AccountSlice";
import { getKeccak256Hash } from "../../../lib/helper/EncryptHelper";
import { IAccount } from "../../../types/AccountTypes";

export interface IPropsConfirmPasswordContent {
  confirmPurchase: () => void;
  sendingTransaction: boolean;
}

const ConfirmPasswordContent = ({ confirmPurchase, sendingTransaction }: IPropsConfirmPasswordContent) => {
  const { t } = useTranslation();

  const accountStore: IAccount = useSelector(getAccount);
  const accountStoreRef = useRef(accountStore);
  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .test("equals", t("cca-60_wrong-password"), (value) => {
          return getKeccak256Hash(value) === accountStoreRef?.current?.password;
        })
        .required(t("cca-63_required")),
    }),
    onSubmit: async () => {
      try {
        confirmPurchase();
      } catch (err) {
        console.error("Failed to onSubmit at ConfirmPasswordContent: ", err);
      }
    },
  });

  return (
    <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={"24px"}>
      <Box className="fs-40-regular white">Confirm your purchase</Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={"24px"}>
          <Stack width={"100%"}>
            <InputText
              id="password"
              label={"Your Password"}
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password ? true : false}
              showTooltip={false}
            />
            {formik.touched.password && formik.errors.password && <Box className={"fs-16-regular red t-left"}>{formik.errors.password}</Box>}
          </Stack>

          <Button className={"red-button fw"} disabled={(formik.touched.password && formik.errors.password) || sendingTransaction ? true : false} type="submit">
            {sendingTransaction ? (
              <CircularProgress
                sx={{
                  color: "#F5EBFF",
                }}
              />
            ) : (
              t("pur-12_confirm-purchase")
            )}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default ConfirmPasswordContent;
