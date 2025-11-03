import type React from "react";
import { memo } from "react";
import type { PreviewProps } from "../../types/components";
import type { SocialMediaData } from "../../types/parsers";
import { createGenericLinkPreview } from "./GenericLinkPreview";

const GenericPreview = createGenericLinkPreview<SocialMediaData>();

export const SocialMediaPreview: React.FC<PreviewProps<SocialMediaData>> = memo((props) => {
	const getPlatformIcon = () => {
		switch (props.data.platform) {
			case "instagram": return "📸";
			case "twitter": return "🐦";
			case "linkedin": return "💼";
			case "facebook": return "👥";
			case "tiktok": return "🎵";
			case "youtube": return "📺";
			case "snapchat": return "👻";
			default: return "👤";
		}
	};

	const getPlatformName = () => {
		const name = props.data.platform.charAt(0).toUpperCase() + props.data.platform.slice(1);
		return name === "Youtube" ? "YouTube" : name === "Linkedin" ? "LinkedIn" : name === "Tiktok" ? "TikTok" : name === "Snapchat" ? "Snapchat" : name;
	};

	return (
		<GenericPreview
			{...props}
			title={getPlatformName()}
			icon={getPlatformIcon()}
			primaryLabel="Open Profile"
			buildDetails={(data) => {
				const details = [];
				if (data.username) {
					details.push({ label: "Username", value: `@${data.username}`, icon: "👤" });
				}
				details.push({ label: "Platform", value: getPlatformName(), icon: getPlatformIcon() });
				return details;
			}}
		/>
	);
});

SocialMediaPreview.displayName = 'SocialMediaPreview';


