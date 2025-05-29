import { useCallback, useEffect, useState } from "react";
import { Modal, Fade, Box } from "@mui/material";

import { CONST_NOTIFICATION_CONTENTS } from "../../../const/NotificationConsts";
import tymtCore from "../../../lib/core/tymtCore";
import { useWallet } from "../../../providers/WalletProvider";
import { useNotification } from "../../../providers/NotificationProvider";
import BuyGameContent from "./BuyGameContent";
import ConfirmPasswordContent from "./ConfirmPasswordContent";
import ThankContent from "./ThankContent";

import { IGame } from "../../../types/GameTypes";
import { IRecipient } from "../../../types/TransactionTypes";

import GameAPI from "../../../lib/api/GameAPI";

export interface IPropsBuyGameModal {
  open: boolean;
  setOpen: (_: boolean) => void;
  game: IGame;
  setPurchased: (_: boolean) => void;
}

const BuyGameModal = ({ open, setOpen, game, setPurchased }: IPropsBuyGameModal) => {
  const { sxpFee, getPassphrase } = useWallet();
  const { showNotification } = useNotification();

  const [content, setContent] = useState<string>("buy-game");
  const [sendingTransaction, setSendingTransaction] = useState<boolean>(false);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(false);
  const [gamePriceInSXP, setGamePriceInSXP] = useState<number>(0);

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const fetchGamePriceInSXP = useCallback(async () => {
    setLoadingPrice(true);
    GameAPI.fetchGamePriceInSXP(game?._id)
      .then((res) => {
        setGamePriceInSXP(res?.data?.price as number);
      })
      .catch((err) => {
        console.error("Failed to fetchGamePriceInSXP: ", err);
        setGamePriceInSXP(0);
      })
      .finally(() => {
        setLoadingPrice(false);
      });
  }, [game]);

  const purchaseGame = async () => {
    setContent("confirm-password");
  };

  const confirmPurchase = useCallback(
    async (password: string) => {
      try {
        setSendingTransaction(true);

        const resOrder = await GameAPI.postGameOrder(game?._id);
        const orderId = resOrder?.data?.order_id;
        const recipientAddress = resOrder?.data?.recipient_solar_address;
        const amount = resOrder?.data?.price.toString();

        const recipient: IRecipient = {
          address: recipientAddress,
          amount: amount,
        };
        const passphrase = await getPassphrase(password);
        const res = await tymtCore.Blockchains.solar.wallet.sendTransaction(passphrase, { recipients: [recipient], fee: sxpFee.toString() });

        if (res.success) {
          showNotification({ content: CONST_NOTIFICATION_CONTENTS.TX_SENT_SUCCESS });
          const txId = res?.message;
          const resPurchase = await GameAPI.postGamePurchase(orderId, txId);
          console.log("Purchase response: ", resPurchase);
          setPurchased(true);
          setContent("thank-purchase");
        } else {
          showNotification({ content: CONST_NOTIFICATION_CONTENTS.TX_SENT_FAIL, text: res.error });
          console.error("Error confirming purchase: ", res.error);
          setOpen(false);
        }
      } catch (err) {
        console.error("Error confirming purchase: ", err);
        setOpen(false);
      } finally {
        setSendingTransaction(false);
      }
    },
    [sxpFee, game, tymtCore]
  );

  useEffect(() => {
    if (open) {
      setContent("buy-game");
      fetchGamePriceInSXP();
    }
  }, [open, fetchGamePriceInSXP]);

  return (
    <>
      <Modal
        open={open}
        style={modalStyle}
        onClose={() => setOpen(false)}
        sx={{
          backdropFilter: "blur(4px)",
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              width: content === "thank-purchase" ? "360px" : "480px",
              padding: content === "thank-purchase" ? "24px" : "40px 24px 24px",
              borderRadius: "16px",
              border: "3px solid #ffffff33",
              background: "#8080804d",
              backgroundBlendMode: "luminosity",
              transition: "all 0.3s ease-in-out", // Added transition
              "&:focusVisible": {
                outline: "none",
              },
            }}
          >
            {content === "buy-game" && <BuyGameContent game={game} purchaseGame={purchaseGame} loadingPrice={loadingPrice} gamePriceInSXP={gamePriceInSXP} />}
            {content === "confirm-password" && <ConfirmPasswordContent confirmPurchase={confirmPurchase} sendingTransaction={sendingTransaction} />}
            {content === "thank-purchase" && <ThankContent game={game} setOpen={setOpen} />}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default BuyGameModal;
