from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)


# ==========================================
# LOAD AI MODEL
# ==========================================

with open("risk_model.pkl", "rb") as file:
    model = pickle.load(file)


# ==========================================
# HOME ROUTE
# ==========================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "KaushalTrack AI Risk Engine is running!",
        "status": "success"
    })


# ==========================================
# AI RISK PREDICTION
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        # Get JSON data from Node.js
        data = request.get_json()

        if not data:
            return jsonify({
                "message": "No data received"
            }), 400


        # --------------------------------------
        # Read input values
        # --------------------------------------

        attendance = float(
            data["attendance"]
        )

        assessment = float(
            data["assessment"]
        )


        # --------------------------------------
        # Validate values
        # --------------------------------------

        if attendance < 0 or attendance > 100:

            return jsonify({
                "message":
                    "Attendance must be between 0 and 100"
            }), 400


        if assessment < 0 or assessment > 100:

            return jsonify({
                "message":
                    "Assessment must be between 0 and 100"
            }), 400


        # --------------------------------------
        # AI Prediction
        # --------------------------------------

        prediction = model.predict(
            [
                [
                    attendance,
                    assessment
                ]
            ]
        )[0]


        # --------------------------------------
        # Prediction probabilities
        # --------------------------------------

        probabilities = model.predict_proba(
            [
                [
                    attendance,
                    assessment
                ]
            ]
        )[0]


        # --------------------------------------
        # AI Confidence
        # --------------------------------------

        confidence = (
            max(probabilities) * 100
        )


        # --------------------------------------
        # Recommended Action
        # --------------------------------------

        if prediction == "High":

            recommended_action = (
                "Immediate counselling, "
                "skill support and placement "
                "assistance required."
            )

        elif prediction == "Medium":

            recommended_action = (
                "Monitor progress and provide "
                "additional learning support."
            )

        else:

            recommended_action = (
                "Continue regular training and "
                "placement activities."
            )


        # --------------------------------------
        # Return response
        # --------------------------------------

        return jsonify({

            "risk": prediction,

            "confidence": round(
                confidence,
                2
            ),

            "attendance": attendance,

            "assessment": assessment,

            "recommendedAction":
                recommended_action

        })


    except KeyError as error:

        return jsonify({

            "message":
                f"Missing required field: {error}"

        }), 400


    except ValueError:

        return jsonify({

            "message":
                "Attendance and assessment must be numbers."

        }), 400


    except Exception as error:

        print(
            "AI prediction error:",
            error
        )

        return jsonify({

            "message":
                "Prediction failed",

            "error":
                str(error)

        }), 500


# ==========================================
# START SERVER
# ==========================================

if __name__ == "__main__":

    print()
    print("========================================")
    print("KaushalTrack AI Risk Engine")
    print("========================================")
    print("AI Service: http://localhost:8000")
    print("Prediction: POST /predict")
    print("========================================")
    print()

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )