import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Apple-style design */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-semibold tracking-tight">Webpigram</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/submit" className="text-sm font-medium hover:text-primary transition-colors">
              Submit
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full">
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                    Coming Soon!
                  </DialogTitle>
                  <DialogDescription className="pt-4 text-base">
                    We know you&apos;re excited to create your own account here, but for now everyone is anonymous. 
                    <span className="block mt-2">✨ The beauty of anonymity is that ideas stand on their own merit! ✨</span>
                    <span className="block mt-2">We&apos;ll notify you when personal profiles become available. Until then, enjoy sharing your wisdom incognito!</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end mt-4">
                  <DialogClose asChild>
                    <Button variant="default">
                      Got it!
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </nav>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-sm font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/submit" 
                className="text-sm font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Submit
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="rounded-full w-full">
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                      Coming Soon!
                    </DialogTitle>
                    <DialogDescription className="pt-4 text-base">
                      We know you&apos;re excited to create your own account here, but for now everyone is anonymous. 
                      <span className="block mt-2">✨ The beauty of anonymity is that ideas stand on their own merit! ✨</span>
                      <span className="block mt-2">We&apos;ll notify you when personal profiles become available. Until then, enjoy sharing your wisdom incognito!</span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end mt-4">
                    <DialogClose asChild>
                      <Button variant="default" onClick={() => setMobileMenuOpen(false)}>
                        Got it!
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto">
        {children}
      </main>
      
      {/* Footer with Apple-style design */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Webpigram</h3>
              <p className="text-sm text-muted-foreground">
                A collection of programming epigrams and wisdom from the world of software development.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/submit" className="text-muted-foreground hover:text-foreground transition-colors">
                    Submit Epigram
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Webpigram - All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 