const asyncHandler = require('../utils/asyncHandler');

exports.getUserInfo = asyncHandler(async (req, res) =>
{
    const user = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'admin',
    };

    res.status(200).json(user);
});
