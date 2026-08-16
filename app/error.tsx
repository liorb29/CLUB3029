"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold">משהו השתבש</h2>
      <p className="text-muted-foreground">אירעה שגיאה בעת ביצוע הפעולה.</p>
      <Button onClick={() => reset()}>נסה שוב</Button>
    </div>
  );
}
