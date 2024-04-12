import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';
import UserProfile from '../components/UserProfile';

fetchMock.enableMocks();

test('renders user data after fetching', async () => {
  const userData = { id: 1, name: 'John Doe', username: "Bret", email: 'john@example.com' };

  const response = new Response(JSON.stringify(userData), {
    status: 200,
    headers: { 'Content-type': 'application/json' },
  });

  fetchMock.mockResolvedValueOnce(response);

  render(<UserProfile />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

  expect(screen.getByText('User Profile')).toBeInTheDocument();
  expect(screen.getByText(`Name: ${userData.name}`)).toBeInTheDocument();
  expect(
    screen.getByText(`Username: ${userData.username}`)
  ).toBeInTheDocument();
  expect(screen.getByText(`Email: ${userData.email}`)).toBeInTheDocument();
});

test('renders error message on failed fetch', async () => {
  fetchMock.mockRejectedValueOnce(new Error('Failed to fetch'));

  render(<UserProfile />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

  expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
});
