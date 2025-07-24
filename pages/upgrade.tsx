import { Panel } from '@bigcommerce/big-design';
import { useEffect, useState } from 'react';
import ErrorMessage from '../components/error';
import Loading from '../components/loading';
import { useSession } from '../context/session';

const Upgrade = () => {
    const { context } = useSession();
    const [checkoutUrl, setCheckoutUrl] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (context) {
            fetch(`/api/billing?context=${context}`, { method: 'POST' })
                .then((res) => res.json())
                .then((data) => {
                    if (data.checkoutUrl) {
                        setCheckoutUrl(data.checkoutUrl);
                    } else {
                        setError('Unable to start billing checkout');
                    }
                })
                .catch((err) => setError(err.message));
        }
    }, [context]);

    if (error) {
        return <ErrorMessage error={{ message: error }} />;
    }

    if (!checkoutUrl) {
        return <Loading />;
    }

    return (
        <Panel>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <iframe src={checkoutUrl} style={{ width: '100%', height: '600px', border: 'none' }} />
        </Panel>
    );
};

export default Upgrade;
