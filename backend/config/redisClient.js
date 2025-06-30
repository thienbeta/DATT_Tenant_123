const Redis = require('ioredis');

let redisClient;

try {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => Math.min(times * 50, 2000),
    maxRetriesPerRequest: 3,
    enableOfflineQueue: false
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

  // Thêm phương thức setex an toàn
  const originalSetex = redisClient.setex;
  redisClient.setex = async function(key, seconds, value) {
    try {
      return await originalSetex.call(this, key, seconds, value);
    } catch (error) {
      console.error('Redis setex error:', error);
      // Không ném lỗi, chỉ ghi log
      return null;
    }
  };

  // Thêm phương thức get an toàn
  const originalGet = redisClient.get;
  redisClient.get = async function(key) {
    try {
      return await originalGet.call(this, key);
    } catch (error) {
      console.error('Redis get error:', error);
      // Không ném lỗi, chỉ ghi log
      return null;
    }
  };

} catch (error) {
  console.error('Redis initialization error:', error);
  // Tạo một đối tượng giả lập Redis để ứng dụng vẫn hoạt động
  redisClient = {
    setex: async () => null,
    get: async () => null,
    on: () => {}
  };
}

module.exports = redisClient;