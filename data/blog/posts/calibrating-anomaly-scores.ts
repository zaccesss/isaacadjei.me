import type { BlogPost } from "../index"

const _calibrating_anomaly_scores: BlogPost = {
  slug: "calibrating-anomaly-scores",
  title: "Calibrating Anomaly Scores: Why One Formula Flagged Every Reading",
  date: "2026-10-13",
  type: "research",
  cover_image: "/images/blog/covers/calibrating-anomaly-scores-shot.webp",
  cover_image_dark: "/images/blog/covers/calibrating-anomaly-scores-shot-dark.webp",
  description:
    "PHAEMOS flagged 100% of its own training data as anomalous because of a one-line normalisation formula. How I found the bug, calibrated the Isolation Forest against its own decision boundary and gave each sensor node its own model.",
  tags: ["ML", "Python", "IoT", "PHAEMOS", "Maintenance"],
  projectSlug: "phaemos",
  published: true,
  content: [
    {
      type: "p",
      text: "[PHAEMOS](https://phaemos.com) is my predictive maintenance platform. Sensor nodes on a machine stream temperature, vibration, current and more to a backend, which scores every reading with an [Isolation Forest](https://cs.nju.edu.cn/zhouzh/zhouzh.files/publication/icdm08b.pdf) and raises an alert when a machine starts behaving unlike its normal self. After retraining the model on a fresh batch of healthy data, I checked the result and found that it flagged 100% of the training readings as anomalous. A model that thinks everything is broken is just as useless as one that thinks nothing is. The cause was a single line of arithmetic.",
    },
    {
      type: "h2",
      text: "How Isolation Forest scores a reading",
    },
    {
      type: "p",
      text: "An Isolation Forest builds many random trees. Each tree keeps splitting the data on a random feature at a random value until every point sits on its own. Unusual points are easy to isolate, so they end up near the root after only a few splits. Normal points sit in dense regions and need many splits. The average path length across all the trees becomes the anomaly score.",
    },
    {
      type: "p",
      text: "In [scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html) the raw score comes from `score_samples`. It is the negative of the anomaly score from the original paper, so it is always negative and lower means more abnormal. For normal data it typically sits somewhere around -0.4 to -0.7. The model also stores `offset_`, a threshold chosen during training from the `contamination` setting. With contamination at 5%, `offset_` is placed so that about 5% of the training data falls below it. `decision_function` is simply `score_samples` minus `offset_`, so a negative decision means outside what the model learned as normal.",
    },
    {
      type: "table",
      headers: ["Method or attribute", "Range", "Meaning"],
      rows: [
        ["score_samples(X)", "Negative, roughly -0.4 to -0.7 for normal data", "Lower is more abnormal"],
        ["offset_", "A single negative number", "The boundary picked from contamination during fit"],
        ["decision_function(X)", "Around zero", "Below zero is an outlier by the model's own boundary"],
        ["predict(X)", "1 or -1", "Inlier or outlier"],
      ],
    },
    {
      type: "h2",
      text: "The bug",
    },
    {
      type: "p",
      text: "The dashboard and the alert rules want a score from 0 to 1 where higher means more worrying, with 0.7 as the threshold. The original code produced that with a fixed shift:",
    },
    {
      type: "code",
      lang: "python",
      text: `# the original normalisation
normalised = 1 - (raw + 0.5)
is_anomaly = normalised >= 0.7`,
    },
    {
      type: "p",
      text: "Put real numbers through it. A perfectly ordinary reading with a raw score of -0.45 becomes 0.95. A reading at -0.6 becomes 1.1 and gets clipped to 1. Every normal reading lands at 0.9 or above, comfortably over the 0.7 threshold. The formula assumed raw scores centred on -0.5 with a spread of about half a unit, which is not how the model behaves. It also ignored `offset_` entirely, so the contamination setting I had chosen so carefully did nothing.",
    },
    {
      type: "callout",
      tone: "warning",
      text: "Never normalise a model's output with constants you guessed. Print the actual distribution of scores on your training data first. One histogram would have shown this bug before it ever reached the dashboard.",
    },
    {
      type: "h2",
      text: "The fix: calibrate against the model itself",
    },
    {
      type: "p",
      text: "I wanted two anchor points that mean something. A typical healthy reading should score near 0. A reading exactly on the model's own decision boundary should score exactly 0.7, the alert threshold. Then 'anomalous' in the dashboard means precisely what the trained model learned, rather than whatever a constant happened to produce.",
    },
    {
      type: "code",
      lang: "python",
      text: `ANOMALY_THRESHOLD = 0.7

def calibrate(model, raw_scores):
    # decision values are the model's own scale: below 0 is outside normal
    decisions = raw_scores - model.offset_
    model.phaemos_typical_decision = float(max(np.median(decisions), 1e-6))

def normalise(model, raw_scores):
    typical = model.phaemos_typical_decision
    decisions = raw_scores - model.offset_
    # typical maps to 0, the boundary maps to the threshold
    return np.clip(ANOMALY_THRESHOLD * (typical - decisions) / typical, 0.0, 1.0)`,
    },
    {
      type: "p",
      text: "During training I take the median decision value of the healthy data and store it on the model. At scoring time a reading with that median decision scores 0, a reading with a decision of 0 scores 0.7 and anything further outside the boundary climbs towards 1. Because the boundary comes from `offset_`, the share of healthy readings above 0.7 now matches the contamination setting. The `max(..., 1e-6)` guard avoids dividing by zero on a degenerate dataset.",
    },
    {
      type: "h2",
      text: "One model per kind of node",
    },
    {
      type: "p",
      text: "Fixing the formula exposed a second problem. PHAEMOS has four kinds of sensor node and they report very different things. An [ESP32](https://www.espressif.com/en/products/socs/esp32) node carries 23 sensor fields, an STM32 node reports 8 vibration fields, an [Arduino Nano](https://docs.arduino.cc/hardware/nano/) 5 and a Raspberry Pi Pico 4. The original single model was trained on a shared list of columns. Any field a node never sends was filled with zero, so a constant zero became part of what 'normal' looked like and skewed the whole envelope.",
    },
    {
      type: "p",
      text: "Now each node type with at least 50 readings gets its own model, trained only on the fields that appear in at least 90% of that node's readings. A general model still covers readings that do not say which node sent them. All the models are saved together and the scorer picks the right one for each reading. The training script and the API also share one scoring function, so evaluation can never quietly disagree with production.",
    },
    {
      type: "h2",
      text: "Did it work?",
    },
    {
      type: "table",
      headers: ["Measure", "Before", "After"],
      rows: [
        ["Healthy training readings flagged", "100%", "4 to 8% per model (contamination 5%)"],
        ["Precision on the evaluation set", "Not meaningful", "0.83"],
        ["Recall on the evaluation set", "1.0 (everything flagged)", "1.0"],
        ["F1 score", "Not meaningful", "0.91"],
      ],
    },
    {
      type: "p",
      text: "Recall of 1.0 before the fix sounds good until you remember that flagging everything always catches every fault. After calibration the model still caught every injected fault in the evaluation set, including simulated bearing wear early in its development, while only flagging a small slice of healthy readings. Those occasional false positives are expected by design. Dealing with them is the job of the alerting layer, which waits for three anomalous readings in a row before raising anything. That rule gets its own post. The platform as a whole is written up on the [PHAEMOS project page](/projects/phaemos).",
    },
    {
      type: "clip",
      src: "/videos/projects/phaemos/machine.mp4",
      poster: "/videos/projects/phaemos/machine.webp",
      alt: "A machine's page in PHAEMOS showing the anomaly score chart with its threshold line above one small chart per sensor, each updating live.",
      caption: "The calibrated score on a machine's page: healthy readings sit near zero and the 0.7 threshold line means what the model learned.",
    },
    {
      type: "h2",
      text: "What I would check on any anomaly model",
    },
    {
      type: "ol",
      items: [
        "Plot the raw score distribution on training data before writing any normalisation.",
        "Use the model's own threshold (here `offset_`) rather than a guessed constant.",
        "Check the flagged share on healthy data matches the contamination you set.",
        "Train on the features each source really has. Missing values filled with zero are not neutral.",
        "Run evaluation through the exact code path production uses.",
      ],
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "scikit-learn: IsolationForest reference", url: "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html" },
        { text: "scikit-learn user guide: novelty and outlier detection", url: "https://scikit-learn.org/stable/modules/outlier_detection.html" },
        { text: "Liu, Ting and Zhou (2008): Isolation Forest, the original paper (PDF)", url: "https://cs.nju.edu.cn/zhouzh/zhouzh.files/publication/icdm08b.pdf" },
        { text: "PHAEMOS project site", url: "https://phaemos.com" },
        { text: "PHAEMOS source code on GitHub", url: "https://github.com/phaemos/phaemos" },
      ],
    },
    {
      type: "h2",
      text: "Watch or listen",
    },
    {
      type: "video",
      youtubeId: "O9VvmWj-JAk",
      title: "Andy McDonald: Isolation Forest for outlier detection in Python",
    },
  ],
}

export default _calibrating_anomaly_scores
