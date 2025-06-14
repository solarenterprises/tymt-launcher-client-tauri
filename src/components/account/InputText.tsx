import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { FormControl, InputLabel, Input, IconButton, Tooltip, Box, Stack } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import WarningSvg from "../../assets/account/Warning.svg";

export interface IPropsInputText {
  id: string;
  label: string;
  type: string;
  name?: string;
  setValue?: (data: string) => void;
  value?: string;
  onChange?: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
  };
  onBlur?: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  error?: boolean;
  onIconButtonClick?: () => void;
  onAddressButtonClick?: () => void;
  showTooltip?: boolean;
}

const InputText = ({
  id,
  label,
  type,
  name,
  setValue,
  value,
  onChange,
  onBlur,
  error,
  onIconButtonClick,
  onAddressButtonClick,
  showTooltip,
}: IPropsInputText) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [capsLockOn, setCapsLockOn] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    const handleKeyEvent = (event: { getModifierState: (arg0: string) => boolean | ((prevState: boolean) => boolean) }) => {
      setCapsLockOn(event.getModifierState("CapsLock"));
    };

    document.addEventListener("keydown", handleKeyEvent);
    document.addEventListener("keyup", handleKeyEvent);

    return () => {
      document.removeEventListener("keydown", handleKeyEvent);
      document.removeEventListener("keyup", handleKeyEvent);
    };
  }, []);

  return (
    <>
      {type === "text" && (
        <FormControl className="input-text" sx={{ width: "100%" }} variant="standard">
          <InputLabel
            htmlFor={id}
            sx={{
              fontFamily: "Cobe",
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "24px",
              color: "#AFAFAF", // Default color
              padding: "5px",
              top: "-10px",
              "&.Mui-focused": {
                color: "#AFAFAF", // Keep the same color when focused
              },
            }}
          >
            {label}
          </InputLabel>
          <Input
            id={id}
            name={name}
            type={"text"}
            sx={{
              fontFamily: "Cobe",
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "24px",
              color: "#FFFFFF",
              padding: "5px",
              top: "-10px",
              "&:before": {
                borderBottom: "1px solid #FFFFFF16", // Underline color when not focused
              },
              "&:after": {
                borderBottom: "2px solid #AFAFAF", // Underline color when focused
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: "1px solid #AFAFAF", // Underline color on hover
              },
            }}
            onChange={
              onChange
                ? onChange
                : (e) => {
                    if (setValue) setValue(e.target.value);
                  }
            }
            value={value}
            onBlur={onBlur}
            error={error}
            autoComplete="off"
          />
        </FormControl>
      )}
      {type === "mnemonic" && (
        <FormControl className="input-text" sx={{ width: "100%" }} variant="standard">
          <InputLabel
            htmlFor={id}
            sx={{
              fontFamily: "Cobe",
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "24px",
              color: "#AFAFAF", // Default color
              padding: "5px",
              top: "-10px",
              "&.Mui-focused": {
                color: "#AFAFAF", // Keep the same color when focused
              },
            }}
          >
            {label}
          </InputLabel>
          <Input
            id={id}
            name={name}
            type={"text"}
            onChange={
              onChange
                ? onChange
                : (e) => {
                    if (setValue) setValue(e.target.value);
                  }
            }
            value={value}
            onBlur={onBlur}
            error={error}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onIconButtonClick}
                  onMouseDown={handleMouseDownPassword}
                  className={"icon-button"}
                  tabIndex={-1}
                >
                  <ContentCopyIcon className={"icon-button"} />
                </IconButton>
              </InputAdornment>
            }
            sx={{
              fontFamily: "Cobe",
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "24px",
              color: "#FFFFFF",
              padding: "5px",
              top: "-10px",
              "&:before": {
                borderBottom: "1px solid #FFFFFF16", // Underline color when not focused
              },
              "&:after": {
                borderBottom: "2px solid #AFAFAF", // Underline color when focused
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: "1px solid #AFAFAF", // Underline color on hover
              },
            }}
            autoComplete="off"
          />
        </FormControl>
      )}
      {type === "password" && (
        <>
          <Tooltip
            open={showTooltip && !value}
            title={
              !value && (
                <Stack
                  spacing={"10px"}
                  sx={{
                    marginTop: "-42px",
                    backgroundColor: "rgb(49, 53, 53)",
                    padding: "16px",
                    borderRadius: "16px",
                    border: "1px solid rgb(71, 76, 76)",
                  }}
                >
                  <Box className="fs-16-regular white">{t("cca-4_your-password-must")}</Box>
                  <Stack>
                    <Box className="fs-14-regular light">• {t("cca-5_at-least-8")}</Box>
                    <Box className="fs-14-regular light">• {t("cca-9_max-64")}</Box>
                    <Box className="fs-14-regular light">• {t("cca-10_disallow-common-passwords")}</Box>
                  </Stack>
                </Stack>
              )
            }
            PopperProps={{
              sx: {
                [`& .MuiTooltip-tooltip`]: {
                  maxWidth: "600px",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
            }}
          >
            <FormControl sx={{ width: "100%" }} variant="standard" className="input-text">
              <InputLabel
                htmlFor={id}
                sx={{
                  fontFamily: "Cobe",
                  fontSize: "20px",
                  fontWeight: "400",
                  lineHeight: "24px",
                  color: "#AFAFAF", // Default color
                  padding: "5px",
                  top: "-10px",
                  "&.Mui-focused": {
                    color: "#AFAFAF", // Keep the same color when focused
                  },
                }}
              >
                {label}
              </InputLabel>
              <Input
                id={id}
                name={name}
                type={showPassword ? "text" : "password"}
                onChange={
                  onChange
                    ? onChange
                    : (e) => {
                        if (setValue) setValue(e.target.value);
                      }
                }
                value={value}
                onBlur={onBlur}
                error={error}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      className={"icon-button"}
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOutlinedIcon className={"icon-button"} /> : <VisibilityOffOutlinedIcon className={"icon-button"} />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{
                  fontFamily: "Cobe",
                  fontSize: "20px",
                  fontWeight: "400",
                  lineHeight: "24px",
                  color: "#FFFFFF",
                  padding: "5px",
                  top: "-10px",
                  "& input[type='password']::-ms-reveal": {
                    display: "none",
                  },
                  "& input[type='password']::-ms-clear": {
                    display: "none",
                  },
                  "&:before": {
                    borderBottom: "1px solid #FFFFFF16", // Underline color when not focused
                  },
                  "&:after": {
                    borderBottom: "2px solid #AFAFAF", // Underline color when focused
                  },
                  "&:hover:not(.Mui-disabled):before": {
                    borderBottom: "1px solid #AFAFAF", // Underline color on hover
                  },
                }}
              />
            </FormControl>
          </Tooltip>
          {capsLockOn && (
            <Stack direction={"row"} alignItems={"center"} gap={"5px"} padding={"0px 6px"}>
              <Box component={"img"} src={WarningSvg} width={"20px"} height={"20px"} />
              <Box className="fs-16-regular orange">{t("wc-27_caps-lock-on")}</Box>
            </Stack>
          )}
        </>
      )}
      {type === "address" && (
        <FormControl className="input-text" sx={{ width: "100%" }} variant="standard">
          <InputLabel
            htmlFor={id}
            sx={{
              fontFamily: "Cobe",
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "24px",
              color: "#AFAFAF", // Default color
              padding: "5px",
              top: "-10px",
              "&.Mui-focused": {
                color: "#AFAFAF", // Keep the same color when focused
              },
            }}
          >
            {label}
          </InputLabel>
          <Input
            id={id}
            name={name}
            type={"text"}
            onChange={
              onChange
                ? onChange
                : (e) => {
                    if (setValue) setValue(e.target.value);
                  }
            }
            value={value}
            onBlur={onBlur}
            error={error}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={onIconButtonClick} onMouseDown={handleMouseDownPassword} className={"icon-button"} tabIndex={-1}>
                  <ContentCopyIcon className={"icon-button"} />
                </IconButton>
                <IconButton onClick={onAddressButtonClick} onMouseDown={handleMouseDownPassword} className={"icon-button"} tabIndex={-1}>
                  <i className="pi pi-book icon-button" />
                </IconButton>
              </InputAdornment>
            }
            sx={{
              fontFamily: "Cobe",
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "24px",
              color: "#FFFFFF",
              padding: "5px",
              top: "-10px",
              "&:before": {
                borderBottom: "1px solid #FFFFFF16", // Underline color when not focused
              },
              "&:after": {
                borderBottom: "2px solid #AFAFAF", // Underline color when focused
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: "1px solid #AFAFAF", // Underline color on hover
              },
            }}
            autoComplete="off"
          />
        </FormControl>
      )}
    </>
  );
};

export default InputText;
