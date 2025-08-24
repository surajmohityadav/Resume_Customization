import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  return (
    <nav className="bg-card/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-foreground">
              Resume<span className="text-primary">Forge</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <a href="#" className="hidden sm:block bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-bold hover:bg-primary/90 transition-colors">Log In</a>
          </div>
        </div>
      </div>
    </nav>
  );
}