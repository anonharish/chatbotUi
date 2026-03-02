export default function RegionsDataSection() {

  const regionData = [
    { name: "Godavari Region", subs: "West Godavari, East Godavari" },
    { name: "Amaravathi Region", subs: "Vijayawada, Guntur, Amaravathi" },
    { name: "Visakhapatnam Region", subs: "Tuni, Gajuwaka, Annavaram" },
    { name: "Kakinada Region", subs: "Ramachandrapuram, Mandapeta, Jonnada" },
    { name: "Eluru Region", subs: "Eluru, Bhimadolu, Tadepalligudem" },
    { name: "Nellore Region", subs: "Kavali, Gudur, Venkatagiri" },
    { name: "Tirupati Region", subs: "Renigunta, Srikalahasti, Puttur" },
    { name: "Guntur Region", subs: "Tenali, Mangalagiri, Bapatla" },
    { name: "Rajahmundry Region", subs: "Dowlaiswaram, Kadiyam, Korukonda" },
    { name: "Srikakulam Region", subs: "Palasa, Tekkali, Amadalavalasa" },
    { name: "Vizianagaram Region", subs: "Bobbili, Cheepurupalli, Salur" }
  ];

  return (
    <div className="space-y-5">

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center flex-wrap gap-3">

        <button className="px-6 py-2 rounded-full border border-white/40 text-white text-sm backdrop-blur-md bg-white/10">
          Area / Region List
        </button>

        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-white text-xl">+</button>
          <button className="w-10 h-10 rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-white text-sm">||</button>
        </div>

      </div>

      {/* ===== CARDS ===== */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">

        {/* ===== LEFT CARD ===== */}
        <div className="bg-white rounded-[36px] lg:rounded-[46px] shadow-sm flex flex-col w-full lg:w-[68%] h-[420px] lg:h-[480px] p-4 md:p-6">

          {/* TABLE HEADER */}
          <table className="w-full text-sm text-gray-500">
            <thead>
              <tr>
                <th className="text-left pb-3">Region Name</th>
                <th className="text-left pb-3">Sub Regions Name</th>
                <th className="text-right pb-3">Create Date</th>
              </tr>
            </thead>
          </table>

          {/* HEADER LINE */}
          <div className="border-b border-gray-200 mb-2"></div>

          {/* SCROLL BODY */}
          <div className="flex-1 overflow-y-auto no-scrollbar">

            <table className="w-full text-sm text-gray-700">
              <tbody>
                {regionData.map((region, i) => (
                  <tr key={i} className="h-12 md:h-14">
                    <td>{region.name}</td>
                    <td>{region.subs}</td>
                    <td className="text-right">6th Oct - 12:53 PM</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

        </div>

        {/* ===== RIGHT CARD ===== */}
        <div className="bg-white rounded-[36px] lg:rounded-[46px] shadow-sm flex flex-col w-full lg:w-[32%] h-auto lg:h-[420px] p-4 md:p-6">

          {/* TITLE */}
          <p className="text-gray-500 text-sm pb-3">
            Region : Andhra Pradesh
          </p>

          {/* TITLE LINE */}
          <div className="border-b border-gray-200 mb-4"></div>

          {/* IMAGE + STATS */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* IMAGE */}
            <img
              src="/src/assets/regions/land.png"
              alt="region"
              className="h-[140px] md:h-[160px] lg:h-[180px] object-contain"
            />

            {/* STATS */}
            <div className="flex flex-col justify-center gap-4 w-full">

              <div className="text-center">
                <p className="text-xl md:text-2xl font-semibold text-gray-800">24</p>
                <p className="text-xs text-gray-500">Total Areas</p>
              </div>

              {/* SINGLE MIDDLE LINE */}
              <div className="w-full border-b border-gray-200"></div>

              <div className="text-center">
                <p className="text-xl md:text-2xl font-semibold text-gray-800">+3</p>
                <p className="text-xs text-gray-500">New Areas Created</p>
              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div className="flex bg-gray-100 rounded-[16px] overflow-hidden mt-6">

            <div className="text-center w-full p-3">
              <p className="text-lg text-gray-800">22</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>

            <div className="w-px bg-gray-300"></div>

            <div className="text-center w-full p-3">
              <p className="text-lg text-gray-800">+2</p>
              <p className="text-xs text-gray-500">Drafts</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}