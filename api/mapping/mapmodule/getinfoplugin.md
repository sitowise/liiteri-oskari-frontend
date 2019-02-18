# Get Info Plugin

## Description

This plugin provides view of the from GetFeatureInfo and similar results what are processed in backend

## Screenshot

![screenshot](images/gfi_query.png)

## Bundle configuration

Handling infoBox and ignoredLayerTypes in the plugin are made configurable. infoBox variable makes it possible to request infoBox with additional information later on. ignoredLayerTypes is an array of layer types that are ignored in the requests. This functionality is made because of new mapwfs2 which controls WFS's GFI data.

The colour scheme and font of the plugin are configurable, with variables `colourScheme` (Object) and `font` (String), respectively. A CSS class of `oskari-publisher-font-<font>` is expected to be defined with font-family definition. The structure of `colourScheme` should be of following format:

```javascript
{
  "val": "<id of the colour scheme, eg. 'blue'>",
  "bgColour": "<the colour of the gfi popup header background, eg. '#0091FF'>",
  "titleColour": "<the colour of the gfi popup header text, eg. '#FFFFFF'>",
  "headerColour": "<the colour of myplaces popup title text, eg. '#0091FF'>",
  "iconCls": "<either 'icon-close' or 'icon-close-white'>"
}
```

## Requests the plugin handles

This plugin doesn't handle any requests.

## Requests the plugin sends out

This plugin doesn't sends out any requests

## Events the bundle listens to

<table class="table">
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> EscPressedEvent </td><td> Closing GetInfo "popup" from screen.</td>
  </tr>
  <tr>
    <td> MapClickedEvent </td><td> Send ajax request to backend system.</td>
  </tr>
  <tr>
    <td> AfterMapMoveEvent </td><td> Cancel ajax request.</td>
  </tr>
</table>

## Events the plugin sends out

<table class="table">
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td>GetInfoResultEvent</td><td> Result of ajax request formatted send as an event so that infobox handling can be done elsewhere </td>
  </tr>
</table>

## Dependencies

<table class="table">
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to create the UI</td>
  </tr>
  <tr>
    <td> [Oskari infobox](/documentation/bundles/framework/infobox) </td>
    <td> Oskari's InfoBoxBundle </td>
    <td> That handles the infobox as an Openlayers popup with customized UI
  </td>
  </tr>
  <tr>
    <td> [Backend API](/documentation/backend/mapmodule/getinfoplugin) </td>
    <td> N/A </td>
    <td> Get info is handle in backend</td>
  </tr>
</table>
