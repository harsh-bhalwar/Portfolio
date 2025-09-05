const basicAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.setHeader("WWW-Authenticate", 'Basic realm="Protected"');
        return res.status(401).json({ error: "Authentication required" });
    }

    // match "Basic <token>" case-insensitively and capture token
    const match = authHeader.match(/^Basic\s+(.+)$/i);
    if (!match) {
        res.setHeader("WWW-Authenticate", 'Basic realm="Protected"');
        return res.status(401).json({ error: "Invalid authentication scheme" });
    }

    const base64Credentials = match[1];

    let decoded;
    try {
        decoded = Buffer.from(base64Credentials, "base64").toString("utf-8");
    } catch (err) {
        return res.status(400).json({ error: "Malformed credentials" });
    }

    // split only on the first colon to allow colons in the password
    const idx = decoded.indexOf(":");
    if (idx === -1) {
        return res.status(400).json({ error: "Malformed credentials" });
    }

    const username = decoded.slice(0, idx);
    const password = decoded.slice(idx + 1);

    // now compare with your .env values (don't log username/password!)
    if (
        username === process.env.USERNAME &&
        password === process.env.PASSWORD
    ) {
        return next();
    }

    // correct scheme but wrong credentials
    return res.status(403).json({ error: "Invalid credentials" });
};

export default basicAuth;
