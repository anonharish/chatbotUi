// Mock field officer data with real Indian city coordinates

export interface FieldOfficer {
  id: string
  name: string
  phone: string
  region: string
  place: string
  state: string
  lat: number
  lng: number
}

export const FIELD_OFFICERS: FieldOfficer[] = [
  // Maharashtra
  { id: 'fo01', name: 'Rajesh Patil', phone: '+91-9876543201', region: 'West Zone', place: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { id: 'fo02', name: 'Anil Deshmukh', phone: '+91-9876543202', region: 'West Zone', place: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  { id: 'fo03', name: 'Suresh More', phone: '+91-9876543203', region: 'West Zone', place: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { id: 'fo04', name: 'Vikram Jadhav', phone: '+91-9876543204', region: 'West Zone', place: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { id: 'fo05', name: 'Priya Kulkarni', phone: '+91-9876543205', region: 'West Zone', place: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433 },

  // Karnataka
  { id: 'fo06', name: 'Ramesh Gowda', phone: '+91-9876543206', region: 'South Zone', place: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { id: 'fo07', name: 'Lakshmi Rao', phone: '+91-9876543207', region: 'South Zone', place: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  { id: 'fo08', name: 'Deepak Hegde', phone: '+91-9876543208', region: 'South Zone', place: 'Hubli', state: 'Karnataka', lat: 15.3647, lng: 75.1240 },

  // Tamil Nadu
  { id: 'fo09', name: 'Karthik Subramanian', phone: '+91-9876543209', region: 'South Zone', place: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { id: 'fo10', name: 'Meena Rajan', phone: '+91-9876543210', region: 'South Zone', place: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { id: 'fo11', name: 'Senthil Kumar', phone: '+91-9876543211', region: 'South Zone', place: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },

  // Gujarat
  { id: 'fo12', name: 'Amit Shah', phone: '+91-9876543212', region: 'West Zone', place: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { id: 'fo13', name: 'Bhavna Patel', phone: '+91-9876543213', region: 'West Zone', place: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  { id: 'fo14', name: 'Darshan Mehta', phone: '+91-9876543214', region: 'West Zone', place: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },

  // Rajasthan
  { id: 'fo15', name: 'Om Prakash Sharma', phone: '+91-9876543215', region: 'North Zone', place: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { id: 'fo16', name: 'Kavita Singh', phone: '+91-9876543216', region: 'North Zone', place: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
  { id: 'fo17', name: 'Ratan Choudhary', phone: '+91-9876543217', region: 'North Zone', place: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125 },

  // Uttar Pradesh
  { id: 'fo18', name: 'Rohit Verma', phone: '+91-9876543218', region: 'North Zone', place: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { id: 'fo19', name: 'Sanjay Yadav', phone: '+91-9876543219', region: 'North Zone', place: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { id: 'fo20', name: 'Neha Gupta', phone: '+91-9876543220', region: 'North Zone', place: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  { id: 'fo21', name: 'Manoj Tiwari', phone: '+91-9876543221', region: 'North Zone', place: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },

  // Bihar
  { id: 'fo22', name: 'Ashok Kumar', phone: '+91-9876543222', region: 'East Zone', place: 'Patna', state: 'Bihar', lat: 25.6093, lng: 85.1376 },
  { id: 'fo23', name: 'Sunita Devi', phone: '+91-9876543223', region: 'East Zone', place: 'Gaya', state: 'Bihar', lat: 24.7955, lng: 84.9994 },

  // Madhya Pradesh
  { id: 'fo24', name: 'Vivek Mishra', phone: '+91-9876543224', region: 'Central Zone', place: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { id: 'fo25', name: 'Rani Shukla', phone: '+91-9876543225', region: 'Central Zone', place: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { id: 'fo26', name: 'Gopal Pandey', phone: '+91-9876543226', region: 'Central Zone', place: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864 },

  // West Bengal
  { id: 'fo27', name: 'Sourav Banerjee', phone: '+91-9876543227', region: 'East Zone', place: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { id: 'fo28', name: 'Ananya Das', phone: '+91-9876543228', region: 'East Zone', place: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953 },

  // Delhi
  { id: 'fo29', name: 'Rahul Khanna', phone: '+91-9876543229', region: 'North Zone', place: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { id: 'fo30', name: 'Pooja Malhotra', phone: '+91-9876543230', region: 'North Zone', place: 'Dwarka', state: 'Delhi', lat: 28.5921, lng: 77.0460 },

  // Kerala
  { id: 'fo31', name: 'Vishnu Nair', phone: '+91-9876543231', region: 'South Zone', place: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { id: 'fo32', name: 'Anjali Menon', phone: '+91-9876543232', region: 'South Zone', place: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366 },

  // Telangana
  { id: 'fo33', name: 'Srinivas Reddy', phone: '+91-9876543233', region: 'South Zone', place: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { id: 'fo34', name: 'Lavanya Chary', phone: '+91-9876543234', region: 'South Zone', place: 'Warangal', state: 'Telangana', lat: 17.9784, lng: 79.5941 },

  // Andhra Pradesh
  { id: 'fo35', name: 'Ravi Teja', phone: '+91-9876543235', region: 'South Zone', place: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  { id: 'fo36', name: 'Padma Lakshmi', phone: '+91-9876543236', region: 'South Zone', place: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },

  // Punjab
  { id: 'fo37', name: 'Harpreet Singh', phone: '+91-9876543237', region: 'North Zone', place: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
  { id: 'fo38', name: 'Gurpreet Kaur', phone: '+91-9876543238', region: 'North Zone', place: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },

  // Haryana
  { id: 'fo39', name: 'Sunil Hooda', phone: '+91-9876543239', region: 'North Zone', place: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266 },

  // Odisha
  { id: 'fo40', name: 'Prasad Mohanty', phone: '+91-9876543240', region: 'East Zone', place: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245 },

  // Assam
  { id: 'fo41', name: 'Bhaskar Bora', phone: '+91-9876543241', region: 'Northeast Zone', place: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },

  // Jharkhand
  { id: 'fo42', name: 'Dinesh Mahto', phone: '+91-9876543242', region: 'East Zone', place: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096 },

  // Chhattisgarh
  { id: 'fo43', name: 'Ramkumar Sahu', phone: '+91-9876543243', region: 'Central Zone', place: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296 },
]

// Convert officers array to GeoJSON FeatureCollection for MapLibre clustering
export const officersToGeoJSON = (officers: FieldOfficer[]): GeoJSON.FeatureCollection => ({
  type: 'FeatureCollection',
  features: officers.map(o => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [o.lng, o.lat]
    },
    properties: {
      id: o.id,
      name: o.name,
      phone: o.phone,
      region: o.region,
      place: o.place,
      state: o.state,
    }
  }))
})
