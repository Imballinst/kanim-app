const { postLogin } = require('../lib/requests');

module.exports = (app) => {
  app.post('/login', (req, res) => {
    // get all notification
    const response = { success: false };
    const { username, password } = req.data;

    res.set('Content-Type', 'application/json');

    postLogin(undefined, username, password).then(({ data }) => {
      const {
        Success, Message, Token, Id, errorCode,
      } = data;

      res.set('Content-Type', 'application/json');

      if (Success) {
        response.data = { Token, Id, Message };
        response.success = true;
      } else {
        response.message = Message;
        response.errorCode = errorCode;
      }

      res.send(response);
    }).catch(err => res.send({
      success: false,
      message: err,
    }));
  });
};
