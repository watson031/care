
const { Pool } = require('pg')

let client = {}
let pool = {}
async function connect () {
    const connectionString = 'postgres://jkkkzqsxaxwqst:5c8b42b674893998561068fb8a3ef908b154d22053857bd92ebc5937b7533dac@ec2-3-211-37-117.compute-1.amazonaws.com:5432/dcg0jkkmkd0vhq'
    pool = new Pool({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    })
    client = await pool.connect()
}

async function query (query, values, resultCallback) {
    console.log(values)
    await client.query(query, values)
        .then(result => {
            console.log('quering...')
            resultCallback(result)
        }).catch(err => {
            throw new Error(err)
        })
    // const result = await client.query('SELECT * FROM user_garage')
    // console.log('ERRR', err)
}

function disconnect () {
    client.end()
}

module.exports = {
    connect: connect,
    disconnect: disconnect,
    query: query
}
