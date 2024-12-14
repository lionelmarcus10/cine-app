-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "ageLimit" INTEGER NOT NULL,
    "director" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Actor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Cinema" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Screening" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movieId" INTEGER NOT NULL,
    "cinemaId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "subtitle" TEXT NOT NULL,
    CONSTRAINT "Screening_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Screening_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "Cinema" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Administrator" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MovieActors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MovieActors_A_fkey" FOREIGN KEY ("A") REFERENCES "Actor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MovieActors_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Administrator_email_key" ON "Administrator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieActors_AB_unique" ON "_MovieActors"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieActors_B_index" ON "_MovieActors"("B");
