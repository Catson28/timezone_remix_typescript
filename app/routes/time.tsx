import { json, LoaderFunction, useLoaderData } from '@remix-run/react';
import axios from 'axios';
import { useState } from 'react';

type LoaderData = {
  time?: string;
  error?: string;
};

const TIMEZONE_API_BASE_URL = 'http://worldtimeapi.org/api/timezone/';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const city = url.searchParams.get('city') || '';

  if (!city) {
    return json<LoaderData>({});
  }

  try {
    const response = await axios.get(`${TIMEZONE_API_BASE_URL}${city}`);
    const time = response.data.datetime;
    return json<LoaderData>({ time });
  } catch {
    return json<LoaderData>({ error: 'Unable to fetch time or invalid timezone' });
  }
};

const formatDateTime = (datetime: string) => {
  const date = new Date(datetime);
  const formattedDate = date.toISOString().split('T')[0]; // Extract date part (YYYY-MM-DD)
  const formattedTime = date.toISOString().split('T')[1].split('.')[0]; // Extract time part (HH:MM:SS)
  const timezone = datetime.split('+')[1] || datetime.split('-')[1] || ''; // Extract timezone

  return {
    date: formattedDate,
    time: formattedTime,
    timezone: `+${timezone}` // Include the '+' sign for timezone
  };
};

export default function Time() {
  const data = useLoaderData<LoaderData>();
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [currentTime, setCurrentTime] = useState<string | undefined>(data.time);
  const [error, setError] = useState<string | undefined>(data.error);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    try {
      const response = await axios.get(`${TIMEZONE_API_BASE_URL}${city}`);
      setCurrentTime(response.data.datetime);
      setError(undefined);
    } catch {
      setCurrentTime(undefined);
      setError('Unable to fetch time or invalid timezone');
    }
  };

  const { date, time, timezone } = currentTime ? formatDateTime(currentTime) : { date: '', time: '', timezone: '' };

  return (
    <div>
      <h1>Get Current Time</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter timezone (e.g., Africa/Luanda)"
        />
        <button type="submit">Search</button>
      </form>
      {submitted && (
        <div>
          {error ? (
            <p>{error}</p>
          ) : (
            <div>
              <p>Date: {date}</p>
              <p>Time: {time}</p>
              <p>Timezone: {timezone}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
