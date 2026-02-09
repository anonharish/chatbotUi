import DirectoryCards from "@/components/DirectoryCards";

export default function DirectoryPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">User Directory</h1>

      <DirectoryCards />
    </div>
  );
}
