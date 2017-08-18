namespace BubbleGunner {
    import EventDispatcher = createjs.EventDispatcher;

    export class GarbageCollector {
        private static Id: number = 1;

        private _intervalHandlers: number[] = [];
        private _timeoutHandlers: number[] = [];
        private _eventHandlerRemoverCallbacks: Function[] = [];

        constructor(private _scope: Object, private _name: string = null) {
            if (this._name != undefined) {
                this._name = `GC ${GarbageCollector.Id}`;
                GarbageCollector.Id++;
            }
        }

        public registerEventListener(o: EventDispatcher, eventName: string, listener: (eventObj: Object) => any, scope: Object = this._scope): Function {
            const listenerHandler = o.on(eventName, listener, scope);
            const removeCallback = () => {
                if (o == undefined || listenerHandler == undefined) return;
                o.off(eventName, listenerHandler);
            };
            this._eventHandlerRemoverCallbacks.push(removeCallback);
            return listenerHandler;
        }

        public registerTimeout(handler: (...args: any[]) => void, timeout: number): number {
            const timeoutHandler = setTimeout(handler, timeout);
            this._timeoutHandlers.push(timeoutHandler);
            return timeoutHandler;
        }

        public registerInterval(handler: (...args: any[]) => void, timeout: number): number {
            const intervalHandler = setInterval(handler, timeout);
            this._intervalHandlers.push(intervalHandler);
            return intervalHandler;
        }

        public disposeInterval(handler: number): void {
            if (!this._intervalHandlers.some(h => h === handler)) {
                throw new Error(`Interval handler is not registered with garbage collector.`);
            }

            clearInterval(handler);
            this._intervalHandlers = this._intervalHandlers.filter(h => h !== handler);
        }

        public disposeAll(): void {
            this._timeoutHandlers.forEach(handler => clearTimeout(handler));
            this._timeoutHandlers = [];
            this._intervalHandlers.forEach(handler => clearInterval(handler));
            this._intervalHandlers = [];
            this._eventHandlerRemoverCallbacks.forEach(func => func());
            this._eventHandlerRemoverCallbacks = [];
        }
    }
}