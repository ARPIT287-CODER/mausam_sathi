// Fitness & Outdoor Workout Analyzer

export function analyzeOutdoorFitnessConditions(hourlyData = [], currentData = null) {
  if (!hourlyData || hourlyData.length === 0) {
    return {
      bestWindow: "6:30 PM – 7:30 PM",
      bestScore: 82,
      currentStatus: "Moderate",
      currentVerdict: "Suitable for moderate pace jogging with hydration.",
      hourlyScores: []
    };
  }

  // Score each hour from 0 to 100
  const scoredHours = hourlyData.map((hour) => {
    const { temp, rainProb, uv, windSpeed, aqi } = hour;

    // Ideal workout conditions:
    // Temp: 18-24C (penalties above 27C and below 12C)
    // AQI: < 80 (heavy penalty > 150)
    // UV: < 3
    // Rain: < 20%
    // Wind: 8-18 km/h

    let score = 100;

    // Temp penalty
    if (temp > 24) score -= (temp - 24) * 4;
    else if (temp < 16) score -= (16 - temp) * 3;

    // AQI penalty
    if (aqi > 50) {
      if (aqi <= 100) score -= (aqi - 50) * 0.3;
      else if (aqi <= 150) score -= 15 + (aqi - 100) * 0.5;
      else score -= 40 + (aqi - 150) * 0.35;
    }

    // UV penalty
    if (uv > 3) score -= (uv - 3) * 6;

    // Rain penalty
    if (rainProb > 20) score -= (rainProb - 20) * 0.5;

    // Wind penalty
    if (windSpeed > 25) score -= (windSpeed - 25) * 1.5;

    score = Math.max(10, Math.min(98, Math.round(score)));

    return {
      ...hour,
      fitnessScore: score,
      status: score >= 75 ? "Optimal" : score >= 55 ? "Acceptable" : "Unfavorable"
    };
  });

  // Find best 1-2 hour consecutive slot
  let bestIdx = 0;
  let maxScore = -1;

  for (let i = 0; i < Math.min(18, scoredHours.length - 1); i++) {
    const twoHourAvg = (scoredHours[i].fitnessScore + scoredHours[i + 1].fitnessScore) / 2;
    if (twoHourAvg > maxScore) {
      maxScore = twoHourAvg;
      bestIdx = i;
    }
  }

  const startHour = scoredHours[bestIdx];
  const endHour = scoredHours[Math.min(scoredHours.length - 1, bestIdx + 1)];

  const bestWindow = `${startHour?.time || "6:30 PM"} – ${endHour?.time || "7:30 PM"}`;

  // Current condition analysis
  const currentTemp = currentData?.temp ?? (hourlyData[0]?.temp || 28);
  const currentAqi = currentData?.aqi?.value ?? (hourlyData[0]?.aqi || 128);
  const currentUv = currentData?.uvIndex ?? (hourlyData[0]?.uv || 4);

  let currentStatus = "Good";
  let currentVerdict = "Outdoor running conditions are currently acceptable.";
  let badgeColor = "#10b981";

  if (currentAqi > 160 || currentTemp > 35 || currentUv > 8) {
    currentStatus = "Avoid Intense Cardio";
    currentVerdict = `High ${currentAqi > 160 ? 'AQI (' + currentAqi + ')' : 'Heat (' + currentTemp + '°C)'}. Indoor training strongly recommended.`;
    badgeColor = "#ef4444";
  } else if (currentAqi > 100 || currentTemp > 30 || currentUv > 5) {
    currentStatus = "Moderate Exertion Only";
    currentVerdict = "Stay well-hydrated and consider waiting for the optimal evening window.";
    badgeColor = "#f59e0b";
  } else {
    currentStatus = "Great Running Conditions";
    currentVerdict = "Ideal temperature, low UV, and safe air quality for distance running.";
    badgeColor = "#10b981";
  }

  return {
    bestWindow,
    bestScore: Math.round(maxScore),
    bestDetails: {
      temp: startHour?.temp,
      aqi: startHour?.aqi,
      uv: startHour?.uv,
      rainProb: startHour?.rainProb,
      windSpeed: startHour?.windSpeed
    },
    currentStatus,
    currentVerdict,
    badgeColor,
    hourlyScores: scoredHours
  };
}
