// server/src/index.js
  
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const Sentiment = require('sentiment');

const twitterClient = new TwitterApi(process.env.BEARER_TOKEN)
const readOnlyClient = twitterClient.readOnly

const app = express();
app.use(cors());
app.use(express.json());

const sentiment = new Sentiment()

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000

app.get('/tweets/:query', async(req, res) => {
    const query = req.params.query;
    try {

        const cacheKey = `tweets-${query}`
        const cachedData = cache.get(cacheKey)

        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
            console.log('Returning cached data for: ', query)
            return res.json(cachedData.data)
        }
        const tweetsResponse = await readOnlyClient.v2.search(query, {
            max_results: 10,
            'tweet.fields': ['created_at', 'public_metrics', 'text'],
            expansions: ['author_id'],
            'user.fields': ['username', 'name', 'profile_image_url']
        })
        const tweets = tweetsResponse.data.data;
        const tweetsWithSentiment = analyzeTweets(tweets);

        cache.set(cacheKey, {
            timestamp: Date.now(),
            data: tweetsWithSentiment
        })
        res.json({tweets, tweetsWithSentiment });
    } catch (error) {
        if (error.code === 429) {
            console.warn('Rate limit exceeded! Handing 429 error.')
            if (cache.has(query)) {
                console.log('Serving cached data due to rate limit: ', query)
                return res.json(cache.get(query).data)
            }

            return res.status(429).json({
                error: "Rate limit exceeded. Please try again later."
            })
        }
        console.error('Error fetching tweets:', error);
        res.status(500).json({ error: 'Failed to fetch tweets. '})
    }
})

const analyzeTweets = (tweets) => {
    const results = tweets.map((tweet) => {
        const text = tweet.text
        if (text) {         
            const tweetSentimentScore = sentiment.analyze(text).score
            console.log('tweetScore is: ', tweetSentimentScore)
            console.log('Comparative score is: ',sentiment.analyze(text).comparative)
            let tweetSentimentCategory
            if (tweetSentimentScore > 0) {
                tweetSentimentCategory = 'positive';
            } else if (tweetSentimentScore < 0) {
                tweetSentimentCategory = 'negative';
            } else {
                tweetSentimentCategory = 'neutral'
            }
            
            return {...tweet, sentimentScore: tweetSentimentScore, sentimentCategory: tweetSentimentCategory}
            
        } else {
            return null
        }
        })
    
    console.log(results)
    return results
    
}
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});