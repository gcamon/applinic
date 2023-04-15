const verifyApi = (req,res,next) => {
	const authHeader = req.headers.authorization;
    if(authHeader) {
        const token = authHeader.split(" ")[1];
        if(token === process.env.API_AUTH_KEY){
        	next();
        } else {
        	return res.status(301).json("Permission denied!")
        }
    } else {
        return res.status(401).json("Authentication failed!")
    }
}

module.exports = verifyApi;