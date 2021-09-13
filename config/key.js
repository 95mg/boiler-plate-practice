if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prodprod');
}
else {
    module.exports = require('./dev');
}