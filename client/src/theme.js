import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    common: {
      black: "rgba(153, 170, 181, 1)",
      white: "rgba(153, 170, 181, 1)"
    },
    background: {
      paper: "rgba(44, 47, 51, 1)",
      default: "rgba(35, 39, 42, 1)"
    },
    primary: {
      light: "#7986cb",
      main: "rgba(114, 137, 218, 1)",
      dark: "#303f9f",
      contrastText: "#fff"
    },
    secondary: {
      light: "rgba(218, 156, 156, 1)",
      main: "rgba(118, 127, 161, 1)",
      dark: "rgba(53, 74, 144, 1)",
      contrastText: "#fff"
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff"
    },
    text: {
      primary: "rgba(255, 255, 255, 1)",
      secondary: "rgba(212, 212, 212, 0.54)",
      disabled: "rgba(255, 255, 255, 0.38)",
      hint: "rgba(230, 192, 192, 0.38)"
    },
    action: {
      disabled: "rgba(255, 255, 255, 0.38)"
    }
  }
});
