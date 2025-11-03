/**
 * Central export for all action handlers
 */

export { AppLinkHandler } from "./app-link-handler";
export { ContactHandler } from "./contact-handler";
export { EmailHandler } from "./email-handler";
export { EventHandler } from "./event-handler";
export { FIDOHandler } from "./fido-handler";
export { LocationHandler } from "./location-handler";
export { MeCardHandler } from "./mecard-handler";
export { PaymentHandler } from "./payment-handler";
export { PhoneHandler } from "./phone-handler";
export { SMSHandler } from "./sms-handler";
export { TelegramHandler } from "./telegram-handler";
export { TextHandler } from "./text-handler";
export { TOTPHandler } from "./totp-handler";
export { URLHandler } from "./url-handler";
export { WhatsAppHandler } from "./whatsapp-handler";
export { WiFiHandler } from "./wifi-handler";

// Generic handlers for new types
export {
	AppStoreHandler,
	EPCPaymentHandler,
	MusicMediaHandler,
	SocialMediaHandler,
	VideoConferenceHandler,
} from "./generic-link-handler";

