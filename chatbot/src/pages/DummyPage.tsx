import { Button } from "@/components/ui/button"

export default function DummyPage() {
    return (
        <div
            className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center text-white"
            style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")',
                // Fallback or overlay to ensure text readability if needed, though header transparency is the main goal
            }}
        >
            {/* Overlay for better text contrast if needed, but keeping it minimal for "transparency" test */}
            <div className="absolute inset-0 bg-black/20" />

            <div className="relative z-10 text-center space-y-6 max-w-2xl px-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                    Explore the World
                </h1>
                <p className="text-xl md:text-2xl text-white/90">
                    This is a full-screen dummy page to demonstrate the transparent header overlay.
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
