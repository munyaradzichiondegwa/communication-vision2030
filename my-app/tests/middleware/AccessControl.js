// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { checkPermission } = require('../middleware/roleMiddleware');
const ProjectController = require('../controllers/projectController');

router.get(
    '/', 
    checkPermission('view:public:projects'),
    ProjectController.listProjects
);

router.post(
    '/', 
    checkPermission('create:project'),
    ProjectController.createProject
);

router.put(
    '/:id', 
    checkPermission('update:own:project'),
    ProjectController.updateProject
);

router.delete(
    '/:id', 
    checkPermission('delete:own:project'),
    ProjectController.deleteProject
);

module.exports = router;