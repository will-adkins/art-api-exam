# Art

A basic restful api to manage a list of famous art.

## Getting Started

This section is intended for developers.

### Clone the Repo

Sign into your github account and fork the repo at the following URL:

```
https://github.com/will-adkins/art-api-exam/blob/master/instructions.md#getting-started
```

Clone the repo and install its dependencies on your local machine by entering the following commands into your terminal:

```
:) git clone <url>
:) cd art-api-exam
:) npm install
```

### Environmental Variables

This API depends on several variables being present in its environment. To set yours up appropriately, create a **.env** file.

The required environmental variables are:

- `PORT` - The port within the local directory where the API is listening. Set the value to an unused port for your machine.
- `COUCH_HOSTNAME=https://{user}:{pwd}@{dbhostname}/` - Hostname for your database (only couchdb is supported at this time).
- `COUCH_DBNAME={dbname}` - The name of your art database.

**Example .env file**

```
PORT=5000
COUCH_HOSTNAME=https://user:pwd@bob.jrscode.cloud/
COUCH_DBNAME=art
```

### Load Data

To quickly fill your database with test data, simply run the following in the terminal:

`npm run load`

This will take the array of documents in the **load-data.js** and bulk add them into the database.

**Example test data:**

```
const paintings = [
  {
    _id: 'painting_starry_night',
    name: 'The Starry Night',
    type: 'painting',
    movement: 'post-impressionism',
    artist: 'Vincent van Gogh',
    yearCreated: 1889,
    museum: { name: 'Museum of Modern Art', location: 'New York' }
  },
  {
    _id: 'painting_water_lilies_nympheas',
    name: 'Water Lilies Nympheas',
    type: 'painting',
    movement: 'impressionism',
    artist: 'Claude Monet',
    yearCreated: 1907,
    museum: { name: 'Art Gallery of Ontario', location: 'Toronto' }
  }
]
```

### Start the API

To start the API on the designated port, run the following command:

`npm start`
