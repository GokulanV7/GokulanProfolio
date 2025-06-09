interface EmailJS {
  init: (publicKey: string) => void;
  send: (
    serviceId: string,
    templateId: string,
    templateParams: Record<string, any>
  ) => Promise<{ text: string }>;
}

declare global {
  interface Window {
    emailjs?: EmailJS;
  }
}

export {};
