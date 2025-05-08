import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import numeral from "numeral";
import { Box, Button, Stack } from "@mui/material";
import { CONST_CHAIN_ICONS } from "../../../const/ChainConsts";
import { useWallet } from "../../../providers/WalletProvider";
import { IGame } from "../../../types/GameTypes";
import ChevronRightDouble from "../../../assets/arrow/ChevronRightDouble.png";

export interface IPropsBuyGameContent {
  game: IGame;
  purchaseGame: () => void;
}

const BuyGameContent = ({ game, purchaseGame }: IPropsBuyGameContent) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sxpBalance, sxpPrice, sxpFee } = useWallet();

  const isInsufficient: boolean = useMemo(() => sxpBalance < game?.price + sxpFee, [sxpBalance, game?.price, sxpFee]);

  const handleClick = () => {
    if (isInsufficient) {
      navigate("/wallet", { state: { openGameTopUp: true } });
      return;
    }
    purchaseGame();
  };

  return (
    <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={"24px"}>
      <Box className="fs-40-regular white">{t("pur-8_buying-a-game")}</Box>

      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
        <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
          <Box component={"img"} src={game?.imageUrl} alt="game" sx={{ width: "40px", height: "40px", borderRadius: "8px" }} />
          <Box className="fs-20-regular white">{game?.title}</Box>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
          <Box component={"img"} src={CONST_CHAIN_ICONS.SOLAR} alt="game" sx={{ width: "24px", height: "24px" }} />
          <Box className="fs-20-regular white">{numeral(game?.price + sxpFee).format("0.0")}</Box>
        </Stack>
      </Stack>

      <Box sx={{ width: "100%", border: "1px solid #ffffff33", borderRadius: "16px" }}>
        {isInsufficient ? (
          <Stack direction={"column"} gap={"16px"} padding={"24px 16px"}>
            <Box className="fs-20-regular white">{t("pur-11_there-are-insufficient")}</Box>

            <Stack direction={"column"} gap={"8px"}>
              <Box className="fs-16-regular light">{`${t("pur-9_your-current-balance")}:`}</Box>
              <Stack direction={"column"} gap={"4px"}>
                <Box className="fs-16-regular white">{numeral(sxpBalance).format("0,0.00")} SXP</Box>
                <Box className="fs-16-regular light">$ {numeral(sxpBalance * sxpPrice).format("0,0.00")}</Box>
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} padding={"24px 16px"}>
            <Stack direction={"column"} gap={"8px"}>
              <Box className="fs-16-regular light">{`${t("pur-9_your-current-balance")}:`}</Box>
              <Stack direction={"column"} gap={"4px"}>
                <Box className="fs-16-regular white">{numeral(sxpBalance).format("0,0.00")} SXP</Box>
                <Box className="fs-16-regular light">$ {numeral(sxpBalance * sxpPrice).format("0,0.00")}</Box>
              </Stack>
            </Stack>
            <Box component={"img"} src={ChevronRightDouble} alt="chevron" sx={{ width: "24px", height: "24px" }} />
            <Stack direction={"column"} gap={"8px"}>
              <Box className="fs-16-regular light">{`${t("pur-10_balance-after-purchase")}:`}</Box>
              <Stack direction={"column"} gap={"4px"}>
                <Box className="fs-16-regular white">{numeral(sxpBalance - game?.price - sxpFee).format("0,0.00")} SXP</Box>
                <Box className="fs-16-regular light">$ {numeral((sxpBalance - game?.price - sxpFee) * sxpPrice).format("0,0.00")}</Box>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Box>

      <Button className={"red-button fw"} onClick={handleClick}>
        {isInsufficient ? "Top up balance" : "Purchase"}
      </Button>
    </Stack>
  );
};

export default BuyGameContent;
