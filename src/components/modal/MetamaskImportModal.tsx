import { useSelector } from "react-redux";
import { QRCodeSVG } from "qrcode.react";

import { Box, Stack, Modal, Fade, Button } from "@mui/material";

import { useWallet } from "../../providers/WalletProvider";

import { getWallet } from "../../store/WalletSlice";

import { IWalletAddresses } from "../../types/WalletTypes";

import MetamaskImage from "../../assets/wallet/Metamask.png";
import closeIcon from "../../assets/setting/XIcon.svg";
import { useMemo } from "react";
import { useMetamask } from "../../providers/MetamaskCustomProvider";

interface props {
  open: boolean;
  setOpen: (status: boolean) => void;
}

const MetamaskImportModal = ({ open, setOpen }: props) => {
  const walletStore: IWalletAddresses = useSelector(getWallet);
  const { ethPrivateKey } = useWallet();
  const { connect } = useMetamask();

  const ethWalletAddress = useMemo(() => walletStore?.ethereum, [walletStore]);

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

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
        <Box className="modal-content oauth-modal">
          <img src={closeIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
          <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"30px"}>
            <Box className="fs-24-regular" sx={{ color: "#52e1f2" }}>{`Mobile Metamask can scan this QR code to import tymt account`}</Box>
            <Box className="fs-14-regular white">{ethWalletAddress}</Box>
            <QRCodeSVG
              value={ethPrivateKey}
              size={250}
              marginSize={1}
              level={"L"}
              imageSettings={{
                src: MetamaskImage,
                x: undefined,
                y: undefined,
                height: 30,
                width: 30,
                excavate: true,
              }}
            />
            <Box className="fs-14-regular light">{`After importing, you still need to connect your mobile metamask with tymt.`}</Box>
            <Button
              fullWidth
              className={"red-button"}
              onClick={() => {
                setOpen(false);
                connect();
              }}
            >{`Next to connect`}</Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MetamaskImportModal;
