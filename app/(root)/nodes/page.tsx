/// export const runtime = 'edge';

// SSR IS FOR CLINET SIDE INTERACTIVITY WHERE WE REQUIRE REAL TIME UPDATES;
// SSG IS FOR STATIC CONTENT
// ISG (?)

import React from "react";

const Nodes = () => {
  return (
    <div className="background">
      <h1 className="page-header">Nodes</h1>
    </div>
  );
};

export default Nodes;
