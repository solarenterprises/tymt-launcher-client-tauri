import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";

import { Box, Stack, Modal, Button, Fade } from "@mui/material";

import { getWallet } from "../../store/WalletSlice";

import { getCurrentChainWalletAddress } from "../../lib/helper/WalletHelper";

import { IWalletAddresses } from "../../types/WalletTypes";
import { ISupportChain } from "../../types/ChainTypes";

import closeIcon from "../../assets/setting/XIcon.svg";
import copyIcon from "../../assets/setting/CopyIcon.svg";
import TooltipComponent from "../home/TooltipComponent";

export interface IPropsQrModal {
  supportChain: ISupportChain;
  open: boolean;
  setOpen: (_: boolean) => void;
}

const QrModal = ({ supportChain, open, setOpen }: IPropsQrModal) => {
  const { t } = useTranslation();

  const [copied, setCopied] = useState<boolean>(false);

  const walletStore: IWalletAddresses = useSelector(getWallet);

  const currentWallet = useMemo(() => getCurrentChainWalletAddress(walletStore, supportChain?.native?.name), [walletStore]);

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const handleCopyClicked = useCallback(() => {
    setCopied(true);
    navigator.clipboard.writeText(currentWallet);
    setTimeout(() => setCopied(false), 1000);
  }, [currentWallet]);

  return (
    <Modal
      open={open}
      style={modalStyle}
      onClose={() => setOpen(false)}
      sx={{
        backdropFilter: "blur(4px)",
      }}
    >
      <Fade in={open}>
        <Stack direction={"column"} alignItems={"center"} textAlign={"center"} className="modal-content qr-modal">
          <Stack direction={"row"} justifyContent={"space-between"} sx={{ width: "100%" }}>
            <Stack direction={"row"} alignItems={"center"} className="" gap={"10px"}>
              <Box component={"img"} src={supportChain?.native?.logo} width={"32px"} height={"32px"} />
              <Box className="fs-h3 white">{supportChain?.native?.name}</Box>
            </Stack>
            <Stack className="center-align" onClick={() => setOpen(false)} sx={{ cursor: "pointer" }}>
              <img src={closeIcon} />
            </Stack>
          </Stack>
          <Stack className="qr-container" direction={"column"} alignItems={"center"} textAlign={"center"}>
            <Box className="center-align" sx={{ width: "150px" }}>
              <QRCodeSVG
                value={currentWallet}
                size={150}
                level={"L"}
                marginSize={1}
                imageSettings={{
                  src: supportChain?.native?.logo,
                  x: undefined,
                  y: undefined,
                  height: 20,
                  width: 20,
                  excavate: true,
                }}
              />
            </Box>
            <Stack direction={"row"} className="qr-container" gap={"10px"}>
              <Stack direction={"column"} textAlign={"left"}>
                <Box className="fs-14-light light">{t("set-67_address")}</Box>
                <Box className="fs-14-regular qr-address"> {currentWallet.substring(0, 10) + "..." + currentWallet.substring(currentWallet.length - 10)}</Box>
              </Stack>

              <Button className="center-align tooltip-btn" sx={{ cursor: "pointer", display: "flex" }} onClick={handleCopyClicked}>
                <TooltipComponent placement="bottom" text={copied ? "Copied" : t("set-79_copy-address")}>
                  <img src={copyIcon} />
                </TooltipComponent>
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Fade>
    </Modal>
  );
};

export default QrModal;
