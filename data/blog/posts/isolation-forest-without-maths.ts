import type { BlogPost } from "../index"

const _isolation_forest_without_maths: BlogPost = {
    slug: "isolation-forest-without-maths",
    title: "The Isolation Forest, Explained Without Maths",
    date: "2026-10-17",
    type: "article",
    cover_image: "/images/blog/covers/isolation-forest-without-maths.webp",
    cover_credit: "Photo: Dan Otis, Unsplash Licence, via Unsplash",
    description:
      "A plain-language explanation of the Isolation Forest, one of the most practical anomaly detection algorithms: why odd points are easy to separate, how a forest of random cuts turns that into a score and where it goes wrong.",
    tags: ["ML", "Python", "Learning", "Notes"],
    published: true,
    content: [
      {
        type: "p",
        text: "Most machine learning explanations start with equations. This one does not. The Isolation Forest is one of the few algorithms whose core idea fits in a sentence, which makes it a good first step into anomaly detection for anyone who builds sensors, monitors servers or looks after data. I have used it in [PHAEMOS](https://phaemos.com), my [predictive maintenance project](/projects/phaemos). The hardest part was never the theory. It was understanding what the numbers it produces actually mean. So here is the idea, built up from a game you already know.",
      },
      {
        type: "h2",
        text: "Start with a guessing game",
      },
      {
        type: "p",
        text: "Imagine a class of thirty students lined up by height. I pick one in secret and you have to identify them by asking questions of the form 'is the person taller than X?'. If I picked someone of average height, you need several questions, because many people are close to them. If I picked the one student who is much taller than everyone else, a single question like 'taller than 190 cm?' finds them straight away.",
      },
      {
        type: "p",
        text: "That is the whole insight. Unusual things are easy to separate from the crowd. Normal things hide among their neighbours. The Isolation Forest does not try to describe what normal looks like. It measures how quickly each point can be cut off on its own.",
      },
      {
        type: "h2",
        text: "Random cuts instead of clever questions",
      },
      {
        type: "p",
        text: "In the guessing game you chose good questions. The algorithm does something that sounds worse but works remarkably well: it asks random ones. It picks a random feature (say temperature), picks a random value between the smallest and largest temperature it has seen and splits the data in two. Then it repeats inside each half, with a new random feature and value, until every point sits alone or a depth limit is reached.",
      },
      {
        type: "p",
        text: "Record those splits as a tree and the number of cuts it took to isolate a point is its path length. An outlier sitting far from the others tends to get separated by one of the first few random cuts, because almost any value between it and the crowd will do. A point in the middle of a dense cluster needs many cuts before it is alone.",
      },
      {
        type: "diagram",
        code: `flowchart TD
    R["All readings"] --> A["temperature < 61?"]
    A -- "no" --> O["Isolated after 1 cut<br/>(the outlier)"]
    A -- "yes" --> B["vibration < 0.04?"]
    B -- "yes" --> C["humidity < 48?"]
    B -- "no" --> D["temperature < 33?"]
    C --> E["...many more cuts<br/>for normal points"]
    D --> F["...many more cuts"]`,
        caption: "One isolation tree. The outlier falls out early. Normal readings need many more random cuts.",
      },
      {
        type: "h2",
        text: "Why it needs a forest",
      },
      {
        type: "p",
        text: "One random tree is noisy. Sometimes a normal point gets isolated early by luck and sometimes an outlier survives a few unlucky cuts. So the algorithm grows many trees (a hundred is the default in [scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html)), each on a small random sample of the data. It then averages the path length for each point. Averaging washes out the luck and leaves the signal: short average path means anomalous and long average path means normal.",
      },
      {
        type: "p",
        text: "The small samples are a feature rather than a shortcut. The [original paper by Liu, Ting and Zhou](https://cs.nju.edu.cn/zhouzh/zhouzh.files/publication/icdm08b.pdf) found that sub-samples of around 256 points are enough. Smaller samples make the trees cheap to build and actually help, because a huge dense cluster can otherwise swamp a few outliers sitting near it.",
      },
      {
        type: "h2",
        text: "From path length to a score",
      },
      {
        type: "p",
        text: "The average path length is turned into an anomaly score by comparing it with the path length you would expect for a typical point in a random tree of the same size. Points that isolate much faster than expected score as anomalous. That comparison is the one bit of maths I am skipping. It still matters for one practical reason: the raw score has its own scale and it is not a percentage.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "In scikit-learn, score_samples returns values where lower means more abnormal and normal data sits well below zero. Do not invent your own conversion to a 0 to 1 scale. Measure against the model's own threshold, offset_, which is exactly what decision_function does. I [learned this the hard way](/blog/calibrating-anomaly-scores) when a home-made formula marked every single reading as anomalous.",
      },
      {
        type: "h2",
        text: "Contamination: the one setting that decides the threshold",
      },
      {
        type: "p",
        text: "The algorithm can rank points from most to least unusual without any labels. Deciding where 'unusual' becomes 'anomaly' needs one more piece of information: roughly what share of your training data you expect to be anomalous. That is the contamination parameter. Set it to 0.05 and the threshold is placed so that about 5% of the training data falls on the anomalous side. It is a business decision as much as a technical one, because it sets how many alerts people will see.",
      },
      {
        type: "code",
        lang: "python",
        text: `import numpy as np
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(0)
normal = rng.normal(loc=[25.0, 0.03], scale=[1.5, 0.01], size=(500, 2))  # temperature, vibration
odd = np.array([[38.0, 0.30], [24.0, 0.25]])                              # overheating, loose bearing

model = IsolationForest(n_estimators=200, contamination=0.05, random_state=42).fit(normal)

print(model.predict(odd))             # [-1 -1]  -1 means anomaly
print(model.decision_function(odd))   # negative: beyond the learned threshold
print((model.predict(normal) == -1).mean())  # about 0.05 of training data flagged`,
      },
      {
        type: "h2",
        text: "Where it shines and where it struggles",
      },
      {
        type: "table",
        headers: ["Strength", "Limitation"],
        rows: [
          ["No labels needed: train on mostly normal data", "Contamination is a guess you have to tune"],
          ["Fast to train and score, even on modest hardware", "Splits are along one feature at a time, so oddly shaped clusters can confuse it"],
          ["Handles many features without scaling them first", "Irrelevant features dilute the signal from useful ones"],
          ["Scores are easy to rank and threshold", "Raw scores have no natural units, so they need calibrating before people read them"],
        ],
        caption: "A quick guide to when the Isolation Forest is a sensible first choice.",
      },
      {
        type: "p",
        text: "The irrelevant features point is the one that bites in practice. If a sensor node never reports a field and you fill it with zero, that constant column wastes cuts and quietly shifts what normal looks like. Train each kind of device on the features it really has. It is also worth remembering that an anomaly is only 'different from training data'. If the machine was already failing when you collected that data, the model learns failure as normal.",
      },
      {
        type: "h2",
        text: "The short version",
      },
      {
        type: "ol",
        items: [
          "Anomalies are few and different, so random cuts separate them quickly.",
          "A tree counts how many cuts each point needs. A forest averages many trees to remove luck.",
          "Short average paths mean anomalous. Contamination decides where the line is drawn.",
          "Read scores against the model's own threshold rather than a formula of your own.",
        ],
      },
      {
        type: "h2",
        text: "Further reading",
      },
      {
        type: "ol-links",
        items: [
          { text: "Liu, Ting and Zhou (2008), Isolation Forest, the original paper (IEEE ICDM)", url: "https://doi.org/10.1109/ICDM.2008.17" },
          { text: "scikit-learn: IsolationForest API reference", url: "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html" },
          { text: "scikit-learn user guide: novelty and outlier detection", url: "https://scikit-learn.org/stable/modules/outlier_detection.html" },
          { text: "Liu, Ting and Zhou (2008): the same paper as an open PDF", url: "https://cs.nju.edu.cn/zhouzh/zhouzh.files/publication/icdm08b.pdf" },
          { text: "scikit-learn example: plotting an Isolation Forest's decision boundary", url: "https://scikit-learn.org/stable/auto_examples/ensemble/plot_isolation_forest.html" },
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

export default _isolation_forest_without_maths
