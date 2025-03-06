import { Stack, Box, Button } from "@mui/material";

export interface IPropsSwitchButton {
  currentIndex: number;
  setCurrentIndex: (_: number) => void;
  texts: string[];
}

const SwitchButton = ({ currentIndex, setCurrentIndex, texts }: IPropsSwitchButton) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"2px"}
      sx={{
        padding: "2px",
        borderRadius: "16px",
        gap: "2px",
        border: "1px solid",
        borderColor: "#FFFFFF1A",
        background: "#0B1718",
      }}
    >
      {texts?.map((text, index) => (
        <Button
          key={`${index}-${text}`}
          onClick={() => {
            setCurrentIndex(index);
          }}
          sx={{
            "&.MuiButtonBase-root, &.MuiBox-root": {
              display: "block",
              textTransform: "none",
              color: "#52E1F21A",
              minWidth: "unset",
              boxShadow: "none",
              padding: "0px",
              borderRadius: "16px",
            },
            backgroundColor: currentIndex === index ? "rgba(82, 225, 242, 0.10)" : undefined,
            "&:hover": {
              backgroundColor: currentIndex === index ? "rgba(82, 225, 242, 0.10)" : undefined,
            },
          }}
        >
          <Box
            sx={{
              color: currentIndex === index ? "#52E1F2" : "white",
              padding: "8px 16px 8px 16px",
              fontFeatureSettings: "'calt' off",
              fontFamily: "Cobe",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "24px" /* 133.333% */,
              letterSpacing: "-0.36px",
            }}
          >
            {text}
          </Box>
        </Button>
      ))}
    </Stack>
  );
};

export default SwitchButton;
