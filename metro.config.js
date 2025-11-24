const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure fonts are treated as assets
config.resolver.assetExts.push('ttf');

module.exports = config;
