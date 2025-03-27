import { Avatar } from "@mui/material";

const TextAvatar = ({ text = "?" }) => {
  // ✅ Đảm bảo text luôn là string
  const safeText = text || "?";

  // ✅ Tránh lỗi khi text bị undefined hoặc rỗng
  const stringToColor = (str = "") => {
    if (!str) return "#000"; // Màu mặc định nếu chuỗi không hợp lệ

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  return (
    <Avatar
      sx={{
        backgroundColor: stringToColor(safeText),
        width: 40,
        height: 40,
      }}
    >
      {safeText.trim().length > 0 ? safeText.split(" ")[0][0].toUpperCase() : "?"}
    </Avatar>
  );
};

export default TextAvatar;
