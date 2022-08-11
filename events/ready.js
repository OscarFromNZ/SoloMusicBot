module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        client.user.setActivity({
            name: "/help",
            type: "LISTENING"
        });
	},
};