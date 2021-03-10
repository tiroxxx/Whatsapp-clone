import Login from "./Login";
import { useState } from "react"


function App() {
  const [id, setId] = useState()

  return (
    <Login onIdSubmit={setId} />
  );
}

export default App;