const { ObjectId } = require('mongodb');

// const { winstonInfo } = require('../lib/logging');
const {
  find, insertOne, updateOne, deleteOne,
} = require('../lib/mongo');

module.exports = (app) => {
  app.get('/user/:userID/notification', (req, res) => {
    // get all notification
    res.set('Content-Type', 'application/json');

    const { notified, treshold, session = 'both' } = req.query;

    const queryObject = {
      userID: req.params.userID,
      session: {
        $in: session === 'both' ? ['both', 'morning', 'afternoon'] : [session],
      },
    };

    // conditional queries
    if (notified !== undefined) {
      queryObject.notified = notified === 'true';
    }

    if (treshold !== undefined) {
      queryObject.treshold = { $gte: parseInt(treshold, 10) };
    }

    find(
      app.locals.db,
      'notifications',
      queryObject
    )
      .then(({ data }) => res.send({ success: true, data }))
      .catch(({ message }) => res.send({ success: false, message }));
  });

  app.post('/user/:userID/notification', (req, res) => {
    const { userID } = req.params;

    // add new notification
    res.set('Content-Type', 'application/json');

    insertOne(
      app.locals.db,
      'notifications',
      Object.assign({}, req.body, { userID, notified: false, expired: false })
    )
      .then(({ data }) => res.send({ success: true, data }))
      .catch(({ message }) => res.send({ success: false, message }));
  });

  app.get('/user/:userID/notification/:notificationID', (req, res) => {
    // update a notification
    res.set('Content-Type', 'application/json');

    find(
      app.locals.db,
      'notifications',
      { _id: ObjectId(req.params.notificationID) }
    )
      .then(({ data }) => res.send({ success: true, data: data[0] }))
      .catch(({ message }) => res.send({ success: false, message }));
  });

  app.put('/user/:userID/notification/:notificationID', (req, res) => {
    // update a notification
    res.set('Content-Type', 'application/json');

    updateOne(
      app.locals.db,
      'notifications',
      { _id: ObjectId(req.params.notificationID) },
      { $set: req.body }
    )
      .then(({ data }) => res.send({ success: true, data }))
      .catch(({ message }) => res.send({ success: false, message }));
  });

  app.delete('/user/:userID/notification/:notificationID', (req, res) => {
    // update a notification
    res.set('Content-Type', 'application/json');

    deleteOne(
      app.locals.db,
      'notifications',
      { _id: ObjectId(req.params.notificationID) }
    )
      .then(({ data }) => res.send({ success: true, data }))
      .catch(({ message }) => res.send({ success: false, message }));
  });
};
