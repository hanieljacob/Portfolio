export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-8 bg-gray-50 dark:bg-gray-800 text-white">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 text-center sm:text-left">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Haniel Thomson. Built with React + Vite.
        </p>
        <a
          href="#"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
