import pandas as pd

from sklearn.ensemble import RandomForestClassifier

import pickle


data = {

    "attendance": [
        95, 90, 88, 85, 82,
        78, 75, 70, 65, 62,
        58, 55, 50, 45, 40
    ],

    "assessment": [
        92, 88, 85, 82, 78,
        75, 72, 68, 60, 55,
        50, 45, 40, 35, 30
    ],

    "risk": [
        "Low",
        "Low",
        "Low",
        "Low",
        "Low",
        "Low",
        "Low",
        "Medium",
        "Medium",
        "Medium",
        "Medium",
        "High",
        "High",
        "High",
        "High"
    ]

}


df = pd.DataFrame(data)


print("Training data:")

print(df)


X = df[
    [
        "attendance",
        "assessment"
    ]
]


y = df["risk"]


model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


model.fit(X, y)


with open(
    "risk_model.pkl",
    "wb"
) as file:

    pickle.dump(
        model,
        file
    )


print()

print(
    "========================================"
)

print(
    "AI Risk Model trained successfully!"
)

print(
    "Model saved as risk_model.pkl"
)

print(
    "Features: Attendance + Assessment"
)

print(
    "Risk levels: Low / Medium / High"
)

print(
    "========================================"
)