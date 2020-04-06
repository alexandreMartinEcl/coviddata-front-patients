import React from "react";
import Plotly from "react-plotly.js";

function Plot(props) {
  return (
    <Plotly
      data={[
        {
          x: [1, 2, 3],
          y: [2, 6, 3],
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "red" },
        },
        { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
      ]}
      layout={{ width: 320, height: 240, title: "A Fancy Plot" }}
      config={{ responsive: true }}
    />
  );
}

export default Plot;
