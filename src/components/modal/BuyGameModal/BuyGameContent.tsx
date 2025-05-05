import { useMemo, useState } from "react";
import numeral from "numeral";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { CONST_CHAIN_ICONS } from "../../../const/ChainConsts";
import { useWallet } from "../../../providers/WalletProvider";
import { IGame } from "../../../types/GameTypes";
import ChevronRightDouble from "../../../assets/arrow/ChevronRightDouble.png";

export interface IPropsBuyGameContent {
  game: IGame;
  purchaseGame: () => void;
}

const BuyGameContent = ({ game, purchaseGame }: IPropsBuyGameContent) => {
  const { sxpBalance, sxpPrice } = useWallet();

  const [loading, setLoading] = useState<boolean>(false);

  const isInsufficient: boolean = useMemo(() => sxpBalance * sxpPrice < game?.price, [sxpBalance, sxpPrice, game?.price]);

  return (
    <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={"24px"}>
      <Box className="fs-40-regular white">Buying a Game</Box>

      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
        <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
          <Box component={"img"} src={game?.imageUrl} alt="game" sx={{ width: "40px", height: "40px", borderRadius: "8px" }} />
          <Box className="fs-20-regular white">{game?.title}</Box>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
          <Box component={"img"} src={CONST_CHAIN_ICONS.SOLAR} alt="game" sx={{ width: "24px", height: "24px" }} />
          <Box className="fs-20-regular white">{numeral(game?.price).format("0.0")}</Box>
        </Stack>
      </Stack>

      <Box sx={{ width: "100%", border: "1px solid #ffffff33", borderRadius: "16px" }}>
        {isInsufficient ? (
          <Stack direction={"column"} gap={"16px"} padding={"24px 16px"}>
            <Box className="fs-20-regular white">There are insufficient funds in your account.</Box>

            <Stack direction={"column"} gap={"8px"}>
              <Box className="fs-16-regular light">Your current balance:</Box>
              <Stack direction={"column"} gap={"4px"}>
                <Box className="fs-16-regular white">{numeral(sxpBalance).format("0,0.00")} SXP</Box>
                <Box className="fs-16-regular light">$ {numeral(sxpBalance * sxpPrice).format("0,0.00")}</Box>
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} padding={"24px 16px"}>
            <Stack direction={"column"} gap={"8px"}>
              <Box className="fs-16-regular light">Your current balance:</Box>
              <Stack direction={"column"} gap={"4px"}>
                <Box className="fs-16-regular white">{numeral(sxpBalance).format("0,0.00")} SXP</Box>
                <Box className="fs-16-regular light">$ {numeral(sxpBalance * sxpPrice).format("0,0.00")}</Box>
              </Stack>
            </Stack>
            <Box component={"img"} src={ChevronRightDouble} alt="chevron" sx={{ width: "24px", height: "24px" }} />
            <Stack direction={"column"} gap={"8px"}>
              <Box className="fs-16-regular light">Balance after purchase:</Box>
              <Stack direction={"column"} gap={"4px"}>
                <Box className="fs-16-regular white">{numeral(sxpBalance - game?.price).format("0,0.00")} SXP</Box>
                <Box className="fs-16-regular light">$ {numeral((sxpBalance - game?.price) * sxpPrice).format("0,0.00")}</Box>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Box>

      <Button className={"red-button fw"} onClick={purchaseGame}>
        {loading ? (
          <CircularProgress
            sx={{
              color: "#F5EBFF",
            }}
          />
        ) : isInsufficient ? (
          "Top up balance"
        ) : (
          "Purchase"
        )}
      </Button>
    </Stack>
  );
};

export default BuyGameContent;
