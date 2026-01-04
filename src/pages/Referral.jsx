import { useEffect, useState } from "react";

export default function ReferralPage() {
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [referredUsers, setReferredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReferralData = async () => {
    try {
      const res = await fetch("http://localhost:5005/api/auth/user/me", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load profile");
        return;
      }

      if (!data.referralCode) {
        setError("Referral code not found");
        return;
      }

      setReferralCode(data.referralCode);
      setReferralLink(
        `${window.location.origin}/industrial-training/signup?referredBy=${data.referralCode}`
      );

      // store current user's id to exclude from referred list
      setCurrentUserId(data._id || null);
    } catch (err) {
      console.error(err);
      setError("Server not responding");
    }
  };

  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchReferredUsers = async () => {
    try {
      const res = await fetch("http://localhost:5005/api/auth/user/referrals", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load referrals");
        return;
      }

      // Exclude current user if accidentally included
      const filteredUsers = (data.users || []).filter(
        (u) => u._id !== currentUserId
      );

      setReferredUsers(filteredUsers);
    } catch (err) {
      console.error(err);
      setError("Server not responding");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  // fetch referred users **after currentUserId is set**
  useEffect(() => {
    if (currentUserId) fetchReferredUsers();
  }, [currentUserId]);

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied ✔️");
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          Referral Program
        </h1>

        {error && (
          <p className="text-center text-red-600 font-medium">{error}</p>
        )}

        {/* Referral Link */}
        <div className="space-y-3 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Referral Link
          </h2>

          {!referralCode ? (
            <p className="text-gray-600">Loading referral code...</p>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-blue-100 rounded-xl">
              <span className="flex-1 text-blue-900 font-mono text-sm break-all">
                {referralLink}
              </span>
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg"
              >
                Copy
              </button>
            </div>
          )}
        </div>

        {/* Referred Users */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            People Who Joined Using Your Referral
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : referredUsers.length === 0 ? (
            <p className="text-gray-500">No one has joined yet.</p>
          ) : (
            <ul className="space-y-2">
              {referredUsers.map((u) => (
                <li
                  key={u._id}
                  className="border p-3 rounded-lg bg-gray-50 flex justify-between items-center"
                >
                  <span>{u.name}</span>
                  <span className="text-sm text-gray-500">{u.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
