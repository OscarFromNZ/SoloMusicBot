module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
        client.user.setActivity({
            name: "/help",
            type: "LISTENING"
        });
	},
};