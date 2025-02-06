import { useTranslation } from "react-i18next";

import { Box } from "@mui/material";

import MnemonicInput from "./MnemonicInput";

export interface IPropsMnemonicConfirm {
  confirmedPassphrase: string[];
  selectedInput: number;
  setSelectedInput: (_: number) => void;
}

const MnemonicConfirm = ({ confirmedPassphrase, selectedInput, setSelectedInput }: IPropsMnemonicConfirm) => {
  const { t } = useTranslation();

  return (
    <div>
      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div
          style={{ width: "163px", height: "69px" }}
          onClick={() => {
            setSelectedInput(1);
          }}
        >
          <Box className={"fs-14-regular light m-b-8"}>{t("ncca-33_third-word")}</Box>
          <MnemonicInput word={confirmedPassphrase[0] ?? ""} focus={selectedInput === 1} />
        </div>
        <div
          style={{
            width: "163px",
            height: "69px",
            marginLeft: "13px",
            marginRight: "13px",
          }}
          onClick={() => {
            setSelectedInput(2);
          }}
        >
          <Box className={"fs-14-regular light m-b-8"}>{t("ncca-34_sixth-word")}</Box>
          <MnemonicInput word={confirmedPassphrase[1] ?? ""} focus={selectedInput === 2} />
        </div>
        <div
          style={{ width: "163px", height: "69px" }}
          onClick={() => {
            setSelectedInput(3);
          }}
        >
          <Box className={"fs-14-regular light m-b-8"}>{t("ncca-35_ninth-word")}</Box>
          <MnemonicInput word={confirmedPassphrase[2] ?? ""} focus={selectedInput === 3} />
        </div>
      </div>
    </div>
  );
};

export default MnemonicConfirm;
