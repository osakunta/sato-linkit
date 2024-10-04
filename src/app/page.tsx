"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Link {
  id: string;
  name: string;
  url: string;
}

function Home() {
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const response = await fetch("/api/crud/get-links");
      if (response.ok) {
        const linksList = await response.json();
        setLinks(linksList);
      } else {
        console.error("Failed to fetch links");
      }
    };

    fetchLinks();
  }, []);

  return (
    <div className="flex justify-center items-center bg-[url('../assets/sato-bg-desktop.png')] bg-cover bg-center min-h-screen min-w-full">
      <div className="w-2/5 p-4">
        {/* Display Links */}
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            passHref
          >
            <div className="flex items-center justify-between bg-gray-50 p-4 mb-2 rounded-lg shadow-md">
              {link.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
