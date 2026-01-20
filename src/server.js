require('dotenv').config();
const path = require('path');
const app = require(path.join(__dirname, 'app'));

const isProd = process.env.NODE_ENV === 'production';
const PORT = (isProd ? process.env.PROD_PORT : null) || process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
