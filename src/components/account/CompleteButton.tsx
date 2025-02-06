import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@mui/material";

import { decrypt } from "../../lib/helper/EncryptHelper";

import { IAccount } from "../../types/AccountTypes";

export interface IPropsCompleteButton {
  account: IAccount;
}

const CompleteButton = ({ account }: IPropsCompleteButton) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCompleteButton = useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      e.preventDefault();
      e.stopPropagation();

      const decryptedMnemonic = await decrypt(account?.mnemonic, "");
      navigate("/non-custodial-import-1/guest", { state: { passphrase: decryptedMnemonic } });
    } catch (err) {
      console.error("Failed to handleCompleteButton: ", err);
    }
  }, []);

  return (
    <Button
      onClick={handleCompleteButton}
      sx={{
        padding: "5px 6px",
        color: "#52e1f2",
        fontFamily: "Cobe",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        borderRadius: "12px",
        border: "1px solid #ef4444",
        backgroundColor: "transparent",
        textTransform: "none",
        alignSelf: "flex-end",
        "&:hover": {
          backgroundColor: "#992727",
          border: "1px solid #992727",
          color: "white",
        },
        "&.Mui-disabled": {
          border: "1px solid #2a2525",
          color: "#7c7c7c",
        },
      }}
    >
      {t("ncca-62_complete")}
    </Button>
  );
};

export default CompleteButton;
