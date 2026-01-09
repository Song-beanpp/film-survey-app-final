const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Only load .env file in local development (not on Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    require('dotenv').config();
    console.log('📁 Loaded .env file for local development');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
console.log('🔍 MONGODB_URI loaded:', uri ? `${uri.substring(0, 25)}...` : 'NOT FOUND');
console.log('🔍 Environment check:', process.env.MONGODB_URI ? 'EXISTS' : 'MISSING');
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    // Increase timeouts for MongoDB Free Tier (M0) cold starts
    connectTimeoutMS: 60000,    // 60 seconds instead of default 30s
    socketTimeoutMS: 60000,      // 60 seconds for socket operations
    serverSelectionTimeoutMS: 60000  // 60 seconds to select a server
});

let db;
let responsesCollection;
let isConnecting = false;
let isConnected = false;

// Connect to MongoDB with connection state management
async function connectDB() {
    // If already connected, return
    if (isConnected) {
        return true;
    }

    // If stuck connecting, reset after check
    if (isConnecting) {
        console.log('⏳ Connection already in progress, skipping...');
        return false;
    }

    isConnecting = true;
    console.log('🔄 Attempting MongoDB connection...');

    // Set timeout to reset stuck state
    const timeout = setTimeout(() => {
        if (isConnecting) {
            console.log('⏰ Connection timeout - resetting');
            isConnecting = false;
        }
    }, 50000); // 50 second timeout

    try {
        await client.connect();
        clearTimeout(timeout);
        console.log('✅ Connected to MongoDB successfully!');

        db = client.db('film-survey');
        responsesCollection = db.collection('responses');

        // Create indexes for better performance
        await responsesCollection.createIndex({ timestamp: -1 });
        await responsesCollection.createIndex({ id: 1 }, { unique: true });

        isConnected = true;
        isConnecting = false;
        return true;

    } catch (error) {
        clearTimeout(timeout);
        console.error('❌ MongoDB connection error:', error.name, error.message);
        console.log('⚠️  Falling back to local JSON storage');
        isConnecting = false;
        isConnected = false;
        return false;
    }
}

// Get all responses (for admin view)
app.get('/api/responses', async (req, res) => {
    try {
        // Ensure MongoDB connection before querying
        if (!isConnected) {
            console.log('🔄 MongoDB not connected, attempting to connect...');
            await connectDB();
        }

        if (responsesCollection) {
            console.log('📊 Fetching responses from MongoDB...');
            const responses = await responsesCollection.find({}).sort({ timestamp: -1 }).toArray();
            console.log(`✅ Found ${responses.length} responses`);
            res.json({ responses });
        } else {
            console.log('⚠️ MongoDB collection not available');
            res.json({ responses: [] });
        }
    } catch (error) {
        console.error('❌ Error fetching responses:', error);
        res.status(500).json({ error: 'Failed to read responses', details: error.message });
    }
});

// Submit new response
app.post('/api/submit', async (req, res) => {
    try {
        console.log('📥 Received submission request');

        // Ensure MongoDB connection before saving - with retry
        let connectionAttempts = 0;
        const maxAttempts = 3;

        while (!isConnected && connectionAttempts < maxAttempts) {
            connectionAttempts++;
            console.log(`🔄 Attempt ${connectionAttempts}: Connecting to MongoDB...`);
            const connected = await connectDB();
            if (connected) {
                console.log('✅ MongoDB connection established');
                break;
            }
            // Wait a bit before retry
            if (connectionAttempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        const newResponse = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...req.body
        };

        // Check if we have MongoDB connection
        if (isConnected && responsesCollection) {
            // Save to MongoDB
            console.log(`📝 Saving response to MongoDB (ID: ${newResponse.id})`);
            const result = await responsesCollection.insertOne(newResponse);
            console.log(`✅ Response saved to MongoDB (ID: ${newResponse.id}, MongoDB ID: ${result.insertedId})`);

            res.json({
                success: true,
                message: '问卷提交成功！感谢您的参与！\nThank you for your participation!',
                saved: 'mongodb'
            });
        } else {
            // MongoDB not available - this will fail in Vercel
            console.error('❌ MongoDB not connected and JSON fallback not available in Vercel');
            throw new Error('Database connection unavailable');
        }

    } catch (error) {
        console.error('❌ Error saving response:', error.name, error.message);
        console.error('   Full error:', error);
        console.error('   Connection status - isConnected:', isConnected, 'hasCollection:', !!responsesCollection);

        res.status(500).json({
            error: 'Failed to save response',
            details: error.message,
            hint: 'Please try again in a moment'
        });
    }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
    try {
        // Ensure MongoDB connection before querying
        if (!isConnected) {
            console.log('🔄 MongoDB not connected, attempting to connect...');
            await connectDB();
        }

        if (responsesCollection) {
            const total = await responsesCollection.countDocuments();

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todayCount = await responsesCollection.countDocuments({
                timestamp: { $gte: today.toISOString() }
            });

            // Get film watch statistics (using new film IDs)
            const filmStats = await responsesCollection.aggregate([
                {
                    $group: {
                        _id: null,
                        zootopia: { $sum: { $cond: [{ $eq: ['$zootopia_watched', 'yes'] }, 1, 0] } },
                        frozen2: { $sum: { $cond: [{ $eq: ['$frozen2_watched', 'yes'] }, 1, 0] } },
                        mulan: { $sum: { $cond: [{ $eq: ['$mulan_watched', 'yes'] }, 1, 0] } },
                        greenbook: { $sum: { $cond: [{ $eq: ['$greenbook_watched', 'yes'] }, 1, 0] } },
                        kungfupanda3: { $sum: { $cond: [{ $eq: ['$kungfupanda3_watched', 'yes'] }, 1, 0] } }
                    }
                }
            ]).toArray();

            res.json({
                total,
                today: todayCount,
                filmStats: filmStats[0] || {}
            });
        } else {
            res.json({ total: 0, today: 0, filmStats: {} });
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Export responses as CSV
app.get('/api/export/csv', async (req, res) => {
    try {
        let responses = [];

        if (responsesCollection) {
            responses = await responsesCollection.find({}).sort({ timestamp: -1 }).toArray();
        } else {
            const fs = require('fs').promises;
            const path = require('path');
            const dataFile = path.join(__dirname, 'survey-responses.json');

            try {
                const data = await fs.readFile(dataFile, 'utf8');
                const surveyData = JSON.parse(data);
                responses = surveyData.responses || [];
            } catch {
                return res.status(404).send('No responses to export');
            }
        }

        if (responses.length === 0) {
            return res.status(404).send('No responses to export');
        }

        // Create CSV content
        const headers = Object.keys(responses[0]).join(',');
        const rows = responses.map(response =>
            Object.values(response).map(val => {
                if (val === null || val === undefined) return '';
                const str = String(val);
                return `"${str.replace(/"/g, '""')}"`;
            }).join(',')
        );

        const csv = [headers, ...rows].join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=survey-responses-${new Date().toISOString().split('T')[0]}.csv`);
        res.send('\uFEFF' + csv); // Add BOM for Excel compatibility

    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ error: 'Failed to export responses' });
    }
});

// Debug endpoint
app.get('/api/debug-env', (req, res) => {
    res.json({
        hasMongoUri: !!process.env.MONGODB_URI,
        uriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
        uriStart: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'NOT SET',
        isVercel: !!process.env.VERCEL,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        isConnected,
        isConnecting,
        hasClient: !!client,
        hasDb: !!db,
        hasCollection: !!responsesCollection
    });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    // Try to connect if not connected
    if (!isConnected) {
        await connectDB();
    }

    res.json({
        status: 'ok',
        mongodb: isConnected && responsesCollection ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Initialize MongoDB connection (async, don't wait)
connectDB().catch(err => console.error('Initial connection failed:', err));

// Export the Express app for Vercel
module.exports = app;

