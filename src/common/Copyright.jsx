import { Typography } from "@mui/material";

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <a
        color="inherit"
        href="https://www.upgrad.com/"
        target="_blank"
        rel="noreferrer"
      >
        upGrad
      </a>{" "}
      {2024}
      {"."}
    </Typography>
  );
};

export default Copyright;