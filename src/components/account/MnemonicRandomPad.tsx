import MnemonicRandomWord from "./MnemonicRandomWord";
import { shuffleArray } from "../../lib/helper/WalletHelper";

export interface IPropsMnemonicRandomPad {
  passphrase: string;
  confirmedPassphrase: string[];
  setConfirmedPassphrase: (_: string[]) => void;
  selectedInput: number;
  setSelectedInput: (_: number) => void;
}

const MnemonicRandomPad = ({ passphrase, confirmedPassphrase, setConfirmedPassphrase, selectedInput, setSelectedInput }: IPropsMnemonicRandomPad) => {
  const temp = passphrase.split(" ");
  const mnemonic = shuffleArray(temp);

  return (
    <div
      style={{
        border: "1px solid rgb(23, 32, 33)",
        borderRadius: "16px",
        padding: "8px",
      }}
    >
      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord
            number={"1"}
            word={mnemonic[0]}
            confirmedPassphrase={confirmedPassphrase}
            setConfirmedPassphrase={setConfirmedPassphrase}
            selectedInput={selectedInput}
            setSelectedInput={setSelectedInput}
          />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord
            number={"2"}
            word={mnemonic[1]}
            confirmedPassphrase={confirmedPassphrase}
            setConfirmedPassphrase={setConfirmedPassphrase}
            selectedInput={selectedInput}
            setSelectedInput={setSelectedInput}
          />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord
            number={"3"}
            word={mnemonic[2]}
            confirmedPassphrase={confirmedPassphrase}
            setConfirmedPassphrase={setConfirmedPassphrase}
            selectedInput={selectedInput}
            setSelectedInput={setSelectedInput}
          />
        </div>
      </div>
      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord
            number={"4"}
            word={mnemonic[3]}
            confirmedPassphrase={confirmedPassphrase}
            setConfirmedPassphrase={setConfirmedPassphrase}
            selectedInput={selectedInput}
            setSelectedInput={setSelectedInput}
          />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord
            number={"5"}
            word={mnemonic[4]}
            confirmedPassphrase={confirmedPassphrase}
            setConfirmedPassphrase={setConfirmedPassphrase}
            selectedInput={selectedInput}
            setSelectedInput={setSelectedInput}
          />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord
            number={"6"}
            word={mnemonic[5]}
            confirmedPassphrase={confirmedPassphrase}
            setConfirmedPassphrase={setConfirmedPassphrase}
            selectedInput={selectedInput}
            setSelectedInput={setSelectedInput}
          />
        </div>
      </div>
      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord
            number={"7"}
            word={mnemonic[6]}
            confirmedPassphrase={confirmedPassphrase}
            setConfirmedPassphrase={setConfirmedPassphrase}
            selectedInput={selectedInput}
            setSelectedInput={setSelectedInput}
          />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord
            number={"8"}
            word={mnemonic[7]}
            confirmedPassphrase={confirmedPassphrase}
            setConfirmedPassphrase={setConfirmedPassphrase}
            selectedInput={selectedInput}
            setSelectedInput={setSelectedInput}
          />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord
            number={"9"}
            word={mnemonic[8]}
            confirmedPassphrase={confirmedPassphrase}
            setConfirmedPassphrase={setConfirmedPassphrase}
            selectedInput={selectedInput}
            setSelectedInput={setSelectedInput}
          />
        </div>
      </div>
      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord
            number={"10"}
            word={mnemonic[9]}
            confirmedPassphrase={confirmedPassphrase}
            setConfirmedPassphrase={setConfirmedPassphrase}
            selectedInput={selectedInput}
            setSelectedInput={setSelectedInput}
          />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord
            number={"11"}
            word={mnemonic[10]}
            confirmedPassphrase={confirmedPassphrase}
            setConfirmedPassphrase={setConfirmedPassphrase}
            selectedInput={selectedInput}
            setSelectedInput={setSelectedInput}
          />
        </div>
        <div style={{ width: "151px", height: "42px", padding: "8px" }}>
          <MnemonicRandomWord
            number={"12"}
            word={mnemonic[11]}
            confirmedPassphrase={confirmedPassphrase}
            setConfirmedPassphrase={setConfirmedPassphrase}
            selectedInput={selectedInput}
            setSelectedInput={setSelectedInput}
          />
        </div>
      </div>
      {mnemonic.length === 24 && (
        <>
          <div
            style={{
              width: "520px",
              display: "flex",
            }}
          >
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord
                number={"13"}
                word={mnemonic[12]}
                confirmedPassphrase={confirmedPassphrase}
                setConfirmedPassphrase={setConfirmedPassphrase}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
              />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord
                number={"14"}
                word={mnemonic[13]}
                confirmedPassphrase={confirmedPassphrase}
                setConfirmedPassphrase={setConfirmedPassphrase}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
              />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord
                number={"15"}
                word={mnemonic[14]}
                confirmedPassphrase={confirmedPassphrase}
                setConfirmedPassphrase={setConfirmedPassphrase}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
              />
            </div>
          </div>
          <div
            style={{
              width: "520px",
              display: "flex",
            }}
          >
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord
                number={"16"}
                word={mnemonic[15]}
                confirmedPassphrase={confirmedPassphrase}
                setConfirmedPassphrase={setConfirmedPassphrase}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
              />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord
                number={"17"}
                word={mnemonic[16]}
                confirmedPassphrase={confirmedPassphrase}
                setConfirmedPassphrase={setConfirmedPassphrase}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
              />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord
                number={"18"}
                word={mnemonic[17]}
                confirmedPassphrase={confirmedPassphrase}
                setConfirmedPassphrase={setConfirmedPassphrase}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
              />
            </div>
          </div>
          <div
            style={{
              width: "520px",
              display: "flex",
            }}
          >
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord
                number={"19"}
                word={mnemonic[18]}
                confirmedPassphrase={confirmedPassphrase}
                setConfirmedPassphrase={setConfirmedPassphrase}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
              />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord
                number={"20"}
                word={mnemonic[19]}
                confirmedPassphrase={confirmedPassphrase}
                setConfirmedPassphrase={setConfirmedPassphrase}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
              />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord
                number={"21"}
                word={mnemonic[20]}
                confirmedPassphrase={confirmedPassphrase}
                setConfirmedPassphrase={setConfirmedPassphrase}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
              />
            </div>
          </div>
          <div
            style={{
              width: "520px",
              display: "flex",
            }}
          >
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord
                number={"22"}
                word={mnemonic[21]}
                confirmedPassphrase={confirmedPassphrase}
                setConfirmedPassphrase={setConfirmedPassphrase}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
              />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord
                number={"23"}
                word={mnemonic[22]}
                confirmedPassphrase={confirmedPassphrase}
                setConfirmedPassphrase={setConfirmedPassphrase}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
              />
            </div>
            <div style={{ width: "151px", height: "42px", padding: "8px" }}>
              <MnemonicRandomWord
                number={"24"}
                word={mnemonic[23]}
                confirmedPassphrase={confirmedPassphrase}
                setConfirmedPassphrase={setConfirmedPassphrase}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MnemonicRandomPad;
