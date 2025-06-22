import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { BGPattern } from "~/components/ui/bg-pattern";
import { Play, Scissors, Zap, Clock, Users, Star } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Pattern - Primary Grid */}
      <BGPattern 
        variant="grid" 
        mask="none" 
        size={50} 
        fill="#ffffff" 
        className="opacity-30"
      />
      
      {/* Fallback visible grid pattern for testing */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          zIndex: -1
        }}
      />
      
      {/* Navigation */}
      <header className="bg-background sticky top-0 z-10 flex justify-center border-b">
        <div className="container flex h-16 items-center justify-between px-4 py-2">
          <Link href="/" className="flex items-center">
            <div className="text-xl font-medium tracking-tight">
              <span className="text-foreground underline">clipper</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Transform Your Videos Into
            <span className="block text-primary"> Viral Clips Instantly</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Upload your long-form videos and let our AI automatically identify and create 
            the most engaging clips. Perfect for content creators, marketers, and social media managers.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                <Play className="mr-2 h-5 w-5" />
                Start Creating Clips
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Why Choose Clipper?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Powered by advanced AI technology to streamline your video editing workflow
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Scissors className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Intelligent Auto-Clipping</CardTitle>
                <CardDescription>
                  Our AI analyzes your content and automatically extracts the most engaging moments
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast Processing</CardTitle>
                <CardDescription>
                  Process hours of content in minutes. Get your clips ready for publishing instantly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Save Hours of Editing</CardTitle>
                <CardDescription>
                  Skip the tedious manual editing process. Focus on creating content while we handle the clips
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Built for Creators</CardTitle>
                <CardDescription>
                  Perfect for YouTube creators, podcasters, educators, and live streamers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>High-Quality Output</CardTitle>
                <CardDescription>
                  Maintain original video quality while creating optimized clips for any platform
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multi-Platform Ready</CardTitle>
                <CardDescription>
                  Export clips optimized for TikTok, Instagram, YouTube Shorts, and more
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                How It Works
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Get viral clips in three simple steps
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  1
                </div>
                <h3 className="mb-2 text-xl font-semibold">Upload Your Video</h3>
                <p className="text-muted-foreground">
                  Simply drag and drop your video content into our platform and let AI figure out the best clips for you
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  2
                </div>
                <h3 className="mb-2 text-xl font-semibold">AI Analyzes Content</h3>
                <p className="text-muted-foreground">
                  Our advanced AI identifies the most engaging moments and key highlights through sentiment analysis, and scene detection
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  3
                </div>
                <h3 className="mb-2 text-xl font-semibold">Download Your Clips</h3>
                <p className="text-muted-foreground">
                  Get perfectly edited clips with synchronized subtitles, ready to share across all your socials
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to Create Viral Content?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of creators who are already using Clipper to grow their audience 
            and save time on video editing.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
