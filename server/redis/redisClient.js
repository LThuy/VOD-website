import { createClient } from 'redis';

const client = createClient({
    password: 'KScrfLH4h5VAAnvgqFBk7QIt5xlcBIu7',
    socket: {
        host: 'redis-10732.c291.ap-southeast-2-1.ec2.redns.redis-cloud.com',
        port: 10732
    }
});

client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
})();

export default client;
