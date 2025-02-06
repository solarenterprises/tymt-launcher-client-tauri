import { Button, Box } from "@mui/material";

import LeftArrow from "../../assets/arrow/LeftArrow.png";

interface props {
  onClick: () => void;
}

const Back = ({ onClick }: props) => {
  return (
    <Button className={"back-button"} onClick={onClick}>
      <Box component={"img"} src={LeftArrow}></Box>
    </Button>
  );
};

export default Back;
