import UserService from '@services/UserService';
import { StatusMessage } from '@types';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface FormErrors {
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    birthDate?: string;
}

const UserRegisterForm: React.FC = () => {
    // State variables for register
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // State variables for additional fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');

    // Consolidated Error State
    const [errors, setErrors] = useState<FormErrors>({});

    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { t } = useTranslation();

    const clearErrors = () => {
        setErrors({});
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!username.trim()) {
            newErrors.username = t('register.validate.username');
        }

        if (!password.trim()) {
            newErrors.password = t('register.validate.password');
        }

        if (!firstName.trim()) {
            newErrors.firstName = t('register.validate.firstName');
        }

        if (!lastName.trim()) {
            newErrors.lastName = t('register.validate.lastName');
        }

        if (!email.trim()) {
            newErrors.email = t('register.validate.email');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = t('register.validate.invalidEmail');
        }

        if (!birthDate.trim()) {
            newErrors.birthDate = t('register.validate.birthDate');
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        clearErrors();

        if (!validate()) {
            return;
        }

        const userData = {
            username: username.trim(),
            password: password.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            birthDate: new Date(birthDate.trim()),
        };

        setIsLoading(true);

        try {
            const response = await UserService.registerUser(userData);

            if (response.ok) {
                setStatusMessages([{ message: t('register.success'), type: 'success' }]);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else if (response.status === 400) {
                const responseData = await response.json();
                const genericErrorMessage = responseData.message || t('general.error');

                setStatusMessages([{ message: genericErrorMessage, type: 'error' }]);
            } else {
                setStatusMessages([
                    {
                        message: t('general.error'),
                        type: 'error',
                    },
                ]);
            }
        } catch (error) {
            setStatusMessages([{ message: t('register.error.serverError'), type: 'error' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h3 className="px-0">{t('register.title')}</h3>
            {statusMessages.length > 0 && (
                <div className="row">
                    <ul className="list-none mb-3 mx-auto">
                        {statusMessages.map(({ message, type }, index) => (
                            <li
                                key={index}
                                className={classNames({
                                    'text-red-800': type === 'error',
                                    'text-green-800': type === 'success',
                                })}
                            >
                                {message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="block mb-2 text-sm font-medium">
                    <label htmlFor="usernameInput" className="block mb-2 text-sm font-medium">
                        {t('register.label.username')}
                    </label>

                    <input
                        id="usernameInput"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className={`border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                            errors.username ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.username && <div className="text-red-800">{errors.username}</div>}
                </div>

                {/* Password Field */}
                <div className="mt-2">
                    <label htmlFor="passwordInput" className="block mb-2 text-sm font-medium">
                        {t('register.label.password')}
                    </label>
                    <input
                        id="passwordInput"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className={`border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.password && <div className="text-red-800">{errors.password}</div>}
                </div>

                {/* First Name Field */}
                <div className="mt-2">
                    <label htmlFor="firstNameInput" className="block mb-2 text-sm font-medium">
                        {t('register.label.firstName')}
                    </label>
                    <input
                        id="firstNameInput"
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        className={`border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.firstName && <div className="text-red-800">{errors.firstName}</div>}
                </div>

                {/* Last Name Field */}
                <div className="mt-2">
                    <label htmlFor="lastNameInput" className="block mb-2 text-sm font-medium">
                        {t('register.label.lastName')}
                    </label>
                    <input
                        id="lastNameInput"
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        className={`border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.lastName && <div className="text-red-800">{errors.lastName}</div>}
                </div>

                {/* Email Field */}
                <div className="mt-2">
                    <label htmlFor="emailInput" className="block mb-2 text-sm font-medium">
                        {t('register.label.email')}
                    </label>
                    <input
                        id="emailInput"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className={`border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.email && <div className="text-red-800">{errors.email}</div>}
                </div>

                {/* Birth Date Field */}
                <div className="mt-2">
                    <label htmlFor="birthDateInput" className="block mb-2 text-sm font-medium">
                        {t('register.label.birthDate')}
                    </label>
                    <input
                        id="birthDateInput"
                        type="date"
                        value={birthDate}
                        onChange={(event) => setBirthDate(event.target.value)}
                        className={`border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                            errors.birthDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.birthDate && <div className="text-red-800">{errors.birthDate}</div>}
                </div>

                {/* Submit Button */}
                <button
                    className="mt-4 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? t('register.loading') : t('buttons.register')}
                </button>
            </form>
        </>
    );
};

export default UserRegisterForm;
