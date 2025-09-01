/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';

// --- Type Definitions ---
export interface CurrentWeather {
  city: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
  feelsLike: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
}
export interface DailyForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
}

export interface WeatherAlert {
    title: string;
    severity: 'Warning' | 'Watch' | 'Advisory' | string;
    description: string;
}

export interface WeatherNews {
    title: string;
    snippet: string;
}

export interface LocalEvent {
    title: string;
    description: string;
}

export interface Pollutant {
    name: string;
    value: number;
    unit: string;
    category: string;
    description: string;
    sources: string;
}

export interface AirQualityIndex {
    aqiValue: number;
    aqiCategory: string;
    healthAdvisory: string;
    pollutants: Pollutant[];
}

export interface ForecastResponse {
  current: CurrentWeather;
  daily: DailyForecast[]; // Next 5 days
  alerts: WeatherAlert[];
  suggestion: string;
  news: WeatherNews;
  localEvents: LocalEvent[];
  aqi: AirQualityIndex;
}

export interface FullApiResponse {
    forecast: ForecastResponse;
    summary: string;
    correctedCity?: string;
}

export interface DefaultForecast {
    city: string;
    temp: number | null;
    condition: string | null;
}

export interface VacationDayPlan {
    day: string;
    weatherSummary: string;
    high: number;
    low: number;
    condition: string;
    activities: string[];
}

export interface VacationPlanResponse {
    destination: string;
    plan: VacationDayPlan[];
}

export interface CategorizedAgroTip {
    tip: string;
    category: string;
}

export interface AgroTipsResponse {
    destination: string;
    tips: CategorizedAgroTip[];
}

export interface CoastalInfo {
    locationName: string;
    isCoastal: boolean;
    tide?: {
        highTide: string[];
        lowTide: string[];
    };
    waterTemp?: number;
    waveHeight?: string;
    wind?: string;
    safetyTip?: string;
}

export interface HistoricalWeatherResponse {
    city: string;
    date: string;
    highTemp: number;
    lowTemp: number;
    avgTemp: number;
    precipitation: number; // in mm
    windSpeed: number; // in km/h
    summary: string;
}

export interface HikerInfoResponse {
    locationName: string;
    isMountainous: boolean;
    elevation?: number; // in meters
    temperature?: number; // in Celsius
    windSpeed?: number; // in km/h
    windChill?: number; // in Celsius
    avalancheRisk?: 'Low' | 'Moderate' | 'Considerable' | 'High' | 'Extreme';
    safetyMessage?: string;
}

interface LocationSuggestionsResponse {
    suggestions: string[];
}

// Initialize the GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches a detailed weather forecast.
 */
export const fetchForecast = async (location: string): Promise<FullApiResponse> => {
  const prompt = `
      Provide a detailed weather forecast for ${location}.
      If the location is misspelled or ambiguous (e.g., "Pariis"), correct it to the most likely intended city (e.g., "Paris").
      Include any active weather alerts. If none, return an empty array for alerts.
      Provide a short, conversational summary of today's weather.
      For the current weather, include the 'feels like' temperature, the UV index value, and the local sunrise and sunset times.
      The daily forecast should be for the next 5 days (not including today), providing the specific day of the week (e.g., "Monday", "Tuesday", not "Tomorrow").
      Provide a single, friendly, actionable suggestion for the day based on the weather.
      Also, provide one weather-related news update or a climate change fact (title and a short snippet).
      Finally, suggest 1-2 potential local events or activities suitable for today's weather in the area.
      Additionally, provide a detailed Air Quality Index (AQI) analysis. Include the overall AQI value, its category (e.g., 'Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'), a relevant health advisory, and a breakdown of major pollutants (PM2.5, PM10, O3, NO2, SO2, CO). For each pollutant, provide its name, value, unit (e.g., µg/m³), its individual quality category, a brief description, and a list of common sources.
      Use Celsius for temperature, km/h for wind speed, hPa for pressure, and km for visibility.`;
      
      const forecastSchema = {
          type: Type.OBJECT,
          properties: {
              forecast: {
                  type: Type.OBJECT,
                  properties: {
                      current: {
                          type: Type.OBJECT,
                          properties: {
                              city: { type: Type.STRING },
                              temp: { type: Type.NUMBER },
                              condition: { type: Type.STRING },
                              high: { type: Type.NUMBER },
                              low: { type: Type.NUMBER },
                              feelsLike: { type: Type.NUMBER },
                              uvIndex: { type: Type.NUMBER },
                              sunrise: { type: Type.STRING },
                              sunset: { type: Type.STRING },
                              humidity: { type: Type.NUMBER },
                              windSpeed: { type: Type.NUMBER },
                              pressure: { type: Type.NUMBER },
                              visibility: { type: Type.NUMBER },
                          },
                          required: ['city', 'temp', 'condition', 'high', 'low', 'feelsLike', 'uvIndex', 'sunrise', 'sunset', 'humidity', 'windSpeed', 'pressure', 'visibility']
                      },
                      daily: {
                          type: Type.ARRAY,
                          items: {
                              type: Type.OBJECT,
                              properties: {
                                  day: { type: Type.STRING },
                                  high: { type: Type.NUMBER },
                                  low: { type: Type.NUMBER },
                                  condition: { type: Type.STRING }
                              },
                              required: ['day', 'high', 'low', 'condition']
                          }
                      },
                      alerts: {
                          type: Type.ARRAY,
                          items: {
                              type: Type.OBJECT,
                              properties: {
                                  title: { type: Type.STRING },
                                  severity: { type: Type.STRING },
                                  description: { type: Type.STRING }
                              },
                              required: ['title', 'severity', 'description']
                          }
                      },
                      suggestion: { type: Type.STRING },
                      news: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          snippet: { type: Type.STRING },
                        },
                        required: ['title', 'snippet']
                      },
                      localEvents: {
                          type: Type.ARRAY,
                          items: {
                              type: Type.OBJECT,
                              properties: {
                                  title: { type: Type.STRING },
                                  description: { type: Type.STRING },
                              },
                              required: ['title', 'description']
                          }
                      },
                      aqi: {
                          type: Type.OBJECT,
                          properties: {
                              aqiValue: { type: Type.NUMBER },
                              aqiCategory: { type: Type.STRING },
                              healthAdvisory: { type: Type.STRING },
                              pollutants: {
                                  type: Type.ARRAY,
                                  items: {
                                      type: Type.OBJECT,
                                      properties: {
                                          name: { type: Type.STRING },
                                          value: { type: Type.NUMBER },
                                          unit: { type: Type.STRING },
                                          category: { type: Type.STRING },
                                          description: { type: Type.STRING },
                                          sources: { type: Type.STRING },
                                      },
                                      required: ['name', 'value', 'unit', 'category', 'description', 'sources']
                                  }
                              }
                          },
                          required: ['aqiValue', 'aqiCategory', 'healthAdvisory', 'pollutants']
                      }
                  },
                  required: ['current', 'daily', 'alerts', 'suggestion', 'news', 'localEvents', 'aqi']
              },
              summary: { type: Type.STRING },
              correctedCity: { type: Type.STRING }
          },
          required: ['forecast', 'summary']
      };

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              responseMimeType: "application/json",
              responseSchema: forecastSchema,
          },
      });

      return JSON.parse(response.text.trim());
};

/**
 * Fetches simple forecasts for multiple locations in a single batch.
 */
export const fetchMultipleSimpleForecasts = async (locations: string[]): Promise<DefaultForecast[]> => {
    if (locations.length === 0) {
        return [];
    }
    const prompt = `For each city in this list: [${locations.join(', ')}], provide its name ("city"), current temperature in Celsius ("temp"), and a one-word weather condition ("condition"). Return a JSON array of these objects. Ensure every city from the list is present in the response. If you cannot find data for a city, use the city name provided and return null for temp and condition.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        city: { type: Type.STRING },
                        temp: { type: Type.NUMBER, nullable: true },
                        condition: { type: Type.STRING, nullable: true }
                    },
                    required: ['city', 'temp', 'condition']
                }
            }
        }
    });
    return JSON.parse(response.text.trim());
};

/**
 * Fetches a vacation plan for a specified date range.
 */
export const fetchVacationPlan = async (destination: string, startDate: string, endDate: string): Promise<VacationPlanResponse> => {
    const prompt = `
        Create a detailed vacation itinerary for ${destination} for the dates from ${startDate} to ${endDate}.
        For each day in this range, provide the specific date and day of the week (e.g., "Monday, July 1"), a brief weather summary, the high and low temperatures in Celsius, a one-word weather condition (for icons), and a list of 2-3 weather-appropriate activities.
        The activities should be a mix of popular tourist attractions and local experiences.
        Ensure the response is structured as a JSON object.
        `;
    
    const vacationSchema = {
        type: Type.OBJECT,
        properties: {
            destination: { type: Type.STRING },
            plan: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: { type: Type.STRING, description: "The day of the week and date, e.g., 'Monday, July 1'." },
                        weatherSummary: { type: Type.STRING },
                        high: { type: Type.NUMBER },
                        low: { type: Type.NUMBER },
                        condition: { type: Type.STRING },
                        activities: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['day', 'weatherSummary', 'high', 'low', 'condition', 'activities']
                }
            }
        },
        required: ['destination', 'plan']
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: vacationSchema,
        },
    });
    return JSON.parse(response.text.trim());
};

/**
 * Fetches agricultural tips.
 */
export const fetchAgroTips = async (destination: string): Promise<AgroTipsResponse> => {
    const prompt = `
        Based on the current weather forecast for ${destination}, provide a list of 5-7 short, actionable agricultural or gardening tips.
        For each tip, classify it into one of the following categories: 'Planting', 'Watering', 'Protection', or 'General'. Each tip should be a concise sentence, ideally under 15 words.
        The tips should be relevant for farmers and gardeners in that specific region.
        Return the response as a JSON object.
        `;
    
    const agroSchema = {
        type: Type.OBJECT,
        properties: {
            destination: { type: Type.STRING },
            tips: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        tip: { type: Type.STRING },
                        category: { type: Type.STRING }
                    },
                    required: ['tip', 'category']
                }
            }
        },
        required: ['destination', 'tips']
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: agroSchema,
        },
    });
    return JSON.parse(response.text.trim());
};

/**
 * Fetches coastal information.
 */
export const fetchCoastalInfo = async (location: string): Promise<CoastalInfo> => {
    const prompt = `
        Provide coastal information for ${location}. First, determine if this is a coastal location.
        If it is NOT a coastal location, set isCoastal to false and make all other optional fields null.
        If it IS a coastal location, set isCoastal to true and provide the following:
        - A list of today's high tide times.
        - A list of today's low tide times.
        - The current water temperature in Celsius.
        - The current wave height as a string (e.g., "0.5 - 1 meter").
        - The current wind speed and direction as a string (e.g., "15 km/h SW").
        - A brief, helpful beach safety tip relevant to the conditions.
        Return the response as a JSON object.
        `;

    const coastalSchema = {
        type: Type.OBJECT,
        properties: {
            locationName: { type: Type.STRING },
            isCoastal: { type: Type.BOOLEAN },
            tide: {
                type: Type.OBJECT,
                properties: {
                    highTide: { type: Type.ARRAY, items: { type: Type.STRING } },
                    lowTide: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
            },
            waterTemp: { type: Type.NUMBER },
            waveHeight: { type: Type.STRING },
            wind: { type: Type.STRING },
            safetyTip: { type: Type.STRING }
        },
        required: ['locationName', 'isCoastal']
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: coastalSchema,
        },
    });
    return JSON.parse(response.text.trim());
};

/**
 * Fetches hiker/trekker information.
 */
export const fetchHikerInfo = async (location: string): Promise<HikerInfoResponse> => {
    const prompt = `
        Provide specialized weather information for a hiker at ${location}. First, determine if this is a known mountainous or trekking location.
        If it is NOT, set isMountainous to false and leave all other optional fields null.
        If it IS a mountainous location, set isMountainous to true and provide the following:
        - The approximate elevation in meters.
        - The current temperature in Celsius.
        - The current wind speed in km/h.
        - The calculated wind chill ('feels like' temperature) in Celsius.
        - The current avalanche risk, categorized as one of: 'Low', 'Moderate', 'Considerable', 'High', 'Extreme'.
        - A brief, actionable safety message for hikers based on these conditions.
        Return the response as a JSON object.
        `;

    const hikerSchema = {
        type: Type.OBJECT,
        properties: {
            locationName: { type: Type.STRING },
            isMountainous: { type: Type.BOOLEAN },
            elevation: { type: Type.NUMBER },
            temperature: { type: Type.NUMBER },
            windSpeed: { type: Type.NUMBER },
            windChill: { type: Type.NUMBER },
            avalancheRisk: { type: Type.STRING },
            safetyMessage: { type: Type.STRING }
        },
        required: ['locationName', 'isMountainous']
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: hikerSchema,
        },
    });
    return JSON.parse(response.text.trim());
};

/**
 * Fetches historical weather data.
 */
export const fetchHistoricalWeather = async (city: string, date: string): Promise<HistoricalWeatherResponse> => {
    const prompt = `
        Provide historical weather data for ${city} on the date ${date}.
        Give the high, low, and average temperatures in Celsius.
        Provide the total precipitation in millimeters and the average wind speed in km/h.
        Also, provide a brief one-sentence summary of the overall weather conditions for that day.
        If data for this specific date is unavailable, please indicate that in the summary.
        Return the response as a JSON object.
        `;

    const historySchema = {
        type: Type.OBJECT,
        properties: {
            city: { type: Type.STRING },
            date: { type: Type.STRING },
            highTemp: { type: Type.NUMBER },
            lowTemp: { type: Type.NUMBER },
            avgTemp: { type: Type.NUMBER },
            precipitation: { type: Type.NUMBER },
            windSpeed: { type: Type.NUMBER },
            summary: { type: Type.STRING }
        },
        required: ['city', 'date', 'highTemp', 'lowTemp', 'avgTemp', 'precipitation', 'windSpeed', 'summary']
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: historySchema,
        },
    });
    return JSON.parse(response.text.trim());
};

/**
 * Fetches location suggestions for autocomplete.
 */
export const fetchLocationSuggestions = async (query: string): Promise<string[]> => {
    const prompt = `Provide a JSON array of 5 location name suggestions for the search query "${query}". Include common misspellings.`;
    const suggestionsSchema = {
        type: Type.OBJECT,
        properties: {
            suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        },
        required: ['suggestions']
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: suggestionsSchema,
            thinkingConfig: { thinkingBudget: 0 },
        }
    });

    const data: LocationSuggestionsResponse = JSON.parse(response.text.trim());
    return data.suggestions || [];
};
