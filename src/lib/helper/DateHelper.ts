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
