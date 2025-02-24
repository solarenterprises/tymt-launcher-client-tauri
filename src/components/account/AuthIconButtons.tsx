import { Stack, Box } from "@mui/material";

import mailIcon from "../../assets/account/Mail.png";
import facebookIcon from "../../assets/account/FacebookIcon.svg";
import googleIcon from "../../assets/account/GoogleIcon.svg";
import discordIcon from "../../assets/account/DiscordIcon.svg";
import binanceIcon from "../../assets/account/BinanceIcon.svg";
import AuthIconButton from "./AuthIconButton";

const list = [
  {
    icon: mailIcon,
  },
  {
    icon: googleIcon,
  },
  {
    icon: facebookIcon,
  },
  {
    icon: discordIcon,
  },
  {
    icon: binanceIcon,
  },
];

const AuthIconButtons = () => {
  return (
    <>
      <Box className={`fs-16-regular light`} sx={{ textAlign: "center", marginBottom: "16px" }}>
        Coming Soon
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          filter: "grayscale(1.0)",
        }}
      >
        {list.map((one, index) => (
          <AuthIconButton key={index} icon={one.icon} />
        ))}
      </Stack>
    </>
  );
};

export default AuthIconButtons;
