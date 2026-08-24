// Community crowd-sourced micro-climate hazard reports
export let communityReports = [
  {
    id: "rep-1",
    type: "waterlogging",
    title: "Heavy Waterlogging near Sector 62 Underpass",
    description: "Water accumulated up to 1.5 feet after sudden downpour. Two-wheelers getting stuck, avoid right lane.",
    location: {
      name: "Sector 62, Noida",
      lat: 28.6280,
      lon: 77.3649,
      landmark: "Near Electronic City Metro Station"
    },
    severity: "high", // low, moderate, high, extreme
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    confirmations: 14,
    rejections: 1,
    verified: true,
    user: "Aakash S. (Daily Commuter)",
    userBadge: "Top Contributor",
    tags: ["Traffic Delay", "1.5ft Water", "Alternative Route Recommended"]
  },
  {
    id: "rep-2",
    type: "hailstorm",
    title: "Sudden Hailstorm & Strong Gusts",
    description: "Sudden marble-sized hail falling with intense gusty winds. Seek shelter under concrete structures immediately.",
    location: {
      name: "Indirapuram, Ghaziabad",
      lat: 28.6415,
      lon: 77.3714,
      landmark: "Ahinsa Khand 2"
    },
    severity: "extreme",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    confirmations: 28,
    rejections: 2,
    verified: true,
    user: "Priya V. (Resident)",
    userBadge: "Verified Resident",
    tags: ["Hail Damage Risk", "Wind 65km/h"]
  },
  {
    id: "rep-3",
    type: "tree_fallen",
    title: "Large Neem Tree Fallen across Main Road",
    description: "Storm caused branch collapse blocking 2 lanes towards expressway. Traffic police diverting via service lane.",
    location: {
      name: "Sector 18, Noida",
      lat: 28.5708,
      lon: 77.3271,
      landmark: "Atta Market Crossing"
    },
    severity: "high",
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    confirmations: 19,
    rejections: 0,
    verified: true,
    user: "Rohit K. (Cab Driver)",
    userBadge: "Commuter Scout",
    tags: ["Road Blocked", "Traffic Diverted"]
  },
  {
    id: "rep-4",
    type: "smog",
    title: "Severe Smoke & Visibility Drop < 150m",
    description: "Localized agricultural burning / construction dust causing intense burning sensation in eyes and throat. Wear N95 mask.",
    location: {
      name: "Greater Noida West (Noida Extension)",
      lat: 28.6015,
      lon: 77.4426,
      landmark: "Gaur Chowk"
    },
    severity: "high",
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    confirmations: 32,
    rejections: 3,
    verified: true,
    user: "Dr. Meenal R. (Health Pro)",
    userBadge: "Health Expert",
    tags: ["AQI > 320", "Mask Required", "Low Visibility"]
  },
  {
    id: "rep-5",
    type: "heavy_rain",
    title: "Torrential Downpour with Water Accumulation",
    description: "Continuous heavy shower started 15 mins ago. Visibility reduced to 200m on freeway.",
    location: {
      name: "Cyber Hub, Gurugram",
      lat: 28.4950,
      lon: 77.0895,
      landmark: "DLF Cyber City"
    },
    severity: "moderate",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    confirmations: 8,
    rejections: 1,
    verified: false,
    user: "Kunal M. (Techie)",
    userBadge: "Community Member",
    tags: ["Rain", "Headlights On"]
  }
];

export function getReports(lat, lon, radiusKm = 50) {
  return communityReports;
}

export function addReport(newReport) {
  const report = {
    id: `rep-${Date.now()}`,
    ...newReport,
    timestamp: new Date().toISOString(),
    confirmations: 1,
    rejections: 0,
    verified: false
  };
  communityReports.unshift(report);
  return report;
}

export function voteReport(id, voteType) {
  const report = communityReports.find(r => r.id === id);
  if (!report) return null;

  if (voteType === 'confirm') {
    report.confirmations += 1;
  } else if (voteType === 'reject') {
    report.rejections += 1;
  }

  // Auto-verify if confirmed by at least 5 people with >80% approval
  const total = report.confirmations + report.rejections;
  if (total >= 5 && (report.confirmations / total) >= 0.75) {
    report.verified = true;
  } else if (total >= 6 && (report.rejections / total) > 0.6) {
    report.verified = false;
  }

  return report;
}
