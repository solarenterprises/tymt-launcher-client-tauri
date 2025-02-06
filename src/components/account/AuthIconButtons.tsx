import { Stack } from "@mui/material";

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
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {list.map((one, index) => (
          <AuthIconButton key={index} icon={one.icon} />
        ))}
      </Stack>
    </>
  );
};

export default AuthIconButtons;
