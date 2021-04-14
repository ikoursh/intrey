let pythonBridge = require('python-bridge');

const python = pythonBridge({
    cwd:__dirname
});
let initialized = false;

export default async function (text: string): Promise<number> {
    if (!initialized) {
        throw "wait for initialization to finish";
    }
    const out = await bias(text);
    console.log(out)
    return out;
}

export async function initialize() {
    await python.ex`
    print("importing python deps")
    import tensorflow as tf
    import tensorflow_text as tft
    print("loading model")
    model = tf.keras.models.load_model("savedModel", compile=False)
    bias = lambda x: float(model(tf.constant([x])).numpy()[0][0])
    print("done loading model")
    `;
    initialized = true;
}

async function bias(d:string):Promise<number> {
    return await python`bias (${d})`;
}