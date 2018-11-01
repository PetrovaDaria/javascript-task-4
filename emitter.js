'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        contexts: [],

        checkContext: function (context) {
            if (this.contexts.indexOf(context) === -1) {
                this.contexts.push(context);
            }
        },

        createContextEvent: function (params) {
            Object.defineProperty(params.context, params.event, { value: {
                'handler': params.handler,
                'times': params.times,
                'frequency': params.frequency,
                'callCount': 0
            }, configurable: true, enumerable: true });
        },

        checkTimes: function (context, eventConditions) {
            if (eventConditions.times >= eventConditions.callCount) {
                eventConditions.handler.apply(context);
            }
        },

        checkFrequency: function (context, eventConditions) {
            if ((eventConditions.callCount - 1) % eventConditions.frequency === 0) {
                eventConditions.handler.apply(context);
            }
        },

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            console.info(event, context, handler);
            this.checkContext(context);
            this.createContextEvent({ 'event': event, 'context': context, 'handler': handler });

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
            for (let key in context) {
                if (key.startsWith(event + '.') || key === event) {
                    delete context[key];
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            console.info(event);
            const nameSpaces = this.getNameSpaces(event);
            nameSpaces.forEach(nameSpace => {
                this.contexts.forEach(context => {
                    if (nameSpace in context) {
                        const eventConditions = context[nameSpace];
                        eventConditions.callCount++;
                        if (eventConditions.times !== undefined) {
                            this.checkTimes(context, eventConditions);
                        } else if (eventConditions.frequency !== undefined) {
                            this.checkFrequency(context, eventConditions);
                        } else {
                            eventConditions.handler.apply(context);
                        }
                    }
                });
            });

            return this;
        },

        getNameSpaces: function (event) {
            const nameSpaces = [];
            const events = event.split('.');
            let currentNameSpace = '';
            events.forEach(function (e) {
                if (currentNameSpace.length !== 0) {
                    currentNameSpace += '.';
                }
                currentNameSpace += e;
                nameSpaces.unshift(currentNameSpace);
            });

            return nameSpaces;
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
            this.checkContext(context);
            this.createContextEvent({ 'event': event, 'context': context,
                'handler': handler, 'times': times });

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
            this.checkContext(context);
            this.createContextEvent({ 'event': event, 'context': context,
                'handler': handler, 'frequency': frequency });

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
