require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

//	모든 도메인에서 내 서버로의 접속을 허용합니다.
//	app.use(cors()); 

app.use(cors({
	origin: ['https://sangyun.pe.kr', 'http://dgs2024.ddns.net']
}));

app.get('/search/proxy', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: '검색어가 필요합니다.' });

    try {
        let allItems = [];
        const display = 5; // 지역 검색 API 1회 최대치

        // 지역 검색은 start를 바꿔가며 요청해도 최대 20개까지만 허용됨 (1, 6, 11, 16)
        for (let start = 1; start <= 16; start += display) {
            const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
                params: { query, display, start, sort: 'comment' },
                headers: {
                    'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                    'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
                }
            });

            if (response.data.items) {
                allItems = allItems.concat(response.data.items);
            }
            
            // 결과가 더 이상 없으면 중단
            if (response.data.items.length < display) break;
        }

        res.json({
            lastBuildDate: new Date().toUTCString(),
            total: allItems.length,
            items: allItems
        });

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: 'API 호출 실패', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));