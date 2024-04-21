module.exports.basicAuthorizer = (event, ctx, cb) => {
    console.log(JSON.stringify(event))
    if (event["type" !== "TOKEN"]) {
        cb("Unauthorized");
    }
    try {
        const token = event.authorizationToken;
        const encodedCreds = token.split(" ")[1]
        const buff = Buffer.from(encodedCreds, "base64");
        const plainCreds = buff.toString('utf-8').split(":");
        const username = plainCreds[0];
        const password = plainCreds[1];
        console.log(username, password);
        const storedPassword = process.env[username];
        const result = 
        

    } catch (e) {
        cb(`Unauthorized: ${e.message}`)
    }
}