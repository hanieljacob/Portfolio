export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {year} Haniel Thomson</span>
        <div className="footer-links">
          <a href="https://github.com/hanieljacob" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/haniel-jacob/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="footer-top" href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
