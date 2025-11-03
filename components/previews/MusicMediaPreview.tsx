import type React from "react";
import { memo } from "react";
import type { PreviewProps } from "../../types/components";
import type { MusicMediaData } from "../../types/parsers";
import { createGenericLinkPreview } from "./GenericLinkPreview";

const GenericPreview = createGenericLinkPreview<MusicMediaData>();

export const MusicMediaPreview: React.FC<PreviewProps<MusicMediaData>> = memo((props) => {
	const getPlatformIcon = () => {
		switch (props.data.platform) {
			case "spotify": return "🎵";
			case "youtube": return "▶️";
			case "apple_music": return "🎧";
			case "soundcloud": return "☁️";
			default: return "🎶";
		}
	};

	const getPlatformName = () => {
		switch (props.data.platform) {
			case "spotify": return "Spotify";
			case "youtube": return "YouTube";
			case "apple_music": return "Apple Music";
			case "soundcloud": return "SoundCloud";
			default: return "Music";
		}
	};

	const getTypeName = () => {
		return props.data.type.charAt(0).toUpperCase() + props.data.type.slice(1);
	};

	return (
		<GenericPreview
			{...props}
			title={getPlatformName()}
			icon={getPlatformIcon()}
			primaryLabel="Open"
			buildDetails={(data) => {
				const details = [];
				details.push({ label: "Type", value: getTypeName(), icon: "📀" });
				details.push({ label: "Platform", value: getPlatformName(), icon: getPlatformIcon() });
				return details;
			}}
		/>
	);
});

MusicMediaPreview.displayName = 'MusicMediaPreview';


