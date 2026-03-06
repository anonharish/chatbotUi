export const ProfileInfoCards = () => {
  return (
    <div className="flex gap-6 mt-6">

      {/* INFO CARD */}
      <div className="w-[372px] h-[416px] rounded-[45px] bg-[#F4F5F6] shadow overflow-hidden">

        {/* HEADER */}
        <div className="px-6 pt-7 pb-3">
          <h3 className="text-[#5A5C5E] font-semibold">Info</h3>
        </div>

        {/* Divider */}
        <div className="h-[1.5px] bg-gray-300 w-full" />

        {/* CONTENT */}
        <div className="px-6 pt-9 space-y-9 text-sm">

          <div className="flex items-start gap-4">
            <img src="/src/assets/icons/mail.png" className="w-5 mt-0.5" />
            <div>
              <p className="text-gray-400 text-xs">EMAIL</p>
              <p className="text-[#5A5C5E] font-medium">
                ramkishore@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <img src="/src/assets/icons/call.png" className="w-5 mt-0.5" />
            <div>
              <p className="text-gray-400 text-xs">PHONE</p>
              <p className="text-[#5A5C5E] font-medium">
                +91-992-555-0151
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <img src="/src/assets/icons/location.png" className="w-5 mt-0.5" />
            <div>
              <p className="text-gray-400 text-xs">ROLE ID</p>
              <p className="text-[#5A5C5E] font-medium">
                AG00013
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <img src="/src/assets/icons/map.png" className="w-5 mt-0.5" />
            <div>
              <p className="text-gray-400 text-xs">BASE</p>
              <p className="text-[#5A5C5E] font-medium">
                Tanuku, West Godavari, Andhra Pradesh, 534211
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* REPORTING TEAM */}
      <div className="w-[372px] h-[416px] rounded-[45px] bg-[#F4F5F6] shadow overflow-hidden">

        {/* HEADER */}
        <div className="px-6 pt-7 pb-3">
          <h3 className="text-[#5A5C5E] font-semibold">Reporting Team</h3>
        </div>

        {/* Divider */}
        <div className="h-[1.5px] bg-gray-300 w-full" />

        {/* CONTENT */}
        <div className="px-6 pt-9 space-y-9 text-sm">

          <div className="flex items-start gap-4">
            <img src="/src/assets/icons/man1.png" className="w-5 mt-0.5" />
            <div>
              <p className="text-gray-400 text-xs">REGIONAL OFFICER</p>
              <p className="text-[#5A5C5E] font-medium">
                Jayanth Kumar (GLC R00012)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <img src="/src/assets/icons/man2.png" className="w-5 mt-0.5" />
            <div>
              <p className="text-gray-400 text-xs">INTELLIGENCE OFFICER</p>
              <p className="text-[#5A5C5E] font-medium">
                Kishore Kumar (GLC IO0012)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <img src="/src/assets/icons/man3.png" className="w-5 mt-0.5" />
            <div>
              <p className="text-gray-400 text-xs">FIELD OFFICER</p>
              <p className="text-[#5A5C5E] font-medium">
                Ram Verma (GLC FO0012)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <img src="/src/assets/icons/landmark.png" className="w-5 mt-0.5" />
            <div>
              <p className="text-gray-400 text-xs">TERRITORY ASSIGNED</p>
              <p className="text-[#5A5C5E] font-medium">
                Tanuku, Godavari Region, Andhra Pradesh
              </p>
            </div>
          </div>

        </div>
      </div>



      {/* COMPLIANCE */}
      <div className="w-[472px] h-[416px] rounded-[45px] bg-[#F4F5F6] shadow overflow-hidden">

        {/* HEADER */}
        <div className="px-6 pt-7 pb-3">
          <h3 className="text-[#5A5C5E] font-semibold">Compliance Status</h3>
        </div>

        <div className="h-[1.5px] bg-gray-300 w-full" />

        <div className="px-6 pt-7 space-y-4 text-sm">

          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs">AADHAR CARD</p>
              <p className="text-[#5A5C5E] mt-1">Verified</p>
              <img src="/src/assets/icons/checked.png" className="w-4 mt-1" />
            </div>

            <img
              src="/src/assets/profileinfo/aadhar.png"
              className="w-[236px] h-[151px] rounded-xl object-cover"
            />
          </div>

          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs">PAN CARD</p>
              <p className="text-[#5A5C5E] mt-1">Verified</p>
              <img src="/src/assets/icons/checked.png" className="w-4 mt-1" />
            </div>
            
            <img
              src="/src/assets/profileinfo/pan.png"
              className="w-[236px] h-[151px] rounded-xl object-cover"
            />
          </div>

        </div>
      </div>

    </div>
  );
};