import { Box, Stack } from "@mui/material";

interface props {
  number?: string;
  word?: string;
  confirmedPassphrase: string[];
  setConfirmedPassphrase: (_: string[]) => void;
  selectedInput: number;
  setSelectedInput: (_: number) => void;
}

const MnemonicRandomWord = ({ number, word, confirmedPassphrase, setConfirmedPassphrase, selectedInput, setSelectedInput }: props) => {
  return (
    <Box
      className="mnemonic-word-box"
      onClick={() => {
        setConfirmedPassphrase(confirmedPassphrase.map((_, index) => (index === selectedInput - 1 ? word : confirmedPassphrase[index])));
        setSelectedInput(selectedInput + 1 > 3 ? 3 : selectedInput + 1);
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        sx={{
          width: "100%",
          padding: "8px 16px",
        }}
        spacing={"8px"}
      >
        <Box className={"fs-16-regular light"}>{number}</Box>
        <Box className={"fs-14-regular white"}>{word}</Box>
      </Stack>
    </Box>
  );
};

export default MnemonicRandomWord;
