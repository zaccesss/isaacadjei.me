import type { TILEntry } from "../index"

const _isolation_forest_offset: TILEntry = {
    id: "isolation-forest-offset",
    title: "scikit-learn's IsolationForest decision_function is score_samples minus offset_",
    date: "2026-10-13",
    category: "AI/ML",
    published: true,
    body: "[`score_samples`](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html) returns the negated anomaly score from [the original paper](https://doi.org/10.1109/ICDM.2008.17), so lower means more abnormal and healthy data sits around -0.4 to -0.7 rather than near zero. `decision_function` subtracts the fitted `offset_`, which moves the model's own boundary to 0: negative means outlier. With `contamination=\"auto\"` the offset is fixed at -0.5, while a number such as 0.05 sets it so that share of the training data falls below zero. Calibrating against `offset_` instead of a hand-picked constant is what stopped [PHAEMOS](https://phaemos.com) flagging every reading.",
    detail: [
      {
        type: "code",
        lang: "python",
        code: `import numpy as np
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(0)
X = rng.normal(size=(2000, 4))
model = IsolationForest(contamination=0.05, random_state=0).fit(X)

raw = model.score_samples(X)
print(model.offset_)                        # -0.545
print(np.median(raw))                       # -0.445
print(np.allclose(model.decision_function(X), raw - model.offset_))  # True
print((model.predict(X) == -1).mean())      # 0.05`,
        caption: "Real output from scikit-learn: the boundary is learned, not assumed",
      },
      {
        type: "p",
        text: "A 0 to 1 score can then be anchored to the model rather than a guess: map the median training decision to 0 and the boundary (decision 0) to the alert threshold, then clip.",
      },
      {
        type: "code",
        lang: "python",
        code: `typical = np.median(raw - model.offset_)
score = np.clip(0.7 * (typical - (raw - model.offset_)) / typical, 0, 1)`,
        caption: "A typical healthy reading scores 0 and the model's own boundary scores 0.7",
      },
    ],
    tags: ["machine learning", "scikit-learn", "anomaly detection", "Python"],
    source: { label: "scikit-learn: IsolationForest", url: "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html" },
    project: { name: "PHAEMOS", url: "https://phaemos.com", slug: "phaemos" },
    series: "Isolation Forest",
    seriesPart: 1,
  }

export default _isolation_forest_offset
