import React, { useState, useEffect } from "react";

const App = () => {
  const [geolocation, setGeolocation] = useState({});

  navigator.geolocation.getCurrentPosition((position) => {
    setGeolocation(position.coords);
    debugger;
  });

  return (
    <div>
      <h1>Hello world</h1>
    </div>
  );
};

export default App;
