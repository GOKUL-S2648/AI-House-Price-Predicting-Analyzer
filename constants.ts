
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
  const houses: any[] = [];

  const ownerNames = [
    "Aravind Swamy", "Meera Krishnan", "Rahul Sharma", "Sneha Kapoor", 
    "Vikram Reddy", "Priya Nair", "Sanjay Gupta", "Anjali Verma", 
    "Arjun Malhotra", "Kavya Iyer", "Rohan Das", "Ishita Paul",
    "David Miller", "Sarah Wilson", "Michael Brown", "Emma Watson",
    "James Anderson", "Olivia Taylor"
  ];

  STATES_AND_DISTRICTS.forEach((sObj, sIdx) => {
    sObj.districts.forEach((d, dIdx) => {
      const neighborhoods = (NEIGHBORHOOD_MAP as any)[d] || GENERIC_NEIGHBORHOODS;
      const baseCoords = (DISTRICT_COORDS as any)[d] || DEFAULT_COORD;
      const priceModifier = d === 'The Nilgiris' || d === 'Dindigul' ? 1.4 : 1.0;

      const types = ['Pg', 'Apartment', 'Villa', 'Individual House', 'Studio'];
      const bhkTypes = ['1BHK', '2BHK', '3BHK'];

      neighborhoods.forEach((neighborhood: string, nIdx: number) => {
        // Increase variety to satisfy "up to 6 suggestions" requirement
        // Using 15 to cover all combinations of 5 types and 3 BHKs (LCM = 15)
        for (let i = 0; i < 15; i++) {
          const typeIndex = (nIdx + i) % types.length;
          const type = types[typeIndex];
          const bhkType = bhkTypes[(nIdx + i) % bhkTypes.length];

          // Added significant jitter to ensure unique prices at first glance
          const priceJitter = Math.floor(Math.random() * 3000) - 1500;
          let basePrice = 0;
          let title = "";
          let amenities: string[] = [];

          const nameIndex = (nIdx + i + dIdx + sIdx) % ownerNames.length;
          const owner = ownerNames[nameIndex];

          switch (type) {
            case 'Pg':
              basePrice = Math.round(4500 + (nIdx * 250) + (i * 1200)) + priceJitter;
              title = `${owner}'s Heritage Guest House (${bhkType})`;
              amenities = ['WiFi', 'Food', 'Cleaning', 'Laundry'];
              break;
            case 'Apartment':
              basePrice = Math.round((9500 + (nIdx * 550) + (i * 2800)) * priceModifier) + priceJitter;
              title = `${owner}'s Traditional Flat (${bhkType})`;
              amenities = ['Lift', 'Security', 'Parking', 'Gym'];
              break;
            case 'Villa':
              basePrice = Math.round((38000 + (nIdx * 1200) + (i * 12000)) * priceModifier) + priceJitter;
              title = `${owner}'s Royal Estate (${bhkType})`;
              amenities = ['Private Garden', 'Swimming Pool', 'Luxury Interiors', 'Solar Power'];
              break;
            case 'Individual House':
              basePrice = Math.round((14500 + (nIdx * 850) + (i * 3500)) * priceModifier) + priceJitter;
              title = `${owner}'s Heritage Home (${bhkType})`;
              amenities = ['Backyard', 'Own Water Source', 'Quiet Area', 'Pet Friendly'];
              break;
            case 'Studio':
              basePrice = Math.round(7500 + (nIdx * 350) + (i * 1800)) + priceJitter;
              title = `${owner}'s Traditional Studio (${bhkType})`;
              amenities = ['AC', 'Compact Kitchen', 'Near Transit', 'Balcony'];
              break;
          }

          // Adjust base price by BHK Type
          if (bhkType === '2BHK') basePrice *= 1.5;
          if (bhkType === '3BHK') basePrice *= 2.2;

          // Ensure price doesn't go negative or too low
          basePrice = Math.max(3000, basePrice);

          const latJitter = (Math.random() - 0.5) * 0.08;
          const lngJitter = (Math.random() - 0.5) * 0.08;
          const imageIndex = (sIdx + dIdx + nIdx + i) % PROPERTY_IMAGES.length;

          const roundTo500 = (num: number) => Math.round(num / 500) * 500;
          const finalPrice = roundTo500(basePrice);

          houses.push({
            id: `listing_${sIdx}_${dIdx}_${nIdx}_${i}_${Math.floor(Math.random() * 1000)}`,
            title,
            type,
            bhkType,
            price: finalPrice,
            location: `${neighborhood}, ${d}`,
            district: d,
            state: sObj.state,
            image: PROPERTY_IMAGES[imageIndex],
            email: `${owner.toLowerCase().replace(/\s/g, '')}s@gmail.com`,
            phone: `+91 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100000 + Math.random() * 900000)}`,
            ownerName: owner,
            amenities,
            historicalPrices: [
              { year: 2023, price: roundTo500(finalPrice * 0.5) },
              { year: 2024, price: roundTo500((finalPrice * 2) / 3) },
              { year: 2025, price: roundTo500((finalPrice * 5) / 6) },
              { year: 2026, price: finalPrice }
            ],
            description: `Beautifully maintained ${type} (${bhkType}) located in the heart of ${neighborhood}. Perfect for those seeking both comfort and accessibility in ${d}.`,
            isApproved: true,
            lat: baseCoords[0] + latJitter,
            lng: baseCoords[1] + lngJitter,
            ratings: {
              connectivity: 3.5 + Math.random() * 1.5,
              neighbourhood: 3.5 + Math.random() * 1.5,
              safety: 3.5 + Math.random() * 1.5,
              livability: 3.5 + Math.random() * 1.5
            },
            furnishings: [
              { name: 'Sofa', count: 1 },
              { name: 'Stove', count: 1 },
              { name: 'Fan', count: 2 },
              { name: 'Light', count: 4 },
              { name: 'Wardrobe', count: 1 },
              { name: 'TV', count: 1 },
              { name: 'Bed', count: 1 }
            ]
          });
        }
      });
    });
  });

  return houses;
};

export const MOCK_HOUSES = generateMockData();
