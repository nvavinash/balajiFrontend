import jwt from 'jsonwebtoken';

// Middleware to authenticate user token
const authUser = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Middleware to authenticate admin token
const authAdmin = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check for admin role in the decoded token
        if (token_decode.role !== 'admin') {
            return res.json({ success: false, message: 'Not Authorized. Admin Access Required' });
        }

        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { authUser, authAdmin };
