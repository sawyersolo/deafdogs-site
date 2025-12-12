import Home from "./pages/Home";
import Music from "./pages/Music";
import Press from "./pages/Press";

function App() {
  return (
    <>
      <nav className="site-nav">
        <a href="#home">Home</a>
        <a href="#music">Music</a>
        <a href="#epk">EPK</a>
      </nav>

      <main>
        <section id="home" className="page-section">
          <Home />
        </section>

        <section id="music" className="page-section">
          <Music />
        </section>

        <section id="epk" className="page-section">
          <Press />
        </section>
      </main>
    </>
  );
}

export default App;