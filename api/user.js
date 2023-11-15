const axios = require('axios');

async function getOnline() {
    const url = "http://localhost:3000/user/getOnline"
    const resp = await axios.get(url)
    return resp.data
}
module.exports = {
    getOnline
}