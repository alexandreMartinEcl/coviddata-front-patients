import React, { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    // case "add":
    //     return [...state, initialStyle];
    // case "remove":
    //     const { index } = action;
    //     return state.filter((_, i) => i !== index);
    case "set":
      const { index, value } = action;
      return state.map((e, i) => (i === index ? value : e));
    default:
      throw new Error("Missing type");
  }
}

function useArrayReducer(initialArray) {
  return useReducer(reducer, initialArray);
}

export default useArrayReducer;
