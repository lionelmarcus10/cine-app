# Cine-app

## Technos

- Nextjs
- Prisma orm ( to query sqlite database)
- ShadcnUi and TailwindCSS
- bcryptjs (encrypt password)
- jose (encode jwt)

### Run project

### 1- Install dependencies

Go on `cine-app > bzbz` and run 

```bash
npm i
```

### 2 - Generate prisma client schema

Go on `cine-app > bzbz` and run 

#### 2.1 - Pull database

```bash
npx prisma db pull
```

#### 2.2 - Generate client schema

```bash
npx prisma generate
```


#### 2.3 - Seed the database

- You could change the number of movies and cinema in `.env` file once you create it in the next section

|variable|meanings|
|--------|--------|
|TOTAL_MOVIES| number of movies to create during the seed|
|TOTAL_CINEMA| number of cinema to create during the seed|



```bash
npm run seed
```



### 3 - Run the webapp

### 3.1 - Add `.env`

- Copy the file `.env.exemple` on a new file `.env` 
- Populate it with the environment values ( ask a member)

### 3.2 - Run app

Go on `cine-app > bzbz` and run 

```bash
npm run dev
```

The app will be visible on localhost:3000


### 4- Run the database viewer


Open new tab and go on `cine-app > bzbz` and run 

```bash
npx prisma studio
```

The studio will be visible on localhost:5555

## Web app paths

après avoir lancé l'application web, vous pouvez visiter les liens suivant qui sont disponible

`localhost:3000/unauthorized` => '( Page sur laquelle sont redirigé les visiteurs qui n'ont pas de droit et veulent acceder à des fonctionnalités admin)
`localhost:3000/admin-dashboard` => (Dashboard admin pour créer des films et les gérer)
`localhost:3000/movies/slug-of-film` => (page de visualisation détaillé des infos d'un film)
`localhost:3000/` => page d'accueil et de recherche des filmes (possiblement)
`localhost:3000/authentication` => (page d'authentification et de création de compte admin)
``

Leur code est dans `cine-app > bzbz > app > (website) > <dossier> > page.tsx`

> Risque de ne pas pouvoir accéder à `localhost:3000/admin-dashboard` car vous avoir un token jwt dans vos cookies ( la documentation sera faite ultérieurement)

## TODO

- [ ] Create api route for movies crud and search 
- [ ] Create login/signup page
- [ ] Create film details display page
- [ ] Create search page
- [ ] Create admin management dashboard