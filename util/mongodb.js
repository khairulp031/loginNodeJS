const mongoose = require('mongoose');
mongoose.Promise = global.Promise
const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const startDB = async (DB_STR) => {
    await mongoose.connect(DB_STR, config)
    console.log('startDB', 'connected')
}

const stopDB = () => mongoose.connection.close()

module.exports = {
    startDB,
    stopDB
}
