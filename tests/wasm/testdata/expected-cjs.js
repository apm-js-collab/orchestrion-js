const { tracingChannel: tr_ch_apm_tracingChannel } = require("diagnostics_channel");
const tr_ch_apm$up_fetch = tr_ch_apm_tracingChannel("orchestrion:one:up:fetch");
const tr_ch_apm$up_constructor = tr_ch_apm_tracingChannel("orchestrion:one:up:constructor");
module.exports = class Up {
    constructor(){
        const tr_ch_apm_ctx$up_constructor = {
            arguments
        };
        try {
            if (tr_ch_apm$up_constructor.hasSubscribers) {
                tr_ch_apm$up_constructor.start.publish(tr_ch_apm_ctx$up_constructor);
            }
            console.log('constructor');
        } catch (tr_ch_err) {
            if (tr_ch_apm$up_constructor.hasSubscribers) {
                tr_ch_apm_ctx$up_constructor.error = tr_ch_err;
                try {
                    tr_ch_apm_ctx$up_constructor.self = this;
                } catch (refErr) {}
                tr_ch_apm$up_constructor.error.publish(tr_ch_apm_ctx$up_constructor);
            }
            throw tr_ch_err;
        } finally{
            if (tr_ch_apm$up_constructor.hasSubscribers) {
                tr_ch_apm_ctx$up_constructor.self = this;
                tr_ch_apm$up_constructor.end.publish(tr_ch_apm_ctx$up_constructor);
            }
        }
    }
    fetch() {
        const __apm$traced = ()=>{
            console.log('fetch');
        };
        if (!tr_ch_apm$up_fetch.hasSubscribers) return __apm$traced();
        return tr_ch_apm$up_fetch.traceSync(__apm$traced, {
            arguments,
            self: this
        });
    }
};
