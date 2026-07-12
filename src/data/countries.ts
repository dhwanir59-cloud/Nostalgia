/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Country } from "../types";

export const countriesData: Country[] = [
  {
    id: "india",
    name: "India",
    code: "IN",
    flag: "🇮🇳",
    tagline: "The Land of Epics, Colors, and Infinite Contrasts",
    intro: "Step into a timeless sub-continent where ancient chants echo through towering silicon valleys. From the pristine, snow-clad peaks of the Himalayas to the warm, spice-scented breezes of the southern coasts, India is not just a destination—it is a sensory awakening.",
    history: "India's history is a 5,000-year saga of empires, philosophies, and cultural rebirths. Home to the Indus Valley Civilization, one of the world's oldest, it gave birth to major global religions: Hinduism, Buddhism, Jainism, and Sikhism. The Maurya, Gupta, and Mughal empires left behind incredible monuments and intellectual legacies. Following centuries of British colonial rule, India achieved independence in 1947 through a historic non-violent struggle led by Mahatma Gandhi.",
    geography: "India boasts immense geological diversity. The north is guarded by the mighty Himalayas, the highest mountain range on Earth. Below lie the fertile Indo-Gangetic plains, watered by sacred rivers like the Ganges and Yamuna. The west is dominated by the Thar Desert, while the southern peninsula is defined by the Deccan Plateau, flanked by the lush Western and Eastern Ghats, and bordered by thousands of miles of tropical coastline.",
    culture: "A rich mosaic of over 2,000 distinct ethnic groups and 121 major languages. Indian culture is a celebration of unity in diversity, visible in complex classical dances (like Bharatnatyam and Kathakali), classical music (Hindustani and Carnatic), deep spiritual traditions, and a globally celebrated culinary canvas which relies on the complex art of spice blending.",
    traditions: "Deeply rooted in family values, respect for elders, and spiritual devotion. Key concepts like 'Atithi Devo Bhava' (The guest is equivalent to God) and 'Ahimsa' (non-violence to all living beings) dictate social interaction. Meditation, yoga, and Ayurvedic healing systems are daily rituals practiced across generations.",
    localCustoms: "The traditional greeting of 'Namaste' (bowing with folded palms) signifies honoring the divine spark within others. Taking off footwear before entering homes and temples is customary. Eating with the right hand is traditional, and festivals are communal events where entire neighborhoods gather to feast and celebrate.",
    officialLanguage: "Hindi and English (with 22 constitutionally recognized languages including Tamil, Bengali, Marathi, and Sanskrit).",
    currency: "Indian Rupee (INR, Symbol: ₹)",
    population: "Approximately 1.43 Billion",
    government: "Federal Parliamentary Democratic Republic",
    climate: "Varies from alpine and tundra in the high Himalayas to humid tropical in the southern states and arid desert conditions in Rajasthan. It is characterized by three main seasons: Winter, Summer, and the vital southwest Monsoon.",
    wildlife: "India is one of the world's 17 megadiverse nations. It is home to 70% of the world's wild tiger population, the Asiatic Lion, the Indian Leopard, the Snow Leopard, the One-horned Rhinoceros, and the majestic Indian Elephant, alongside over 1,200 bird species.",
    nationalParks: "Over 100 national parks, including Jim Corbett National Park (the oldest), Kaziranga (one-horned rhino sanctuary), Sundarbans (mangrove tiger reserve), and Ranthambore (famous tiger haven).",
    economy: "One of the world's fastest-growing major economies. Historically agricultural, India has evolved into a global powerhouse in Information Technology, pharmaceuticals, space exploration (ISRO), manufacturing, and services, backed by a huge, young consumer market.",
    architecture: "An evolution from rock-cut temples (Ajanta & Ellora) and majestic stepwells to the symmetrical white-marble grandeur of Mughal architecture (Taj Mahal) and towering southern Dravidian temple spires (Madurai Meenakshi). Modern India features clean, structural landmarks designed by visionaries like Le Corbusier.",
    festivals: "India is a calendar of endless festivals. Diwali (the festival of lights) celebrates the victory of light over darkness; Holi (the festival of colors) welcomes spring with vibrant powders; Eid-ul-Fitr, Christmas, Durga Puja, and Ganesh Chaturthi are celebrated with equal, electric fervor.",
    music: "An artistic spectrum spanning ancient Vedic-rooted Hindustani (northern) and Carnatic (southern) classical traditions to the energetic, high-tempo beats of Bollywood pop, Punjabi Bhangra, and regional folk rhythms.",
    famousPersonalities: [
      "Mahatma Gandhi (Leader of Independence)",
      "Rabindranath Tagore (Nobel Laureate Poet)",
      "Dr. APJ Abdul Kalam (Visionary Scientist & President)",
      "Sachin Tendulkar (Cricket Legend)",
      "Srinivasa Ramanujan (Mathematical Genius)"
    ],
    interestingFacts: [
      "India is the world's largest democracy.",
      "The game of Chess (originally 'Chaturanga') was invented in India.",
      "India was the first country to discover water on the Moon (Chandrayaan-1).",
      "Yoga originated in India over 5,000 years ago.",
      "India produces the largest number of movies in the world annually (Bollywood & regional cinemas)."
    ],
    landmarks: [
      {
        id: "taj_mahal",
        name: "The Taj Mahal",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000",
        description: "An ivory-white marble mausoleum on the south bank of the Yamuna River in Agra, built by Mughal Emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal.",
        historicalImportance: "Built between 1632 and 1648, it is considered the pinnacle of Mughal architecture and a universal symbol of eternal love. It is a UNESCO World Heritage Site and one of the New Seven Wonders of the World.",
        bestTimeToVisit: "October to March (Sunrise or sunset for perfect soft lighting)",
        funFacts: [
          "The Taj Mahal's marble columns are designed to tilt slightly outwards so they wouldn't fall on the main dome in case of an earthquake.",
          "Over 20,000 artisans and 1,000 elephants were employed to construct this masterpiece."
        ],
        category: "landmark",
        coordinates: { lat: 27.1751, lng: 78.0421 }
      },
      {
        id: "meenakshi_temple",
        name: "Meenakshi Amman Temple",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1000",
        description: "A historic, towering Dravidian Hindu temple located on the southern bank of the Vaigai River in the temple city of Madurai, Tamil Nadu.",
        historicalImportance: "Built by the Pandya and Nayak dynasties, it features 14 majestic gopurams (gateway towers), completely covered in thousands of colorful, multi-hued stucco figures of deities, mythical beasts, and stories.",
        bestTimeToVisit: "November to February (During major temple festivals)",
        funFacts: [
          "The temple complex houses an estimated 33,000 sculptures.",
          "The central 'Hall of a Thousand Pillars' is supported by sculptured stone columns that produce musical notes when tapped."
        ],
        category: "culture",
        coordinates: { lat: 9.9195, lng: 78.1193 }
      }
    ],
    galleries: [
      { url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1000", caption: "The imposing Red Fort in New Delhi", category: "hero" },
      { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000", caption: "Agra Fort with view of Taj Mahal", category: "landmarks" },
      { url: "https://images.unsplash.com/photo-1506461883276-594a12b11db3?q=80&w=1000", caption: "Misty Munnar Tea Gardens in Kerala", category: "nature" },
      { url: "https://images.unsplash.com/photo-1615959189197-48400bc2ae9c?q=80&w=1000", caption: "The Royal Bengal Tiger in Ranthambore", category: "wildlife" },
      { url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000", caption: "Vibrant and aromatic Biryani and Indian Curries", category: "food" },
      { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000", caption: "Symmetry of traditional lighting during Diwali", category: "festivals" },
      { url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000", caption: "Traditional dance practice in Kerala", category: "culture" },
      { url: "https://images.unsplash.com/photo-1562790351-d273a961e0e9?q=80&w=1000", caption: "Incredible carvings of Hawa Mahal in Jaipur", category: "architecture" }
    ],
    regionalMemories: [
      {
        city: "Mumbai",
        description: "The city of dreams on the Arabian Sea",
        icon: "🌊",
        memories: [
          "Taking a local train during peak hours and learning the 'art' of getting in and out.",
          "Walking down Marine Drive at midnight with a warm cup of cutting chai and cool sea breeze.",
          "Eating spicy, hot Vadapav from the local street vendor right after monsoon rains.",
          "The absolute scale and energy of the Ganesh Chaturthi immersion at Girgaon Chowpatty beach."
        ]
      },
      {
        city: "Delhi",
        description: "The historic heart and street food capital",
        icon: "🕌",
        memories: [
          "Biting into crispy, hot Butter Chicken or Chole Bhature in the lanes of Chandni Chowk.",
          "Hanging out at India Gate on summer evenings, eating orange ice-creams.",
          "The absolute chaos and joy of bargain shopping at Sarojini Nagar market.",
          "Walking through the misty, cold winters of Lutyens' Delhi."
        ]
      },
      {
        city: "Kolkata",
        description: "The cultural soul and city of joy",
        icon: "🚋",
        memories: [
          "Riding the vintage slow wooden trams along the historic lanes of College Street.",
          "Eating sweet, melt-in-the-mouth Roshogollas and creamy Mishti Doi in clay cups.",
          "The incredible, electric atmosphere of Durga Puja, hearing the energetic 'Dhak' drum beats.",
          "Reading old books over a hot cup of lemon tea at the legendary Indian Coffee House."
        ]
      },
      {
        city: "Bangalore",
        description: "The garden city and tech capital",
        icon: "🌳",
        memories: [
          "Drinking freshly brewed filter coffee at Vidyarthi Bhavan on a cool, breezy morning.",
          "Walking under the beautiful pink blossoms of Tabebuia trees in Cubbon Park.",
          "Weekend trips to Nandi Hills to watch the sunrise above the blankets of clouds.",
          "Exploring the thriving indie music gigs in cozy corner pubs."
        ]
      }
    ]
  },
  {
    id: "japan",
    name: "Japan",
    code: "JP",
    flag: "🇯🇵",
    tagline: "Where Ancient Serenity Meets Neon Futurity",
    intro: "Experience a nation where centuries-old stone temples stand quietly beneath soaring glass skyscrapers. Japan is an artistic symphony of quiet zen gardens, hyper-speed bullet trains, neon-drenched arcade subcultures, and delicate cherry blossom showers.",
    history: "Japan's history flows from the indigenous Jomon period through feudal centuries ruled by noble Shoguns and sword-wielding Samurais. After long isolation, the Meiji Restoration in 1868 rapidly modernized the country. Out of the devastation of World War II, Japan rose to become a global democratic, cultural, and technological giant.",
    geography: "Japan is an archipelago of over 6,800 islands, heavily forested and mountain-covered. Mount Fuji, an elegant volcanic cone, is its tallest peak. The country is part of the Pacific Ring of Fire, giving it dramatic thermal hot springs (Onsen) and beautiful, rugged coastlines.",
    culture: "An intricate balance of Shintoism (worship of nature spirits) and Zen Buddhism. It is universally celebrated for its artistic focus on minimalism ('Wabi-Sabi'), pristine tea ceremonies, calligraphy, kabuki theater, and its massive modern exports of Anime, Manga, and gaming.",
    traditions: "Defined by respect, precision, and harmony. Customary bowing, extreme punctuality, seasonal appreciation (like cherry blossom viewing, 'Hanami'), and the craft of master craftsmanship ('Takumi') are foundational tenets.",
    localCustoms: "Removing shoes at the entrance (switching to slippers), bowing to greet, and saying 'Itadakimasu' before starting a meal to express gratitude. Slurping noodles is considered a sign of enjoyment, not bad manners.",
    officialLanguage: "Japanese",
    currency: "Japanese Yen (JPY, Symbol: ¥)",
    population: "Approximately 124 Million",
    government: "Unitary Parliamentary Constitutional Monarchy",
    climate: "Four highly distinct seasons. Mild springs with cherry blossoms, warm humid summers with spectacular fireworks, colorful red-maple autumns, and heavy-snow winters in the northern regions like Hokkaido.",
    wildlife: "Includes the famous red-faced Japanese Macaque (Snow Monkeys) who bathe in volcanic hot springs, the majestic Japanese Serow, and the elegant Red-crowned Crane.",
    nationalParks: "34 national parks, including Fuji-Hakone-Izu (stunning volcano views) and Shiretoko (wild, untouched northern peninsula).",
    economy: "The world's fourth-largest economy. A global pioneer in automotive engineering, robotics, high-speed rail (Shinkansen), electronics, and luxury hospitality.",
    architecture: "From masterfully jointed, nail-free wooden temples (like Kiyomizu-dera) to minimalist, sleek modern structures by Tadao Ando that blend glass, raw concrete, and natural light.",
    festivals: "Vibrant summer 'Matsuri' festivals with giant paper lanterns (Gion Matsuri), heavy wood shrines carried on shoulders, and beautiful traditional yukatas worn during temple dances.",
    music: "From classical court music (Gagaku) played with bamboo flutes and stringed kotos to the energetic, polished beats of modern J-Pop and anime soundtracks.",
    famousPersonalities: [
      "Emperor Meiji (Modernizer of Japan)",
      "Hayao Miyazaki (Legendary Anime Director)",
      "Akira Kurosawa (Master Film Director)",
      "Shigeru Miyamoto (Creator of Mario & Zelda)",
      "Yayoi Kusama (Avant-Garde Artist)"
    ],
    interestingFacts: [
      "Over 90% of phones in Japan are waterproof because people use them in the bath.",
      "The trains are so punctual that any delay over 18 seconds triggers a formal apology.",
      "Japan has more than 5 million vending machines, selling everything from hot canned coffee to fresh umbrellas.",
      "Melons can sell for thousands of dollars at auctions as premium luxury gifts.",
      "Tokyo is the most populous metropolitan area in the world with over 37 million residents."
    ],
    landmarks: [
      {
        id: "mount_fuji",
        name: "Mount Fuji",
        image: "https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=1000",
        description: "An active stratovolcano about 100 kilometers southwest of Tokyo, with an exceptionally symmetrical cone covered in thick white snow for several months of the year.",
        historicalImportance: "A sacred mountain in Shinto and Buddhist traditions, Mount Fuji has inspired poets, woodblock artists (such as Hokusai's 36 Views), and pilgrims for over a thousand years. It is a UNESCO World Heritage Site.",
        bestTimeToVisit: "July to early September (for climbing) or November to February (for crisp, clear morning views)",
        funFacts: [
          "Fuji is actually composed of three separate volcanoes stacked on top of each other.",
          "Women were forbidden from climbing Mount Fuji until the late 19th century."
        ],
        category: "nature",
        coordinates: { lat: 35.3606, lng: 138.7274 }
      },
      {
        id: "fushimi_inari",
        name: "Fushimi Inari-taisha",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000",
        description: "The head shrine of the god Inari, located in southern Kyoto, famous for its mesmerizing pathway of thousands of vibrant vermilion torii gates winding up the sacred mountain.",
        historicalImportance: "Founded in 711 AD, it is dedicated to Inari, the Shinto patron of rice, agriculture, and business prosperity. Thousands of stone fox statues (kitsune), acting as the god's messengers, dot the grounds.",
        bestTimeToVisit: "Early morning or late evening (to beat the crowds and experience its quiet, spiritual, eerie peace)",
        funFacts: [
          "Every single torii gate has been donated by a business or merchant seeking good fortune, with the donor's name painted on the gate's back.",
          "It takes about 2 to 3 hours to hike all the way to the top of the mountain."
        ],
        category: "culture",
        coordinates: { lat: 34.9671, lng: 135.7727 }
      }
    ],
    galleries: [
      { url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1000", caption: "The sparkling neon streets of Shibuya, Tokyo", category: "hero" },
      { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000", caption: "The vermilion torii gates of Fushimi Inari", category: "landmarks" },
      { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000", caption: "Pink cherry blossoms framing the Chureito Pagoda", category: "nature" },
      { url: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1000", caption: "Sleek Shinkansen bullet train passing Tokyo", category: "architecture" },
      { url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000", caption: "Art of masterfully prepared fresh Nigiri Sushi", category: "food" },
      { url: "https://images.unsplash.com/photo-1583842761829-4245d7894246?q=80&w=1000", caption: "Gion geisha culture in Kyoto", category: "culture" },
      { url: "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?q=80&w=1000", caption: "Scenic view of Mount Fuji from Hakone", category: "hidden" },
      { url: "https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?q=80&w=1000", caption: "Snow Monkeys in Jigokudani Hot Springs", category: "wildlife" }
    ],
    regionalMemories: [
      {
        city: "Tokyo",
        description: "The neon-drenched arcade paradise",
        icon: "👾",
        memories: [
          "Spending entire afternoons in Akihabara Sega centers playing Taiko no Tatsujin drums.",
          "Walking under the neon lights of Shinjuku, hearing the electronic hum and arcade music.",
          "Grabbing hot canned corn soup from a warm vending machine on a freezing winter evening.",
          "Bumping shoulders at Shibuya Crossing under towering screens flashing anime trailers."
        ]
      },
      {
        city: "Kyoto",
        description: "The historic city of silent temples",
        icon: "🏮",
        memories: [
          "Renting a wooden bicycle and cycling through quiet bamboo pathways of Arashiyama.",
          "The hollow, peaceful sound of a wooden temple bell ringing through the autumn maple trees.",
          "Drinking warm, whisked matcha green tea while watching golden carp in a zen garden pond.",
          "Watching a geisha disappear into a wooden doorway in the historic Gion alleyways."
        ]
      }
    ]
  },
  {
    id: "usa",
    name: "United States",
    code: "US",
    flag: "🇺🇸",
    tagline: "The Great Melting Pot of Innovation and Vast Horizons",
    intro: "Discover a land carved out of massive geological spectacles and glowing megacities. From the cinematic skyscrapers of New York to the giant redwood forests of California, the USA is a playground of global entertainment, history, and wild, untamed nature.",
    history: "Inhabited by diverse Indigenous nations for millennia, the USA was colonized by European powers before declaring independence from Britain in 1776. After expanding across the continent and surviving a brutal Civil War, the nation pioneered industrialization. The 20th century established the country as a global economic, military, and cultural powerhouse, pioneering space flight, the internet, and popular culture.",
    geography: "Spans an entire continent, housing the dramatic Grand Canyon, the volcanic peaks of Hawaii, the vast Great Plains, the ancient Appalachian mountains, and the snow-capped Rockies, bordering three major oceans.",
    culture: "A global cultural trendsetter. The birthplace of Jazz, Rock & Roll, Hip Hop, and the global cinematic powerhouse of Hollywood. It is highly characterized by regional subcultures, diverse immigrant culinary blends, and a pioneer spirit.",
    traditions: "Celebrates national milestones like Thanksgiving (commemorating harvest and gratitude) and the 4th of July (Independence Day fireworks). Rooted in the ideal of individual liberty, the 'American Dream', and local volunteerism.",
    localCustoms: "Friendly small talk with strangers, tipping service workers (typically 15-20%), and holding doors open for others. Commuting is heavily centered on cars and iconic road trips.",
    officialLanguage: "English (with a massive Spanish-speaking population; no official language at the federal level).",
    currency: "US Dollar (USD, Symbol: $)",
    population: "Approximately 335 Million",
    government: "Federal Constitutional Presidential Republic",
    climate: "Spans from tropical (Florida, Hawaii) and arid desert (Arizona) to temperate plains, alpine ranges, and sub-arctic conditions in Alaska.",
    wildlife: "Includes the iconic Bald Eagle, Grizzly Bears, American Bison, Cougars, and giant Gray Wolves roaming vast wilderness areas.",
    nationalParks: "63 national parks, including Yellowstone (the world's first), Yosemite (giant granite cliffs), and the Grand Canyon.",
    economy: "The world's largest national economy. A global leader in technology (Silicon Valley), finance (Wall Street), entertainment (Hollywood), biotechnology, and aerospace.",
    architecture: "Defined by towering art-deco and glass skyscrapers (Empire State Building), sweeping suspension bridges (Golden Gate), and the organic residential designs of Frank Lloyd Wright.",
    festivals: "Massive celebrations of Halloween (trick-or-treating), Thanksgiving feasts, New Year's Eve ball drops, and global music festivals like Coachella.",
    music: "An incredibly rich, globally influential heritage: blues, jazz, country, rock and roll, soul, pop, and hip hop.",
    famousPersonalities: [
      "George Washington (Founding Father)",
      "Abraham Lincoln (Preserver of the Union)",
      "Martin Luther King Jr. (Civil Rights Icon)",
      "Steve Jobs (Tech Visionary)",
      "Walt Disney (Entertainment Pioneer)"
    ],
    interestingFacts: [
      "The USA has no official national language, although English is used globally.",
      "The GPS (Global Positioning System) was developed by the US military and is now used worldwide.",
      "One out of eight people in the US has been employed by McDonald's at some point in their lives.",
      "The flag's design was created by a 17-year-old student as a high school project; he received a B- for it.",
      "The Grand Canyon is so massive it can create its own weather patterns."
    ],
    landmarks: [
      {
        id: "statue_of_liberty",
        name: "Statue of Liberty",
        image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1000",
        description: "A colossal copper statue on Liberty Island in New York Harbor, representing Libertas, the Roman goddess of liberty, holding a torch and a tablet of law.",
        historicalImportance: "A gift from the people of France in 1886, it became a universal icon of freedom and the welcoming symbol for millions of immigrants arriving in America.",
        bestTimeToVisit: "April to October (early ferry bookings are essential to climb the crown)",
        funFacts: [
          "The statue's green color is the result of natural oxidation of its copper skin.",
          "The seven spikes on her crown represent the seven seas and continents of the world."
        ],
        category: "landmark",
        coordinates: { lat: 40.6892, lng: -74.0445 }
      },
      {
        id: "grand_canyon",
        name: "Grand Canyon",
        image: "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?q=80&w=1000",
        description: "A steep-sided canyon carved by the Colorado River in Arizona, showing millions of years of colorful geological rock layers.",
        historicalImportance: "A sacred place for several Native American tribes and an unparalleled geological window showing earth's history. It is one of the natural wonders of the world.",
        bestTimeToVisit: "September to November (cool temperatures and beautiful foliage)",
        funFacts: [
          "The canyon is 277 miles long and up to 18 miles wide.",
          "It contains hidden caves and a small native village tucked inside the canyon floor."
        ],
        category: "nature",
        coordinates: { lat: 36.0544, lng: -112.1377 }
      }
    ],
    galleries: [
      { url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000", caption: "The sparkling billboards of Times Square, New York", category: "hero" },
      { url: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=1000", caption: "Sunrise over the Golden Gate Bridge, San Francisco", category: "landmarks" },
      { url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1000", caption: "Lush waterfalls in Yosemite Valley", category: "nature" },
      { url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1000", caption: "Mighty Bison grazing in Yellowstone", category: "wildlife" },
      { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000", caption: "Classic thick-crust Chicago Pizza", category: "food" },
      { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000", caption: "Electric stage lights of a music festival", category: "festivals" },
      { url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1000", caption: "The massive Saturn V rocket at NASA", category: "hidden" },
      { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000", caption: "Glass skyscrapers of Manhattan skyline", category: "architecture" }
    ],
    regionalMemories: [
      {
        city: "New York",
        description: "The city that never sleeps",
        icon: "🍎",
        memories: [
          "Grabbing a $1 slice of greasy pizza from a corner shop at 2 AM in Manhattan.",
          "Walking across the majestic wooden planks of the Brooklyn Bridge at sunset.",
          "The steam rising from subway grates and the heavy yellow taxi horns echoing in the avenues.",
          "Ice skating at Central Park on a crisp, snowy winter morning."
        ]
      },
      {
        city: "Los Angeles",
        description: "The dream factory of Hollywood",
        icon: "🎬",
        memories: [
          "Cruising down Santa Monica Boulevard on skateboards under towering palm trees.",
          "Looking at the city lights from the Griffith Observatory, thinking about movie stars.",
          "Eating hot tacos from a food truck after a long, sunny day at the beach.",
          "Spotting your favorite cartoon character star on the Hollywood Walk of Fame."
        ]
      }
    ]
  }
];
