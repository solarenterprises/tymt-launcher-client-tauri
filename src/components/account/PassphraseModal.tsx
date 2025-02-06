import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Box, Stack, Modal, Fade } from "@mui/material";

import closeIcon from "../../assets/setting/XIcon.svg";
import encryptIcon from "../../assets/account/EncryptIcon.svg";
import infoIcon from "../../assets/account/InfoIcon.svg";
import benefitImg from "../../assets/account/Benefit.svg";

export interface IPropsPassphraseModal {
  open: boolean;
  setOpen: (_: boolean) => void;
  passphrase: string;
  password: string;
}

const PassphraseModal = ({ open, setOpen, passphrase, password }: IPropsPassphraseModal) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Modal
      open={open}
      style={modalStyle}
      sx={{
        backdropFilter: "blur(2px)",
      }}
      onClose={() => setOpen(false)}
    >
      <Fade in={open}>
        <Box
          className="modal-content benefit-modal"
          sx={{
            backdropFilter: "blur(10px)",
            maxHeight: "80%",
            overflowY: "auto",
            scrollbarWidth: "none", // For Firefox
            "&::-webkit-scrollbar": {
              display: "none", // For Chrome, Safari, and Edge
            },
          }}
        >
          <img src={closeIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
          <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
            <Box>
              <img src={benefitImg} alt="benefit" />
            </Box>
            <Box className="fs-h3 white">{t("ncca-22_securing-your-crypto")} </Box>
            <Box className="fs-16-light light">{t("ncca-23_walk-through-mnemonic")}</Box>
            <Stack direction={"row"} className="m-tb-10" gap={"15px"}>
              <Box className="center-align">
                <img src={encryptIcon} />
              </Box>
              <Stack direction={"column"} gap={"10px"} textAlign={"left"}>
                <Box className="fs-h4 white">{t("ncca-24_what-is-mnemonic")}:</Box>
                <Box className="fs-14-light light">{t("ncca-25_mnemonic-is-words")}</Box>
              </Stack>
            </Stack>
            <Stack direction={"row"} className="m-tb-10" gap={"15px"}>
              <Box className="center-align">
                <img src={infoIcon} />
              </Box>
              <Stack direction={"column"} gap={"10px"} textAlign={"left"}>
                <Box className="fs-h4 white">{t("ncca-26_importance-of-mnemonic")}:</Box>
                <Box className="fs-14-light light">{`• ${t("ncca-27_backup-and-recovery")}`}</Box>
                <Box className="fs-14-light light">{`• ${t("ncca-28_storing-your-key")}`}</Box>
              </Stack>
            </Stack>
            <Box
              onClick={() =>
                navigate("/non-custodial-signup-3", {
                  state: { passphrase: passphrase, password: password }, // Pass the passphrase here
                })
              }
              className="action-btn fs-18-light blue center-align"
              sx={{ minWidth: "100%" }}
            >
              {t("wc-26_got-it")}
            </Box>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PassphraseModal;
