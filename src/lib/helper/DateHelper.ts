export const formatDateAsMMDDYYYY = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}.${date.getFullYear()}`;
    return formattedDate;
  } catch (err) {
    console.error("Failed to formatDateAsMMDDYYYY: ", err);
    return "";
  }
};

export const formatUnixTime = (unix: number): string => {
  const date = new Date(unix * 1000); // Unix timestamps are in seconds, so multiply by 1000 for milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};
