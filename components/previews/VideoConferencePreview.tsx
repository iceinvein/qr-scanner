import type React from "react";
import { memo } from "react";
import type { PreviewProps } from "../../types/components";
import type { VideoConferenceData } from "../../types/parsers";
import { createGenericLinkPreview } from "./GenericLinkPreview";

const GenericPreview = createGenericLinkPreview<VideoConferenceData>();

export const VideoConferencePreview: React.FC<PreviewProps<VideoConferenceData>> = memo((props) => {
	const getPlatformIcon = () => {
		switch (props.data.platform) {
			case "zoom": return "📹";
			case "meet": return "📞";
			case "teams": return "💼";
			case "webex": return "🎥";
			default: return "🎬";
		}
	};

	const getPlatformName = () => {
		switch (props.data.platform) {
			case "zoom": return "Zoom Meeting";
			case "meet": return "Google Meet";
			case "teams": return "Microsoft Teams";
			case "webex": return "Webex Meeting";
			default: return "Video Conference";
		}
	};

	return (
		<GenericPreview
			{...props}
			title={getPlatformName()}
			icon={getPlatformIcon()}
			primaryLabel="Join Meeting"
			buildDetails={(data) => {
				const details = [];
				if (data.meetingId) {
					details.push({ label: "Meeting ID", value: data.meetingId, icon: "🔢" });
				}
				if (data.password) {
					details.push({ label: "Password", value: "••••••", icon: "🔒" });
				}
				details.push({ label: "Platform", value: getPlatformName(), icon: getPlatformIcon() });
				return details;
			}}
		/>
	);
});

VideoConferencePreview.displayName = 'VideoConferencePreview';


