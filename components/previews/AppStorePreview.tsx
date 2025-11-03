import type React from "react";
import { memo } from "react";
import type { PreviewProps } from "../../types/components";
import type { AppStoreData } from "../../types/parsers";
import { createGenericLinkPreview } from "./GenericLinkPreview";

const GenericPreview = createGenericLinkPreview<AppStoreData>();

export const AppStorePreview: React.FC<PreviewProps<AppStoreData>> = memo((props) => {
	const getStoreIcon = () => {
		switch (props.data.store) {
			case "apple": return "🍎";
			case "google": return "📱";
			default: return "📲";
		}
	};

	const getStoreName = () => {
		switch (props.data.store) {
			case "apple": return "App Store";
			case "google": return "Google Play";
			default: return "App Store";
		}
	};

	return (
		<GenericPreview
			{...props}
			title={getStoreName()}
			icon={getStoreIcon()}
			primaryLabel="View App"
			buildDetails={(data) => {
				const details = [];
				details.push({ label: "App ID", value: data.appId, icon: "🆔" });
				details.push({ label: "Store", value: getStoreName(), icon: getStoreIcon() });
				return details;
			}}
		/>
	);
});

AppStorePreview.displayName = 'AppStorePreview';


