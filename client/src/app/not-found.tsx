import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md text-center">
        <AlertCircle className="w-16 h-16 text-foreground/40 mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
        <p className="text-3xl font-semibold text-foreground mb-4">Page Not Found</p>
        <p className="text-foreground/70 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">Back to Home</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
