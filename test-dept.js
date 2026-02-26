const axios = require('axios');
async function test() {
    try {
        const loginRes = await axios.post('https://orbit-api-zw0b.onrender.com/api/v1/auth/login', { email: 'admin@gmail.com', password: 'password' });
        const token = loginRes.data?.data?.access_token || loginRes.data?.access_token;

        // Add auth header
        const reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        try {
            const res = await reqInstance.post('https://orbit-api-zw0b.onrender.com/api/v1/departments/', { name: 'New Dept 1', description: 'desc' });
            console.log('success departments/', res.status, res.data);
        } catch (e) {
            console.log('error departments/:', e.response?.status, JSON.stringify(e.response?.data));
        }

        try {
            const res = await reqInstance.post('https://orbit-api-zw0b.onrender.com/api/v1/departments/create', { name: 'New Dept 2', description: 'desc' });
            console.log('success departments/create', res.status, res.data);
        } catch (e) {
            console.log('error departments/create:', e.response?.status, JSON.stringify(e.response?.data));
        }

        try {
            const res = await reqInstance.post('https://orbit-api-zw0b.onrender.com/api/v1/departments', { name: 'New Dept 3', description: 'desc' });
            console.log('success departments', res.status, res.data);
        } catch (e) {
            console.log('error departments:', e.response?.status, JSON.stringify(e.response?.data));
        }
    } catch (e) {
        console.log('login error', e.response?.status, JSON.stringify(e.response?.data));
    }
}
test();
