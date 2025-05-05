import { User } from '@types';
import { TFunction } from 'i18next';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

interface UserDropdownProps {
    t: TFunction;
    loggedInUser: User;
    setLoggedInUser: (user: any) => void;
}

export default function UserDropdown({ t, loggedInUser, setLoggedInUser }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: { target: any }) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClick = () => {
        localStorage.removeItem('loggedInUser');
        setLoggedInUser(null);

        if (router.pathname === '/') {
            // Reload if you're on the homepage
            window.location.reload();
        } else {
            // Navigate to homepage if not
            router.push('/');
        }
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                className="px-2 text-white text-xl hover:bg-slate-600 rounded-lg inline-flex items-center"
                onClick={() => setIsOpen(!isOpen)}
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
                            className="block px-2 py-1 text-black text-xl hover:bg-gray-200 "
                            href={`/users/${loggedInUser.username}`}
                        >
                            {t('header.nav.edit')}
                        </Link>
                        <a
                            onClick={handleClick}
                            className="block px-2 py-1 text-black text-xl hover:bg-gray-200 "
                        >
                            {t('header.nav.logout')}
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
