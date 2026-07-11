// app/test/page.jsx - کامل
"use client";

import { useState, useEffect } from "react";
import { vehiclesService } from "@/services/vehicles.service";

export default function TestPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(null);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  useEffect(() => {
    const test = async () => {
      try {
        setLoading(true);
        const result = await vehiclesService.testApi();
        setResult(result);
        console.log("✅ Test result:", result);
      } catch (error) {
        setError(error);
        console.error("❌ Test error:", error);
      } finally {
        setLoading(false);
      }
    };
    test();
  }, []);

  const testFavorites = async () => {
    setFavoritesLoading(true);
    try {
      const data = await vehiclesService.getFavorites();
      setFavorites(data);
      console.log("✅ Favorites:", data);
    } catch (error) {
      console.error("❌ Favorites error:", error);
      alert("Error: " + error.message);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const testAddFavorite = async () => {
    const carId = prompt("Enter car ID to add to favorites:");
    if (!carId) return;

    try {
      await vehiclesService.addFavorite(parseInt(carId));
      alert("✅ Added to favorites!");
      testFavorites();
    } catch (error) {
      console.error("❌ Add favorite error:", error);
      alert("Error: " + error.message);
    }
  };

  const testRemoveFavorite = async () => {
    const carId = prompt("Enter car ID to remove from favorites:");
    if (!carId) return;

    try {
      await vehiclesService.removeFavorite(parseInt(carId));
      alert("✅ Removed from favorites!");
      testFavorites();
    } catch (error) {
      console.error("❌ Remove favorite error:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🧪 API Test Page</h1>
        <p className="text-gray-600 mb-6">
          Testing API connections and favorite functionality
        </p>

        {/* ===== Token Status ===== */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="font-semibold mb-2">🔑 Token Status</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {localStorage.getItem("access_token")
              ? "✅ Token exists"
              : "❌ No token"}
          </pre>
        </div>

        {/* ===== Test API ===== */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="font-semibold mb-2">📡 Test API Connection</h2>
          {loading && <p>Testing...</p>}
          {result && (
            <pre className="bg-green-50 p-2 rounded text-sm overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
          {error && (
            <pre className="bg-red-50 text-red-600 p-2 rounded text-sm overflow-x-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          )}
        </div>

        {/* ===== Favorites Actions ===== */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="font-semibold mb-2">❤️ Favorites Actions</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={testFavorites}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Get Favorites
            </button>
            <button
              onClick={testAddFavorite}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Favorite
            </button>
            <button
              onClick={testRemoveFavorite}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Remove Favorite
            </button>
          </div>
          {favoritesLoading && <p>Loading favorites...</p>}
          {favorites && (
            <div>
              <p className="font-semibold">
                Count:{" "}
                {Array.isArray(favorites)
                  ? favorites.length
                  : favorites.count || 0}
              </p>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto max-h-60">
                {JSON.stringify(favorites, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* ===== Instructions ===== */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="font-semibold text-yellow-800 mb-2">
            📝 Instructions
          </h2>
          <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
            <li>Check if token exists</li>
            <li>Test API connection</li>
            <li>Test get favorites</li>
            <li>Test add favorite with a valid car ID</li>
            <li>Test remove favorite with a valid car ID</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
