'use client';
export default function MonnifyButton({ qr }: { qr: any }) {
  const init = async () => {
    const gross = qr.amount * 1.01;
    const res = await fetch('/api/monnify/create', {
      method: 'POST',
      body: JSON.stringify({ qrId: qr.id, amount: gross }),
    });
    const { checkoutUrl } = await res.json();
    window.location.href = checkoutUrl;
  };

  return <button onClick={init} className="bg-green-600 text-white py-3 px-8 rounded-lg">Pay with Monnify</button>;
}