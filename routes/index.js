const express = require('express');
const router = express.Router();

const hueLights = require('./lights/hue.js');

// Lights related

// Hue Admin
router.get('/getBridgeDetails', hueLights.hueLights.displayBridge);
router.post('/createGroup', hueLights.hueLights.createGroup);
router.get('/deleteGroup/:groupId', hueLights.hueLights.deleteGroup);
router.get('/allGroups', hueLights.hueLights.allGroups);
router.get('/registerNewBridgeUser', hueLights.hueLights.registerNewBridgeUser);
router.get('/getBridgeConfig', hueLights.hueLights.getBridgeConfig);
router.get('/completeBridgeState', hueLights.hueLights.completeBridgeState);
router.get('/listAvailableLights', hueLights.hueLights.listAvailableLights);
// Hue Controls
router.get('/toggleLights/:roomId', hueLights.hueLights.toggleLights);
router.get('/lightBrightness/:roomId/:brightness', hueLights.hueLights.lightBrightness);
router.get('/toggleGroup/:groupId', hueLights.hueLights.toggleGroup);

module.exports = router;