
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer";
import AppRoutes from "./Routes/AppRoutes";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <AppRoutes />
      </main>

      <Footer />
    </>
  );
}

export default App;
