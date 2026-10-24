export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages } = req.body;

        // Call DeepSeek API securely using the environment variable
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat", // DeepSeek Pro model
                messages: messages,
                stream: false
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return res.status(response.status).json({ error: errData.error?.message || 'DeepSeek API error' });
        }

        const data = await response.json();
        
        // Return the DeepSeek response back to your frontend HTML
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to communicate with DeepSeek API' });
    }
}
