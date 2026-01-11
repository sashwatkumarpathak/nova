"use client";

import { useEffect, useState } from "react";

type EventItem = {
  id: number;
  date: string;   // yyyy-mm-dd
  time: string;   // hh:mm
  title: string;
  description: string;
};

export default function EventPlanner() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  /* ---------- LOAD ---------- */
  useEffect(() => {
    const stored = localStorage.getItem("nova-events");
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  /* ---------- SAVE ---------- */
  useEffect(() => {
    localStorage.setItem("nova-events", JSON.stringify(events));
  }, [events]);

  const resetForm = () => {
    setDate("");
    setTime("");
    setTitle("");
    setDescription("");
    setEditingId(null);
  };

  const addOrUpdateEvent = () => {
    if (!date || !time || !title) return;

    if (editingId) {
      setEvents(
        events.map((e) =>
          e.id === editingId
            ? { ...e, date, time, title, description }
            : e
        )
      );
    } else {
      setEvents([
        ...events,
        {
          id: Date.now(),
          date,
          time,
          title,
          description,
        },
      ]);
    }

    resetForm();
  };

  const editEvent = (event: EventItem) => {
    setDate(event.date);
    setTime(event.time);
    setTitle(event.title);
    setDescription(event.description);
    setEditingId(event.id);
  };

  const removeEvent = (id: number) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  /* ---------- GROUP BY DATE ---------- */
  const groupedEvents = events.reduce<Record<string, EventItem[]>>(
    (acc, event) => {
      acc[event.date] = acc[event.date] || [];
      acc[event.date].push(event);
      return acc;
    },
    {}
  );

  return (
    <section
      id="event-planner"
      className="min-h-screen bg-zinc-950 text-white px-6 py-20"
    >
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold tracking-wide">
          Event Planner
        </h2>
        <p className="mt-3 text-zinc-400">
          Plan NOVA using calendar & time selectors.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto bg-zinc-900 p-6 rounded-xl mb-14 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-zinc-800 p-3 rounded outline-none"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-zinc-800 p-3 rounded outline-none"
          />
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
          className="w-full bg-zinc-800 p-3 rounded outline-none"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event Description (optional)"
          className="w-full bg-zinc-800 p-3 rounded outline-none"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={addOrUpdateEvent}
            className="px-6 py-2 rounded bg-purple-600 hover:bg-purple-700 transition"
          >
            {editingId ? "Update Event" : "Add Event"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="text-sm text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Events */}
      <div className="max-w-5xl mx-auto space-y-10">
        {Object.keys(groupedEvents).length === 0 && (
          <p className="text-center text-zinc-500">
            No events added yet.
          </p>
        )}

        {Object.entries(groupedEvents).map(([date, dayEvents]) => (
          <div key={date}>
            <h3 className="text-2xl font-semibold mb-4 text-purple-400">
              {new Date(date).toDateString()}
            </h3>

            <div className="space-y-4">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex justify-between items-start bg-zinc-900 p-5 rounded-xl"
                >
                  <div>
                    <p className="text-sm text-purple-300">
                      {event.time}
                    </p>
                    <h4 className="text-lg font-semibold mt-1">
                      {event.title}
                    </h4>
                    {event.description && (
                      <p className="text-zinc-400 mt-2">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* ICON ACTIONS */}
                  <div className="flex gap-4 text-xl">
                    <button
                      onClick={() => editEvent(event)}
                      title="Edit"
                      className="hover:scale-110 transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => removeEvent(event.id)}
                      title="Delete"
                      className="hover:scale-110 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
