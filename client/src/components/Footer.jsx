import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 w-full mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Group35. All Rights Reserved.
        </p>
        <ul className="flex justify-center space-x-4 mt-2">
          <li>
            <a href="/about" className="hover:underline">
              About Us
            </a>
          </li>
          <li>
            <a href="/contact" className="hover:underline">
              Contact
            </a>
          </li>
          <li>
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
