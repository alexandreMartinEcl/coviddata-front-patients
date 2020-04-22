import { AxiosResponse } from "axios";

/**
 * This callback type is called `requestCallback` and is displayed as a global symbol.
 *
 * @callback uiInform
 * @param {string} msg
 * @param {string} infoType either 'success', 'error', 'info' or 'warning'
 */

/**
 *
 * @param {AxiosResponse} errResp response from request error returned from axios
 * @param {uiInform} uiInform
 */
export function manageError(errResp, uiInform) {
  console.log(errResp);
  if (!errResp) {
    uiInform &&
      uiInform(
        "Erreur inconnue (pas de données fournies), merci de prévenir le support",
        "error"
      );
    return;
  }

  let errMsg = "";
  if (errResp.data.code === 404) {
    errMsg = "URL incorrecte, merci de prévenir le support";
  } else if (errResp.data) {
    errMsg = `Echec: ${Object.entries(errResp.data)
      .map(([type, info]) => `(${type}) ${info}`)
      .join("\n")}`;
  } else {
    errMsg = "Erreur inconnue, merci de prévenir le support";
  }

  uiInform && uiInform(errMsg, "error");
}
