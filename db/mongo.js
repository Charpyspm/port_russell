const mongoose = require('mongoose');

const clientOptions = {
    dbName : 'PortRussell'
};

exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('Connected to mongo');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}