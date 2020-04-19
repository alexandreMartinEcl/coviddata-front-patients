import { createMuiTheme } from "@material-ui/core/styles";
import { frFR } from "@material-ui/core/locale";

const theme = createMuiTheme(
  {
    palette: {
      primary: {
        main: "#228F80",
        light: "#64BCB0",
        veryLight: "#CAF1EC",
        dark: "#026154",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#2F5597",
        light: "#708EC2",
        dark: "#194180",
        veryLight: "#9DB5DD",
        contrastText: "#f5f0f6",
      },
      danger: {
        main: "#DC3444",
        light: "#F98590",
        // main: "#C28416",
        // light: '#E4A636',
      },
      background: {
        default: "#9DB5DD",
        paper: "#FFFFFF",
      },
    },
    spacing: {
      row: 1,
    },
    overrides: {
      MuiTypography: {
        body2: {
          fontSize: "0.7rem",
        },
      },
    },
  },
  frFR
);

export default theme;
