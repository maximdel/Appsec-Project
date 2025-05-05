import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    // Clean up the database
    await prisma.goal.deleteMany();
    await prisma.matchTeam.deleteMany();
    await prisma.match.deleteMany();
    await prisma.team.deleteMany();
    await prisma.location.deleteMany();
    await prisma.user.deleteMany();

    // Create users with different roles
    const [
        maxim,
        mathieu,
        admin,
        user1,
        lionel,
        cristiano,
        sergio,
        coachPep,
        neymar,
        mbappe,
        kevin,
        robert,
        virgil,
        salah,
        sadio,
        hazard,
        kane,
        modric,
        kroos,
        neuer,
        klopp,
        mourinho,
        Ancelotti,
        Simeone,
        Conte,
        Pochettino,
        Tuchel,
        Allegri,
    ] = await Promise.all([
        prisma.user.create({
            data: {
                firstName: 'Maxim',
                lastName: 'Delloye',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('2003-10-01'),
                email: 'r0898568@ucll.be',
                username: 'maximdel',
                description: 'hello world',
                role: 'ADMIN',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Mathieu',
                lastName: 'Sibret',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('2001-06-09'),
                email: 'r0833900@ucll.be',
                username: 'msibret',
                description: 'hola',
                role: 'ADMIN',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Admin',
                lastName: 'UCLL',
                password: await bcrypt.hash('secure12345', 10),
                birthDate: new Date('1995-01-01'),
                email: 'admin@ucll.be',
                username: 'admin',
                description: 'the one and only',
                role: 'ADMIN',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'User',
                lastName: '1',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1972-06-23'),
                email: 'user@example.com',
                username: 'user1',
                description: 'Iconic user',
                role: 'USER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Lionel',
                lastName: 'Messi',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1987-06-24'),
                email: 'lionel.messi@example.com',
                username: 'lionelm',
                description: 'Best player in the world',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Cristiano',
                lastName: 'Ronaldo',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1985-02-05'),
                email: 'cristiano.ronaldo@example.com',
                username: 'cristianor',
                description: 'Top scorer',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Sergio',
                lastName: 'Ramos',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1986-03-30'),
                email: 'sergio.ramos@example.com',
                username: 'sergior',
                description: 'Defensive leader',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Pep',
                lastName: 'Guardiola',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1971-01-18'),
                email: 'pep.guardiola@example.com',
                username: 'pepg',
                description: 'Best coach in the world',
                role: 'COACH',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Neymar',
                lastName: 'Jr',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1971-01-18'),
                email: 'neymar@ucll.be',
                username: 'neymar',
                description: 'Simulator simulator',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Kylian',
                lastName: 'Mbappe',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1971-01-18'),
                email: 'mbappe@ucll.be',
                username: 'mbappe',
                description: 'Up and coming',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Kevin',
                lastName: 'De Bruyne',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1991-06-28'),
                email: 'kevin.debruyne@example.com',
                username: 'kevdeb',
                description: 'Midfield maestro',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Robert',
                lastName: 'Lewandowski',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1988-08-21'),
                email: 'robert.lewandowski@example.com',
                username: 'lewy',
                description: 'Goal machine',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Virgil',
                lastName: 'van Dijk',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1991-07-08'),
                email: 'virgil.vandijk@example.com',
                username: 'virgilvd',
                description: 'Defensive rock',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Mohamed',
                lastName: 'Salah',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1992-06-15'),
                email: 'mohamed.salah@example.com',
                username: 'mosalah',
                description: 'Speedster',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Sadio',
                lastName: 'Mane',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1992-04-10'),
                email: 'sadio.mane@example.com',
                username: 'sadiom',
                description: 'Winger',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Eden',
                lastName: 'Hazard',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1991-01-07'),
                email: 'eden.hazard@example.com',
                username: 'edenh',
                description: 'Dribbler',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Harry',
                lastName: 'Kane',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1993-07-28'),
                email: 'harry.kane@example.com',
                username: 'harryk',
                description: 'Striker',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Luka',
                lastName: 'Modric',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1985-09-09'),
                email: 'luka.modric@example.com',
                username: 'lukam',
                description: 'Playmaker',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Toni',
                lastName: 'Kroos',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1990-01-04'),
                email: 'toni.kroos@example.com',
                username: 'tonik',
                description: 'Midfield general',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Manuel',
                lastName: 'Neuer',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1986-03-27'),
                email: 'manuel.neuer@example.com',
                username: 'manueln',
                description: 'Goalkeeper',
                role: 'PLAYER',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Jurgen',
                lastName: 'Klopp',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1967-06-16'),
                email: 'jurgen.klopp@example.com',
                username: 'jurgenk',
                description: 'Charismatic coach',
                role: 'COACH',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Jose',
                lastName: 'Mourinho',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1963-01-26'),
                email: 'jose.mourinho@example.com',
                username: 'josem',
                description: 'The Special One',
                role: 'COACH',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Carlo',
                lastName: 'Ancelotti',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1959-06-10'),
                email: 'carlo.ancelotti@example.com',
                username: 'carloa',
                description: 'Experienced coach',
                role: 'COACH',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Diego',
                lastName: 'Simeone',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1970-04-28'),
                email: 'diego.simeone@example.com',
                username: 'diegos',
                description: 'Tactical genius',
                role: 'COACH',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Antonio',
                lastName: 'Conte',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1969-07-31'),
                email: 'antonio.conte@example.com',
                username: 'antonioc',
                description: 'Passionate coach',
                role: 'COACH',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Mauricio',
                lastName: 'Pochettino',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1972-03-02'),
                email: 'mauricio.pochettino@example.com',
                username: 'mauriciop',
                description: 'Strategic thinker',
                role: 'COACH',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Thomas',
                lastName: 'Tuchel',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1973-08-29'),
                email: 'thomas.tuchel@example.com',
                username: 'thomast',
                description: 'Innovative coach',
                role: 'COACH',
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Massimiliano',
                lastName: 'Allegri',
                password: await bcrypt.hash('123', 10),
                birthDate: new Date('1967-08-11'),
                email: 'massimiliano.allegri@example.com',
                username: 'massimilianoa',
                description: 'Experienced tactician',
                role: 'COACH',
            },
        }),
    ]);

    // Create Locations
    const [campNou, bernabeu, parcDesPrinces, etihad, munich, turin, liverpoolLoc] =
        await Promise.all([
            prisma.location.create({
                data: {
                    country: 'Spain',
                    city: 'Barcelona',
                    streetName: "Carrer d'Arístides Maillol",
                    zipCode: '08028',
                    number: '12',
                },
            }),
            prisma.location.create({
                data: {
                    country: 'Spain',
                    city: 'Madrid',
                    streetName: 'Avenida de Concha Espina',
                    zipCode: '28036',
                    number: '1',
                },
            }),
            prisma.location.create({
                data: {
                    country: 'France',
                    city: 'Paris',
                    streetName: 'Rue du Commandant Guilbaud',
                    zipCode: '75016',
                    number: '24',
                },
            }),
            prisma.location.create({
                data: {
                    country: 'England',
                    city: 'Manchester',
                    streetName: 'Ashton New Rd',
                    zipCode: 'M11 3FF',
                    number: '100',
                },
            }),
            prisma.location.create({
                data: {
                    country: 'Germany',
                    city: 'Munich',
                    streetName: 'Werner-Heisenberg-Allee',
                    zipCode: '80939',
                    number: '25',
                },
            }),
            prisma.location.create({
                data: {
                    country: 'Italy',
                    city: 'Turin',
                    streetName: 'Corso Gaetano Scirea',
                    zipCode: '10151',
                    number: '50',
                },
            }),
            prisma.location.create({
                data: {
                    country: 'England',
                    city: 'Liverpool',
                    streetName: 'Anfield Rd',
                    zipCode: 'L4 0TH',
                    number: '1',
                },
            }),
        ]);

    // Create teams
    const [barcelona, madrid, psg, mancity, bayern, juventus, liverpool, chelsea, tottenham] =
        await Promise.all([
            prisma.team.create({
                data: {
                    name: 'FC Barcelona',
                    description: 'Best team in the world',
                    coach: { connect: { id: coachPep.id } },
                    players: { connect: [{ id: lionel.id }, { id: kroos.id }] },
                },
            }),
            prisma.team.create({
                data: {
                    name: 'Real Madrid',
                    description: 'Historic team with many titles',
                    coach: { connect: { id: klopp.id } },
                    players: {
                        connect: [{ id: cristiano.id }, { id: sergio.id }, { id: mbappe.id }],
                    },
                },
            }),
            prisma.team.create({
                data: {
                    name: 'Paris Saint-Germain',
                    description: 'Top French club',
                    coach: { connect: { id: Ancelotti.id } },
                    players: { connect: [{ id: neymar.id }, { id: sadio.id }] },
                },
            }),
            prisma.team.create({
                data: {
                    name: 'Manchester City',
                    description: 'Top team in the Premier League',
                    coach: { connect: { id: mourinho.id } },
                    players: { connect: [{ id: kevin.id }] },
                },
            }),
            prisma.team.create({
                data: {
                    name: 'Bayern Munich',
                    description: 'Top team in the Bundesliga',
                    coach: { connect: { id: Simeone.id } },
                    players: { connect: [{ id: neuer.id }, { id: robert.id }] },
                },
            }),
            prisma.team.create({
                data: {
                    name: 'Juventus',
                    description: 'Top team in Serie A',
                    coach: { connect: { id: Conte.id } },
                    players: { connect: [{ id: modric.id }] },
                },
            }),
            prisma.team.create({
                data: {
                    name: 'Liverpool',
                    description: 'Top team in the Premier League',
                    coach: { connect: { id: Pochettino.id } },
                    players: { connect: [{ id: salah.id }, { id: virgil.id }] },
                },
            }),
            prisma.team.create({
                data: {
                    name: 'Chelsea',
                    description: 'Top team in the Premier League',
                    coach: { connect: { id: Tuchel.id } },
                    players: { connect: [{ id: hazard.id }] },
                },
            }),
            prisma.team.create({
                data: {
                    name: 'Tottenham Hotspur',
                    description: 'Top team in the Premier League',
                    coach: { connect: { id: Allegri.id } },
                    players: { connect: [{ id: kane.id }] },
                },
            }),
        ]);

    // Create Matches
    const [
        match1,
        match2,
        match3,
        match4,
        match5,
        match6,
        match7,
        match8,
        match9,
        match10,
        match11,
        match12,
        match13,
        match14,
    ] = await Promise.all([
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: campNou.id } },
                teams: {
                    create: [
                        { team: { connect: { id: barcelona.id } } },
                        { team: { connect: { id: madrid.id } } },
                    ],
                },
            },
        }),
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: parcDesPrinces.id } },
                teams: {
                    create: [
                        { team: { connect: { id: psg.id } } },
                        { team: { connect: { id: mancity.id } } },
                    ],
                },
            },
        }),
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: bernabeu.id } },
                teams: {
                    create: [
                        { team: { connect: { id: madrid.id } } },
                        { team: { connect: { id: psg.id } } },
                    ],
                },
            },
        }),
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: campNou.id } },
                teams: {
                    create: [
                        { team: { connect: { id: barcelona.id } } },
                        { team: { connect: { id: madrid.id } } },
                    ],
                },
            },
            include: { teams: true },
        }),
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: campNou.id } },
                teams: {
                    create: [
                        { team: { connect: { id: bayern.id } } },
                        { team: { connect: { id: juventus.id } } },
                    ],
                },
            },
            include: { teams: true },
        }),
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: munich.id } },
                teams: {
                    create: [
                        { team: { connect: { id: liverpool.id } } },
                        { team: { connect: { id: chelsea.id } } },
                    ],
                },
            },
        }),
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: turin.id } },
                teams: {
                    create: [
                        { team: { connect: { id: tottenham.id } } },
                        { team: { connect: { id: mancity.id } } },
                    ],
                },
            },
        }),
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: liverpoolLoc.id } },
                teams: {
                    create: [
                        { team: { connect: { id: liverpool.id } } },
                        { team: { connect: { id: chelsea.id } } },
                    ],
                },
            },
        }),
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: campNou.id } },
                teams: {
                    create: [
                        { team: { connect: { id: barcelona.id } } },
                        { team: { connect: { id: tottenham.id } } },
                    ],
                },
            },
        }),
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: etihad.id } },
                teams: {
                    create: [
                        { team: { connect: { id: mancity.id } } },
                        { team: { connect: { id: bayern.id } } },
                    ],
                },
            },
        }),
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: bernabeu.id } },
                teams: {
                    create: [
                        { team: { connect: { id: madrid.id } } },
                        { team: { connect: { id: liverpool.id } } },
                    ],
                },
            },
        }),
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: parcDesPrinces.id } },
                teams: {
                    create: [
                        { team: { connect: { id: psg.id } } },
                        { team: { connect: { id: chelsea.id } } },
                    ],
                },
            },
        }),
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: munich.id } },
                teams: {
                    create: [
                        { team: { connect: { id: bayern.id } } },
                        { team: { connect: { id: tottenham.id } } },
                    ],
                },
            },
        }),
        prisma.match.create({
            data: {
                date: new Date(),
                location: { connect: { id: turin.id } },
                teams: {
                    create: [
                        { team: { connect: { id: juventus.id } } },
                        { team: { connect: { id: mancity.id } } },
                    ],
                },
            },
        }),
    ]);

    // Create Goals
    await prisma.goal.createMany({
        data: [
            // Match 1: Barcelona vs. Madrid
            { time: 15, matchId: match1.id, teamId: barcelona.id, playerId: lionel.id },
            { time: 45, matchId: match1.id, teamId: madrid.id, playerId: cristiano.id },
            { time: 90, matchId: match1.id, teamId: madrid.id, playerId: cristiano.id },

            // Match 2: PSG vs. Manchester City
            { time: 30, matchId: match2.id, teamId: psg.id, playerId: neymar.id },

            // Match 3: Madrid vs. PSG
            { time: 25, matchId: match3.id, teamId: madrid.id, playerId: sergio.id },
            { time: 75, matchId: match3.id, teamId: psg.id, playerId: sadio.id },

            // Match 4: Barcelona vs. Madrid
            { time: 10, matchId: match4.id, teamId: barcelona.id, playerId: lionel.id },
            { time: 55, matchId: match4.id, teamId: madrid.id, playerId: cristiano.id },
            { time: 5, matchId: match4.id, teamId: madrid.id, playerId: mbappe.id },
            { time: 75, matchId: match4.id, teamId: madrid.id, playerId: cristiano.id },
            { time: 89, matchId: match4.id, teamId: madrid.id, playerId: sergio.id },

            // Match 5: Bayern vs. Juventus
            { time: 20, matchId: match5.id, teamId: bayern.id, playerId: robert.id },
            { time: 70, matchId: match5.id, teamId: juventus.id, playerId: modric.id },

            // Match 6: Liverpool vs. Chelsea
            { time: 15, matchId: match6.id, teamId: liverpool.id, playerId: salah.id },
            { time: 65, matchId: match6.id, teamId: chelsea.id, playerId: hazard.id },
            { time: 1, matchId: match6.id, teamId: chelsea.id, playerId: hazard.id },

            // Match 7: Tottenham vs. Manchester City
            { time: 25, matchId: match7.id, teamId: tottenham.id, playerId: kane.id },
            { time: 75, matchId: match7.id, teamId: mancity.id, playerId: kevin.id },

            // Match 8: Liverpool vs. Chelsea
            { time: 15, matchId: match8.id, teamId: liverpool.id, playerId: salah.id },
            { time: 45, matchId: match8.id, teamId: chelsea.id, playerId: hazard.id },
            { time: 75, matchId: match8.id, teamId: liverpool.id, playerId: virgil.id },

            // Match 9: Barcelona vs. Tottenham
            { time: 20, matchId: match9.id, teamId: barcelona.id, playerId: lionel.id },
            { time: 50, matchId: match9.id, teamId: tottenham.id, playerId: kane.id },
            { time: 85, matchId: match9.id, teamId: barcelona.id, playerId: lionel.id },
            { time: 12, matchId: match9.id, teamId: barcelona.id, playerId: lionel.id },
            { time: 65, matchId: match9.id, teamId: barcelona.id, playerId: lionel.id },

            // Match 10: Manchester City vs. Bayern
            { time: 25, matchId: match10.id, teamId: mancity.id, playerId: kevin.id },
            { time: 60, matchId: match10.id, teamId: bayern.id, playerId: robert.id },
            { time: 90, matchId: match10.id, teamId: mancity.id, playerId: kevin.id },

            // Match 11: Madrid vs. Liverpool
            { time: 10, matchId: match11.id, teamId: madrid.id, playerId: cristiano.id },
            { time: 55, matchId: match11.id, teamId: liverpool.id, playerId: salah.id },
            { time: 75, matchId: match11.id, teamId: madrid.id, playerId: sergio.id },
            { time: 4, matchId: match11.id, teamId: madrid.id, playerId: cristiano.id },
            { time: 87, matchId: match11.id, teamId: liverpool.id, playerId: salah.id },

            // Match 12: PSG vs. Chelsea
            { time: 35, matchId: match12.id, teamId: psg.id, playerId: neymar.id },
            { time: 65, matchId: match12.id, teamId: chelsea.id, playerId: hazard.id },
            { time: 80, matchId: match12.id, teamId: psg.id, playerId: sadio.id },

            // Match 13: Bayern vs. Tottenham
            { time: 15, matchId: match13.id, teamId: bayern.id, playerId: robert.id },
            { time: 50, matchId: match13.id, teamId: tottenham.id, playerId: kane.id },
            { time: 85, matchId: match13.id, teamId: bayern.id, playerId: robert.id },

            // Match 14: Juventus vs. Manchester City
            { time: 30, matchId: match14.id, teamId: juventus.id, playerId: modric.id },
            { time: 65, matchId: match14.id, teamId: mancity.id, playerId: kevin.id },
            { time: 85, matchId: match14.id, teamId: juventus.id, playerId: modric.id },
        ],
    });

    console.log('Seeding completed');
};

main()
    .then(() => prisma.$disconnect())
    .catch((error) => {
        console.error(error);
        prisma.$disconnect();
        process.exit(1);
    });
