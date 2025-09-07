
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const usePaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancelled' | null>(null);

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      setPaymentStatus('success');
    } else if (payment === 'cancelled') {
      setPaymentStatus('cancelled');
    }
  }, [searchParams]);

  return paymentStatus;
};
