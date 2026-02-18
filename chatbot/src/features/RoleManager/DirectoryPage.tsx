import TopStatsSection from "./components/layout/TopStatsSection";
import DirectorySection from "./components/directory/DirectorySection";

export default function DirectoryPage() {
  return (
    <div className="relative min-h-screen">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center" />

      <div className="relative z-10 px-10 pt-10 pb-20">

        {/* TOP GRAPHS */}
        <TopStatsSection />

        {/* DIRECTORY SECTION */}
        <div className="mt-16">
          <DirectorySection />
        </div>

      </div>
    </div>
  );
}
