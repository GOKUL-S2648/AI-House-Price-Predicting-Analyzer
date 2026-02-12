
const DISTRICT_COORDS = {
  'Chennai': [13.0827, 80.2707],
  'Coimbatore': [11.0168, 76.9558],
  'Madurai': [9.9252, 78.1198],
  'The Nilgiris': [11.4102, 76.6991],
  'Thiruvananthapuram': [8.5241, 76.9366],
  'Ernakulam': [9.9816, 76.2999],
  'Kozhikode': [11.2588, 75.7804],
  'Bengaluru Urban': [12.9716, 77.5946],
  'Mumbai City': [18.9220, 72.8347],
  'Hyderabad': [17.3850, 78.4867],
  'Delhi': [28.6139, 77.2090]
};

const DEFAULT_COORD = [20.5937, 78.9629];

const NEIGHBORHOOD_MAP = {
  'Thiruvananthapuram': ['Kazhakoottam', 'Vattiyoorkavu', 'Pattom', 'Vazhuthacaud', 'Sasthamangalam', 'Kowdiar', 'Technopark Area', 'Peroorkada', 'Statue Junction', 'Ambalamukku'],
  'Ernakulam': ['Kochi', 'Kakkanad', 'Edappally', 'Vyttila', 'Aluva', 'Marine Drive', 'Panampilly Nagar', 'Kalamassery', 'Tripunithura', 'MG Road Area', 'Fort Kochi'],
  'Kozhikode': ['Beach Road', 'Mavoor Road', 'Chevayur', 'Nallalam', 'Pottammal', 'Kottooli', 'Calicut City', 'West Hill', 'Nadakkavu'],
  'Thrissur': ['City Center', 'Punkunnam', 'Ayyanthole', 'Ramavarmapuram', 'Olarikkara', 'Kuriachira', 'Patturaikkal', 'East Fort'],
  'Chennai': ['Adyar', 'Velachery', 'Anna Nagar', 'T Nagar', 'Besant Nagar', 'Mylapore', 'Thirumiyur', 'Guindy', 'Kotturpuram', 'Nungambakkam', 'OMR - Navalur', 'Perungudi'],
  'Coimbatore': ['Gandhipuram', 'Peelamedu', 'RS Puram', 'Saibaba Colony', 'Race Course', 'Saravanampatti', 'Singanallur', 'Vadavalli', 'Thudiyalur', 'Avinashi Road'],
  'Madurai': ['Anna Nagar', 'K Pudur', 'KK Nagar', 'Sellur', 'Simmakkal', 'Tallakulam', 'Mattuthavani', 'Ellis Nagar', 'TVS Nagar', 'Bibikulam', 'Narimedu'],
  'The Nilgiris': ['Ooty Town', 'Charring Cross', 'Fingerpost', 'Coonoor', 'Kotagiri', 'Lovedale', 'Wellington', 'Doddabetta Area'],
  'Dindigul': ['Kodaikanal Lake', 'Fairy Falls', 'Bear Shola', 'Palani Town', 'Oddanchatram', 'Batlagundu'],
  'Tiruchirappalli': ['Thillai Nagar', 'Srirangam', 'Cantonment', 'KK Nagar', 'Woraiur'],
  'Salem': ['Fairlands', 'Alagapuram', 'Hasthampatti', 'Steel Plant Road'],
  'Mumbai City': ['Colaba', 'Worli', 'Lower Parel', 'Dadar', 'Prabhadevi'],
  'Bengaluru Urban': ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Jayanagar', 'JP Nagar', 'Electronic City', 'Marathahalli', 'Hebbal', 'BTM Layout'],
  'Hyderabad': ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Kondapur'],
  'Delhi': ['Saket', 'Karol Bagh', 'Hauz Khas', 'Connaught Place', 'Vasant Vihar']
};

const GENERIC_NEIGHBORHOODS = ['Sector 1', 'Main Market Area', 'Civil Lines', 'Model Town', 'Station Road', 'Green Park', 'City Center'];

export const STATES_AND_DISTRICTS = [
  {
    state: 'Tamil Nadu',
    districts: ['Chennai', 'Coimbatore', 'Madurai', 'The Nilgiris', 'Dindigul', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Thoothukudi', 'Kanyakumari', 'Tiruppur']
  },
  {
    state: 'Kerala',
    districts: ['Thiruvananthapuram', 'Ernakulam', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kottayam', 'Malappuram', 'Idukki', 'Wayanad', 'Kasaragod', 'Pathanamthitta', 'Kannur']
  },
  {
    state: 'Karnataka',
    districts: ['Bengaluru Urban', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru']
  },
  {
    state: 'Maharashtra',
    districts: ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane']
  },
  {
    state: 'Telangana',
    districts: ['Hyderabad', 'Warangal', 'Nizamabad']
  }
];

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513584684374-8bdb74838a0f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1448630360428-6e238802ee97?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80'
];

const generateMockData = () => {
  const houses = [];

  const pgNames = ["Stanza Living", "Zolo Stay", "Hello World PG", "Sunrise Hostels", "Olive Living", "Nestaway"];
  const aptNames = ["Prestige Heights", "Godrej Woods", "Sobha Dream", "Brigade Meadows", "Skyline Apartment", "Mantri Gardens"];
  const villaNames = ["Serene Villas", "Emerald Heights", "Cloud 9 Retreat", "Mist View Manor", "Heritage Villa", "Palazzo"];
  const indNames = ["Nivasam", "Illam", "Bhavan", "Sree Mansion", "Traditional House", "Santi Nilayam"];

  STATES_AND_DISTRICTS.forEach((sObj, sIdx) => {
    sObj.districts.forEach((d, dIdx) => {
      const neighborhoods = NEIGHBORHOOD_MAP[d] || GENERIC_NEIGHBORHOODS;
      const baseCoords = DISTRICT_COORDS[d] || DEFAULT_COORD;
      const priceModifier = d === 'The Nilgiris' || d === 'Dindigul' ? 1.4 : 1.0;

      const types = ['Pg', 'Apartment', 'Villa', 'Individual House', 'Studio'];

      neighborhoods.forEach((neighborhood, nIdx) => {
        for (let i = 0; i < 2; i++) {
          const typeIndex = (nIdx + i) % types.length;
          const type = types[typeIndex];
          let basePrice = 0;
          let title = "";
          let amenities = [];

          const nameIndex = (nIdx + i + dIdx) % pgNames.length;

          switch (type) {
            case 'Pg':
              basePrice = Math.round(4500 + (nIdx * 250) + (i * 1200));
              title = `${pgNames[nameIndex]} ${neighborhood}`;
              amenities = ['WiFi', 'Food', 'Cleaning', 'Laundry'];
              break;
            case 'Apartment':
              basePrice = Math.round((9500 + (nIdx * 550) + (i * 2800)) * priceModifier);
              title = `${aptNames[nameIndex]} @ ${neighborhood}`;
              amenities = ['Lift', 'Security', 'Parking', 'Gym'];
              break;
            case 'Villa':
              basePrice = Math.round((38000 + (nIdx * 1200) + (i * 12000)) * priceModifier);
              title = `${villaNames[nameIndex]} - ${neighborhood}`;
              amenities = ['Private Garden', 'Swimming Pool', 'Luxury Interiors', 'Solar Power'];
              break;
            case 'Individual House':
              basePrice = Math.round((14500 + (nIdx * 850) + (i * 3500)) * priceModifier);
              title = `${neighborhood} ${indNames[nameIndex]}`;
              amenities = ['Backyard', 'Own Water Source', 'Quiet Area', 'Pet Friendly'];
              break;
            case 'Studio':
              basePrice = Math.round(7500 + (nIdx * 350) + (i * 1800));
              title = `Cozy Studio ${neighborhood}`;
              amenities = ['AC', 'Compact Kitchen', 'Near Transit', 'Balcony'];
              break;
          }

          const latJitter = (Math.random() - 0.5) * 0.08;
          const lngJitter = (Math.random() - 0.5) * 0.08;
          const imageIndex = (sIdx + dIdx + nIdx + i) % PROPERTY_IMAGES.length;

          houses.push({
            id: `listing_${sIdx}_${dIdx}_${nIdx}_${i}_${Math.floor(Math.random() * 1000)}`,
            title,
            type,
            price: basePrice,
            location: `${neighborhood}, ${d}`,
            district: d,
            state: sObj.state,
            image: PROPERTY_IMAGES[imageIndex],
            amenities,
            historicalPrices: [
              { year: 2023, price: Math.round(basePrice * 0.92) },
              { year: 2024, price: Math.round(basePrice * 0.96) },
              { year: 2025, price: basePrice }
            ],
            description: `Beautifully maintained ${type} located in the heart of ${neighborhood}. Perfect for those seeking both comfort and accessibility in ${d}.`,
            lat: baseCoords[0] + latJitter,
            lng: baseCoords[1] + lngJitter
          });
        }
      });
    });
  });

  return houses;
};

export const MOCK_HOUSES = generateMockData();
