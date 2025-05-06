import { Box, Button } from "@mui/material";

export interface IPropsRoundStoreButton {
  text: string;
  onClick: () => void;
}

const RoundStoreButton = ({ text, onClick }: IPropsRoundStoreButton) => {
  return (
    <Button
      sx={{
        border: "1px solid #52E1F270",
        borderRadius: "50ch",
        height: "40px",
        padding: "10px 16px",
        textTransform: "none",
      }}
      onClick={onClick}
    >
      <Box className={"fs-16 white"}>{text}</Box>
    </Button>
  );
};

export default RoundStoreButton;
