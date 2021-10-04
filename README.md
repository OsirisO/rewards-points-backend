# Rewards Points Backend

Web service that accepts HTTP requests and returns responses in JSON format. The codebase is written in NodeJS using the ExpressJS framework to create a web server. There is no durable storage for the transactions as they are stored in memory. To run the project you need node v14 and npm v7 and you can use Postman to invoke the HTTP endpoints.

## Get Started

### Clone this repository

```bash
$ git clone https://github.com/OsirisO/rewards-points-backend.git
```

### Install npm dependencies

```bash
npm install
```

### Run locally

```bash
npm run start
```

Press CTRL + C to stop the process.

## Endpoint Documentation

The node server listens on http://localhost:3000.

| operation         | http method | endpoint      | payload / response                                                           |
| ----------------- | ----------- | ------------- | ---------------------------------------------------------------------------- |
| Add transaction   | POST        | /transaction  | `{ "payer": "DANNON", "points": 1000, "timestamp": "2021-11-11T15:00:00Z" }` |
| List transactions | GET         | /transaction  | `[ { ...transaction1 }, { ...transaction2 } ]`                               |
| Spend points      | PUT         | /spend-points | `{ "points": 5000 }`                                                         |
| Check balance     | GET         | /balance      | `{ "DANNON": 100, "UNILEVER": 1000 }`                                        |
