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

#### 2.1 - Generate client schema

```bash
npx prisma generate
```

### 3 - Run the webapp

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



## TODO

- [ ] Create seed ( admin, films, series, cine, .....) (1)
- [X] Create authentication api routes ( login + signin )
- [ ] Create login page
- [ ] Create film display page
- [ ] Create search page
- [ ] Create admin management dashboard
- [ ] Create api route for movies and search (2)