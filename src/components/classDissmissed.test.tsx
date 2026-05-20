import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// import UserProfile from './UserProfile';
import { describe, beforeEach, it } from 'node:test';

global.fetch = jest.fn();
describe('UserProfile', () =>
    {
        beforeEach(() => {
            (global.fetch as jest.Mock).mockClear();
        });
        
        it('renders loading state initially', () => {
            (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => { }));
            // render(<UserProfile id="1" />);
            expect(screen.getByText(/loading/i)).toBeInTheDocument();
        });
            
            it('renders user data after successful fetch', async () => {
                const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com'};
                (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockUser });
                // render(<UserProfile id="1" />);
                await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
                expect(screen.getByText('john@example.com')).toBeInTheDocument();
            });

            it('renders error message on fetch failure', async () => {
                (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Down'));
                // render(<UserProfile id="1" />);
                await waitFor(() => expect(screen.getByText(/error:/i)).toBeInTheDocument());
            });
    });