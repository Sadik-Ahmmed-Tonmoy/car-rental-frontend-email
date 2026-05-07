/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { verifyPaymentSession } from "@/actions/verify-payment";
import { Button } from "@/components/ui/buttons/button";
import { useCreateAdvertisementMutation } from "@/redux/features/advertisements/advertisementsApi";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { CheckCircle, Loader2, Mail, Receipt, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PaymentData {
  paymentStatus: string;
  customerEmail?: string;
  amountTotal?: number;
  currency?: string;
  lineItems?: any[];
}

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = useAppSelector(selectCurrentToken);
  const {
    data: userData,
    isLoading: isLoadingUser,
    isSuccess: isUserDataFetched,
  } = useGetMeQuery(undefined, {
    skip: !token,
  });
  const [createAdvertisement] = useCreateAdvertisementMutation();

  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // const userId = searchParams.get("userId");
  // const pricePaid = searchParams.get("pricePaid");
  const packageId = searchParams.get("packageId");
  const priceId = searchParams.get("priceId");
  const name = searchParams.get("name");
  const duration = searchParams.get("duration");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const vehicleId = searchParams.get("vehicleId");
  const selectedSellingPriceRange = searchParams.get(
    "selectedSellingPriceRange"
  );
  const sellerType = searchParams.get("sellerType");
  const vehicleType = searchParams.get("vehicleType");

  useEffect(() => {
    async function fetchPaymentData() {
      if (!sessionId && !userData) {
        setError("No session ID provided");
        setLoading(false);
        return;
      }

      try {
        const result = await verifyPaymentSession(sessionId as string);
        if (result.success) {
          await setPaymentData({
            paymentStatus: result.paymentStatus ?? "",
            customerEmail: result.customerEmail ?? "",
            amountTotal: result.amountTotal ?? 0,
            currency: result.currency ?? "",
            lineItems: result.lineItems ?? [],
          });

          await handleAsyncWithToast(async () => {
            await createAdvertisement({
              userId: userData?.data?.id,
              pricePaid:
                result.amountTotal != null ? result.amountTotal / 100 : 0,
              currency: result.currency,
              packageId,
              priceId,
              name,
              duration,
              startDate,
              endDate,
              selectedSellingPriceRange: selectedSellingPriceRange || "",
              sellerType: sellerType || "",
              vehicleType: vehicleType || "",
              stripePaymentId: sessionId,
            });
          }, false);
        } else {
          setError(result.error || "Payment verification failed");
        }
      } catch {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    if (!isLoadingUser && isUserDataFetched) {
      fetchPaymentData();
    }
  }, [sessionId, isLoadingUser]);

  const formatAmount = (amount?: number, currency?: string) => {
    if (!amount || !currency) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600 text-center">
              Please wait while we verify your payment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col items-center justify-center p-8">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Error
            </h1>
            <p className="text-gray-600 text-center mb-6">
              {error ||
                "We encountered an issue processing your payment. Please contact support."}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPaymentSuccessful = paymentData.paymentStatus === "paid";

  return (
    <div
      className={`min-h-[calc(100vh-170px)] ${
        isPaymentSuccessful ? "" : "bg-gradient-to-br from-red-50 to-orange-50"
      } flex items-center justify-center p-4`}
    >
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Success/Failure Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="text-center pt-8 pb-4 px-6">
            {isPaymentSuccessful ? (
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
            )}
            <h1 className="text-3xl font-bold text-gray-900">
              {isPaymentSuccessful ? "Payment Successful!" : "Payment Failed"}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {isPaymentSuccessful
                ? "Thank you for your purchase. Your payment has been processed successfully."
                : "We were unable to process your payment. Please try again."}
            </p>
          </div>

          <div className="px-6 pb-8 space-y-6">
            {isPaymentSuccessful && (
              <>
                {/* Payment Details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium ml-2">
                        {formatAmount(
                          paymentData.amountTotal,
                          paymentData.currency
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium ml-2 text-green-600 capitalize">
                        {paymentData.paymentStatus}
                      </span>
                    </div>
                    {paymentData.customerEmail && (
                      <div className="md:col-span-2">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium ml-2">
                          {paymentData.customerEmail}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-3">
                    <Mail className="h-5 w-5" />
                    What&#39;s Next?
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        A confirmation email has been sent to your email address
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        You&#39;ll receive access details within the next few
                        minutes
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        Check your spam folder if you don&#39;t see the email
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {isPaymentSuccessful ? (
                <>
                  {/* <Button asChild className="flex-1">
                    <Link href="/dashboard" className="flex items-center justify-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button> */}
                  {/* minPrice: carMinPrice,
      maxPrice: carMaxPrice,
      sellerType: sellerType,
      vehicleType: vehicleType, */}
                  {/* <Button
                    variant="outline"
                    asChild
                    className="flex-1 bg-transparent"
                  > */}
                  <Link
                    href={`/find-your-car?sessionId=${sessionId}&priceId=${priceId}&sellerType=${sellerType}&vehicleType=${vehicleType}&vehicleId=${vehicleId}`}
                    className="w-full"
                  >
                    {/* <span className="flex items-center gap-2">
                        Find Your Car
                      </span> */}
                    <button className="border border-blue-primary  text-sm font-semibold px-6 py-3 hover:bg-blue-400 rounded-md w-full bg-blue-primary text-white transition-colors cursor-pointer">
                      Add Car Listing
                    </button>
                  </Link>
                  {/* </Button> */}
                </>
              ) : (
                <>
                  <Button asChild className="flex-1">
                    <Link href="/checkout">Try Again</Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="flex-1 bg-transparent"
                  >
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
