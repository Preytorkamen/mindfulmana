import { useEffect, useState } from 'react';

function QuoteWidget() {
    const [quote, setQuote] = useState('Loading your daily quote...');
    const [error,setError] = useState(null);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/quotes/random`
                );
                if (!res.ok) throw new Error('Failed to fetch quote');
                const data = await res.json();
                setQuote(data.quote);
            } catch (err) {
                setError('In the middle of every difficulty lies opportunity. - Albert Einstein');
                console.error(err);
            }
        };
        
        fetchQuote();
    }, []);

    if (error) return <h4>{error}</h4>;
    return <h4>{quote}</h4>;
}
 
export default QuoteWidget;