import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Stack } from "@mui/material";
import { getAccount } from "../../../store/AccountSlice";
import InputText from "../../account/InputText";
import { getKeccak256Hash } from "../../../lib/helper/EncryptHelper";
import { IAccount } from "../../../types/AccountTypes";

export interface IPropsMetamaskPasswordContent {
  confirmPassword: (_: string) => void;
}

const MetamaskPasswordContent = ({ confirmPassword }: IPropsMetamaskPasswordContent) => {
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
        confirmPassword(formik.values.password);
      } catch (err) {
        console.error("Failed to onSubmit at ConfirmPasswordContent: ", err);
      }
    },
  });

  return (
    <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={"24px"}>
      <Box className="fs-40-regular white">Confirm your password</Box>

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

          <Button className={"red-button fw"} disabled={formik.touched.password && formik.errors.password ? true : false} type="submit">
            {`Confirm`}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default MetamaskPasswordContent;
