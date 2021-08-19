import pg from 'pg';
const { Client } = pg;

// set the way we will connect to the server
const pgConnectionConfigs = {
  user: 'en',
  host: 'localhost',
  database: 'cat_owners',
  port: 5432, // Postgres server always runs on this port
};

// create the var we'll use
const client = new Client(pgConnectionConfigs);

// make the connection to the server
client.connect();

// create the query done callback
const whenQueryDone = (error, result) => {
  // this error is anything that goes wrong with the query
  if (error) {
    console.log('error', error);
  } else {
    // rows key has the data
    console.log(result.rows);
  }

  // close the connection
  client.end();
};

// write the SQL query
let sqlQuery;
switch(process.argv[2]) {
  case('create-owner'): {
    console.log("creating owner");

    sqlQuery = `INSERT INTO owners (name) VALUES ('${process.argv[3]}') RETURNING *`;
    client.query(sqlQuery, whenQueryDone);
    break
  }
  // node index.js <OWNER_ID> <CAT_NAME>
  case('create-cat'): {
    if (process.argv.length === 5) {
      console.log ('creating cat with owner name')
      const owner = process.argv[3]
      const cat = process.argv[4]
      sqlQuery = `INSERT INTO cats (owner_id, name) VALUES ((SELECT id FROM owners WHERE owners.name = '${owner}'),'${cat}')`;
    }
    else {
    console.log("creating cat");
    sqlQuery = `INSERT INTO cats (owner_id, name) VALUES ('${process.argv[3]}', '${process.argv[4]}') RETURNING *`;
    }
    client.query(sqlQuery, whenQueryDone);
    break;
  }
  case('cats'): {
    console.log("Querying all cats");
    sqlQuery = 'SELECT * FROM cats';
    client.query(sqlQuery, (error, result) => {
      result.rows.forEach((cat, index)=>{
        const ownerQuery = `SELECT name FROM owners WHERE id=${cat.owner_id}`;
        client.query(ownerQuery, (error, ownerResult) => {
          if (error) throw error;

          if(index===result.rows.length-1){
            client.end();
          }       
        })
      })
    })
  }

  case('owners'): {
    console.log ("Querying owners and their cats");
    sqlQuery = 'SELECT owners.name AS owner_name, cats.name FROM owners INNER JOIN cats ON owners.id = cats.owner_id'
    client.query(sqlQuery, (error, result) => {
      if (error) throw error
      const ownerCatsObj = {}
      result.rows.forEach((x) => {
        const owner = x.owner_name;
        const cat = x.name;
        if (owner in ownerCatsObj) {
          ownerCatsObj[owner].push(cat)
        }
        else {
          ownerCatsObj[owner] = [cat]
        }
      }
    )
    console.log (ownerCatsObj)
    })
    break;
  }
  default:
    break;
}