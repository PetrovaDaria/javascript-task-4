'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

function checkEvent(event, events) {
    if (!(event in events)) {
        events[event] = new Map();
    }
}

function checkContext(event, context, events) {
    if (!(events[event].has(context))) {
        events[event].set(context, []);
    }
}

function addToEvent(event, context, params, events) {
    checkEvent(event, events);
    checkContext(event, context, events);
    const obj = { 'handler': params.handler, 'times': params.times,
        'frequency': params.frequency, 'callsCount': 0 };
    events[event].get(context).push(obj);
}

function checkTimes(context, params) {
    if (params.times >= params.callsCount) {
        params.handler.apply(context);
    }
}

function checkFrequency(context, params) {
    if (((params.callsCount - 1) % params.frequency) === 0) {
        params.handler.apply(context);
    }
}

function getNameSpaces(event) {
    const nameSpaces = [];
    const ee = event.split('.');
    let currentNameSpace = '';
    ee.forEach(function (e) {
        if (currentNameSpace.length !== 0) {
            currentNameSpace += '.';
        }
        currentNameSpace += e;
        nameSpaces.unshift(currentNameSpace);
    });

    return nameSpaces;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const events = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            console.info(event, context, handler);
            addToEvent(event, context, { 'handler': handler }, events);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            console.info(event, context);
            events[event].delete(context);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            console.info(event);
            const nameSpaces = getNameSpaces(event);
            nameSpaces.forEach(function (e) {
                if (e in events) {
                    events[e].forEach(function (handlers, context) {
                        handlers.forEach(function (params) {
                            params.callsCount++;
                            if (params.times !== undefined) {
                                checkTimes(context, params);
                            } else if (params.frequency !== undefined) {
                                checkFrequency(context, params);
                            } else {
                                params.handler.call(context);
                            }
                        });
                    });
                }
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
            if (times <= 0) {
                return this.on(event, context, handler);
            }
            addToEvent(event, context, { 'handler': handler, 'times': times }, events);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} this
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
            if (frequency <= 0) {
                return this.on(event, context, handler);
            }
            addToEvent(event, context, { 'handler': handler,
                'frequency': frequency }, events);

            return this;
        }
    };
}


module.exports = {
    getEmitter,

    isStar
};
