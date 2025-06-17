import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";

// import "../../../global.css";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import InputText from "../../../components/account/InputText";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";

import { getAccountList } from "../../../store/AccountListSlice";

import { IAccountList } from "../../../types/AccountTypes";

import tymt3 from "../../../assets/account/tymt3.png";
import { validatePassword } from "nist-password-validator";

export interface ILocationStateNonCustodialImport1 {
  passphrase: string;
}

async function checkCustomPassword(password) {
  const result = await validatePassword(password, {
    minLength: 8, // Custom minimum length (default: 15)
    maxLength: 64, // Custom maximum length (default: 100K)
    hibpCheck: false, // Disable HIBP check if using local hash database
    blocklist: [
      "123456",
      "123456789",
      "12345678",
      "password",
      "qwerty123",
      "qwerty1",
      "111111",
      "12345",
      "secret",
      "123123",
      "1234567890",
      "1234567",
      "000000",
      "qwerty",
      "abc123",
      "password1",
      "iloveyou",
      "11111111",
      "dragon",
      "monkey",
      "123123123",
      "123321",
      "qwertyuiop",
      "00000000",
      "Password",
      "654321",
      "target123",
      "tinkle",
      "zag12wsx",
      "1g2w3e4r",
      "gwerty123",
      "gwerty",
      "666666",
      "1q2w3e4r5t",
      "Qwerty123",
      "987654321",
      "1q2w3e4r",
      "a123456",
      "1qaz2wsx",
      "121212",
      "abcd1234",
      "asdfghjkl",
      "123456a",
      "88888888",
      "Qwerty123!",
      "Qwerty1!",
      "112233",
      "q1w2e3r4t5y6",
      "football",
      "zxcvbnm",
      "princess",
      "Qwerty1",
      "aaaaaa",
      "Abcd1234",
      "Password1",
      "sunshine",
      "147258369",
      "Qwerty1234",
      "fuckyou",
      "Qwerty12",
      "123qwe",
      "computer",
      "baseball",
      "159753",
      "superman",
      "azerty",
      "dearbook",
      "pokemon",
      "michael",
      "1234qwer",
      "1234561",
      "888888",
      "daniel",
      "111222tianya",
      "12345678910",
      "1qaz2wsx3edc",
      "123456789a",
      "123654",
      "P@ssw0rd",
      "qwer1234",
      "Qwerty1?",
      "789456123",
      "Qwerty123?",
      "q1w2e3r4",
      "shadow",
      "222222",
      "soccer",
      "qwe123",
      "7777777",
      "22535",
      "asdasd",
      "admin",
      "killer",
      "testing",
      "qazwsx",
      "asdf1234",
      "1314520",
      "555555",
      "12341234",
      "michelle",
      "a123456789",
      "charlie",
      "liverpool",
      "master",
      "123abc",
      "7758521",
      "woaini",
      "asdfgh",
      "password123",
      "starwars",
      "jordan",
      "jessica",
      "999999",
      "unknown",
      "1q2w3e",
      "1111111",
      "789456",
      "pakistan",
      "12qwaszx",
      "ashley",
      "1111111111",
      "welcome",
      "aa123456",
      "jennifer",
      "11223344",
      "thomas",
      "159357",
      "asd123",
      "andrew",
      "nicole",
      "anthony",
      "147258",
      "trustno1",
      "qwerty12",
      "naruto",
      "jonathan",
      "hunter",
      "102030",
      "basketball",
      "cambiami",
      "letmein",
      "hello",
      "chocolate",
      "zinch",
      "internet",
      "samsung",
      "asdfasdf",
      "Aa123456",
      "justin",
      "passw0rd",
      "purple",
      "blink182",
      "whatever",
      "g_czechout",
      "tigger",
      "Indya123",
      "samantha",
      "joshua",
      "alexander",
      "hannah",
      "qazwsxedc",
      "11111",
      "andrea",
      "minecraft",
      "matthew",
      "changeme",
      "123456!",
      "87654321",
      "jordan23",
      "qq123456",
      "1qazxsw2",
      "william",
      "1234567891",
      "123456123",
      "12344321",
      "buster",
      "cookie",
      "babygirl",
      "butterfly",
      "batman",
      "lol123",
      "qwert",
      "robert",
      "summer",
      "amanda",
      "123654789",
      "aaaaaaaa",
      "benjamin",
      "myspace1",
      "333333",
      "facebook",
      "chelsea",
      "family",
      "hello123",
      "maggie",
      "freedom",
      "cheese"
      ], // Custom blocklist      
    matchingSensitivity: 0.25, // Custom matching sensitivity (default: 0.25)
    trimWhitespace: true, // Handle leading/trailing whitespace (default: true)
    errorLimit: 3, // Amount of errors to check before stopping (defult: infinty)
  });

  if (!result.isValid) {
    // console.log("Password validation failed:", result.errors);
    return false;
  } else {
    // console.log("Password is valid!");
    return true;
  }
}

const NonCustodialImport1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mode } = useParams();

  const { passphrase } = (location.state as ILocationStateNonCustodialImport1) || {};

  const accountListStore: IAccountList = useSelector(getAccountList);

  const formik = useFormik({
    initialValues: {
      password: "",
      passwordMatch: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
      .test("password-requirements", t("cca-66_password-must-be-nist"), async (value: string) => {
        if (!value) {
          return false;
        }
        const passedConditions = checkCustomPassword(value);
        const result = await passedConditions;
        return result;
      })
        .required(t("cca-63_required")),
      passwordMatch: Yup.string()
        .required(t("cca-63_required"))
        .oneOf([Yup.ref("password")], t("cca-64_password-must-match")),
    }),
    onSubmit: async () => {
      try {
        const newPassword = formik.values.password;
        navigate(`/non-custodial-signup-4/${mode === "guest" ? "guest" : "signup"}`, { state: { passphrase: passphrase, password: newPassword } });
      } catch (err) {
        console.error("Failed to onSubmit at NonCustodialImport1: ", err);
      }
    },
  });

  const handleBackClick = useCallback(() => {
    accountListStore?.list?.length ? navigate("/non-custodial-login-1") : navigate("/welcome");
  }, [accountListStore]);

  return (
    <>
      <Grid container className="basic-container">
        <Grid item xs={12} container justifyContent={"center"}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              alignSelf: "center",
            }}
          >
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} gap={"64px"}>
              <Stack alignItems={"center"} justifyContent={"center"}>
                <Grid container justifyContent={"center"}>
                  <Grid
                    item
                    container
                    sx={{
                      width: "520px",
                      padding: "10px 0px",
                    }}
                  >
                    <Grid item xs={12} container justifyContent={"space-between"}>
                      <Back onClick={handleBackClick} />
                      <Stepper all={2} now={2} text={t("ncl-11_secure-passphrase")} />
                    </Grid>

                    <Grid item xs={12} mt={"80px"}>
                      <AccountHeader title={t("ncca-65_hello-again")} text={t("ncl-12_type-your-mnemonic")} />
                    </Grid>
                    <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                      <Grid item xs={12} mt={"48px"}>
                        <Stack>
                          <InputText
                            id="non-custodial-new-password"
                            label={"Create password"}
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && formik.errors.password ? true : false}
                          />
                          {formik.touched.password && formik.errors.password && <Box className={"fs-16-regular red"}>{formik.errors.password}</Box>}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} mt={"48px"}>
                        <Stack>
                          <InputText
                            id="non-custodial-repeat-password"
                            label={t("ncca-5_repeat-password")}
                            type="password"
                            name="passwordMatch"
                            value={formik.values.passwordMatch}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.passwordMatch && formik.errors.passwordMatch ? true : false}
                          />
                          {formik.touched.passwordMatch && formik.errors.passwordMatch && <Box className={"fs-16-regular red"}>{formik.errors.passwordMatch}</Box>}
                        </Stack>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          height: "20px",
                          padding: "0px 6px",
                        }}
                      >
                        {formik.touched.passwordMatch && formik.errors.passwordMatch && (
                          <Box className={"fs-16-regular red"}>{formik.errors.passwordMatch}</Box>
                        )}
                      </Grid>
                      <Grid item xs={12} mt={"24px"}>
                        <AccountNextButton
                          isSubmit={true}
                          text={t("ncl-6_next")}
                          disabled={formik.errors.password || formik.errors.passwordMatch ? true : false}
                        />
                      </Grid>
                    </form>
                  </Grid>
                </Grid>
              </Stack>
              <Box
                component={"img"}
                src={tymt3}
                sx={{
                  height: "calc(100vh - 64px)",
                }}
              />
            </Stack>
          </motion.div>
        </Grid>
      </Grid>
    </>
  );
};

export default NonCustodialImport1;
