'use strict';

const util = require('../../util/general');
const logger = require('../../util/logger');
const hue = require('node-hue-api');
const hueApi = hue.HueApi;
const config = require('../../config.json');
const _ = require('lodash');

const hueLights = {

  /**
   * Display availablie bridges on network
   * @param req
   * @param res
   */
  displayBridge: (req, res) => {
    hue.nupnpSearch(function(err, result) {
      if (err) {
        logger.warn(err);
        throw err;
      }
      logger.info({'Message': 'Available Bridges in network', 'Bridges': result});
      res.end();
    });
  },

  /**
   * Register a new user in the Hue Bridge
   * @param req
   * @param res
   */
  registerNewBridgeUser: (req, res) => {
    const hueApp = new hueApi;
    hueApp.registerUser(config.hue.bridgeIp, (err, user) => {
      if (err) {
        logger.warn(err);
        throw err;
      }
      logger.info({'Message': 'Register New Bridge User', 'Bridge User': user});
      res.end();
    });
  },

  /**
   * Bridge Configuration
   * @param req
   * @param res
   */
  getBridgeConfig: (req, res) => {
    const hueApp = new hueApi(config.hue.bridgeIp, config.hue.user);
    hueApp.config((err, config) => {
      if (err) {
        logger.warn(err);
        throw err;
      }
      logger.info({'Message': 'Bridge Configuration', 'Bridge Configuration': config});
      res.end();
    });
  },

  /**
   * Obtaining the Complete State of the Bridge
   * @param req
   * @param res
   */
  completeBridgeState: (req, res) => {
    const hueApp = new hueApi(config.hue.bridgeIp, config.hue.user);
    hueApp.fullState((err, config) => {
      if (err) {
        logger.warn(err);
        throw err;
      }
      logger.info({'Message': 'Complete Bridge State', 'Bridge State': config});
      res.end();
    });
  },

  /**
   * Creates New Group
   * @param req
   * @param res
   */
  createGroup: (req, res) => {
    const hueApp = new hueApi(config.hue.bridgeIp, config.hue.user);
    const groupName = req.body.groupName;
    console.log(req.body);
    let rooms = req.body.roomIds.split(',');
    let newRooms = [];
    _(rooms).forEach((value) => {
      newRooms.push(parseInt(value.trim()));
    });

    res.end();
    hueApp.createGroup(groupName, newRooms, (err, result) => {
      if (err) {
        logger.warn(err);
        throw err;
      }
      logger.info({'Message': 'New Group Created', 'Group Id': result});
      res.end();
    });
  },

  /**
   * Deletes Group - use at your own risk
   * @param req
   * @param res
   */
  deleteGroup: (req, res) => {
    const hueApp = new hueApi(config.hue.bridgeIp, config.hue.user);
    const groupId = req.params.groupId;
    hueApp.deleteGroup(groupId, (err, result) => {
      if (err) {
        logger.warn(err);
        throw err;
      }
      logger.info({'Message': 'Group Deleted', 'Group Id': result});
      res.end();
    });
  },

  /**
   * Show Groups
   * @param req
   * @param res
   */
  allGroups: (req, res) => {
    const hueApp = new hueApi(config.hue.bridgeIp, config.hue.user);
    hueApp.groups((err, result) => {
      if (err) {
        logger.warn(err);
        throw err;
      }
      logger.info({'Message': 'All Groups', 'Group Id': result});
      res.end();
    });
  },

  /**
   * List lights connected to bridge
   * @param req
   * @param res
   */
  listAvailableLights: (req, res) => {
    const hueApp = new hueApi(config.hue.bridgeIp, config.hue.user);
    hueApp.lights((err, lights) => {
      if (err) {
        logger.warn(err);
        throw err;
      }
      logger.info({'Message': 'List of available lights', 'Available Lists': lights});
      res.end();
    });
  },

  toggleLights: (req, res) => {
    const hueApp = new hueApi(config.hue.bridgeIp, config.hue.user);
    const lightState = hue.lightState;
    const state = lightState.create();
    const roomId = req.params.roomId;

    hueApp.lightStatus(roomId, (err, result) => {
      if (err) {
        logger.warn(err);
        throw err;
      }

      if (!result.state.on) {
        hueApp.setLightState(roomId, state.on(), (err, lightState) => {
          if (err) {
            logger.warn(err);
            throw err;
          }
          logger.info({'Message': 'Lights On', 'lightState': true, data: lightState});
          res.send({'Message': 'Lights On', 'lightState': true, data: lightState});
        });
      } else {
        hueApp.setLightState(roomId, state.off(), (err, lightState) => {
          if (err) {
            logger.warn(err);
            throw err;
          }
          logger.info({'Message': 'Lights Off', 'lightState': false, data: lightState});
          res.send({'Message': 'Lights Off', 'lightState': false, data: lightState});
        });
      }
    });
  },

  /**
   * Controls light brightness for a specific bulb
   * @param req
   * @param res
   */
  lightBrightness: (req, res) => {
    const hueApp = new hueApi(config.hue.bridgeIp, config.hue.user);
    const lightState = hue.lightState;
    const roomId = req.params.roomId;
    const brightness = req.params.brightness;
    let state = lightState.create().on().brightness(brightness);

    hueApp.setLightState(roomId, state, (err, light) => {
      if (err) {
        logger.warn(err);
        throw err;
      }
      logger.info({'Message': 'Light Dimmed', 'lightState': light});
      res.end();
    });
  },

  toggleGroup: (req, res) => {
    const hueApp = new hueApi(config.hue.bridgeIp, config.hue.user);
    const lightState = hue.lightState;
    const state = lightState.create();
    const groupId = req.params.groupId;

    hueApp.lightStatus(groupId, (err, result) => {
      if (err) {
        logger.warn(err);
        throw err;
      }

      if (!result.state.on) {
        hueApp.setLightState(groupId, state.on(), (err, lightState) => {
          if (err) {
            logger.warn(err);
            throw err;
          }
          logger.info({'Message': 'Group Lights On', 'lightState': lightState});
          res.end();
        });
      } else {
        hueApp.setLightState(groupId, state.off(), (err, lightState) => {
          if (err) {
            logger.warn(err);
            throw err;
          }
          logger.info({'Message': 'Group Lights Off', 'lightState': lightState});
          res.end();
        });
      }
    });
  },
}

module.exports = {
  hueLights
};
