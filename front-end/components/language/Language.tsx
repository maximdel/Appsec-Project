import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Language: React.FC = () => {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;
    const [selectedLocale, setSelectedLocale] = useState(locale);

    useEffect(() => {
        const savedLocale = localStorage.getItem('preferredLanguage');
        if (savedLocale) {
            setSelectedLocale(savedLocale);
            if (savedLocale !== locale) {
                router.push({ pathname, query }, asPath, { locale: savedLocale });
            }
        }
    }, []);

    const handleLanguageChange = (event: { target: { value: string } }) => {
        const newLocale = event.target.value;
        setSelectedLocale(newLocale);
        localStorage.setItem('preferredLanguage', newLocale);
        router.push({ pathname, query }, asPath, { locale: newLocale });
    };

    return (
        <div className="ml-6">
            <select
                id="language"
                className="ml-2 p-1 bg-slate-800"
                value={selectedLocale}
                onChange={handleLanguageChange}
            >
                <option value="en">🇬🇧</option>
                <option value="nl">🇳🇱</option>
            </select>
        </div>
    );
};

export default Language;
