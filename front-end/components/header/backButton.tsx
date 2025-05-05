import { Undo2 } from 'lucide-react';
import { useRouter } from 'next/router';
import React from 'react';

const BackButton: React.FC = () => {
    const router = useRouter();

    const handleBack = () => {
        if (router.pathname !== '/') {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <button onClick={handleBack} className="text-white  shadow-md  focus:outline-none">
            <Undo2 />
        </button>
    );
};

export default BackButton;
