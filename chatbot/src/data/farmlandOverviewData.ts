export const farmlandAssignmentsData = {
  assignments: [
    {
      id: "1",
      farmland: {
        code: "GLCSOS 01",
        area: 120,
        costPerAcre: 710000,
        image: "/src/assets/farm-land/glc1.png",
        state: "Andhra Pradesh",
        zone: "Vizag Zone",
      },
      deal: {
        location: "West Godavari, Tanuku",
        amount: "₹25 Lacs",
        time: "6th Oct 12:53",
        icons: {
          location: "/src/assets/farm-land/location.png",
          amount: "/src/assets/farm-land/amount.png",
          time: "/src/assets/farm-land/time.png",
        },
      },
      agent: {
        name: "Ram Verma",
        roleId: "AG0118",
        avatar: "/src/assets/farm-land/agent1.png",
      },
    },

    {
      id: "2",
      farmland: {
        code: "GLCSOS 02",
        area: 190,
        costPerAcre: 720000,
        image: "/src/assets/farm-land/glc2.png",
        state: "Telangana",
        zone: "South Zone",
      },
      deal: {
        location: "Hyderabad",
        amount: "₹30 Lacs",
        time: "7th Oct 10:00",
        icons: {
          location: "/src/assets/farm-land/location.png",
          amount: "/src/assets/farm-land/amount.png",
          time: "/src/assets/farm-land/time.png",
        },
      },
      agent: {
        name: "Suresh Kumar",
        roleId: "AG0210",
        avatar: "/src/assets/farm-land/agent2.png",
      },
    },
  ],
};