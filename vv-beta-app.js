// VV-CONDUIT: Failover Logic
async function fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.status === 503) throw new Error('High Demand');
            return response;
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise(res => setTimeout(res, 2000 * (i + 1))); // Jitter
        }
    }
}