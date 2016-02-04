define([
	"src/oskari/oskari",
	"./sandbox",
	"./sandbox-key-listener-methods",
	"./sandbox-map-layer-methods",
	"./sandbox-map-methods",
	"./sandbox-abstraction-methods",
	"sources/framework/sandbox/sandbox-state-methods"
], function(Oskari) {
	Oskari.bundleCls('sandbox-base');
	Oskari.bundleCls('sandbox-map');
});