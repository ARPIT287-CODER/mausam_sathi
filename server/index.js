import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { fetchLiveWeatherData } from './services/weatherService.js';
import { calculateSafetyScore } from './services/riskEngine.js';
import { processAiQuery } from './services/aiService.js';
import { getReports, addReport, voteReport } from './data/communityReports.js';
import { activeAlerts, emergencyHelplines } from './data/alertsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Live Weather & AQI Endpoint
app.get('/api/weather/live', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat) || 28.5355;
    const lon = parseFloat(req.query.lon) || 77.3910;
    const name = req.query.name || "Noida, Uttar Pradesh";

    const data = await fetchLiveWeatherData(lat, lon, name);
    res.json(data);
  } catch (error) {
    console.error("Error fetching live weather:", error);
    res.status(500).json({ error: "Failed to fetch weather data", message: error.message });
  }
});

// 2. Dynamic Health Risk & Safety Score Endpoint
app.post('/api/health-score', (req, res) => {
  try {
    const { weather, profile, vulnerabilities, activity } = req.body;
    const scoreResult = calculateSafetyScore({ weather, profile, vulnerabilities, activity });
    res.json(scoreResult);
  } catch (error) {
    console.error("Error calculating safety score:", error);
    res.status(500).json({ error: "Failed to calculate safety score" });
  }
});

// 3. Mausam Plan Activity Evaluation Endpoint
app.post('/api/mausam-plan', (req, res) => {
  try {
    const { activity, targetTime, targetDate, locationName, weather } = req.body;
    
    // Evaluate conditions for the chosen activity
    const currentAqi = weather?.aqi?.value || 120;
    const currentTemp = weather?.current?.temp || 30;
    const currentUv = weather?.current?.uvIndex || 6;
    const rainProb = weather?.current?.rainProbability || 15;

    let verdict = "recommended";
    let score = 85;
    let reasons = [];
    let alternativeWindow = "7:00 PM – 8:15 PM";

    if (activity === 'running' || activity === 'cycling') {
      if (currentAqi > 160 || currentTemp > 34 || currentUv > 7) {
        verdict = "not_recommended";
        score = 42;
        reasons.push(`High thermal load (${currentTemp}°C) and elevated AQI (${currentAqi}) increase cardiovascular strain.`);
        reasons.push(`UV radiation (${currentUv}) is above safe outdoor training thresholds.`);
        alternativeWindow = "6:45 PM – 8:00 PM";
      } else if (currentAqi > 110 || currentTemp > 30) {
        verdict = "caution";
        score = 68;
        reasons.push("Moderate air quality; keep hydration high and pace steady.");
        alternativeWindow = "6:30 PM – 7:30 PM";
      } else {
        verdict = "recommended";
        score = 92;
        reasons.push("Favorable temperature, low rain probability, and safe air quality.");
      }
    } else if (activity === 'travel' || activity === 'outdoor_event') {
      if (rainProb > 60) {
        verdict = "caution";
        score = 58;
        reasons.push("High probability of rain showers during transit.");
        reasons.push("Carry rain protection and allow extra transit time.");
        alternativeWindow = "Tomorrow Morning 8:00 AM – 11:00 AM";
      } else {
        verdict = "recommended";
        score = 88;
        reasons.push("Good travel conditions with clear visibility and pleasant breeze.");
      }
    } else if (activity === 'laundry') {
      if (rainProb > 40 || weather?.current?.humidity > 75) {
        verdict = "not_recommended";
        score = 35;
        reasons.push("High humidity and intermittent rain will prevent fabric drying.");
        alternativeWindow = "Tomorrow 10:30 AM – 3:00 PM";
      } else {
        verdict = "recommended";
        score = 94;
        reasons.push("Strong sun and dry breeze will dry clothes rapidly.");
      }
    }

    res.json({
      activity,
      targetDate: targetDate || "Today",
      targetTime: targetTime || "6:00 PM",
      locationName: locationName || "Noida, UP",
      verdict,
      score,
      reasons,
      recommendedWindow: alternativeWindow,
      checklist: [
        "Hydrate with at least 500ml water beforehand",
        "Check live micro-climate map for localized road conditions",
        "Monitor sudden wind / rain changes in real-time"
      ]
    });
  } catch (error) {
    console.error("Error evaluating Mausam Plan:", error);
    res.status(500).json({ error: "Failed to evaluate activity plan" });
  }
});

// 4. Community Micro-Climate Reports Endpoints
app.get('/api/reports', (req, res) => {
  const { lat, lon, radius } = req.query;
  const reports = getReports(parseFloat(lat), parseFloat(lon), parseFloat(radius));
  res.json({ reports });
});

app.post('/api/reports', (req, res) => {
  try {
    const report = addReport(req.body);
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: "Failed to create report" });
  }
});

app.post('/api/reports/:id/vote', (req, res) => {
  const { id } = req.params;
  const { voteType } = req.body; // 'confirm' or 'reject'
  const updated = voteReport(id, voteType);
  if (!updated) {
    return res.status(404).json({ error: "Report not found" });
  }
  res.json(updated);
});

// 5. Weather & Emergency Alerts Endpoint
app.get('/api/alerts', (req, res) => {
  res.json({
    activeAlerts,
    emergencyHelplines,
    lastRefreshed: new Date().toISOString()
  });
});

// 6. AI Health Assistant Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { question, conversationHistory, context, apiKey } = req.body;
    const result = await processAiQuery({ question, conversationHistory, context, apiKey });
    res.json(result);
  } catch (error) {
    console.error("Error processing AI chat:", error);
    res.status(500).json({ error: "AI Assistant failed to process query" });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: "ok", service: "Mausam Sathi Backend", timestamp: new Date().toISOString() });
});

// Serve frontend dist in production if built
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🌦️ Mausam Sathi Backend running on http://localhost:${PORT}`);
});
