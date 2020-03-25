/* global TrelloPowerUp */

TrelloPowerUp.initialize({
  'card-buttons': function(t, opts) {
    // check that viewing member has write permissions on this board
    if (opts.context.permissions.board !== 'write') {
      return [];
    }
    return t.get('member', 'private', 'token')
    .then(function(token){
      return [{
        icon: 'https://github.com/adrienjoly/trello-outliner/raw/master/icon-transparent.png',
        text: 'Tool Fields',
        callback: function(context) {
          if (!token) {
            context.popup({
              title: 'Authorize Your Account',
              url: './auth.html',
              height: 75
            });
          } else {
            console.log("open popup");
            //context.closePopup();
            return context.popup({
              title: 'Update Tool fields',
              url: './comment-selector.html',
              height: 75
            });
          }
        }
      }];
    });
  },
});