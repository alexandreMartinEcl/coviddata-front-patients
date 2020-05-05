/**
 * Display information snackbar
 * @param {string} msg
 * @param {string} infoType either 'success', 'error', 'info' or 'warning'
 */
const uiInform = (message, severity) => {
  return { type: "SNACKBAR_OPEN", message, severity };
};

const clearSnackbar = () => {
  return { type: "SNACKBAR_CLEAR" };
};

export default {
  uiInform,
  clearSnackbar,
};
