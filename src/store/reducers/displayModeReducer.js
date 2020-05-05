const displayModeReducer = (state = {}, action) => {
  if (typeof state.value === "undefined")
    state.value = localStorage.getItem("gardeMode") === "true";
  switch (action.type) {
    case "DISPLAY_MODE_GARDE":
      return {
        ...state,
        gardeMode: action.value,
      };
    default:
      return state;
  }
};

export default displayModeReducer;
