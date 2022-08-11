module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        console.log("readayyy");
        client.user.setActivity({
            name: "/help",
            type: "LISTENING"
        });
	},
};