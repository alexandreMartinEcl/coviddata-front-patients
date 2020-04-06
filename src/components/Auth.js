import React from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import config from "../config";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: 2, //theme.spacing.unit,
    marginRight: 2, //theme.spacing.unit,
    width: 200,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  btnLine: {
    margin: "15px",
  },
  buttonProgress: {
    color: "#60E73C",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

function Auth({ then, ...props }) {
  const classes = useStyles();
  const { id } = useParams();
  const [formData, setFormData] = React.useState({});
  const [loadingAuth, setLoadingAuth] = React.useState({});
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState("");

  const handleChange = (event) => {
    let data = Object.assign({}, formData);
    data[event.target.id] = event.target.value;
    setFormData(data);
  };

  const closeSnackBar = () => {
    setSnackbarOpen(false);
  };

  const onSubmitAuthenticate = () => {
    setLoadingAuth(true);

    const url = `${config.path.auth}${id}/`;

    axios({
      method: "post",
      url,
      data: formData,
      ...config.axios,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        console.log(res);
        setLoadingAuth(false);
        then();
      })
      .catch((err) => {
        console.log(err);
        setErrMsg(err.response);
        setSnackbarOpen(true);
        setLoadingAuth(false);
      });
  };

  return (
    <Container>
      <p className={classes.whiteText}>Merci de vous connecter </p>
      <TextField
        label="Identifiant AP-HP"
        id="username"
        defaultValue=""
        onChange={this.handleChange}
        // labelClassName={classes.whiteText}
        // helperTextClassName={classes.whiteText}
        // InputProps={{className: classes.whiteText}}
        className={classes.textField}
        helperText="Numéro de 4 à 7 chiffres"
      />

      <TextField
        label="Mot de passe"
        id="password"
        defaultValue=""
        onChange={this.handleChange}
        // labelClassName={classes.whiteText}
        // helperTextClassName={classes.whiteText}
        // InputProps={{className: classes.whiteText}}
        className={classes.textField}
        //helperText="Some important text"
      />

      <div className={classes.btnLine}>
        <div className={classes.wrapper}>
          <Button
            variant="flat"
            color="secondary"
            onClick={onSubmitAuthenticate}
          >
            Se connecter
          </Button>
          {loadingAuth && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackBar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={closeSnackBar}
          severity="error"
        >
          La requête a échoué {errMsg}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

export default Auth;
