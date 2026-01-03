import { useState } from "react";

export default function Classes() {
  // Sample class data — replace links later with real ones
  const [classes] = useState([
    {
      id: 1,
      title: "Introduction to MERN Stack",
      link: "https://www.youtube.com/watch?v=1hPgQWbWmEk",
    },
    {
      id: 2,
      title: "JavaScript Crash Course",
      link: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
    },
    {
      id: 3,
      title: "React Basics Session",
      link: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
    },
  ]);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          Recorded Classes
        </h1>

        <p className="text-center text-gray-600">
          Access your recorded lectures anytime
        </p>

        <hr className="border-blue-100" />

        {/* Classes List */}
        <div className="space-y-4">
          {classes.length === 0 ? (
            <p className="text-center text-gray-500">
              No recorded classes available yet.
            </p>
          ) : (
            classes.map((c) => (
              <div
                key={c.id}
                className="border rounded-2xl p-4 flex justify-between items-center bg-gray-50 shadow-sm"
              >
                <span className="font-semibold text-gray-800">{c.title}</span>

                <a
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  ▶ Watch
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
