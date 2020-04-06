import { createMuiTheme } from '@material-ui/core/styles';
import { frFR } from "@material-ui/core/locale";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#228F80',
            light: '#64BCB0',
            dark: '#026154'
        },
        secondary: {
            main: '#2F5597',
            light: '#708EC2',
            dark: '#194180',
            contrastText: '#f5f0f6'
        },
        danger : {
            main: '#DC3444',
            light: '#E4A636'
        }
    }
}, frFR);

export default theme;
