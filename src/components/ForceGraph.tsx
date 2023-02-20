import React from "react";
import ForceGraph3D  from "react-force-graph-3d";


export default function ForceGraph(data:any) {
  return <ForceGraph3D
   graphData={data.data} />;
}
