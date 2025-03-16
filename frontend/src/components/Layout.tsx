import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold">Webpigram</h1>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
      <footer className="border-t">
        <div className="container mx-auto py-4 px-4 text-center text-sm text-muted-foreground">
          &copy; 2024 Webpigram - A collection of programming epigrams
        </div>
      </footer>
    </div>
  );
} 