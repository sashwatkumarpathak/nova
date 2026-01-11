"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(1);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({ text: "", type: "" });

  const submit = async () => {
    if (!name || !email) {
      setMessage({
        text: "Please fill in your name and a valid email.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, count }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage({
        text:
          "Registration successful! Check your email for the QR code.",
        type: "success",
      });

      // optional: reset form
      setName("");
      setEmail("");
      setCount(1);
    } catch (err) {
      setMessage({
        text:
          "Something went wrong. Please try again in a moment.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-md space-y-5">
        <h1 className="text-3xl font-bold text-center">
          Register for NOVA
        </h1>

        {/* Name */}
        <div>
          <label className="text-sm text-zinc-400">
            Full Name
          </label>
          <input
            className="mt-1 w-full p-3 rounded bg-zinc-800 outline-none"
            placeholder="e.g. Praveen Beeraka"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-zinc-400">
            Email Address
          </label>
          <input
            className="mt-1 w-full p-3 rounded bg-zinc-800 outline-none"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-xs text-zinc-500 mt-1">
            Your QR code will be sent here.
          </p>
        </div>

        {/* Count */}
        <div>
          <label className="text-sm text-zinc-400">
            Number of People
          </label>
          <input
            type="number"
            min={1}
            className="mt-1 w-full p-3 rounded bg-zinc-800 outline-none"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
          <p className="text-xs text-zinc-500 mt-1">
            Including yourself.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full py-3 rounded transition ${
            loading
              ? "bg-purple-600/50 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Message */}
        {message.text && (
          <p
            className={`text-center text-sm ${
              message.type === "success"
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </main>
  );
}
