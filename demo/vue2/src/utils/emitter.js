import {EventBus} from '@/utils/helpe';

function broadcast(componentName, eventName, params) {
    this.$children.forEach(child => {
        var name = child.$options.componentName;
        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat(params));
        } else {
            broadcast.apply(child, [componentName, eventName].concat([params]));
        }
    });
}
export default {
    methods: {
        dispatch(componentName, eventName, params) {
            var parent = this.$parent || this.$root;
            var name = parent.$options.componentName;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;
                if (parent) {
                    name = parent.$options.componentName;
                }
            }
            if (parent) {
                parent.beginBroadcast.apply(parent, params);
            }
        },
        broadcast(componentName, eventName, params) {
            broadcast.call(this, componentName, eventName, params);
        },
        postMsg(eventName, ...params){
            console.log(eventName)
            this[eventName](...params)
        }
    },
    mounted() {
        console.log('this.$options.componentName+\'-event\'', this.$options.componentName+'-event')
        EventBus.$off(this.$options.componentName+'-event')
        EventBus.$on(this.$options.componentName+'-event', this.postMsg)
        this.EventBusST = EventBus
    },
    destroyed() {
        EventBus.$off(this.$options.componentName+'-event')
    }
};