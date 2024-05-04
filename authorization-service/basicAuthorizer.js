const generatePolicy = (principalId, resource, effect) => ({
    principalId,
    policyDocument: {
        Version: "2012-10-17",
        Statement: [{
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: resource
        }]
    }
});

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
        console.log(plainCreds)
        const username = plainCreds[0];
        const password = plainCreds[1];
        console.log(username, password);
        const storedPassword = process.env[username];
        const resultStatus = !storedPassword ? 403: storedPassword ===password? 200 : 401;
        console.log(password, storedPassword)
        const effect = storedPassword && storedPassword === password? "Allow" : "Deny";
        const policy = generatePolicy(encodedCreds, event.methodArn, effect)
        cb(null, policy)
    } catch (e) {
        cb(`Unauthorized: ${e.message}`)
    }
}