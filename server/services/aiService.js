// AI Health Assistant Service with Gemini API support & Multi-Intent Contextual Fallback

export async function processAiQuery({
  question,
  conversationHistory = [],
  context = {},
  apiKey = process.env.GEMINI_API_KEY
}) {
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

  // 1. If Gemini API key is available, call Gemini API
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await callGeminiApi({
        apiKey: apiKey.trim(),
        question,
        conversationHistory,
        context: {
          locationName, temp, feelsLike, condition, aqi, aqiCategory,
          uvIndex, humidity, pollenLevel, safetyScore, safetyLevel,
          userProfile, bestRunningTime
        }
      });
      return {
        reply: response,
        source: "gemini-llm",
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.warn("Gemini API call failed, falling back to multi-intent engine:", err.message);
    }
  }

  // 2. Built-in High-Quality Contextual AI Reasoning Engine
  const reply = generateContextualAiReply({
    question,
    context: {
      locationName, temp, feelsLike, condition, aqi, aqiCategory,
      uvIndex, humidity, pollenLevel, safetyScore, safetyLevel,
      userProfile, bestRunningTime
    }
  });

  return {
    reply,
    source: "mausam-context-engine",
    timestamp: new Date().toISOString()
  };
}

async function callGeminiApi({ apiKey, question, conversationHistory, context }) {
  const systemPrompt = `You are Mausam Sathi's AI Health & Environmental Safety Assistant.
Your mission: "Don't Just Know the Weather. Know What to Do."
Transform raw environmental and meteorological data into simple, empathetic, actionable advice.

CURRENT ENVIRONMENTAL CONTEXT:
- Location: ${context.locationName}
- Temperature: ${context.temp}°C (Feels like ${context.feelsLike}°C)
- Weather: ${context.condition}
- Air Quality Index (AQI): ${context.aqi} (${context.aqiCategory})
- UV Index: ${context.uvIndex}
- Humidity: ${context.humidity}%
- Pollen Risk: ${context.pollenLevel}
- Health & Safety Score: ${context.safetyScore}/100 (${context.safetyLevel})
- Active User Profile: ${context.userProfile}
- Best Outdoor Exercise Window: ${context.bestRunningTime}

SAFETY & FORMATTING GUIDELINES:
1. Always base your advice strictly on the above live context.
2. Structure your reply with clear bullet points, emojis, bold highlights, and a concrete action plan.
3. Be friendly, protective, and concise (2-4 brief paragraphs).
4. Explicit Medical Positioning: You provide general environmental health & safety guidance. Never diagnose diseases or replace medical professionals.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Understood. I am Mausam Sathi AI, ready to provide context-aware health and weather guidance.' }] }
  ];

  if (Array.isArray(conversationHistory)) {
    conversationHistory.slice(-4).forEach(msg => {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });
  }

  contents.push({ role: 'user', parts: [{ text: question }] });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini HTTP ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate reply.";
}

export function generateContextualAiReply({ question, context }) {
  const q = (question || "").toLowerCase().trim();
  const {
    locationName, temp, feelsLike, aqi, aqiCategory, uvIndex,
    humidity, safetyScore, safetyLevel, userProfile, bestRunningTime, condition
  } = context;

  // Greetings
  if (q.startsWith('hi') || q.startsWith('hello') || q.startsWith('hey') || q.includes('namaste') || q.includes('good morning') || q.includes('good evening')) {
    return `👋 **Namaste! How can I help you in ${locationName} today?**

Currently, the temperature is **${temp}°C** (${condition}, feels like ${feelsLike}°C) with an **AQI of ${aqi} (${aqiCategory})** and your Safety Score is **${safetyScore}/100 (${safetyLevel})**.

Feel free to ask me questions like:
• *"Can I go for a run right now?"*
• *"What should I wear today?"*
• *"Is it safe for asthmatics or kids to play outside?"*
• *"What precautions should I take against heat/AQI?"*`;
  }

  // Running & Fitness
  if (q.includes('run') || q.includes('jog') || q.includes('exercise') || q.includes('workout') || q.includes('walk') || q.includes('cycling') || q.includes('gym') || q.includes('sport') || q.includes('cricket') || q.includes('football')) {
    if (aqi > 150 || temp > 34 || uvIndex > 7) {
      return `🏃 **I recommend waiting or moving your workout indoors.**

At the moment in **${locationName}**, the temperature is **${temp}°C** (Feels like ${feelsLike}°C) with an **AQI of ${aqi} (${aqiCategory})** and **UV Index of ${uvIndex}**.

• **Better Time Window:** ${bestRunningTime}
• **Current Activity Safety Score:** ${safetyScore}/100 (${safetyLevel})
• **Reason:** High thermal load and elevated particulates place unnecessary strain on cardiovascular and respiratory systems.
• **Alternative:** A 30-minute indoor HIIT session, yoga, or waiting until the evening temperature and AQI settle down.`;
    } else {
      return `🏃 **Yes, conditions are favorable for outdoor exercise!**

Currently in **${locationName}**:
• **Temperature:** ${temp}°C (${condition})
• **AQI:** ${aqi} (${aqiCategory}) - Safe for moderate exertion
• **UV Index:** ${uvIndex}
• **Best Window:** ${bestRunningTime}

💡 **Quick Pro-Tips:**
1. Drink at least 300ml of water before heading out.
2. If running after sunset, choose well-lit paths.
3. Wear breathable moisture-wicking gear.`;
    }
  }

  // Clothing & Attire
  if (q.includes('wear') || q.includes('cloth') || q.includes('jacket') || q.includes('umbrella') || q.includes('coat') || q.includes('dress') || q.includes('outfit')) {
    const rainAdvice = humidity > 70 ? "Carry a compact umbrella or lightweight raincoat." : "No rain gear needed.";
    const sunAdvice = uvIndex >= 5 ? "Wear UV-rated sunglasses and a cap or wide-brim hat." : "Sunglasses optional.";
    const maskAdvice = aqi > 150 ? "Wear an N95 respirator mask." : "Mask optional.";

    return `👕 **Attire & Accessories Advisory for ${locationName}:**

• **Current Weather:** ${temp}°C, Feels like ${feelsLike}°C (${condition})
• **Recommended Fabrics:** Light, loose-fitting, breathable cotton or linen fabrics to stay cool.
• **Sun Protection:** ${sunAdvice}
• **Rain Gear:** ${rainAdvice}
• **Air Quality Protection:** ${maskAdvice}`;
  }

  // Hydration & Nutrition
  if (q.includes('water') || q.includes('drink') || q.includes('eat') || q.includes('food') || q.includes('fluid') || q.includes('ors') || q.includes('dehydration') || q.includes('electrolyte')) {
    return `💧 **Hydration & Nutrition Guidance for Today (${temp}°C, Humidity ${humidity}%):**

1. 🥛 **Daily Liquid Target:** Drink at least 3.0 to 3.5 Liters of water throughout the day.
2. 🥥 **Natural Electrolytes:** Coconut water, buttermilk (chaas), lemon water (nimbu pani), and ORS are ideal to prevent heat cramps.
3. 🥗 **Dietary Advice:** Eat water-rich fruits like watermelon, cucumber, and oranges. Avoid overly heavy, greasy meals during peak heat hours.`;
  }

  // Sensitive Groups
  if (q.includes('kid') || q.includes('child') || q.includes('baby') || q.includes('elderly') || q.includes('parent') || q.includes('senior') || q.includes('asthma') || q.includes('cough') || q.includes('throat') || q.includes('eye')) {
    const riskLevel = aqi > 150 || temp > 35 ? "High Risk" : aqi > 100 ? "Moderate Caution" : "Low Risk";
    return `👶🩺 **Health & Sensitive Group Advisory (${riskLevel}):**

• **Location:** ${locationName} | **AQI:** ${aqi} (${aqiCategory}) | **UV:** ${uvIndex}

💡 **Actionable Precautions:**
${aqi > 130 ? '• Children and seniors with respiratory sensitivity/asthma should limit outdoor playtime between 12 PM and 4 PM.\n• Keep prescribed inhalers or throat lozenges handy.' : '• General outdoor play is safe with standard hydration.'}
• Ensure children drink water every 30-45 minutes when playing outdoors.
• Run an indoor HEPA air purifier in bedrooms during early morning smog hours.`;
  }

  // Rain & Flooding
  if (q.includes('rain') || q.includes('flood') || q.includes('waterlog') || q.includes('storm') || q.includes('shower') || q.includes('downpour') || q.includes('lightning')) {
    return `🌧️ **Rainfall & Waterlogging Advisory for ${locationName}:**

• **Current Weather:** ${condition} | **Humidity:** ${humidity}%
• **Precipitation Outlook:** Check the **Micro-Climate Map** tab for live community hazard pins near arterial underpasses.
• **Commuter Tip:** Avoid speeding through submerged underpasses. Keep vehicle headlights on low-beam during heavy showers.`;
  }

  // Safety Score
  if (q.includes('score') || q.includes('why is my health') || q.includes('low score') || q.includes('rating') || q.includes('explain score')) {
    const primaryFactor = aqi > 140 ? `elevated AQI (${aqi})` : temp > 34 ? `high heat (${temp}°C)` : uvIndex > 6 ? `intense UV (${uvIndex})` : `humidity (${humidity}%)`;
    return `❤️ **Your Personalized Safety Score is ${safetyScore}/100 (${safetyLevel}).**

Here is the environmental breakdown for **${locationName}**:
• **Air Quality Impact:** AQI is ${aqi} (${aqiCategory})
• **Thermal Stress:** ${temp}°C (Feels like ${feelsLike}°C) with ${humidity}% humidity
• **Solar Radiation:** UV Index is ${uvIndex}
• **Active Profile:** ${userProfile.replace('_', ' ').toUpperCase()}

The primary factor dampening today's score is **${primaryFactor}**. For maximum safety, reduce prolonged outdoor exposure during peak afternoon hours and stay well hydrated.`;
  }

  // AQI & Pollution
  if (q.includes('aqi') || q.includes('pollution') || q.includes('air quality') || q.includes('smog') || q.includes('mask') || q.includes('pm2.5') || q.includes('pm10')) {
    const maskAdvice = aqi > 150 ? "Yes, an **N95 respirator mask** is strongly recommended for outdoor travel." : "A mask is optional for general individuals, but sensitive groups should take standard precautions.";
    return `🌫️ **Current Air Quality in ${locationName}: AQI ${aqi} (${aqiCategory})**

• **What this means:** ${aqiCategory === 'Good' ? 'Air is clean and refreshing.' : aqiCategory === 'Moderate' ? 'Air is acceptable; sensitive individuals may experience slight throat dryness.' : 'Particulate matter is high. Prolonged exertion outdoors can trigger respiratory discomfort.'}
• **Should you wear a mask?** ${maskAdvice}
• **Indoor Advisory:** Keep windows shut if near heavy traffic corridors and consider running an air purifier in bedroom areas.`;
  }

  // Trip & Travel
  if (q.includes('trip') || q.includes('travel') || q.includes('lonavala') || q.includes('delhi') || q.includes('mumbai') || q.includes('jaipur') || q.includes('shimla') || q.includes('event') || q.includes('picnic') || q.includes('weekend')) {
    return `🧳 **Trip & Outdoor Activity Advisory:**

• **Location Assessed:** ${locationName}
• **Current Conditions:** ${temp}°C, ${condition}, Rain Probability: ${humidity > 70 ? 'Moderate' : 'Low'}
• **Verdict:** Favorable for travel with standard outdoor preparations.

💡 **Travel Checklist:**
1. Keep a compact umbrella and polarized sunglasses in your daypack.
2. Check the live Mausam Sathi **Micro-Climate Map** before heading out to verify if any localized waterlogging or traffic delays have been reported by the community.
3. Use **Mausam Plan** in the top navigation to schedule specific departure hours and get optimal route timing.`;
  }

  // Precautions
  if (q.includes('precaution') || q.includes('tips') || q.includes('what should i do') || q.includes('advice') || q.includes('gear') || q.includes('safe') || q.includes('summary')) {
    return `🛡️ **Recommended Precautions for ${locationName} Today:**

1. 💧 **Hydration:** Target 2.5 - 3.5 Liters of water throughout the day. Add electrolytes if spending time outdoors.
2. ☀️ **Sun Protection:** UV Index is **${uvIndex}**. Apply SPF 50+ sunscreen and wear UV-rated sunglasses if stepping out between 11:30 AM and 3:30 PM.
3. 🌫️ **Air Quality:** AQI is **${aqi} (${aqiCategory})**. Plan intense cardio during the recommended window (**${bestRunningTime}**).
4. 👕 **Attire:** Light, breathable cotton or linen fabrics to stay cool and comfortable.`;
  }

  // Generic fallback
  return `🤖 **Mausam Sathi Assistant Summary for ${locationName}:**

Currently, it is **${temp}°C** with **${condition}**, AQI of **${aqi} (${aqiCategory})**, and a UV Index of **${uvIndex}**. Your overall Safety Score is **${safetyScore}/100 (${safetyLevel})**.

• **Best Outdoor Window:** ${bestRunningTime}
• **Recommended Action:** Stay hydrated, protect against mid-day sun, and check the interactive map for real-time community hazard reports before commuting.

💡 *Tip: For open-ended AI conversation on any topic, click the ⚙️ icon above to add a free Gemini API key.*`;
}
