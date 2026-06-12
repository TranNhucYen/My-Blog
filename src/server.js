require('dotenv').config();

const path = require('path');
const app = require(path.join(__dirname, 'app'));
const { checkConnection } = require(path.join(__dirname, 'utils', 'database'));

process.on('unhandledRejection', (reason) => {
  console.error('>>> Unhandled Rejection:', reason?.message || reason);
});

const PORT = Number(process.env.PORT) || 3000;

const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : process.env.HOST || 'localhost';

checkConnection();

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});