import { useTranslation } from "react-i18next";

import { SelectChangeEvent } from "@mui/material/Select";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, MenuItem, FormControl, Select, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import LinuxIcon from "../../assets/main/LinuxIcon.svg";
import WinIcon from "../../assets/main/WinIcon.svg";
import macIcon from "../../assets/main/MacIcon.svg";

import { FilterOptionNames } from "../../const/FilterOptionNames";

const MenuProps = {
  MenuListProps: {
    style: {
      paddingTop: "0",
      paddingBottom: "0",
    },
  },
  PaperProps: {
    style: {
      marginTop: "5px",
      maxHeight: "none",
      width: "120px",
      display: "flex",
      alignItems: "center",
      borderRadius: "16px",
      border: "1px solid var(--Stroke, rgba(58, 58, 58, 0.50))",
      background: "rgba(27, 53, 56, 0.70)",
      backdropFilter: "blur(50px)",
    },
  },
};

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#FF5733",
    },
    secondary: {
      main: "#9e9e9e",
      light: "#F5EBFF",
      contrastText: "#47008F",
    },
  },
});

const Platform = [
  { platform: FilterOptionNames.PLATFORM_ALL }, // All
  { platform: FilterOptionNames.PLATFORM_WINDOWS, icon: WinIcon }, // Windows
  { platform: FilterOptionNames.PLATFORM_MACOS, icon: macIcon }, // macOS
  { platform: FilterOptionNames.PLATFORM_LINUX, icon: LinuxIcon }, // Linux
];

export interface IPropsPlatformButton {
  platform: string;
  setPlatform: (_: string) => void;
}

const PlatformButton = ({ platform, setPlatform }: IPropsPlatformButton) => {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    setPlatform(event.target.value);
  };

  return (
    <div>
      <FormControl>
        <ThemeProvider theme={theme}>
          <Select
            // disabled
            sx={{
              height: "40px",
              display: "flex",
              padding: "8px 16px 8px 16px",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              borderRadius: "32px",
              border: "1px solid rgba(82, 225, 242, 0.40)",
              background: "var(--bg-stroke-card-bg, rgba(27, 53, 56, 0.20))",
              "&:hover": {
                backgroundColor: "var(--bg-stroke-blue-stroke-default-10, rgba(82, 225, 242, 0.10))",
              },
              "&:active": {
                backgroundColor: "var(--bg-stroke-blue-stroke-default-20, rgba(82, 225, 242, 0.20))",
              },
              "& .MuiSelect-icon": {
                color: "var(--Basic-Light, #AFAFAF)",
              },
            }}
            fullWidth
            displayEmpty
            value={platform}
            onChange={handleChange}
            IconComponent={ExpandMoreIcon}
            MenuProps={MenuProps}
            renderValue={(selected) => (
              <>
                <Stack flexDirection={"row"} alignItems={"center"} gap={"4px"}>
                  {selected !== FilterOptionNames.PLATFORM_ALL && <img src={Platform.find((one) => one.platform === selected)?.icon} width={"30px"} />}
                  <Box className={"fs-16 white"}>{t(selected)}</Box>
                </Stack>
              </>
            )}
          >
            {Platform.map((one) => (
              <MenuItem
                sx={{
                  width: "240px",
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--bg-stroke-white-10-stroke-default, rgba(255, 255, 255, 0.10))",
                  "&:hover": {
                    background: "var(--bg-stroke-blue-stroke-default-10, rgba(82, 225, 242, 0.10))",
                  },
                  "&.Mui-selected": {
                    background: "var(--bg-stroke-blue-stroke-default-10, rgba(82, 225, 242, 0.10))",
                    "&:hover": {
                      background: "var(--bg-stroke-blue-stroke-default-10, rgba(82, 225, 242, 0.10))",
                    },
                    backdropFilter: "blur(10px)",
                  },
                  backdropFilter: "blur(10px)",
                }}
                key={one.platform}
                value={one.platform}
              >
                <Stack flexDirection={"row"} alignItems={"center"}>
                  {one.icon && <img src={one.icon} width={"30px"} />}
                  <Box className={"fs-16 white"} sx={{ marginLeft: "8px" }}>
                    {t(`${one.platform}`)}
                  </Box>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </ThemeProvider>
      </FormControl>
    </div>
  );
};

export default PlatformButton;
