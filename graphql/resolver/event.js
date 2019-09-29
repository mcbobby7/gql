const Event = require('../../models/event');
const User = require('../../models/user');
const { user } = require('./merge');


module.exports = {
    events: async () => {
        try {
        const events = await Event.find().populate('creator')
            return events.map(event =>  {
                return  { ...event._doc, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, event._doc.creator) };
        })
    } catch (err) {
            throw err;
        }
    },
    createEvent: async (args) => {
        const event = new Event ({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5d8eb31e6e61e61d9cf8cbac'
        })
        let createdEvent;
        try {
        const result = await event.save()
            createdEvent = { ...result._doc, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, result._doc.creator) };
           const creator = await User.findById('5d8eb31e6e61e61d9cf8cbac');
            if (!creator) {
                throw new Error('user dont exist');
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (err) {
            throw err;
        };
    },
};