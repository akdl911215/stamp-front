import { AppRouter } from "./router";

function App() {

  console.log("현재 환경:", import.meta.env.VITE_ENV);
  console.log("API URL:", import.meta.env.VITE_API_URL);


  return <AppRouter />;
}

export default App;
