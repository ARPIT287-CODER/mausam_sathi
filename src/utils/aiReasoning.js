// Comprehensive Client-side AI Reasoning, Speech Recognition, and Speech Synthesis Engine

export function generateClientAiReply({ question, context }) {
  const q = (question || "").toLowerCase().trim();
  const {
    locationName = "Noida, Uttar Pradesh",
    temp = 28,
    feelsLike = 30,
    condition = "Partly Cloudy",
    aqi = 128,
    aqiCategory = "Moderate",
    uvIndex = 5,
    humidity = 62,
    pollenLevel = "Low",
    safetyScore = 72,
    safetyLevel = "Moderate",
    userProfile = "general",
    bestRunningTime = "6:45 PM – 7:45 PM"
  } = context;

  // 1. Greetings & Pleasantries
  if (q.startsWith('hi') || q.startsWith('hello') || q.startsWith('hey') || q.includes('namaste') || q.includes('good morning') || q.includes('good evening')) {
    return `👋 **Namaste! How can I help you in ${locationName} today?**

Currently, the temperature is **${temp}°C** (${condition}, feels like ${feelsLike}°C) with an **AQI of ${aqi} (${aqiCategory})** and your Safety Score is **${safetyScore}/100 (${safetyLevel})**.

Feel free to ask me questions like:
• *"Can I go for a run right now?"*
• *"What should I wear today?"*
• *"Is it safe for asthmatics or kids to play outside?"*
• *"What precautions should I take against heat/AQI?"*`;
  }

  // 2. Running & Fitness Queries
  if (q.includes('run') || q.includes('jog') || q.includes('exercise') || q.includes('workout') || q.includes('walk') || q.includes('cycling') || q.includes('gym') || q.includes('sport') || q.includes('cricket') || q.includes('football')) {
    if (aqi > 150 || temp > 34 || uvIndex > 7) {
      return `🏃 **I recommend postponing outdoor exercise or moving indoors.**

Currently in **${locationName}**:
• **Temperature:** ${temp}°C (Feels like ${feelsLike}°C)
• **AQI:** ${aqi} (${aqiCategory}) — High particulate load
• **UV Index:** ${uvIndex} — High solar radiation

💡 **Smart Advice:**
• **Recommended Window:** ${bestRunningTime}
• **Current Safety Score:** ${safetyScore}/100 (${safetyLevel})
• **Why:** Intense aerobic exercise right now increases lung inhalation of PM2.5/PM10 and causes unnecessary thermal dehydration.
• **Alternative:** Indoor treadmill, yoga, or waiting for the cooler evening window.`;
    } else {
      return `🏃 **Yes! Weather conditions are suitable for outdoor exercise.**

Currently in **${locationName}**:
• **Temperature:** ${temp}°C (${condition})
• **AQI:** ${aqi} (${aqiCategory}) — Safe for outdoor exertion
• **UV Index:** ${uvIndex}
• **Optimal Time Window:** ${bestRunningTime}

💡 **Workout Checklist:**
1. Drink 300-400ml of water or electrolytes before starting.
2. Pace yourself steadily if humidity is high (${humidity}%).
3. Do a 5-minute cool-down stretch in a shaded spot.`;
    }
  }

  // 3. Clothing & Attire Guidance
  if (q.includes('wear') || q.includes('cloth') || q.includes('jacket') || q.includes('umbrella') || q.includes('coat') || q.includes('dress') || q.includes('outfit')) {
    const rainAdvice = context.humidity > 70 ? "Carry a compact umbrella or lightweight raincoat." : "No rain gear needed.";
    const sunAdvice = uvIndex >= 5 ? "Wear UV-rated sunglasses and a cap or wide-brim hat." : "Sunglasses optional.";
    const maskAdvice = aqi > 150 ? "Wear an N95 respirator mask." : "Mask optional.";

    return `👕 **Attire & Accessories Advisory for ${locationName}:**

• **Current Weather:** ${temp}°C, Feels like ${feelsLike}°C (${condition})
• **Recommended Fabrics:** Light, loose-fitting, breathable cotton or linen fabrics to stay cool.
• **Sun Protection:** ${sunAdvice}
• **Rain Gear:** ${rainAdvice}
• **Air Quality Protection:** ${maskAdvice}`;
  }

  // 4. Food, Fluids & Hydration
  if (q.includes('water') || q.includes('drink') || q.includes('eat') || q.includes('food') || q.includes('fluid') || q.includes('ors') || q.includes('dehydration') || q.includes('electrolyte')) {
    return `💧 **Hydration & Nutrition Guidance for Today (${temp}°C, Humidity ${humidity}%):**

1. 🥛 **Daily Liquid Target:** Drink at least 3.0 to 3.5 Liters of water throughout the day.
2. 🥥 **Natural Electrolytes:** Coconut water, buttermilk (chaas), lemon water (nimbu pani), and ORS are ideal to prevent heat cramps.
3. 🥗 **Dietary Advice:** Eat water-rich fruits like watermelon, cucumber, and oranges. Avoid overly heavy, greasy meals during peak heat hours.`;
  }

  // 5. Children, Elderly & Asthmatic Health Risks
  if (q.includes('kid') || q.includes('child') || q.includes('baby') || q.includes('elderly') || q.includes('parent') || q.includes('senior') || q.includes('asthma') || q.includes('cough') || q.includes('throat') || q.includes('eye')) {
    const riskLevel = aqi > 150 || temp > 35 ? "High Risk" : aqi > 100 ? "Moderate Caution" : "Low Risk";
    return `👶🩺 **Health & Sensitive Group Advisory (${riskLevel}):**

• **Location:** ${locationName} | **AQI:** ${aqi} (${aqiCategory}) | **UV:** ${uvIndex}

💡 **Actionable Precautions:**
${aqi > 130 ? '• Children and seniors with respiratory sensitivity/asthma should limit outdoor playtime between 12 PM and 4 PM.\n• Keep prescribed inhalers or throat lozenges handy.' : '• General outdoor play is safe with standard hydration.'}
• Ensure children drink water every 30-45 minutes when playing outdoors.
• Run an indoor HEPA air purifier in bedrooms during early morning smog hours.`;
  }

  // 6. Rain, Flooding & Waterlogging
  if (q.includes('rain') || q.includes('flood') || q.includes('waterlog') || q.includes('storm') || q.includes('shower') || q.includes('downpour') || q.includes('lightning')) {
    return `🌧️ **Rainfall & Waterlogging Advisory for ${locationName}:**

• **Current Weather:** ${condition} | **Humidity:** ${humidity}%
• **Precipitation Outlook:** Check the **Micro-Climate Map** tab for live community hazard pins near arterial underpasses.
• **Commuter Tip:** Avoid speeding through submerged underpasses. Keep vehicle headlights on low-beam during heavy showers.`;
  }

  // 7. Safety Score Explanation
  if (q.includes('score') || q.includes('why is my health') || q.includes('low score') || q.includes('rating') || q.includes('explain score') || q.includes('safety score')) {
    const primaryFactor = aqi > 140 ? `elevated particulate pollution (AQI ${aqi})` : temp > 33 ? `elevated heat index (${temp}°C)` : uvIndex > 6 ? `high UV radiation (${uvIndex})` : `humidity (${humidity}%)`;
    return `❤️ **Your Personalized Safety Score is ${safetyScore}/100 (${safetyLevel}).**

Here is your environmental breakdown for **${locationName}**:
• **Air Quality Impact:** AQI is ${aqi} (${aqiCategory})
• **Thermal Stress:** ${temp}°C (Feels like ${feelsLike}°C)
• **Solar Radiation:** UV Index is ${uvIndex}
• **Active Profile:** ${userProfile.replace('_', ' ').toUpperCase()}

The primary factor dampening today's score is **${primaryFactor}**. For best comfort, avoid direct sun exposure during peak afternoon hours and drink plenty of fluids.`;
  }

  // 8. AQI & Smog Queries
  if (q.includes('aqi') || q.includes('pollution') || q.includes('air quality') || q.includes('smog') || q.includes('mask') || q.includes('breathe') || q.includes('pm2.5') || q.includes('pm10')) {
    const maskAdvice = aqi > 150 ? "Yes, an **N95 respirator mask** is strongly recommended for outdoor travel." : "A mask is optional for general individuals, but sensitive groups with asthma should take precautions.";
    return `🌫️ **Current Air Quality in ${locationName}: AQI ${aqi} (${aqiCategory})**

• **What this means:** ${aqiCategory === 'Good' ? 'Air is clean, fresh, and ideal for deep breathing.' : aqiCategory === 'Moderate' ? 'Air is acceptable; sensitive individuals may experience slight throat dryness.' : 'Particulate matter is high. Prolonged exertion outdoors can trigger respiratory discomfort.'}
• **Should you wear a mask?** ${maskAdvice}
• **Indoor Action:** Keep windows shut if near arterial roads and run an HEPA purifier if available.`;
  }

  // 9. Trip & Travel Guidance
  if (q.includes('trip') || q.includes('travel') || q.includes('lonavala') || q.includes('delhi') || q.includes('mumbai') || q.includes('jaipur') || q.includes('shimla') || q.includes('event') || q.includes('weekend') || q.includes('picnic')) {
    return `🧳 **Trip & Outdoor Activity Advisory:**

• **Location:** ${locationName}
• **Current Conditions:** ${temp}°C, ${condition}, Rain Probability: ${humidity > 70 ? 'Moderate' : 'Low'}
• **Verdict:** Favorable for travel with standard outdoor preparations.

💡 **Travel Checklist:**
1. Keep a compact umbrella and polarized sunglasses in your daypack.
2. Check the live Mausam Sathi **Micro-Climate Map** before heading out to verify if any localized waterlogging or traffic delays have been reported by the community.
3. Use the **Mausam Plan** tab in the top navigation to schedule specific departure hours and get optimal route timing.`;
  }

  // 10. Precautions & General Safety Checklist
  if (q.includes('precaution') || q.includes('protect') || q.includes('what should i do') || q.includes('advice') || q.includes('tips') || q.includes('safe') || q.includes('how is today') || q.includes('summary')) {
    return `🛡️ **Recommended Precautions for ${locationName} Today:**

1. 💧 **Hydration:** Target 2.5 - 3.5 Liters of water throughout the day. Add electrolytes if spending time outdoors.
2. ☀️ **Sun Protection:** UV Index is **${uvIndex}**. Apply SPF 50+ sunscreen and wear UV-rated sunglasses if stepping out between 11:30 AM and 3:30 PM.
3. 🌫️ **Air Quality:** AQI is **${aqi} (${aqiCategory})**. Plan intense cardio during the recommended window (**${bestRunningTime}**).
4. 👕 **Attire:** Light, breathable cotton fabrics to maintain optimal body temperature.`;
  }

  // 11. Comprehensive Fallback Response
  return `🤖 **Mausam Sathi Assistant Summary for ${locationName}:**

Currently, it is **${temp}°C** with **${condition}**, AQI of **${aqi} (${aqiCategory})**, and a UV Index of **${uvIndex}**. Your overall Safety Score is **${safetyScore}/100 (${safetyLevel})**.

• **Best Outdoor Window:** ${bestRunningTime}
• **Recommended Action:** Stay hydrated, protect against mid-day sun, and check the interactive map for real-time community hazard reports before commuting.

💡 *Tip: For open-ended AI conversation on any topic, you can also add a free Google Gemini API key by clicking the ⚙️ icon above.*`;
}

// Text to Speech
export function speakAssistantText(text, onEnd) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/•/g, '')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.lang = 'en-IN';

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Speech synthesis error", e);
    if (onEnd) onEnd();
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Speech to Text (Web Speech API)
export function createSpeechRecognizer(onResult, onError, onEnd) {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-IN';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (onResult) onResult(transcript);
  };

  recognition.onerror = (err) => {
    if (onError) onError(err);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  return recognition;
}
