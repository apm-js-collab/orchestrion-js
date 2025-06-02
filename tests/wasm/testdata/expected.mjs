import { tracingChannel as tr_ch_apm_tracingChannel } from "diagnostics_channel";
const tr_ch_apm$up:fetch = tr_ch_apm_tracingChannel("orchestrion:one:up:fetch");
const tr_ch_apm$up:constructor = tr_ch_apm_tracingChannel("orchestrion:one:up:constructor");
export class Up {
    constructor(){
        const tr_ch_apm_ctx$up:constructor = {
            arguments
        };
        try {
            if (tr_ch_apm$up:constructor.hasSubscribers) {
                tr_ch_apm$up:constructor.start.publish(tr_ch_apm_ctx$up:constructor);
            }
            console.log('constructor');
        } catch (tr_ch_err) {
            if (tr_ch_apm$up:constructor.hasSubscribers) {
                tr_ch_apm_ctx$up:constructor.error = tr_ch_err;
                try {
                    tr_ch_apm_ctx$up:constructor.self = this;
                } catch (refErr) {}
                tr_ch_apm$up:constructor.error.publish(tr_ch_apm_ctx$up:constructor);
            }
            throw tr_ch_err;
        } finally{
            if (tr_ch_apm$up:constructor.hasSubscribers) {
                tr_ch_apm_ctx$up:constructor.self = this;
                tr_ch_apm$up:constructor.end.publish(tr_ch_apm_ctx$up:constructor);
            }
        }
    }
    fetch() {
        const traced = ()=>{
            console.log('fetch');
        };
        if (!tr_ch_apm$up:fetch.hasSubscribers) return traced();
        return tr_ch_apm$up:fetch.traceSync(traced, {
            arguments,
            self: this
        });
    }
}
