import { Location } from '../../model/location';

const validId = 1;
const validCountry = 'Country';
const validCity = 'City';
const validStreetName = 'Streetname';
const validZipCode = '5';
const validNumber = '1';

const negativeId = -1;
const emptyCountry = '';
const emptyCity = '';
const emptyStreetName = '';
const invalidZipCode = '-0';
const invalidNumber = '-0';

test(`given: valid parameters, when: creating location, then: location is created`, () => {
    // When
    const location = new Location({
        id: validId,
        country: validCountry,
        city: validCity,
        streetName: validStreetName,
        zipCode: validZipCode,
        number: validNumber,
    });

    // Then
    expect(location).toBeDefined();

    expect(location.getId()).toBe(1);
    expect(location.getCountry()).toBe('Country');
    expect(location.getCity()).toBe('City');
    expect(location.getStreetName()).toBe('Streetname');
    expect(location.getZipCode()).toBe('5');
    expect(location.getNumber()).toBe('1');
});

test(`given: negative id, when: create location, then: error is thrown`, () => {
    expect(
        () =>
            new Location({
                id: negativeId,
                country: validCountry,
                city: validCity,
                streetName: validStreetName,
                zipCode: validZipCode,
                number: validNumber,
            })
    ).toThrow('Id cannot be negative');
});

// test('given: no id, when: creating a new location, then: error is thrown'), () => {
//     consts location = () => {
//         new Location({
//             country: validCountry,
//             city: validCity,
//             streetName: validStreetName,
//             zipCode: validZipCode,
//             number: validNumber,
//         })
//     }
//     expect(location).toThrowError('Id cannot be negative')
// };

test(`given: empty country, when: create location, then: error is thrown`, () => {
    expect(
        () =>
            new Location({
                id: validId,
                country: emptyCountry,
                city: validCity,
                streetName: validStreetName,
                zipCode: validZipCode,
                number: validNumber,
            })
    ).toThrow('Invalid country');
});

// test('given: no country, when: creating a new location, then: error is thrown'), () => {
//     consts location = () => {
//         new Location({
//             id: validId,
//             city: validCity,
//             streetName: validStreetName,
//             zipCode: validZipCode,
//             number: validNumber,
//         })
//     }
//     expect(location).toThrowError('Invalid country')
// };

test(`given: empty city, when: create location, then: error is thrown`, () => {
    expect(
        () =>
            new Location({
                id: validId,
                country: validCountry,
                city: emptyCity,
                streetName: validStreetName,
                zipCode: validZipCode,
                number: validNumber,
            })
    ).toThrow('Invalid city');
});

// test('given: no city, when: creating a new location, then: error is thrown'), () => {
//     consts location = () => {
//         new Location({
//             id: validId,
//             country: validCountry,
//             streetName: validStreetName,
//             zipCode: validZipCode,
//             number: validNumber,
//         })
//     }
//     expect(location).toThrowError('Invalid city')
// };

test(`given: empty street name, when: create location, then: error is thrown`, () => {
    expect(
        () =>
            new Location({
                id: validId,
                country: validCountry,
                city: validCity,
                streetName: emptyStreetName,
                zipCode: validZipCode,
                number: validNumber,
            })
    ).toThrow('Invalid street name');
});

// test('given: no street name, when: creating a new location, then: error is thrown'), () => {
//     consts location = () => {
//         new Location({
//             id: validId,
//             country: validCountry,
//             city: validCity,
//             zipCode: validZipCode,
//             number: validNumber,
//         })
//     }
//     expect(location).toThrowError('Invalid street name')
// };

test('given: empty zip code, when: creating a new location, then: error is thrown', () => {
    const location = () => {
        new Location({
            id: validId,
            country: validCountry,
            city: validCity,
            streetName: validStreetName,
            zipCode: '',
            number: validNumber,
        });
    };
    expect(location).toThrow('Invalid zip code');
});

// test('given: no zip code, when: creating a new location, then: error is thrown'), () => {
//     consts location = () => {
//         new Location({
//             id: validId,
//             country: validCountry,
//             city: validCity,
//             streetName: validStreetName,
//             number: validNumber,
//         })
//     }
//     expect(location).toThrowError('Invalid zip code')
// };

test('given: empty number, when: creating a new location, then: error is thrown', () => {
    const location = () => {
        new Location({
            id: validId,
            country: validCountry,
            city: validCity,
            streetName: validStreetName,
            zipCode: validZipCode,
            number: '',
        });
    };
    expect(location).toThrow('Invalid number');
});

// test('given: no number, when: creating a new location, then: error is thrown'), () => {
//     consts location = () => {
//         new Location({
//             id: va,
//             country: validCountry,
//             city: validCity,
//             streetName: validStreetName,
//             zipCode: validZipCode,
//         })
//     }
//     expect(location).toThrowError("Invalid number")
// };
