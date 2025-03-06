import { Box, Button, Divider, Stack, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import backIcon from "../../assets/setting/BackIcon.svg";
import editIcon from "../../assets/setting/EditIcon.svg";
import deleteIcon from "../../assets/setting/TrashIcon.svg";
import InputText from "../../components/account/InputText";
import emptyImg from "../../assets/setting/EmptyAddress.svg";
import { selectAddress, setAddress } from "../../store/AddressSlice";
import { FC, useCallback, useState } from "react";
import { IAddress } from "../../types/SettingTypes";

interface IPropsAddress {
  view: string;
  setView: (panel: string) => void;
}

const Address: FC<IPropsAddress> = ({ view, setView }) => {
  const dispatch = useDispatch();
  const data: IAddress[] = useSelector(selectAddress);
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [status, setStatus] = useState("normal");
  const [seq, setSeq] = useState(-1);
  const { t } = useTranslation();

  const updateAddress = useCallback(() => {
    setStatus("normal");
    if (seq == -1) {
      const updatedData = [...data, { name: name, address: info }];
      dispatch(setAddress(updatedData));
    } else {
      const updateData = [...data];
      updateData[seq] = { name: name, address: info };
      dispatch(setAddress(updateData));
    }
  }, [data, dispatch, name, info, seq]);

  const editAddress = useCallback(
    (index: number) => {
      setStatus("edit");
      const { name, address } = data[index];
      setName(name);
      setInfo(address);
      setSeq(index);
    },
    [data]
  );

  const deleteAddress = useCallback(
    (deleteId: number) => {
      const updatedData = data.filter((_, index) => index !== deleteId);
      dispatch(setAddress(updatedData));
    },
    [data, dispatch]
  );

  return (
    <>
      {view === "address" && (
        <Stack direction={"column"}>
          <input type="file" id="file-input" style={{ display: "none" }} />
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className="common-btn">
              {status === "normal" && (
                <Button className={"setting-back-button"} onClick={() => setView("wallet")}>
                  <Box component={"img"} src={backIcon}></Box>
                </Button>
              )}
              {status === "add" && (
                <Button className={"setting-back-button"} onClick={() => setStatus("normal")}>
                  <Box component={"img"} src={backIcon}></Box>
                </Button>
              )}
              {status === "edit" && (
                <Button className={"setting-back-button"} onClick={() => setStatus("normal")}>
                  <Box component={"img"} src={backIcon}></Box>
                </Button>
              )}
            </Button>
            <Box className="fs-h3 white">
              {status === "normal" && t("set-61_address-book")}
              {status === "add" && t("set-62_add-address")}
              {status === "edit" && t("set-78_edit-address")}
            </Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          {status === "normal" && (
            <>
              {data.length === 0 && (
                <Stack direction={"column"} justifyContent={"center"} textAlign={"center"} alignItems={"center"} paddingTop={"20%"}>
                  <Box>
                    <img src={emptyImg} />
                  </Box>
                  <Box className="fs-h4 white">{t("set-63_address-book-empty")}</Box>
                  <Box padding={"20px"} width={"90%"} sx={{ position: "absolute", bottom: "30px" }}>
                    <Button
                      fullWidth
                      sx={{
                        "&.MuiButtonBase-root": {
                          textTransform: "none",
                          fontSize: "18px",
                          fontStyle: "normal",
                          fontWeight: "400",
                          lineHeight: "24px" /* 133.333% */,
                          letterSpacing: "-0.36px",
                          height: "46px",
                          borderRadius: "16px",
                          backgroundColor: "transparent",
                          color: "#52E1F2",
                          borderColor: "#EF4444",
                          fontFamily: "Cobe",
                          boxShadow: "none",
                          border: "1px solid",
                          paddingTop: "5px",
                          "&:hover": {
                            borderColor: "#EF4444",
                            backgroundColor: "#EF4444",
                          },
                          "&:active": {
                            backgroundColor: "#EF4444",
                            boxShadow: "1px 1px #EF44445F",
                          },
                          "&:disabled": {
                            backgroundColor: "#222222", // Example: light gray background
                            color: "#A0A0A0", // Example: gray text color
                            borderColor: "#222222", // Example: gray border color
                          },
                        },
                      }}
                      onClick={() => setStatus("add")}
                    >
                      {t("set-62_add-address")}
                    </Button>
                  </Box>
                </Stack>
              )}
              {data.length !== 0 && (
                <Stack direction={"column"} key={0}>
                  {data.map((item, index) => (
                    <>
                      <Box key={index}>
                        <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"30px"}>
                          <Stack direction={"column"} justifyContent={"flex-start"} gap={1} textAlign={"left"}>
                            <Box className="fs-h4 white">{item.name}</Box>
                            <Box className="fs-16-regular gray">{item.address}</Box>
                          </Stack>
                          <Stack className="center-align" direction={"row"} gap={1}>
                            <Box sx={{ display: "flex" }} className="common-btn" onClick={() => editAddress(index)}>
                              <Tooltip
                                title={t("set-82_edit")}
                                sx={{ padding: "6px 8px 6px 8px", borderRadius: "32px", border: "1px", borderColor: "#FFFFFF1A", backgroundColor: "#8080804D" }}
                              >
                                <img src={editIcon} />
                              </Tooltip>
                            </Box>
                            <Box sx={{ display: "flex" }} className="common-btn" onClick={() => deleteAddress(index)}>
                              <Tooltip
                                title={t("set-83_delete")}
                                sx={{ padding: "6px 8px 6px 8px", borderRadius: "32px", border: "1px", borderColor: "#FFFFFF1A", backgroundColor: "#8080804D" }}
                              >
                                <img src={deleteIcon} />
                              </Tooltip>
                            </Box>
                          </Stack>
                        </Stack>
                        <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
                      </Box>
                    </>
                  ))}
                  <Box padding={"20px"} width={"90%"} sx={{ position: "absolute", bottom: "30px" }} onClick={() => setStatus("add")}>
                    <Button
                      fullWidth
                      sx={{
                        "&.MuiButtonBase-root": {
                          textTransform: "none",
                          fontSize: "18px",
                          fontStyle: "normal",
                          fontWeight: "400",
                          lineHeight: "24px" /* 133.333% */,
                          letterSpacing: "-0.36px",
                          height: "46px",
                          borderRadius: "16px",
                          backgroundColor: "transparent",
                          color: "#52E1F2",
                          borderColor: "#EF4444",
                          fontFamily: "Cobe",
                          boxShadow: "none",
                          border: "1px solid",
                          paddingTop: "5px",
                          "&:hover": {
                            borderColor: "#EF4444",
                            backgroundColor: "#EF4444",
                          },
                          "&:active": {
                            backgroundColor: "#EF4444",
                            boxShadow: "1px 1px #EF44445F",
                          },
                          "&:disabled": {
                            backgroundColor: "#222222", // Example: light gray background
                            color: "#A0A0A0", // Example: gray text color
                            borderColor: "#222222", // Example: gray border color
                          },
                        },
                      }}
                    >
                      {t("set-62_add-address")}
                    </Button>
                  </Box>
                </Stack>
              )}
            </>
          )}
          {status === "add" && (
            <>
              <Stack sx={{ border: "1px solid #FFFFFF1A", padding: "24px 16px 24px 16px", borderRadius: "16px", gap: "8px" }} margin={"20px"}>
                <Box padding={"10px"}>
                  <InputText setValue={setName} id="address-name" type="text" label={t("set-64_name-for-wallet")} />
                </Box>
                <Box padding={"10px"}>
                  <InputText setValue={setInfo} id="address-wallet" type="mnemonic" label={t("set-65_recipient-address")} />
                </Box>
              </Stack>
              <Box padding={"20px"} width={"90%"} sx={{ position: "absolute", bottom: "30px" }}>
                <Button
                  fullWidth
                  sx={{
                    "&.MuiButtonBase-root": {
                      textTransform: "none",
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: "400",
                      lineHeight: "24px" /* 133.333% */,
                      letterSpacing: "-0.36px",
                      height: "46px",
                      borderRadius: "16px",
                      backgroundColor: "transparent",
                      color: "#52E1F2",
                      borderColor: "#EF4444",
                      fontFamily: "Cobe",
                      boxShadow: "none",
                      border: "1px solid",
                      paddingTop: "5px",
                      "&:hover": {
                        borderColor: "#EF4444",
                        backgroundColor: "#EF4444",
                      },
                      "&:active": {
                        backgroundColor: "#EF4444",
                        boxShadow: "1px 1px #EF44445F",
                      },
                      "&:disabled": {
                        backgroundColor: "#222222", // Example: light gray background
                        color: "#A0A0A0", // Example: gray text color
                        borderColor: "#222222", // Example: gray border color
                      },
                    },
                  }}
                  onClick={() => {
                    setSeq(-1);
                    updateAddress();
                  }}
                >
                  {t("set-57_save")}
                </Button>
              </Box>
            </>
          )}
          {status === "edit" && (
            <>
              <Stack sx={{ border: "1px solid #FFFFFF1A", padding: "24px 16px 24px 16px", borderRadius: "16px", gap: "8px" }} margin={"20px"}>
                <Box padding={"10px"}>
                  <InputText setValue={setName} id="address-name" type="text" label={t("set-64_name-for-wallet")} value={name} />
                </Box>
                <Box padding={"10px"}>
                  <InputText setValue={setInfo} id="address-wallet" type="mnemonic" label={t("set-65_recipient-address")} value={info} />
                </Box>
              </Stack>
              <Box padding={"20px"} width={"90%"} sx={{ position: "absolute", bottom: "30px" }}>
                <Button
                  fullWidth
                  sx={{
                    "&.MuiButtonBase-root": {
                      textTransform: "none",
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: "400",
                      lineHeight: "24px" /* 133.333% */,
                      letterSpacing: "-0.36px",
                      height: "46px",
                      borderRadius: "16px",
                      backgroundColor: "transparent",
                      color: "#52E1F2",
                      borderColor: "#EF4444",
                      fontFamily: "Cobe",
                      boxShadow: "none",
                      border: "1px solid",
                      paddingTop: "5px",
                      "&:hover": {
                        borderColor: "#EF4444",
                        backgroundColor: "#EF4444",
                      },
                      "&:active": {
                        backgroundColor: "#EF4444",
                        boxShadow: "1px 1px #EF44445F",
                      },
                      "&:disabled": {
                        backgroundColor: "#222222", // Example: light gray background
                        color: "#A0A0A0", // Example: gray text color
                        borderColor: "#222222", // Example: gray border color
                      },
                    },
                  }}
                  onClick={() => updateAddress()}
                >
                  {t("set-57_save")}
                </Button>
              </Box>
            </>
          )}
        </Stack>
      )}
    </>
  );
};

export default Address;
