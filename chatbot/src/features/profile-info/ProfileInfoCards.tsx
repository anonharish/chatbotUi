export const ProfileInfoCards = () => {
  return (
    <div className="flex gap-3 xl:gap-5 mt-3 xl:mt-4 w-full">

      {/* INFO CARD */}
      <div className="flex-1 h-[360px] xl:h-[380px] 2xl:h-[400px] rounded-[35px] xl:rounded-[40px] bg-[#F4F5F6] shadow overflow-hidden">

        <div className="px-5 pt-5 pb-2 xl:px-6 xl:pt-6 xl:pb-3">
          <h3 className="text-[#5A5C5E] font-semibold text-sm xl:text-base">Info</h3>
        </div>
        <div className="h-[1.5px] bg-gray-300 w-full" />
        <div className="px-5 pt-4 space-y-4 xl:px-6 xl:pt-6 xl:space-y-6 text-sm">

          <div className="flex items-start gap-3">
            <img src="/src/assets/icons/mail.png" className="w-4 xl:w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">EMAIL</p>
              <p className="text-[#5A5C5E] font-medium text-xs xl:text-sm">ramkishore@gmail.com</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <img src="/src/assets/icons/call.png" className="w-4 xl:w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">PHONE</p>
              <p className="text-[#5A5C5E] font-medium text-xs xl:text-sm">+91-992-555-0151</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <img src="/src/assets/icons/location.png" className="w-4 xl:w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">ROLE ID</p>
              <p className="text-[#5A5C5E] font-medium text-xs xl:text-sm">AG00013</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <img src="/src/assets/icons/map.png" className="w-4 xl:w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">BASE</p>
              <p className="text-[#5A5C5E] font-medium text-xs xl:text-sm">
                Tanuku, West Godavari, Andhra Pradesh, 534211
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* REPORTING TEAM */}
      <div className="flex-1 h-[360px] xl:h-[380px] 2xl:h-[400px] rounded-[35px] xl:rounded-[40px] bg-[#F4F5F6] shadow overflow-hidden">

        <div className="px-5 pt-5 pb-2 xl:px-6 xl:pt-6 xl:pb-3">
          <h3 className="text-[#5A5C5E] font-semibold text-sm xl:text-base">Reporting Team</h3>
        </div>
        <div className="h-[1.5px] bg-gray-300 w-full" />
        <div className="px-5 pt-4 space-y-4 xl:px-6 xl:pt-6 xl:space-y-6 text-sm">

          <div className="flex items-start gap-3">
            <img src="/src/assets/icons/man1.png" className="w-4 xl:w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">REGIONAL OFFICER</p>
              <p className="text-[#5A5C5E] font-medium text-xs xl:text-sm">Jayanth Kumar (GLC R00012)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <img src="/src/assets/icons/man2.png" className="w-4 xl:w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">INTELLIGENCE OFFICER</p>
              <p className="text-[#5A5C5E] font-medium text-xs xl:text-sm">Kishore Kumar (GLC IO0012)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <img src="/src/assets/icons/man3.png" className="w-4 xl:w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">FIELD OFFICER</p>
              <p className="text-[#5A5C5E] font-medium text-xs xl:text-sm">Ram Verma (GLC FO0012)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <img src="/src/assets/icons/landmark.png" className="w-4 xl:w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">TERRITORY ASSIGNED</p>
              <p className="text-[#5A5C5E] font-medium text-xs xl:text-sm">
                Tanuku, Godavari Region, Andhra Pradesh
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* COMPLIANCE */}
      <div className="flex-1 h-[360px] xl:h-[380px] 2xl:h-[400px] rounded-[35px] xl:rounded-[40px] bg-[#F4F5F6] shadow overflow-hidden">

        <div className="px-5 pt-5 pb-2 xl:px-6 xl:pt-6 xl:pb-3">
          <h3 className="text-[#5A5C5E] font-semibold text-sm xl:text-base">Compliance Status</h3>
        </div>
        <div className="h-[1.5px] bg-gray-300 w-full" />
        <div className="px-5 pt-4 space-y-3 xl:px-6 xl:pt-5 xl:space-y-4">

          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs">AADHAR CARD</p>
              <p className="text-[#5A5C5E] mt-1 text-xs xl:text-sm">Verified</p>
              <img src="/src/assets/icons/checked.png" className="w-4 mt-1" />
            </div>
            <img
              src="/src/assets/profileinfo/aadhar.png"
              className="w-[130px] h-[85px] xl:w-[180px] xl:h-[115px] 2xl:w-[200px] 2xl:h-[128px] rounded-xl object-cover"
            />
          </div>

          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs">PAN CARD</p>
              <p className="text-[#5A5C5E] mt-1 text-xs xl:text-sm">Verified</p>
              <img src="/src/assets/icons/checked.png" className="w-4 mt-1" />
            </div>
            <img
              src="/src/assets/profileinfo/pan.png"
              className="w-[130px] h-[85px] xl:w-[180px] xl:h-[115px] 2xl:w-[200px] 2xl:h-[128px] rounded-xl object-cover"
            />
          </div>

        </div>
      </div>

    </div>
  );
};