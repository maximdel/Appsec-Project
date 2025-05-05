import { Location as LocationPrisma } from '@prisma/client';
import { Location } from '../model/location';
import database from './database';

const getAllLocations = async (): Promise<Location[]> => {
    try {
        const locationsPrisma = await database.location.findMany();
        return locationsPrisma.map((locationPrisma) => Location.from(locationPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const getLocationById = async (id: number): Promise<Location | null> => {
    try {
        const locationPrisma = await database.location.findUnique({
            where: { id },
        });
        return locationPrisma ? Location.from(locationPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const addLocation = async (location: Location): Promise<Location> => {
    try {
        const locationPrisma = await database.location.create({
            data: {
                country: location.getCountry(),
                city: location.getCity(),
                streetName: location.getStreetName(),
                zipCode: location.getZipCode(),
                number: location.getNumber(),
            },
        });
        return Location.from(locationPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const updateLocation = async (location: Location): Promise<Location> => {
    try {
        const locationPrisma = await database.location.update({
            where: {
                id: location.getId(),
            },
            data: {
                country: location.getCountry(),
                city: location.getCity(),
                streetName: location.getStreetName(),
                zipCode: location.getZipCode(),
                number: location.getNumber(),
            },
        });
        return Location.from(locationPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const deleteLocation = async (id: number): Promise<void> => {
    try {
        await database.location.delete({
            where: { id },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

export default { getAllLocations, getLocationById, addLocation, updateLocation, deleteLocation };
