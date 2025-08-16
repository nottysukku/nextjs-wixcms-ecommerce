"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Confetti from "react-confetti";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) return;

    const timer = setTimeout(() => {
      router.push("/orders/" + orderId);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [orderId, router]);

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-[calc(100vh-180px)]">
      <Confetti width={2000} height={1000} />
      <h1 className="text-6xl text-green-700">Successful</h1>
      <h2 className="text-xl font-medium">
        We sent the invoice to your e-mail
      </h2>
      <h3 className="">You are being redirected to the order page...</h3>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-6 items-center justify-center h-[calc(100vh-180px)]">
        <h1 className="text-6xl text-green-700">Success!</h1>
        <h2 className="text-xl font-medium">Processing your order...</h2>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage;
