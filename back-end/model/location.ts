import { Location as LocationPrisma } from '@prisma/client';

export class Location {
    private id: number;
    private country: string;
    private city: string;
    private streetName: string;
    private zipCode: string;
    private number: string;

    constructor(location: {
        id: number;
        country: string;
        city: string;
        streetName: string;
        zipCode: string;
        number: string;
    }) {
        this.validate(location);

        this.id = location.id;
        this.country = location.country;
        this.city = location.city;
        this.streetName = location.streetName;
        this.zipCode = location.zipCode;
        this.number = location.number;
    }

    validate(location: {
        id: number;
        country: string;
        city: string;
        streetName: string;
        zipCode: string;
        number: string;
    }) {
        if (location.id < 0 || location.id === null) {
            throw new Error('Id cannot be negative');
        }
        if (location.country === '' || location.country === null) {
            throw new Error('Invalid country');
        }
        if (location.city === '' || location.city === null) {
            throw new Error('Invalid city');
        }
        if (location.streetName == '' || location.streetName === null) {
            throw new Error('Invalid street name');
        }
        if (location.zipCode === '' || location.zipCode === null) {
            throw new Error('Invalid zip code');
        }
        if (location.number === '' || location.number === null) {
            throw new Error('Invalid number');
        }
    }

    // Getters
    getId(): number | undefined {
        return this.id;
    }

    getCountry(): string {
        return this.country;
    }

    getCity(): string {
        return this.city;
    }

    getStreetName(): string {
        return this.streetName;
    }

    getZipCode(): string {
        return this.zipCode;
    }

    getNumber(): string {
        return this.number;
    }

    // Setters
    setCountry(country: string): void {
        this.country = country;
    }

    setCity(city: string): void {
        this.city = city;
    }

    setStreetName(streetName: string): void {
        this.streetName = streetName;
    }

    setZipCode(zipCode: string): void {
        this.zipCode = zipCode;
    }

    setNumber(number: string): void {
        this.number = number;
    }

    equals(location: Location): boolean {
        return (
            this.country === location.getCountry() &&
            this.city === location.getCity() &&
            this.streetName === location.getStreetName() &&
            this.zipCode === location.getZipCode() &&
            this.number === location.getNumber()
        );
    }

    static from(location: LocationPrisma) {
        return new Location({
            id: location.id,
            country: location.country,
            city: location.city,
            streetName: location.streetName,
            zipCode: location.zipCode,
            number: location.number,
        });
    }
}
