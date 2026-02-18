import { Card } from "./card";

type Item = {
  name: string;
  sub: string;
};

function ListCard({
  title,
  data,
}: {
  title: string;
  data: Item[];
}) {
  return (
    <Card
      className="
        bg-white
        rounded-3xl
        p-5
        shadow-[0_20px_40px_rgba(0,0,0,0.15)]
        h-[520px]
        flex flex-col
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800">{title}</h2>

        <button className="w-9 h-9 rounded-full bg-green-600 text-white text-xl">
          +
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Search..."
        className="
          bg-gray-100
          rounded-xl
          px-4 py-2
          mb-4
          outline-none
          focus:ring-2
          focus:ring-green-500
        "
      />

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {data.map((item, i) => (
          <div
            key={i}
            className="
              flex items-center gap-3
              p-3 rounded-xl
              hover:bg-gray-100
              transition
            "
          >
            <div className="w-10 h-10 rounded-full bg-gray-300" />

            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.sub}</p>
            </div>

            <span className="text-gray-400">✏️</span>
            <span className="text-gray-400">👁️</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function CardsSection() {
  const roles = [
    { name: "Ram Verma", sub: "Regional Officer" },
    { name: "Ram Verma", sub: "Intelligence Officer" },
  ];

  const officers = [
    { name: "Satish Kumar", sub: "FO0113" },
    { name: "Ram Verma", sub: "FO0113" },
    { name: "Satish Kumar", sub: "FO0113" },
  ];

  const agents = [
    { name: "Satish Kumar", sub: "AG0113" },
    { name: "Ram Verma", sub: "AG0113" },
    { name: "Satish Kumar", sub: "AG0113" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <ListCard title="Role List" data={roles} />
      <ListCard title="Field Officers" data={officers} />
      <ListCard title="Agents" data={agents} />
    </div>
  );
}
