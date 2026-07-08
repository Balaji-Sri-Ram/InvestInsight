const express = require('express');
const router = express.Router();
const researchController = require('../controllers/research.controller');

// POST /api/research/generate
router.post('/generate', researchController.generateResearch);

// GET /api/research
router.get('/', researchController.getAllResearch);

// GET /api/research/:id
router.get('/:id', researchController.getResearchById);

module.exports = router;
