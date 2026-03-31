import { Toaster } from "react-hot-toast";
import UserRoutes from "./routes/routes";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <UserRoutes />
    </>
  );
}

export default App;
