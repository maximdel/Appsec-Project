// components/users/UserDropdown.tsx
import UserService from '@services/UserService';
import { UserStorage } from '@types';
import { TFunction } from 'i18next';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

interface UserDropdownProps {
    t: TFunction;
    loggedInUser: UserStorage;
    setLoggedInUser: React.Dispatch<React.SetStateAction<UserStorage | null>>;
}

export default function UserDropdown({ t, loggedInUser, setLoggedInUser }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await UserService.logoutUser(); // calls POST /users/logout with credentials
            setLoggedInUser(null);
            await router.push('/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                className="px-2 text-white text-xl hover:bg-slate-600 rounded-lg inline-flex items-center"
                onClick={() => setIsOpen((o) => !o)}
            >
                {loggedInUser.username}
                <ChevronDown
                    className={`ml-2 h-5 w-5 text-white transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Link
                            href={`/users/${loggedInUser.username}`}
                            className="block px-2 py-1 text-black text-xl hover:bg-gray-200"
                        >
                            {t('header.nav.edit')}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-2 py-1 text-black text-xl hover:bg-gray-200"
                        >
                            {t('header.nav.logout')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
