const session = require('express-session');
const { RedisStore } = require('connect-redis');
const { createClient } = require('redis');

const isProd = process.env.NODE_ENV === 'production';

// Tạo Redis client
const redisClient = createClient({
    url: `redis://${(isProd ? process.env.PROD_REDIS_HOST : null) || process.env.REDIS_HOST || 'localhost'}:${(isProd ? process.env.PROD_REDIS_PORT : null) || process.env.REDIS_PORT || 6379}`,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) return new Error('Retry limit reached');
            return Math.min(retries * 50, 2000);
        }
    }
});

let isRedisConnected = false;

// Kết nối Redis
redisClient.connect().catch(() => {
    console.log('>>> Error connecting to Redis, session will use MemoryStore');
});

// Xử lý lỗi Redis
redisClient.on('error', (err) => {
    if (isRedisConnected) {
        console.error('>>> Redis disconnected or error:', err.message);
        isRedisConnected = false;
        console.log('>>> Application falling back to MemoryStore for sessions');
    }
});

// Thông báo khi kết nối thành công
redisClient.on('connect', () => {
    console.log('Redis connected successfully');
    isRedisConnected = true;
});

// Cấu hình session
const configSession = (app) => {
    const sessionOptions = {
        secret: (isProd ? process.env.PROD_SESSION_SECRET : null) || process.env.SESSION_SECRET || 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 // 1 hour
        }
    };

    // Tạo 2 loại session middleware
    const redisSession = session({
        ...sessionOptions,
        store: new RedisStore({
            client: redisClient,
            prefix: 'myapp:',
        })
    });

    const memorySession = session({
        ...sessionOptions,
        // MemoryStore là mặc định khi không truyền store
    });

    // Middleware trung gian để chọn store
    app.use((req, res, next) => {   
        if (isRedisConnected) {
            return redisSession(req, res, next);
        } else {
            return memorySession(req, res, next);
        }
    });
};

module.exports = configSession;