import React, { useEffect, useState } from 'react';
import { getHealth } from '../services/api';

export default function Health() {
  const [status, setStatus] = useState('');
  const [ok, setOk] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await getHealth();
        const data = res?.data;
        setOk(Boolean(data?.success));
        setStatus(data?.message || '');
      } catch (e) {
        setOk(false);
        setError(e?.message || 'Failed to reach backend');
      }
    };
    run();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <p className={`text-xl ${ok ? 'text-green-400' : 'text-red-400'}`}>
          {ok ? '200 OK' : 'Unavailable'}
        </p>
        <p className="text-white mt-2">{status || (error ?? '')}</p>
        <p className="text-sm text-gray-500 mt-4">Backend URL: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'}</p>
      </div>
    </div>
  );
}


