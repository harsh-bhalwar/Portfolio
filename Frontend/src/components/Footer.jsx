import { useState, useEffect } from 'react';
import { getAllLinks } from '../services/api';

const Footer = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await getAllLinks();
        // Normalize ApiResponse shape: { success, data }
        let raw = [];
        if (response?.data?.success) {
          raw = response.data.data;
        } else {
          // Fallbacks for older/alternate shapes
          raw = response?.data?.links ?? response?.data ?? [];
        }

        // Flatten if it's an array of portfolios with `links` arrays
        let flattened = [];
        if (Array.isArray(raw)) {
          if (raw.length > 0 && raw[0] && Array.isArray(raw[0].links)) {
            flattened = raw.flatMap((p) => (Array.isArray(p.links) ? p.links : []));
          } else {
            flattened = raw;
          }
        } else if (raw && Array.isArray(raw.links)) {
          flattened = raw.links;
        }

        setLinks(flattened);
      } catch (error) {
        console.error("Failed to fetch links:", error);
      }
    };
    fetchLinks();
  }, []);

  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(56,189,248,0.15),rgba(56,189,248,0)_60%)]" />
      <div className="max-w-7xl mx-auto px-6 py-12 text-center text-gray-400">
        <div className="flex justify-center flex-wrap gap-6 mb-6">
          {links.map((link) => {
            const href = link?.link || link?.url || link?.href || '#';
            const key = link?._id || `${link?.title}-${href}`;
            return (
              <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
                {link?.title || href}
              </a>
            );
          })}
          <a href="#certificates" className="hover:text-cyan-300 transition-colors">Certificates</a>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} {` ${''}`} All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;