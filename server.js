require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.get('/search/proxy', async (req, res) => {
    const { query } = req.query;
    try {
        const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
            params: { query, display: 5 },
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('API 호출 실패');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));