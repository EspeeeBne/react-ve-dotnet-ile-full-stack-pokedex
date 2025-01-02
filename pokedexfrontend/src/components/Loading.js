import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Loading = ({ disableShrink = false, size = 40 }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <CircularProgress
        size={size}
        disableShrink={disableShrink}
        sx={{
          color: theme.palette.primary.main,
        }}
      />
    </Box>
  );
};

export default Loading;
