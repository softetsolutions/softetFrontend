import React from "react";
import Navbar from "../components/Navbar";
import qrCode from "../assets/qrCode.jpg";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import { useState } from "react";

function PaymentDash() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 border-b-2 border-blue-200/60 bg-white/70 backdrop-blur-md flex items-center justify-between px-6 z-50">
      <Link to="/industrial-training">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Softet Solutions"
            className="w-10 h-10 rounded-lg object-contain"
          />
          <span className="font-bold text-lg text-[#0B3B6A]">
            Softet Solutions
          </span>
        </div>
      </Link>
    </header>
  );
}

export default function BankDetailsPage() {
  return (
    <>
      <PaymentDash />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 pt-24">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Bank Payment Details
          </h1>
          <p className="text-gray-600 text-center">
            Scan the QR code or use the bank details below to make the payment.
          </p>

          <div className="flex justify-center">
            <img
              src={qrCode}
              alt="Bank QR Code"
              className="w-48 h-48 object-contain rounded-lg shadow-md"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Bank Name:</span>
              <span className="text-gray-800">Federal Bank</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Account Name:</span>
              <span className="text-gray-800">Akash Tripathi</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Account Number:</span>
              <span className="text-gray-800">77770116708310</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">IFSC Code:</span>
              <span className="text-gray-800">FDRL0007777</span>
            </div>
          </div>

          {/* Instructions */}
          <p className="text-sm text-gray-500 text-center">
            Verify the name(Akash Tripathi) and account number before making the
            payment. After payment, please keep the transaction receipt for
            verification and share Screenshot in the gorup.
          </p>

          {/* Back Button */}
          <div className="flex justify-center">
            <a
              href="/industrial-training"
              className="px-6 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-600 transition"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
