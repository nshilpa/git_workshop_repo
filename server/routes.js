const rp = require('request-promise');
Promise = require('bluebird');
const request = require('request');

const trelloApi = 'https://api.trello.com/1';
const hawkeyeApi = 'http://apiintegrationprojects.com';
//const hawkeyeApi = 'http://b6dbeffc.ngrok.io';

const getOrderData = Promise.coroutine(function* (params){
  const apiReq = {
    uri: `${hawkeyeApi}/trello_integration/webhooks/trello_requests.php?cardId=${params.cardId}&type=orderData`,
    json: true
  };
 try {
    return yield rp.get(apiReq);
  } catch (apiErr) {
    console.error(`error=${apiErr.message}`);
    return false;
  }
});

const routes = (app) => {
  // GET /vendors
      
  app.get('/hello', function(req, res){
    console.log('Tool Fields Proj', req.query);
    res.send('Tool Fields Proj');
  }),
    
  app.get('/orderData', Promise.coroutine(function* (req, res) {
    console.log('GET /orderData', req.query);
    const orderData = yield getOrderData(req.query); // { cardId, token }
    //console.log('GET /orderData resp ', orderData);
    return res.send({ orderData: orderData});
  })),
  
  app.post('/updateToolFields', Promise.coroutine(function* (req, res) {
    console.log('POST', req.path, req.body.vendor_name);
    console.log('Before req',new Date().toLocaleString());
     
    request({
      uri: `${hawkeyeApi}/trello_integration/webhooks/update_tool_fields.php`,
      method: "POST",
      json: true,   // <--Very important!!!
     body: {
      cardId: req.body.cardId,
      tool_name: req.body.tool_name,
      loc: req.body.loc,
      make: req.body.make,
      model: req.body.model,
      sn: req.body.sn,   
    },
    }); 
    console.log('After res',new Date().toLocaleString());
    return res.send({ ok: {} });
}))

};

module.exports = routes;
