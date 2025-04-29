import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-start justify-center pt-16 md:pt-24 lg:pt-32 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4 flex flex-col items-center text-center relative">
        <div className="max-w-3xl lg:max-w-4xl relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 leading-tight">
            Your All-in-One Community Growth Engine
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
            Featuring advanced leveling systems and customizable giveaways. Perfectly tailor rewards, permissions, and
            automation to create the ultimate engaging experience for your members.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link href="https://discord.com/api/oauth2/authorize?client_id=1072341278081522432&permissions=8&scope=bot">
              <Button
                size="lg"
                className="px-6 py-5 sm:px-8 sm:py-6 text-base sm:text-lg shadow-lg hover:shadow-primary/20 transition-all duration-300 w-full sm:w-auto"
              >
                Add to Discord
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                variant="outline"
                size="lg"
                className="px-6 py-5 sm:px-8 sm:py-6 text-base sm:text-lg hover:bg-primary/10 transition-all duration-300 w-full sm:w-auto"
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-2xl -z-10" />
      </div>
    </main>
  );
}
