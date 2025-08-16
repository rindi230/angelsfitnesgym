import { useState } from "react";
import { Calculator, Activity, Target, Droplets, Scale, TrendingUp, Zap, Heart } from "lucide-react";

// Define the results type
interface Results {
  bmi?: number;
  bmiInfo?: {
    category: string;
    color: string;
    bg: string;
  };
  calories?: number;
  exercise?: string;
  duration?: number;
  bmr?: number;
  tdee?: number;
  loseWeight?: number;
  gainWeight?: number;
  bodyFat?: string;
  gender?: string;
  idealWeight?: string;
  macros?: {
    protein: number;
    fat: number;
    carbs: number;
    tdee: number;
  };
  goal?: string;
  waterIntake?: number;
  glasses?: number;
}

export const Tools = () => {
  const [activeTab, setActiveTab] = useState("bmi");
  const [results, setResults] = useState<Results>({});

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Nenpeshe", color: "text-blue-600", bg: "bg-blue-100" };
    if (bmi < 25) return { category: "Peshe normale", color: "text-green-600", bg: "bg-green-100" };
    if (bmi < 30) return { category: "Mbipeshe", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { category: "Obez", color: "text-red-600", bg: "bg-red-100" };
  };

  const calculateBodyFat = (gender: string, age: number, bmi: number) => {
    // Simplified body fat calculation
    let bodyFat = 0;
    if (gender === 'male') {
      bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
    } else {
      bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
    }
    return Math.max(0, Math.min(50, bodyFat)).toFixed(1);
  };

  const calculateIdealWeight = (height: number, gender: string) => {
    const heightInMeters = height / 100;
    let idealWeight = 0;
    if (gender === 'male') {
      idealWeight = 22 * (heightInMeters * heightInMeters);
    } else {
      idealWeight = 21 * (heightInMeters * heightInMeters);
    }
    return idealWeight.toFixed(1);
  };

  const calculateMacros = (weight: number, height: number, age: number, gender: string, activity: string, goal: string) => {
    // BMR calculation using Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Activity multiplier
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    let tdee = bmr * activityMultipliers[activity];

    // Goal adjustment
    if (goal === 'lose') tdee *= 0.85;
    if (goal === 'gain') tdee *= 1.15;

    const protein = Math.round((weight * 2.2) * 1.2); // 1.2g per lb
    const fat = Math.round((tdee * 0.25) / 9); // 25% of calories from fat
    const carbs = Math.round((tdee - (protein * 4) - (fat * 9)) / 4);

    return { protein, fat, carbs, tdee: Math.round(tdee) };
  };

  const calculateWaterIntake = (weight: number, activity: string) => {
    const baseWater = weight * 0.033; // 33ml per kg
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1,
      light: 1.2,
      moderate: 1.4,
      active: 1.6,
      very_active: 1.8
    };
    return Math.round(baseWater * activityMultipliers[activity] * 1000); // Convert to ml
  };

  const tabs = [
    { id: "bmi", label: " Kalkulator BMI", icon: Scale },
    { id: "kalori", label: "Kalori te djegura", icon: Zap },
    { id: "perditshme", label: "Kalorite e perditshme", icon: Activity },
    { id: "masa dhjamore", label: "Perqindja dhjamore %", icon: TrendingUp },
    { id: "pesha", label: "Pesha ideale", icon: Target },
    { id: "makro", label: "Makro Kalkulator", icon: Calculator },
    { id: "uji", label: "Sasisa e uji", icon: Droplets }
  ];

  const tools: { name: string; icon: JSX.Element; component: JSX.Element }[] = [
    // ... existing code ...
  ];

  return (
    <section id="tools" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Kalkulatoret e trupit</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ndiqni udhëtimin tuaj në fitnes me paketën tonë gjithëpërfshirëse të kalkulatorëve të shëndetit dhe fitnesit
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-8 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* BMI Calculator */}
          {activeTab === "bmi" && (
            <div className="bg-white rounded-2xl p-8 shadow-xl animate-fade-in">
              <div className="text-center mb-8">
                <Scale className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">BMI Kalkulator</h3>
                <p className="text-gray-600">Kalkuloni perqindje dhjamore te trupit per te kuptuar kategorine e peshes qe keni</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const weight = Number(formData.get("weight"));
                  const height = Number(formData.get("height"));
                  
                  const bmi = Number(calculateBMI(weight, height));
                  const bmiInfo = getBMICategory(bmi);
                  setResults({ ...results, bmi, bmiInfo });
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Pesha (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      step="0.1"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="70.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Gjatesia (cm)</label>
                    <input
                      type="number"
                      name="height"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="175"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Kalkulo BMI
                </button>
              </form>
              {results.bmi && (
                <div className={`mt-8 p-6 rounded-xl text-center ${results.bmiInfo.bg} border-2 border-current ${results.bmiInfo.color}`}>
                  <p className="text-3xl font-bold mb-2">Your BMI: {results.bmi}</p>
                  <p className="text-xl font-semibold">{results.bmiInfo.category}</p>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="font-semibold">Nenpeshe</p>
                      <p className="text-gray-600">&lt; 18.5</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="font-semibold">Normal</p>
                      <p className="text-gray-600">18.5 - 24.9</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="font-semibold">Mbipeshe</p>
                      <p className="text-gray-600">25 - 29.9</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="font-semibold">Obez</p>
                      <p className="text-gray-600">&gt; 30</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Calorie Burn Calculator */}
          {activeTab === "kalori" && (
            <div className="bg-white rounded-2xl p-8 shadow-xl animate-fade-in">
              <div className="text-center mb-8">
                <Zap className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Kalkulatori i kalorive te djegura</h3>
                <p className="text-gray-600">Kalkuloni kalorite e djegura gjate ushtrimeve te llojeve te ndryshme</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const exercise = formData.get("exercise") as string;
                  const duration = Number(formData.get("duration"));
                  const weight = Number(formData.get("weight"));
                  
                  const metValues: { [key: string]: number } = {
                    walking: 3.8,
                    running: 8.3,
                    cycling: 7.5,
                    swimming: 8.0,
                    weightlifting: 3.0,
                    yoga: 2.5,
                    dancing: 4.5,
                    basketball: 8.0,
                    tennis: 7.0,
                    hiking: 6.0
                  };
                  
                  const calories = Math.round((metValues[exercise] * weight * duration) / 60);
                  setResults({ ...results, calories, exercise, duration });
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Ushtrimi</label>
                    <select
                      name="exercise"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      required
                    >
                      <option value="walking">Ecje</option>
                      <option value="running">Vrap</option>
                      <option value="cycling">Ciklizem</option>
                      <option value="swimming">Not</option>
                      <option value="weightlifting">Ngritje peshash</option>
                      <option value="yoga">Yoga</option>
                      <option value="dancing">Kercim</option>
                      <option value="basketball">Basketboll</option>
                      <option value="tennis">Tenis</option>
                      <option value="hiking">Hiking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Kohzgjatja(minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Pesha (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="70"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Kalkulo kalorite e djegura
                </button>
              </form>
              {results.calories && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-green-200 rounded-xl text-center border-2 border-green-300">
                  <p className="text-3xl font-bold text-green-800 mb-2">
                    {results.calories} kcal
                  </p>
                  <p className="text-lg text-green-700">
                    te djegura gjate {results.duration} minuta nga {results.exercise}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Daily Calorie Needs */}
          {activeTab === "perditshme" && (
            <div className="bg-white rounded-2xl p-8 shadow-xl animate-fade-in">
              <div className="text-center mb-8">
                <Activity className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Kalorite e nevojitura</h3>
                <p className="text-gray-600">Kalkuloni saine e kalorive te perditshme bazuar ne aktivitetin tuaj</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const weight = Number(formData.get("weight"));
                  const height = Number(formData.get("height"));
                  const age = Number(formData.get("age"));
                  const gender = formData.get("gender") as string;
                  const activity = formData.get("activity") as string;
                  
                  // BMR calculation using Mifflin-St Jeor Equation
                  let bmr = 0;
                  if (gender === 'male') {
                    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
                  } else {
                    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
                  }

                  const activityMultipliers: { [key: string]: number } = {
                    sedentary: 1.2,
                    light: 1.375,
                    moderate: 1.55,
                    active: 1.725,
                    very_active: 1.9
                  };

                  const tdee = Math.round(bmr * activityMultipliers[activity]);
                  const loseWeight = Math.round(tdee * 0.85);
                  const gainWeight = Math.round(tdee * 1.15);
                  
                  setResults({ ...results, bmr: Math.round(bmr), tdee, loseWeight, gainWeight });
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Pesha (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      step="0.1"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="70"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Gajtesia (cm)</label>
                    <input
                      type="number"
                      name="height"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="175"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Mosha</label>
                    <input
                      type="number"
                      name="age"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="25"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Gjinia</label>
                    <select
                      name="gender"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      required
                    >
                      <option value="male">Mashkull</option>
                      <option value="female">Femer</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-3">Niveli i aktivitetit</label>
                    <select
                      name="activity"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      required
                    >
                      <option value="sedentary">I ulet (pak/aspak ushtrime)</option>
                      <option value="light">I lehte (Ushtroheni 1-3 dite/jave)</option>
                      <option value="moderate">Mesatar (Ushtroheni 3-5 dite/jave)</option>
                      <option value="active">Aktiv (Ushtroheni 6-7 days/week)</option>
                      <option value="very_active">Shume aktive(ushtroheni rende 7 dite/jave)</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Kalkuloni kalorite ditore
                </button>
              </form>
              {results.tdee && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-blue-100 rounded-xl text-center border-2 border-blue-300">
                    <p className="text-2xl font-bold text-blue-800 mb-2">BMR</p>
                    <p className="text-3xl font-bold">{results.bmr} kcal</p>
                    <p className="text-sm text-blue-600">Base Metabolic Rate</p>
                  </div>
                  <div className="p-6 bg-green-100 rounded-xl text-center border-2 border-green-300">
                    <p className="text-2xl font-bold text-green-800 mb-2">Maintain</p>
                    <p className="text-3xl font-bold">{results.tdee} kcal</p>
                    <p className="text-sm text-green-600">Daily Calorie Needs</p>
                  </div>
                  <div className="p-6 bg-purple-100 rounded-xl text-center border-2 border-purple-300">
                    <p className="text-2xl font-bold text-purple-800 mb-2">Weight Goals</p>
                    <p className="text-lg font-semibold text-purple-700">Lose: {results.loseWeight} kcal</p>
                    <p className="text-lg font-semibold text-purple-700">Gain: {results.gainWeight} kcal</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Body Fat Calculator */}
          {activeTab === "masa dhjamore" && (
            <div className="bg-white rounded-2xl p-8 shadow-xl animate-fade-in">
              <div className="text-center mb-8">
                <TrendingUp className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Kalkulatori i mases dhjamore</h3>
                <p className="text-gray-600">Zbuloni perqindjen dhjamore te trupit duke perdorur BMI dhe moshen</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const weight = Number(formData.get("weight"));
                  const height = Number(formData.get("height"));
                  const age = Number(formData.get("age"));
                  const gender = formData.get("gender") as string;
                  
                  const bmi = Number(calculateBMI(weight, height));
                  const bodyFat = calculateBodyFat(gender, age, bmi);
                  setResults({ ...results, bodyFat, gender });
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Pesha (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      step="0.1"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="70"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Gjatesia (cm)</label>
                    <input
                      type="number"
                      name="height"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="175"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Mosha</label>
                    <input
                      type="number"
                      name="age"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="25"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Gjinia</label>
                    <select
                      name="gender"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      required
                    >
                      <option value="male">Mashkull</option>
                      <option value="female">Femer</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Kalkulo perqindjen dhjamore %
                </button>
              </form>
              {results.bodyFat && (
                <div className="mt-8 p-6 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl text-center border-2 border-orange-300">
                  <p className="text-3xl font-bold text-orange-800 mb-2">
                    {results.bodyFat}%
                  </p>
                  <p className="text-lg text-orange-700">
                    Perqindja dhjamore per {results.gender}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ideal Weight Calculator */}
          {activeTab === "pesha" && (
            <div className="bg-white rounded-2xl p-8 shadow-xl animate-fade-in">
              <div className="text-center mb-8">
                <Target className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Kalkulatori i peshes ideale</h3>
                <p className="text-gray-600">Kalkulo peshen tende ideale duke perdorur gjinine dhe gjatesine</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const height = Number(formData.get("height"));
                  const gender = formData.get("gender") as string;
                  
                  const idealWeight = calculateIdealWeight(height, gender);
                  setResults({ ...results, idealWeight, gender });
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Gjatesia (cm)</label>
                    <input
                      type="number"
                      name="height"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="175"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Gjinia</label>
                    <select
                      name="gender"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      required
                    >
                      <option value="male">MAshkull</option>
                      <option value="female">Femer</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Kalkulo peshen ideale
                </button>
              </form>
              {results.idealWeight && (
                <div className="mt-8 p-6 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl text-center border-2 border-indigo-300">
                  <p className="text-3xl font-bold text-indigo-800 mb-2">
                    {results.idealWeight} kg
                  </p>
                  <p className="text-lg text-indigo-700">
                    Pesha ideale per {results.gender} ne gjatesine tende
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Macro Calculator */}
          {activeTab === "makro" && (
            <div className="bg-white rounded-2xl p-8 shadow-xl animate-fade-in">
              <div className="text-center mb-8">
                <Calculator className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Kalkulator makro</h3>
                <p className="text-gray-600">kalkulo sasin e nevojshme te makronutrienteve</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const weight = Number(formData.get("weight"));
                  const height = Number(formData.get("height"));
                  const age = Number(formData.get("age"));
                  const gender = formData.get("gender") as string;
                  const activity = formData.get("activity") as string;
                  const goal = formData.get("goal") as string;
                  
                  const macros = calculateMacros(weight, height, age, gender, activity, goal);
                  setResults({ ...results, macros, goal });
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Pesha(kg)</label>
                    <input
                      type="number"
                      name="weight"
                      step="0.1"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="70"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Gjatesia (cm)</label>
                    <input
                      type="number"
                      name="height"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="175"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Mosha</label>
                    <input
                      type="number"
                      name="age"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="25"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Gjinia</label>
                    <select
                      name="gender"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      required
                    >
                      <option value="male">Mashkull</option>
                      <option value="female">Femer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Niveli i aktivitetit</label>
                    <select
                      name="activity"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      required
                    >
                      <option value="sedentary">Jo aktiv</option>
                      <option value="light">Pak aktiv</option>
                      <option value="moderate">Mesatar</option>
                      <option value="active">Aktiv</option>
                      <option value="very_active">Teper Aktive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Qellimi</label>
                    <select
                      name="goal"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      required
                    >
                      <option value="maintain">Mbajtje peshe</option>
                      <option value="lose">Humbje peshe</option>
                      <option value="gain">Shtim peshe</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Kalkulo makrot
                </button>
              </form>
              {results.macros && (
                <div className="mt-8 space-y-6">
                  <div className="p-6 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl text-center border-2 border-purple-300">
                    <p className="text-2xl font-bold text-purple-800 mb-2">Kalorite ditore</p>
                    <p className="text-3xl font-bold">{results.macros.tdee} kcal</p>
                    <p className="text-sm text-purple-600">For {results.goal} qellimi</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-red-100 rounded-xl text-center border-2 border-red-300">
                      <p className="text-2xl font-bold text-red-800 mb-2">Protein</p>
                      <p className="text-3xl font-bold">{results.macros.protein}g</p>
                      <p className="text-sm text-red-600">1.2g per lb peshetrupore</p>
                    </div>
                    <div className="p-6 bg-yellow-100 rounded-xl text-center border-2 border-yellow-300">
                      <p className="text-2xl font-bold text-yellow-800 mb-2">Fat</p>
                      <p className="text-3xl font-bold">{results.macros.fat}g</p>
                      <p className="text-sm text-yellow-600">25% nga kalorite</p>
                    </div>
                    <div className="p-6 bg-green-100 rounded-xl text-center border-2 border-green-300">
                      <p className="text-2xl font-bold text-green-800 mb-2">Carbs</p>
                      <p className="text-3xl font-bold">{results.macros.carbs}g</p>
                      <p className="text-sm text-green-600">Kalorite e mbetura</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Water Intake Calculator */}
          {activeTab === "uji" && (
            <div className="bg-white rounded-2xl p-8 shadow-xl animate-fade-in">
              <div className="text-center mb-8">
                <Droplets className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Sasia e ujit e nevojshme</h3>
                <p className="text-gray-600">Kalkulo sasine e nevojshme te ujit qe i duhet trupit tend</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const weight = Number(formData.get("weight"));
                  const activity = formData.get("activity") as string;
                  
                  const waterIntake = calculateWaterIntake(weight, activity);
                  const glasses = Math.round(waterIntake / 250); // 250ml per glass
                  setResults({ ...results, waterIntake, glasses });
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Pesha (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      step="0.1"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="70"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Niveli i aktivitetit</label>
                    <select
                      name="activity"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      required
                    >
                      <option value="sedentary">Jo aktiv</option>
                      <option value="light">Pak aktiv</option>
                      <option value="moderate">Mesatar</option>
                      <option value="active">Aktiv</option>
                      <option value="very_active">Teper Aktive</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Kalkulo saine e ujite
                </button>
              </form>
              {results.waterIntake && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl text-center border-2 border-blue-300">
                  <p className="text-3xl font-bold text-blue-800 mb-2">
                    {results.waterIntake} ml
                  </p>
                  <p className="text-lg text-blue-700 mb-4">
                    Sasia e ujit te nevojshem({results.glasses} gota)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="font-semibold">Mengjes</p>
                      <p className="text-blue-600">{Math.round(results.glasses * 0.3)} gota</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="font-semibold">Dreke</p>
                      <p className="text-blue-600">{Math.round(results.glasses * 0.4)} gota</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="font-semibold">Mbasdite</p>
                      <p className="text-blue-600">{Math.round(results.glasses * 0.2)} gota</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="font-semibold">Nate</p>
                      <p className="text-blue-600">{Math.round(results.glasses * 0.1)} gota</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
