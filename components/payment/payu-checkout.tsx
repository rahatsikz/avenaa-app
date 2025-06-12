// import PayUBizSdk from "payu-non-seam-less-react";
import React, { useEffect, useRef } from "react";
import { NativeEventEmitter } from "react-native";

export type PayUCheckoutProps = {
  payUPaymentParams: any;
  payUCheckoutProConfig?: any;
  onSuccess: (data: any) => void;
  onFailure: (data: any) => void;
  onCancel: (data: any) => void;
  onError: (data: any) => void;
  onGenerateHash: (e: any, callback: (hash: string) => void) => void;
  triggerPayment: boolean;
};

export const PayUCheckout: React.FC<PayUCheckoutProps> = ({
  payUPaymentParams,
  payUCheckoutProConfig,
  onSuccess,
  onFailure,
  onCancel,
  onError,
  onGenerateHash,
  triggerPayment,
}) => {
  const eventEmitterRef = useRef<NativeEventEmitter | null>(null);
  console.log("payUPaymentParams", payUPaymentParams);
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter();
    eventEmitterRef.current = eventEmitter;

    const paymentSuccess = eventEmitter.addListener(
      "onPaymentSuccess",
      onSuccess
    );
    const paymentFailure = eventEmitter.addListener(
      "onPaymentFailure",
      onFailure
    );
    const paymentCancel = eventEmitter.addListener("onPaymentCancel", onCancel);
    const error = eventEmitter.addListener("onError", onError);
    const generateHash = eventEmitter.addListener("generateHash", (e) => {
      onGenerateHash(e, (hashValue) => {
        const result = { [e.hashName]: hashValue };
        // PayUBizSdk.hashGenerated(result);
      });
    });

    return () => {
      paymentSuccess.remove();
      paymentFailure.remove();
      paymentCancel.remove();
      error.remove();
      generateHash.remove();
    };
  }, [onSuccess, onFailure, onCancel, onError, onGenerateHash]);

  useEffect(() => {
    if (triggerPayment) {
      const paymentObject = {
        payUPaymentParams,
        payUCheckoutProConfig: payUCheckoutProConfig || {},
      };
      try {
        // PayUBizSdk.openCheckoutScreen(paymentObject);
      } catch (err) {
        console.error("Error opening PayU checkout screen:", err);
      }
    }
  }, [triggerPayment, payUPaymentParams, payUCheckoutProConfig]);

  return null;
};
