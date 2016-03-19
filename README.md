# jsGlossary

This is a pure JavaScript plugin that builds an in-line glossary on page level content anchors. It has one public method to initialize the plugin and takes an optional arguments object consisting of six parameters:

dataSource
    The source of the glossary data file
linkSelector
    The DOM selector(s) for assigning the click events to activate the glossary plugin
dataLoadErrorMessage
    Error message for when the glossary data file doesn't load
definitionLookupErrorMessage
    Error message for when the term/defintion is not found in the glossary data file
hoverTitleMessage
    Sets the 'title' hover tooltip to show on the link
closeTitleMessage
    Sets the 'title' hover tooltip on the definition close button

The plugin works by reading the 'data-term' attribute on the link to perform a lookup of the definition in a data file. If there is a match the defintion will be loaded into a temporary display <span> tag that is added in-line with the content link. When the close <a> link/button (that is also rendered in-line) is clicked, the <span> tag and the close <a> link/button are removed from the DOM. The link is then reset to to its initial state.
