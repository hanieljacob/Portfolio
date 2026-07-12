import { useCallback, useEffect, useState } from 'react';
import Preloader from './components/Preloader';
import ScrollProgress from './components/ScrollProgress';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Marquee from './components/Marquee';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [loading, setLoading] = useState(true);

  // Hold the page at the top and freeze scroll while the preloader is up
  useEffect(() => {
    if (!loading) return;
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [loading]);

  const handleLoaded = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <Preloader onComplete={handleLoaded} />}
      <ScrollProgress />
      <Header />
      <main className={loading ? 'app-content' : 'app-content app-content-ready'}>
        <Hero ready={!loading} />
        <About />
        <Marquee />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
