// Reuse the loaded record and keep updates/deletes tied to the signed-in owner.
module.exports = function requireOwner(loadRecord) {
    return async (req, res, next) => {
        try {
            const record = await loadRecord(req.params.id);
            if (!record) return res.status(404).json({ error: 'Not found' });
            if (String(record.user_id) !== String(req.user.id)) return res.status(403).json({ error: 'This item belongs to another account' });
            req.record = record;
            next();
        } catch (err) {
            if (err.message?.includes('404')) return res.status(404).json({ error: 'Not found' });
            next(err);
        }
    };
};
