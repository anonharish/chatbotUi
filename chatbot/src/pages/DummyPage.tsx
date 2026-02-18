import { Button } from "@/components/ui/button"

export default function DummyPage() {
    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center text-white">
            {/* Content */}
            <div className="relative z-10 text-center space-y-6 max-w-2xl px-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-md">
                    Explore the World
                </h1>
                <p className="text-xl md:text-2xl text-white/90 drop-shadow-sm">
                    This page inherits the global background from MainLayout.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button size="lg" className="bg-white text-black hover:bg-white/90">
                        Get Started
                    </Button>
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                        Learn More
                    </Button>
                </div>
            </div>
        </div>
    )
}
