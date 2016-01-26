module.exports = [ {
    topic: 'E',
    action: 'EVT',
    transform: function( data, metaData ) {
        return metaData.sender;
    }
}];