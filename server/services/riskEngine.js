// Dynamic Health Risk & Environmental Safety Score Engine

export function calculateSafetyScore({
  weather,
  profile = 'general',
  vulnerabilities = [],
  activity = null
}) {
  if (!weather || !weather.current) {
    return {
      score: 75,
      level: "Moderate",
      badgeColor: "#eab308",
      summary: "Weather data loading...",
      recommendations: ["Stay updated with local forecast."],
      subScores: { respiratory: 75, uv: 75, thermal: 75, allergy: 75 }
    };
  }

  const { temp, feelsLike, humidity, uvIndex, windSpeed, rainProbability } = weather.current;
  const aqiVal = weather.aqi?.value || 100;
  const pollenScore = weather.pollen?.score || 35;

  // Profile weights
  const weights = {
    health_conscious: { aqi: 0.40, uv: 0.20, thermal: 0.20, allergy: 0.15, rain: 0.05 },
    fitness: { aqi: 0.30, thermal: 0.30, uv: 0.20, rain: 0.15, allergy: 0.05 },
    traveler: { rain: 0.35, thermal: 0.25, wind: 0.15, aqi: 0.15, uv: 0.10 },
    commuter: { rain: 0.40, aqi: 0.25, thermal: 0.20, wind: 0.15 },
    general: { aqi: 0.30, thermal: 0.25, uv: 0.20, rain: 0.15, allergy: 0.10 }
  }[profile] || { aqi: 0.30, thermal: 0.25, uv: 0.20, rain: 0.15, allergy: 0.10 };

  // 1. Respiratory Sub-Score (0-100, 100 is best)
  let respiratoryScore = 100;
  if (aqiVal <= 50) respiratoryScore = 95 - (aqiVal / 50) * 10;
  else if (aqiVal <= 100) respiratoryScore = 85 - ((aqiVal - 50) / 50) * 15;
  else if (aqiVal <= 150) respiratoryScore = 70 - ((aqiVal - 100) / 50) * 20;
  else if (aqiVal <= 200) respiratoryScore = 50 - ((aqiVal - 150) / 50) * 25;
  else if (aqiVal <= 300) respiratoryScore = 25 - ((aqiVal - 200) / 100) * 20;
  else respiratoryScore = Math.max(5, 10 - ((aqiVal - 300) / 200) * 8);

  // Apply vulnerability penalties
  if (vulnerabilities.includes('asthma') || vulnerabilities.includes('copd')) {
    respiratoryScore = Math.round(respiratoryScore * 0.75);
  }

  // 2. UV Sub-Score (0-100, 100 is minimal sun damage risk)
  let uvScore = 100;
  if (uvIndex <= 2) uvScore = 98;
  else if (uvIndex <= 5) uvScore = 85 - (uvIndex - 2) * 5;
  else if (uvIndex <= 7) uvScore = 70 - (uvIndex - 5) * 10;
  else if (uvIndex <= 10) uvScore = 50 - (uvIndex - 7) * 12;
  else uvScore = Math.max(10, 20 - (uvIndex - 10) * 5);

  // 3. Thermal Comfort Sub-Score (0-100, 100 is ideal 20-25C)
  let thermalScore = 100;
  const effectiveTemp = Math.max(temp, feelsLike);
  if (effectiveTemp >= 20 && effectiveTemp <= 26) {
    thermalScore = 95;
  } else if (effectiveTemp > 26) {
    // Heat stress
    const delta = effectiveTemp - 26;
    thermalScore = Math.max(10, 95 - (delta * 4.5) - (humidity > 70 ? 10 : 0));
  } else {
    // Cold stress
    const delta = 20 - effectiveTemp;
    thermalScore = Math.max(15, 95 - (delta * 4));
  }

  // 4. Allergy Sub-Score
  let allergyScore = Math.max(10, 100 - pollenScore);
  if (vulnerabilities.includes('dust_allergy') || vulnerabilities.includes('pollen_allergy')) {
    allergyScore = Math.round(allergyScore * 0.7);
  }

  // 5. Rain / Transit score
  let rainScore = Math.max(10, 100 - (rainProbability * 0.9));

  // Compute weighted aggregate
  let rawScore = (
    respiratoryScore * (weights.aqi || 0.25) +
    uvScore * (weights.uv || 0.2) +
    thermalScore * (weights.thermal || 0.25) +
    allergyScore * (weights.allergy || 0.15) +
    rainScore * (weights.rain || 0.15)
  );

  let finalScore = Math.max(5, Math.min(100, Math.round(rawScore)));

  // Determine Level & Badge
  let level = "Good";
  let badgeColor = "#10b981";
  let statusEmoji = "🟢";

  if (finalScore >= 80) {
    level = "Excellent & Safe";
    badgeColor = "#10b981";
    statusEmoji = "🟢";
  } else if (finalScore >= 65) {
    level = "Moderate";
    badgeColor = "#eab308";
    statusEmoji = "🟡";
  } else if (finalScore >= 45) {
    level = "Caution Required";
    badgeColor = "#f97316";
    statusEmoji = "🟠";
  } else if (finalScore >= 25) {
    level = "High Environmental Risk";
    badgeColor = "#ef4444";
    statusEmoji = "🔴";
  } else {
    level = "Hazardous Conditions";
    badgeColor = "#881337";
    statusEmoji = "🟣";
  }

  // Generate Profile-tailored dynamic summary & recommendations
  const { summary, recommendations } = generateProfileAdvice({
    profile,
    score: finalScore,
    aqiVal,
    temp,
    uvIndex,
    rainProbability,
    vulnerabilities
  });

  return {
    score: finalScore,
    level,
    badgeColor,
    statusEmoji,
    summary,
    recommendations,
    subScores: {
      respiratory: Math.round(respiratoryScore),
      uv: Math.round(uvScore),
      thermal: Math.round(thermalScore),
      allergy: Math.round(allergyScore)
    }
  };
}

function generateProfileAdvice({ profile, score, aqiVal, temp, uvIndex, rainProbability, vulnerabilities }) {
  const recommendations = [];
  let summary = "";

  if (profile === 'health_conscious') {
    if (aqiVal > 150) {
      summary = "Elevated particulate pollution detected. Outdoor cardiovascular exposure should be curtailed.";
      recommendations.push("Wear an N95 respirator mask if stepping out.");
      recommendations.push("Keep windows closed and run an HEPA air purifier indoors.");
    } else if (uvIndex >= 6) {
      summary = "High UV radiation index. Sun protection required during mid-day hours.";
      recommendations.push("Apply broad-spectrum SPF 50+ sunscreen.");
    } else {
      summary = "Conditions are generally acceptable for regular indoor and light outdoor activities.";
      recommendations.push("Maintain adequate hydration throughout the day.");
    }
  } else if (profile === 'fitness') {
    if (aqiVal > 150 || temp > 35) {
      summary = "Outdoor training not recommended right now due to elevated pollution / thermal stress.";
      recommendations.push("Shift workout to an indoor air-conditioned gym or indoor treadmill.");
      recommendations.push("Check the 'Best Running Hours' section for optimal evening windows.");
    } else if (rainProbability > 50) {
      summary = "Wet surfaces and rain showers expected. Traction risk for high-speed running/cycling.";
      recommendations.push("Wear water-repellent running shoes and high-visibility gear.");
    } else {
      summary = "Great conditions for outdoor cardio, cycling, and distance running!";
      recommendations.push("Hydrate before starting and plan for cool-down stretches.");
    }
  } else if (profile === 'traveler') {
    if (rainProbability > 40) {
      summary = "Rain showers likely in the region. Transit delays and damp attractions expected.";
      recommendations.push("Carry a compact umbrella and waterproof bag protector.");
      recommendations.push("Allow 15-20 extra minutes for road travel.");
    } else if (temp > 36) {
      summary = "Hot and sunny destination weather. Plan outdoor sightseeing early morning or late afternoon.";
      recommendations.push("Keep bottled electrolytes and sunglasses handy.");
    } else {
      summary = "Favorable weather for sightseeing, road trips, and exploring scenic spots.";
      recommendations.push("Ideal day for outdoor photography and walking tours.");
    }
  } else if (profile === 'commuter') {
    if (rainProbability > 60) {
      summary = "High rain probability during peak transit hours. Watch for underpass waterlogging.";
      recommendations.push("Check live micro-climate crowd reports before starting journey.");
      recommendations.push("Keep rain gear handy and ride cautiously on two-wheelers.");
    } else if (aqiVal > 200) {
      summary = "Severe smog and vehicular exhaust along arterial corridors.";
      recommendations.push("Keep vehicle windows rolled up and switch AC to recirculation mode.");
    } else {
      summary = "Clear roads and normal transit conditions expected today.";
      recommendations.push("Smooth commute anticipated on primary routes.");
    }
  } else {
    // General
    if (score >= 80) {
      summary = "Comfortable and pleasant weather across all environmental metrics.";
      recommendations.push("Enjoy outdoor walks and open-air activities.");
    } else if (score >= 60) {
      summary = "Moderate conditions. Outdoor activity is possible with standard precautions.";
      recommendations.push("Avoid prolonged exposure during peak UV / heat hours (12 PM - 3 PM).");
    } else {
      summary = "Unfavorable environmental metrics. Limit unnecessary outdoor exposure.";
      recommendations.push("Hydrate regularly and monitor hourly air quality trends.");
    }
  }

  return { summary, recommendations };
}
