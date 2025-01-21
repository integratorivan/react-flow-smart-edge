module.exports = {
	addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
	typescript: {
		check: true
	},
	docs: {
		autodocs: true
	},
	framework: {
		name: "@storybook/react-webpack5",
		options: {}
	},
	core: {
		disableWhatsNewNotifications: true
	}
}
