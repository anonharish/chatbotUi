import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import GlassCutCard from '@/components/pages/GlassCutCard'

export default function DesignSystemPage() {
    return (
        <div className="container mx-auto p-8 space-y-12 text-white">
            <div>
                <h1 className="text-4xl font-bold mb-4">Design System & Components</h1>
                <p className="text-white/70">A playground for testing glassmorphic components, dropdowns, dialogs, and other UI elements.</p>
            </div>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b border-white/20 pb-2">Buttons</h2>
                <div className="flex flex-wrap gap-4">
                    <Button>Default Button</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Button className="bg-brand-lime text-black hover:bg-brand-lime/90">Brand Lime</Button>
                    <Button variant="outline" className="border-brand-lime text-brand-lime hover:bg-brand-lime/10">Brand Outline</Button>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b border-white/20 pb-2">Glassmorphic Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-surface p-6 rounded-xl bg-white/10  border border-white/20">
                        <h3 className="text-xl font-bold mb-2">Standard Glass Card</h3>
                        <p className="text-white/70">Simple backdrop blur with white border and transparency.</p>
                    </div>

                    <GlassCutCard>
                        <h3 className="text-xl font-bold mb-2">Glass Cut Card</h3>
                        <p className="text-white/70">Custom component with specific styling.</p>
                    </GlassCutCard>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b border-white/20 pb-2">Form Elements (Placeholder)</h2>
                <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <p className="text-white/50 italic">Add Input, Select, Checkbox examples here...</p>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b border-white/20 pb-2">Glass Surface Container</h2>
                <div className="flex flex-col gap-4">
                    <p className="text-white/70">
                        The <code className="bg-white/10 px-2 py-1 rounded text-brand-lime">.glass-surface</code> class applies a standard glass background with a gradient border.
                    </p>
                    <div className="glass-surface p-6 max-w-md">
                        <Card className="bg-transparent border-none shadow-none text-white">
                            <h3 className="text-xl font-bold mb-2">Content Inside Glass Surface</h3>
                            <p className="text-white/70">
                                This card is nested inside a container with the <code className="text-brand-lime">.glass-surface</code> class.
                                The border gradient and backdrop blur are handled by the container.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}
