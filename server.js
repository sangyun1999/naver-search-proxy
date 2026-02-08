// server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.get('/search/proxy', async (req, res) => {
    const { query } = req.query; // 검색어 (예: '강남역 맛집')
    try {
        const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
            params: { query, display: 5 },
            headers: {
                'X-Naver-Client-Id': 'n9sps6ygn5',
                'X-Naver-Client-Secret': 'pZFLVjOw6Q6mwMcZ2sxzbMgpbk7KYwoRJsQMOxsL'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('API 호출 실패');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
