// components/payment/CheckoutButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
  planType: string;
  label: string;
  className?: string;
}

export default function CheckoutButton({ planType, label, className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Грешка при плащане');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        router.push(data.url);
      } else {
        // Load Stripe dynamically
        const { loadStripe } = await import('@stripe/stripe-js');
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });

          if (error) {
            console.error('Stripe redirect error:', error);
          }
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Възникна грешка. Опитайте отново.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={className || 'px-6 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] disabled:opacity-50'}
    >
      {loading ? 'Зареждане...' : label}
    </button>
  );
}