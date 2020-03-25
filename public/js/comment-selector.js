/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

t.render(function(){
  t.sizeTo('#estimate'); // resize popup based on content
});

const toolsContainer = document.getElementById('tools');
const myMemberId = t.getContext().member;

// get user's token
t.get('member', 'private', 'token')
.then(function(token) {
  
  // load comments
  t.card('id').then(function(card) {
    console.log('card.id => ', card.id);
    // https://developers.trello.com/advanced-reference/card#get-1-cards-card-id-or-shortlink-actions
    $.get('/orderData?', { token, cardId: card.id }, function(res){
      console.log('orderData => ', res.orderData);
      $('.js-spinner').hide();
      if (res.orderData === false) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode('🚧 Expired auth token. Please try again.'));
        toolsContainer.appendChild(p);
        localStorage.setItem('token', token);
        t.remove('member', 'private', 'token'); // will cause auth popup to display on next click
        return;
      }
      const tools = res.orderData;
      console.log("tools : ", tools);
      tools.forEach(function(tool) {
        const li = document.createElement('option');
        console.log("tool : ", tool);
        var toolname = tool.split("-")[1];
        li.appendChild(document.createTextNode(toolname));
        toolsContainer.appendChild(li);
      });
    });    
   })
  .catch(function(err){
    alert('Oops, there was an error while loading comments. Can you refresh and try again?');
    //console.error('Error loading card comments:', err);
  });
  
  window.estimate.addEventListener('submit', function(event){
    event.preventDefault();
    
    var select1 = document.getElementById('tools');
    var options1 = select1.options;
    var tool_name   = options1[options1.selectedIndex].value;
    
    var loc = document.getElementById('loc');
    var make = document.getElementById('make');
    var model = document.getElementById('model');
    var sn = document.getElementById('sn');
    
    t.card('id').then(function(card){
        $.post('/updateToolFields?', { cardId: card.id, tool_name: tool_name,loc: loc.value,make: make.value,model: model.value,sn: sn.value})
         .always(function(res){
            console.log("close popup...");
            return t.closePopup();
          })
      });
  });
  
});
