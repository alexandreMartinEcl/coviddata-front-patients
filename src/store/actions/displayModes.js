const setGardeMode = (value) => {
    localStorage.setItem("gardeMode", value)
    return { type: "DISPLAY_MODE_GARDE", value };
};

export default {
    setGardeMode,
}