// middleware/roleMiddleware.js
const RBAC = {
    roles: {
        citizen: {
            permissions: [
                'view:own:profile',
                'view:public:projects',
                'create:feedback'
            ]
        },
        investor: {
            permissions: [
                ...citizen.permissions,
                'view:investment:opportunities',
                'apply:project:funding'
            ]
        },
        admin: {
            permissions: [
                '*' // All permissions
            ]
        }
    },

    can(role, permission) {
        const rolePermissions = this.roles[role]?.permissions || [];
        return rolePermissions.includes(permission) || 
               rolePermissions.includes('*');
    }
};

function checkPermission(requiredPermission) {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (RBAC.can(userRole, requiredPermission)) {
            next();
        } else {
            res.status(403).json({ 
                message: 'Insufficient permissions' 
            });
        }
    };
}

module.exports = {
    RBAC,
    checkPermission
};