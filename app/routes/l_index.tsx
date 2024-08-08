import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div>
      <h1>Welcome to the Time App</h1>
      <Link to="/time">Go to Time Search</Link>
    </div>
  );
}
