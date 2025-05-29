import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Modal, Fade } from "@mui/material";
import { useWallet } from "../../../providers/WalletProvider";
import MetamaskImportContent from "./MetamaskImportContent";
import { getWallet } from "../../../store/WalletSlice";
import { IWalletAddresses } from "../../../types/WalletTypes";
import closeIcon from "../../../assets/setting/XIcon.svg";
import MetamaskPasswordContent from "./MetamaskPasswordContent";

interface props {
  open: boolean;
  setOpen: (status: boolean) => void;
}

const MetamaskImportModal = ({ open, setOpen }: props) => {
  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const walletStore: IWalletAddresses = useSelector(getWallet);
  const { getEthPrivateKey, getPassphrase } = useWallet();

  const [content, setContent] = useState<string>("metamask-password");
  const [ethPrivateKey, setEthPrivateKey] = useState<string>("");

  const ethWalletAddress = useMemo(() => walletStore?.ethereum, [walletStore]);

  const confirmPassword = async (password: string) => {
    try {
      const passphrase = await getPassphrase(password);
      const newEthPrivateKey = await getEthPrivateKey(passphrase);
      if (!newEthPrivateKey) {
        throw new Error("Failed to retrieve private key. Please check your password.");
      }
      setEthPrivateKey(newEthPrivateKey);
      setContent("metamask-import");
    } catch (err) {
      console.error("Failed to confirmPassword: ", err);
      setOpen(false);
    }
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
        <Box
          sx={{
            width: "480px",
            padding: "40px 24px 24px",
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
          <img src={closeIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
          {content === "metamask-password" && <MetamaskPasswordContent confirmPassword={confirmPassword} />}
          {content === "metamask-import" && <MetamaskImportContent ethWalletAddress={ethWalletAddress} ethPrivateKey={ethPrivateKey} setOpen={setOpen} />}
        </Box>
      </Fade>
    </Modal>
  );
};

export default MetamaskImportModal;
