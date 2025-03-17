import Link from 'next/link';
import { Home, PlusCircle, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function LeftSidebar() {
  return (
    <div className="w-64 border-r pr-6 py-6 hidden md:block">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Main</h3>
          <nav className="flex flex-col space-y-1">
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                Submit Epigram
              </Link>
            </Button>
          </nav>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Account</h3>
          <nav className="flex flex-col space-y-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="justify-start w-full">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                    Coming Soon!
                  </DialogTitle>
                  <DialogDescription className="pt-4 text-base">
                    We know you&apos;re excited to create your own account here, but for now
                    everyone is anonymous.
                    <span className="block mt-2">
                      ✨ The beauty of anonymity is that ideas stand on their own merit! ✨
                    </span>
                    <span className="block mt-2">
                      We&apos;ll notify you when personal profiles become available. Until then,
                      enjoy sharing your wisdom incognito!
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end mt-4">
                  <DialogClose asChild>
                    <Button variant="default">Got it!</Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </nav>
        </div>
      </div>
    </div>
  );
}
