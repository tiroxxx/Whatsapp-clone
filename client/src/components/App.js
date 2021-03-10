import Login from "./Login";
import { useState } from "react"


function App() {
  const [id, setId] = useState()

  return (
    <>
      {id}
      <Login onIdSubmit={setId} />
    </>
  );
}

export default App;
