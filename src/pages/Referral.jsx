import { useState } from "react";

export default function ReferralPage() {
  const [referralKey, setReferralKey] = useState("");
  const [generated, setGenerated] = useState(false);

  const [joinName, setJoinName] = useState("");
  const [joinKey, setJoinKey] = useState("");

  const [referredUsers, setReferredUsers] = useState([]);

  const handleDelete = (id) => {
    setReferredUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleCopyKey = () => {
    if (!referralKey) return;
    navigator.clipboard.writeText(referralKey);
    alert("Referral key copied ✔️");
  };

  const handleGenerateKey = () => {
    const key =
      "REF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralKey(key);
    setGenerated(true);
  };

  const handleJoin = () => {
    if (joinKey !== referralKey) {
      alert("Invalid referral key ❌");
      return;
    }

    if (!joinName.trim()) {
      alert("Enter name");
      return;
    }

    setReferredUsers((prev) => [...prev, { id: Date.now(), name: joinName }]);

    setJoinName("");
    setJoinKey("");

    alert("Joined successfully ✔️");
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          Referral System
        </h1>

        {/* Generate Referral Key */}
        <div className="space-y-3 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Generate Your Referral Key
          </h2>

          {!generated ? (
            <button
              onClick={handleGenerateKey}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Generate Key
            </button>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-blue-100 border border-blue-300 rounded-xl font-mono text-blue-800 text-lg">
              <span className="flex-1">{referralKey}</span>
              <button
                onClick={handleCopyKey}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Copy
              </button>
            </div>
          )}
        </div>

        {/* Join Using Referral Key */}
        <div className="space-y-3 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Join Using Referral Key
          </h2>

          <input
            type="text"
            placeholder="Your Name"
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="text"
            placeholder="Enter Referral Key"
            value={joinKey}
            onChange={(e) => setJoinKey(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button
            onClick={handleJoin}
            className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Join
          </button>
        </div>

        {/* Referred Users List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            People You Referred & Joined
          </h2>

          {referredUsers.length === 0 ? (
            <p className="text-gray-500">No one has joined yet.</p>
          ) : (
            <ul className="space-y-2">
              {referredUsers.map((u) => (
                <li
                  key={u.id}
                  className="border p-3 rounded-lg bg-gray-50 flex justify-between items-center"
                >
                  <span>{u.name}</span>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-red-600 font-semibold hover:text-red-800"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
