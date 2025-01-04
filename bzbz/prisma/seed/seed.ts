/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";
// import prisma from "@/prisma/db";
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { faker } from '@faker-js/faker';
import { randCompanyName, randFutureDate, randLanguage } from "@ngneat/falso";

dotenv.config();


const prisma = new PrismaClient()


// populate admin account
const populateAdminAccount = async () => {
    const adminEmail = process.env.ADMIN_EMAIL; // Assuming you have an ADMIN_EMAIL in your .env
    const adminPassword = process.env.ADMIN_PASSWORD; // Assuming you have an ADMIN_PASSWORD in your .env

    if (!adminEmail || !adminPassword) {
        console.error("Admin email or password is not defined in the environment variables.");
        return;
    }

    const existingAdmin = await prisma.administrator.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log("Admin account already exists.");
        return;
    }

    const hashedPassword = await bcrypt.hashSync(adminPassword);

    await prisma.administrator.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
        },
    });

    console.log("Admin account created");
};

// List of cities in France
const franceCities = [
    "Paris",
    "Marseille",
    "Lyon",
    "Toulouse",
    "Nice",
    "Nantes",
    "Montpellier",
    "Strasbourg",
    "Bordeaux",
    "Lille",
    "Rennes",
    "Reims",
    "Le Havre",
    "Saint-Étienne",
    "Toulon",
    "Grenoble",
    "Dijon",
    "Angers",
    "Nîmes",
    "Villeurbanne",
    "Clermont-Ferrand",
    "Le Mans",
    "Aix-en-Provence",
    "Brest",
    "Tours",
    "Amiens",
    "Limoges",
    "Annecy",
    "Perpignan",
    "Boulogne-Billancourt",
    "Metz",
    "Besançon",
    "Orléans",
    "Saint-Denis",
    "Argenteuil",
    "Rouen",
    "Montreuil",
    "Mulhouse",
    "Caen",
    "Nancy",
    "Saint-Paul",
    "Roubaix",
    "Tourcoing",
    "Nanterre",
    "Vitry-sur-Seine",
    "Créteil",
    "Avignon",
    "Poitiers",
    "Dunkerque",
    "Asnières-sur-Seine",
    "Courbevoie",
    "Versailles",
    "Colombes",
    "Fort-de-France",
    "Aulnay-sous-Bois",
    "Rueil-Malmaison",
    "Pau",
    "Aubervilliers",
    "Champigny-sur-Marne",
    "Antibes",
    "Saint-Maur-des-Fossés",
    "Cannes",
    "Béziers",
    "Calais",
    "Mérignac",
    "Drancy",
    "Ajaccio",
    "Issy-les-Moulineaux",
    "Levallois-Perret",
    "La Rochelle",
    "Quimper",
    "Noisy-le-Grand",
    "Vénissieux",
    "Cergy",
    "Pessac",
    "Troyes",
    "Ivry-sur-Seine",
    "Clichy",
    "Chambéry",
    "Lorient",
    "Niort",
    "Sarcelles",
    "Les Abymes",
    "Montauban",
    "Villejuif",
    "Saint-Quentin"
  ];

// fetchmovie by id
export async function fetchMovieById(id: number) {
    const url = `${process.env.TMDB_MOVIE_DETAIL_URL}/${id}`;
    const api_key_param = `?api_key=${process.env.TMDB_API_KEY}`;
    const movieResponse = fetch(url + api_key_param);
    const videosResponse = fetch(`${url}/videos` + api_key_param);
    const creditsResponse = fetch(`${url}/credits` + api_key_param);

    const [response, videosResponseData, creditsResponseData] = await Promise.all([movieResponse, videosResponse, creditsResponse]);

    if (!response.ok) {
        console.log(id, response.statusText)
        throw new Error(`Error fetching movie with id ${id}: ${response.statusText}`);
    }

    const movie = await response.json();

    if (!videosResponseData.ok || !creditsResponseData.ok) {
        throw new Error(`Error fetching videos or credits for movie with id ${id}`);
    }

    const videos = await videosResponseData.json();
    const credits = await creditsResponseData.json();

    // You can now return the movie along with videos and credits if needed
    return { ...movie, videos: videos.results, credits: { cast: credits.cast, crew: credits.crew} };
}


// fetch trending movies
export async function fetchTrendingMovies(totalPages: number) {
    /**
     * @param {number} totalPages - The total number of pages to fetch. Always >= 1.
     */
    const url = process.env.TMDB_TRENDING_MOVIE_URL;
    const key = process.env.TMDB_API_KEY;
    const targetUrl = `${url}?api_key=${key}`
    
    const allMovies = [];

    for (let page = 1; page <= totalPages; page++) {
        const response = await fetch(`${targetUrl}&page=${page}`);
        const data = await response.json();
        const filteredMovies = data.results.filter((movie: any) => movie.media_type === 'movie');
        allMovies.push(filteredMovies);
    }
    return allMovies;
}

export async function fetchTrendingMoviesWithDetails(movieNumber: number) {
    const pageNumber: number = Math.max(1, Math.ceil(movieNumber / 20));
    const movies = (await fetchTrendingMovies(pageNumber)).flat();
    
    const movies_details = [];
    const chunkSize = 20;

    for (let i = 0; i < movies.length; i += chunkSize) {
        const chunk = movies.slice(i, i + chunkSize);
        const details = await Promise.all(chunk.map(movie => fetchMovieById(movie.id)));
        movies_details.push(...details);

        // Sleep for 2 seconds after every 20 requests
        if (i + chunkSize < movies.length) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    return movies_details;
}



async function populateDatabaseWithTrendingMovies(movieNumber: number) {
  const movies = await fetchTrendingMoviesWithDetails(movieNumber);
  const actorsMap = new Map();
  const movieActorRelations = [];
  const existingSlugs = new Set(); // Track existing slugs to ensure uniqueness

  for (const movie of movies) {
    let uniqueSlug = slugify(movie.title);
    let slugSuffix = 1;

    // Check for uniqueness and modify the slug if necessary
    while (existingSlugs.has(uniqueSlug)) {
      uniqueSlug = `${slugify(movie.title)}-${slugSuffix}`;
      slugSuffix++;
    }

    existingSlugs.add(uniqueSlug); // Add the unique slug to the set

    // Ensure the movie exists or create it
    await prisma.movie.upsert({
      where: { id: movie.id },
      update: {},
      create: {
        id: movie.id,
        title: movie.title,
        duration: movie.runtime,
        language: movie.original_language,
        ageLimit: 0, // Assuming no age limit is provided
        director:
          movie.credits.crew.find(
            (crewMember: { job: string; name: string }) => crewMember.job === 'Director'
          )?.name || 'Unknown',
        slug: uniqueSlug,
        photo: movie.poster_path
          ? `${movie.poster_path}`
          : `${movie.backdrop_path}`,
        video: movie.videos.length > 0 ? movie.videos[0].key : null,
        synopsis: movie.overview,
      },
    });

    // Process actors for the current movie
    for (const actor of movie.credits.cast) {
      if (!actorsMap.has(actor.id)) {
        // Add the actor only if it doesn't already exist
        const existingActor = await prisma.actor.findUnique({
          where: { id: actor.id },
        });

        if (!existingActor) {
          await prisma.actor.create({
            data: {
              id: actor.id,
              name: actor.name,
              profile: actor.profile_path
                ? actor.profile_path
                : null,
            },
          });
        }

        actorsMap.set(actor.id, true); // Track processed actor IDs
      }

      // Add the relationship
      movieActorRelations.push({
        movieId: movie.id,
        actorId: actor.id,
      });
    }
  }

  // Establish relationships
  for (const relation of movieActorRelations) {
    await prisma.movie.update({
      where: { id: relation.movieId },
      data: {
        actors: {
          connect: { id: relation.actorId },
        },
      },
    });
  }

  console.log('Movies and Actors Seeding completed!');
}


async function populateCinema(TotalCinemaPerCity: number) {

  for (const city of franceCities) {
      const cinemaCount = Math.floor(Math.random() * TotalCinemaPerCity) + 1; // Generate between 1 and TotalCinemaPerCity for each city

      const cinemas = Array.from({ length: cinemaCount }, () => ({
          id: Number(faker.finance.accountNumber()),
          name:  randCompanyName(), 
          city: city,
          address: faker.location.streetAddress(),
      }));

      await prisma.cinema.createMany({
          data: cinemas,
      });
  }

  console.log('Cinema population completed!');
}



async function populateScreenings(totalNumberOfScreenings: number) {
    const movies = await prisma.movie.findMany(); // Fetch all movies
    const cinemas = await prisma.cinema.findMany(); // Fetch all cinemas

    const screenings = Array.from({ length: totalNumberOfScreenings }, () => {
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        const randomCinema = cinemas[Math.floor(Math.random() * cinemas.length)];
        const randomStartTime = randFutureDate().toISOString()

        return {
            movieId: randomMovie.id,
            cinemaId: randomCinema.id,
            startTime: randomStartTime,
            subtitle: randLanguage()
        };
    });

    await prisma.screening.createMany({
        data: screenings,
    });

    console.log('Screening population completed!');
}





export async function launchSeed() {
    const Totalmovies: number = parseInt(process.env.TOTAL_MOVIES || '200', 10);
    const TotalCinema: number = parseInt(process.env.TOTAL_CINEMA || '30', 10);
    const TotalScreening: number = Totalmovies * 8;
    // clean database if there are some data

    await prisma.$transaction([
        prisma.administrator.deleteMany({}),
        prisma.screening.deleteMany({}),
        prisma.movie.deleteMany({}),
        prisma.actor.deleteMany({}),
        prisma.cinema.deleteMany({}),
    ]);
    
    // Populate Administrator table
    await populateAdminAccount();
    console.log("Adding movies......")
    // Populate Movie and Actor table
    await populateDatabaseWithTrendingMovies(Totalmovies);
    console.log("Adding cinemas......")
    // Populate cinema table
    await populateCinema(TotalCinema)
    console.log("Adding screenings......")
    // Populate screening table
    populateScreenings(TotalScreening)
}

// Example usage
const seed = async () => {
    try {
        launchSeed()
    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {
      await prisma.$disconnect();
    }
};

seed()



