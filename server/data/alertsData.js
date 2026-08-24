// Active weather and environmental alerts with NDMA & IMD safety protocols
export const activeAlerts = [
  {
    id: "alert-101",
    level: "orange", // yellow, orange, red, info
    type: "heatwave",
    title: "Extreme Heat Warning (41°C Peak Expected)",
    region: "Delhi NCR, Noida, Gurugram",
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    summary: "Surface temperatures peaking between 12:30 PM and 4:30 PM with high thermal radiation and dry westerly winds.",
    impact: "High risk of heat exhaustion, cramps, and dehydration for children, elderly, and outdoor workers.",
    actionableChecklist: [
      "Avoid direct sun exposure between 12:00 PM and 4:00 PM.",
      "Drink ORS, buttermilk, lemon water or coconut water frequently.",
      "Wear light-colored, loose-fitting cotton clothing and wide-brim hats.",
      "Never leave children or pets inside parked vehicles.",
      "Keep cattle/pets in shaded areas with plenty of water."
    ],
    issuingAuthority: "India Meteorological Department (IMD)",
    ndmaGuidelineId: "NDMA-HEAT-2024"
  },
  {
    id: "alert-102",
    level: "yellow",
    type: "aqi",
    title: "Air Quality Alert: Poor (AQI 210 - 240 Expected)",
    region: "Noida & Greater Noida Industrial Zone",
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    summary: "Stagnant wind conditions trapping PM2.5 and PM10 particles in lower atmospheric boundary layer.",
    impact: "Breathing discomfort to people with asthma and lung ailments; prolonged outdoor exertion not advised.",
    actionableChecklist: [
      "Asthma patients should carry prescribed inhalers at all times.",
      "Use N95 / FFP2 masks when commuting through heavy traffic corridors.",
      "Run indoor air purifiers in sealed rooms during early morning hours.",
      "Avoid early morning and late evening outdoor jogging/cycling."
    ],
    issuingAuthority: "Central Pollution Control Board (CPCB)",
    ndmaGuidelineId: "CPCB-GRAP-II"
  },
  {
    id: "alert-103",
    level: "yellow",
    type: "rain_waterlogging",
    title: "Isolated Heavy Showers & Waterlogging Advisory",
    region: "Low-lying areas along Hindon & Yamuna Floodplains",
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    summary: "Convective cloud formation likely to bring sudden intense spells of 30-45mm rain with localized waterlogging.",
    impact: "Slow traffic movement, submerged underpasses, and pothole hazard on arterial roads.",
    actionableChecklist: [
      "Check live Mausam Sathi micro-climate map for waterlogged spots before travelling.",
      "Avoid speeding through flooded underpasses.",
      "Keep mobile phones and power banks fully charged in case of local power outage."
    ],
    issuingAuthority: "State Disaster Management Authority (SDMA)",
    ndmaGuidelineId: "SDMA-RAIN-MONSOON"
  }
];

export const emergencyHelplines = [
  { name: "National Emergency Number", number: "112", description: "Police, Fire, Medical Integrated" },
  { name: "Disaster Management Helpline (NDRF)", number: "1078", description: "Flash floods, collapse, storms" },
  { name: "Ambulance / Medical Emergency", number: "108", description: "Free 24x7 Ambulance dispatch" },
  { name: "Women Safety Helpline", number: "1090", description: "24x7 Women assistance" },
  { name: "Traffic Police Helpline", number: "1095", description: "Live road closure & route info" }
];
