import { Button, Stack, Box } from "@mui/material";

import TooltipComponent from "./TooltipComponent";

import { useMetamask } from "../../providers/MetamaskCustomProvider";

import MetamaskImage from "../../assets/wallet/Metamask.png";

const MetamaskButton = () => {
  const { account, connect } = useMetamask();

  return (
    <TooltipComponent placement="top" text={"Metamask"}>
      <Button
        className="button_metamask"
        onClick={() => {
          connect();
        }}
      >
        <Stack direction={"row"} alignItems={"center"} marginLeft={"0px"} justifyContent={"left"} spacing={"8px"} height={"32px"}>
          <Box component={"img"} src={MetamaskImage} width={32} height={32} />
          <Stack direction={"column"} width={"110px"} alignItems={"flex-start"}>
            <Box className={"fs-16-regular white"}>{"Metamask"}</Box>
            <Box className={"fs-14-regular light"}>{account ? `${account?.substring(0, 6)}...${account?.substring(account?.length - 4)}` : `Disconnected`}</Box>
          </Stack>
        </Stack>
      </Button>
    </TooltipComponent>
  );
};

export default MetamaskButton;
