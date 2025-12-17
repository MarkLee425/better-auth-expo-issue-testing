import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, Text, View } from "react-native";
import { authClient } from "@/lib/auth-client";
import { Button } from "heroui-native";

interface SocialConnectionsProps {
	onLoadingChange?: (isLoading: boolean) => void;
}

export function SocialConnections({
	onLoadingChange,
}: SocialConnectionsProps = {}) {
	const [showOptions, setShowOptions] = useState(false);

	const SOCIAL_CONNECTION_STRATEGIES = [
		{
			type: "constants.sso.google",
			source: <FontAwesome6 name="google" size={20} />,
			useTint: false,
		},
	] as const;
	const onSocialPress = async (
		provider: (typeof SOCIAL_CONNECTION_STRATEGIES)[number]["type"],
	) => {
		try {
			onLoadingChange?.(true);
			await authClient.signIn.social({
				provider: "google",
				callbackURL: Platform.select({
					ios: "my-better-t-app://",
					android: "my-better-t-app://",
					web: "my-better-t-app://",
				}),
			});
			onLoadingChange?.(false);
		} catch (error) {
			console.error("Social sign-in error:", error);
			onLoadingChange?.(false);
			if (error instanceof Error) {
				console.log("Error message:", error.message);
			}
		}
	};

	return (
		<View className="gap-2 w-full flex flex-col sm:flex-row">
			{SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
				return (
					<Button
						key={strategy.type}
						size="sm"
						onPress={async () => {
							onSocialPress(strategy.type);
						}}
						className="w-full sm:w-1/3"
					>
						<View className="flex-row flex items-center gap-3 w-[100px] justify-between sm:justify-center">
							{strategy.source}
							<View className="flex sm:hidden items-start justify-start text-left w-[70px]">
								<Text className="text-black font-medium">
									{strategy.type.charAt(0).toUpperCase() +
										strategy.type.slice(1)}
								</Text>
							</View>
						</View>
					</Button>
				);
			})}
		</View>
	);
}
