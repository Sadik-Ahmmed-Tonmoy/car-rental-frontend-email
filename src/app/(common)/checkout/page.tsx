"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 7000, currency: "GBP" }), // £70.00
      });

      if (!res.ok) {
        console.error("API error:", await res.text());
        alert("Payment failed — check console");
        return;
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No URL returned:", data);
        alert("Payment failed — no URL");
      }
    } catch (err) {
      console.error("Client error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">One-Time Payment</h1>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Redirecting..." : "Pay $50"}
      </button>
    </main>
  );
}
