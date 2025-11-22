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
                setError('Could not load a quote. Try a slow breath instead.');
                console.error(err);
            }
        };
        
        fetchQuote();
    }, []);

    if (error) return <p>{error}</p>;
    return <h4>{quote}</h4>;
}
 
export default QuoteWidget;