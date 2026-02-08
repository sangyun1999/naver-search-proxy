require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// 2. 모든 도메인에서 내 서버로의 접속을 허용합니다.
//app.use(cors()); 

	app.use(cors({
		origin: ['https://sangyun.pe.kr', 'http://dgs2024.ddns.net']
	}));

app.get('/search/proxy', async (req, res) => {
    const { query } = req.query;
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
		if (error.response) {
			console.error("Naver API Error:", error.response.data);
		} else {
			console.error("Server Error:", error.message);
		}
		res.status(500).json({ error: 'API 호출 실패', details: error.message });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));