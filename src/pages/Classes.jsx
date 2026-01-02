import { useState } from "react";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-blue-50 py-12 px-6 flex justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow p-8 space-y-8">
        {/* Back Button */}
        <div>
          <Link
            to="/industrial-training"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-900 transition"
          >
            ← Back to Main Page
          </Link>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          Recorded Classes
        </h1>

        <p className="text-center text-gray-600">
          Access your recorded lectures anytime
        </p>

        <hr />

        {/* Classes List */}
        {classes.length === 0 ? (
          <p className="text-center text-gray-500">
            No recorded classes available yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {classes.map((c) => (
              <li
                key={c.id}
                className="border rounded-xl p-4 flex justify-between items-center bg-gray-50"
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
