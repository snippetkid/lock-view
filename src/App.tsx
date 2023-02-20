import { useEffect, useState } from "react";
import "./App.css";
import ForceGraph3D from "react-force-graph-3d";
import * as packLock from "./data/package-lock.json";
import { GraphData } from "./models/GraphData";
import { Node } from "./models/Node";

function App() {
  // actual data should be different from initial data
  const myData: GraphData = {
    nodes: [
      { id: "id1", name: "Actual Data 1", val: 10 },
      { id: "id2", name: "Actual Data 2", val: 9 },
    ],
    links: [{ source: "id1", target: "id2" }],
  };

  const [graphData, setData] = useState(myData);
  useEffect(() => {
    const network: GraphData = {
      nodes: [],
      links: [],
    };
    const allPackages = Object.keys(packLock.packages);

    allPackages.forEach((value, index) => {
      if (value == "") {
        network.nodes.push({
          id: "Package",
          color: "red",
        });

        if ("dependencies" in packLock.packages[""]) {
          console.log("has deps");
        }
        if ("devDependencies" in packLock.packages[""]) {
          const devDeps = packLock.packages[""].devDependencies;
          const devDepsKeys = Object.keys(devDeps);

          devDepsKeys.forEach((dd) => {
            network.nodes.push({
              id: dd,
              version: devDeps[dd as keyof typeof devDeps],
            });
            network.links.push({
              source: "Package",
              target: dd,
            });
          });
        }
      } else {
        const versionObj =
          packLock.packages[value as keyof typeof packLock.packages];

        network.nodes.push({
          id: value.split("/")[1],
          version: versionObj.version,
        });

        //add deps
        if (
          "dependencies" in
          packLock.packages[value as keyof typeof packLock.packages]
        ) {
          const packageDetail =
            packLock.packages[value as keyof typeof packLock.packages];
          const deps = packageDetail[
            "dependencies" as keyof typeof packageDetail
          ] as any;
          const depNames = Object.keys(deps);
          depNames.forEach((d) => {
            network.links.push({
              source: value.split("/")[1],
              target: d,
            });
            network.nodes.push({
              id: d,
              version:deps[d]
            });
          });
        }
      }
    });

    setData(network);
    console.log(network);
  }, []);

  return (
    <div className="App">
      <ForceGraph3D
        graphData={graphData}
        onNodeClick={(node) => console.log(node.id)}
      />
    </div>
  );
}

export default App;
