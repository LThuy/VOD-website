// const validatePaginationParams = (req, res, next) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 24;
    
//     if (page < 1) {
//         return res.status(400).json({ error: 'Page number must be greater than 0' });
//     }
    
//     if (limit < 1 || limit > 100) {
//         return res.status(400).json({ error: 'Limit must be between 1 and 100' });
//     }
    
//     req.pagination = { page, limit };
//     next();
// };

// export default validatePaginationParams;