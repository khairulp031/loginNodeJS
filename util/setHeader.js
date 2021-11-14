const nocache = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, must-revalidate');
    res.header('Expires', '-1');
    next();
}
const nohttp = (req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-XSS-Protection', '0');
    res.header('x-permitted-cross-domain-policies', 'none');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('referrer-policy', 'no-referrer');
    res.header('content-security-policy', "default-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Powered-By, csrf");
    res.header("Access-Control-Expose-Headers", "X-Powered-By, csrf");
    res.header("Access-Control-Max-Age", "86400");
    res.header('X-Frame-Options', 'SAMEORIGIN');
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
}

module.exports = {
    nocache,
    nohttp
}