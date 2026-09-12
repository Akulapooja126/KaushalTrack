const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");

const Trainee = require("./models/Trainee");

dotenv.config();

const app = express();


// ==========================================
// AI SERVICE URL
// ==========================================

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:8000";


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error
    );
  });


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

  res.json({
    message: "KaushalTrack Backend is running!",
    status: "success",
    aiService: AI_SERVICE_URL
  });

});


// ==========================================
// GET ALL TRAINEES
// ==========================================

app.get("/api/trainees", async (req, res) => {

  try {

    const trainees = await Trainee
      .find()
      .sort({ id: 1 });

    res.json(trainees);

  } catch (error) {

    console.error(
      "Error fetching trainees:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch trainees",
      error: error.message
    });

  }

});


// ==========================================
// GET SINGLE TRAINEE
// ==========================================

app.get("/api/trainees/:id", async (req, res) => {

  try {

    const trainee = await Trainee.findOne({
      id: Number(req.params.id)
    });

    if (!trainee) {

      return res.status(404).json({
        message: "Trainee not found"
      });

    }

    res.json(trainee);

  } catch (error) {

    console.error(
      "Error fetching trainee:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch trainee",
      error: error.message
    });

  }

});


// ==========================================
// AI RISK PREDICTION
// ==========================================

app.post("/api/predict-risk", async (req, res) => {

  try {

    const {
      attendance,
      assessment
    } = req.body;


    if (
      attendance === undefined ||
      assessment === undefined
    ) {

      return res.status(400).json({
        message:
          "Attendance and assessment are required"
      });

    }


    const response = await axios.post(
      `${AI_SERVICE_URL}/predict`,
      {
        attendance: Number(attendance),
        assessment: Number(assessment)
      }
    );


    res.json({

      risk:
        response.data.risk,

      confidence:
        response.data.confidence,

      recommendedAction:
        response.data.recommendedAction

    });

  } catch (error) {

    console.error(
      "AI prediction error:",
      error.message
    );

    res.status(500).json({

      message:
        "AI Risk Engine is unavailable",

      error:
        error.message

    });

  }

});


// ==========================================
// ADD TRAINEE
// ==========================================

app.post("/api/trainees", async (req, res) => {

  try {

    const {
      name,
      program,
      attendance,
      assessment,
      status,
      company,
      sector,
      salary,
      employmentDate
    } = req.body;


    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (
      !name ||
      !program ||
      attendance === undefined ||
      assessment === undefined ||
      !status
    ) {

      return res.status(400).json({

        message:
          "Please provide all required trainee details"

      });

    }


    const attendanceNumber =
      Number(attendance);

    const assessmentNumber =
      Number(assessment);


    if (
      isNaN(attendanceNumber) ||
      isNaN(assessmentNumber)
    ) {

      return res.status(400).json({

        message:
          "Attendance and assessment must be numbers"

      });

    }


    if (
      attendanceNumber < 0 ||
      attendanceNumber > 100
    ) {

      return res.status(400).json({

        message:
          "Attendance must be between 0 and 100"

      });

    }


    if (
      assessmentNumber < 0 ||
      assessmentNumber > 100
    ) {

      return res.status(400).json({

        message:
          "Assessment must be between 0 and 100"

      });

    }


    // ------------------------------------------
    // CALL DEPLOYED AI SERVICE
    // ------------------------------------------

    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/predict`,
      {
        attendance:
          attendanceNumber,

        assessment:
          assessmentNumber
      }
    );


    const risk =
      aiResponse.data.risk;

    const confidence =
      aiResponse.data.confidence;

    const recommendedAction =
      aiResponse.data.recommendedAction;


    // ------------------------------------------
    // GENERATE TRAINEE ID
    // ------------------------------------------

    const lastTrainee =
      await Trainee
        .findOne()
        .sort({ id: -1 });


    const newId =
      lastTrainee
        ? lastTrainee.id + 1
        : 1;


    // ------------------------------------------
    // CREATE TRAINEE
    // ------------------------------------------

    const trainee = new Trainee({

      id:
        newId,

      name:
        name,

      program:
        program,

      attendance:
        attendanceNumber,

      assessment:
        assessmentNumber,

      status:
        status,

      company:
        company || "",

      sector:
        sector || "",

      salary:
        salary || "",

      employmentDate:
        employmentDate || "",

      risk:
        risk,

      aiConfidence:
        confidence,

      recommendedAction:
        recommendedAction,

      outcomeHistory:
        []

    });


    // ------------------------------------------
    // SAVE TO MONGODB
    // ------------------------------------------

    await trainee.save();


    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    res.status(201).json({

      message:
        "Trainee added successfully",

      trainee:
        trainee,

      aiPrediction: {

        risk:
          risk,

        confidence:
          confidence,

        recommendedAction:
          recommendedAction

      }

    });

  } catch (error) {

    console.error(
      "Error adding trainee:",
      error
    );

    res.status(500).json({

      message:
        "Failed to add trainee",

      error:
        error.message

    });

  }

});


// ==========================================
// UPDATE TRAINEE
// ==========================================

app.put("/api/trainees/:id", async (req, res) => {

  try {

    const traineeId =
      Number(req.params.id);


    if (isNaN(traineeId)) {

      return res.status(400).json({
        message: "Invalid trainee ID"
      });

    }


    const updatedTrainee =
      await Trainee.findOneAndUpdate(

        {
          id: traineeId
        },

        req.body,

        {
          new: true,
          runValidators: true
        }

      );


    if (!updatedTrainee) {

      return res.status(404).json({
        message: "Trainee not found"
      });

    }


    res.json({

      message:
        "Trainee updated successfully",

      trainee:
        updatedTrainee

    });

  } catch (error) {

    console.error(
      "Error updating trainee:",
      error
    );

    res.status(500).json({

      message:
        "Failed to update trainee",

      error:
        error.message

    });

  }

});


// ==========================================
// DELETE TRAINEE
// ==========================================

app.delete("/api/trainees/:id", async (req, res) => {

  try {

    const traineeId =
      Number(req.params.id);


    if (isNaN(traineeId)) {

      return res.status(400).json({

        message:
          "Invalid trainee ID"

      });

    }


    const deletedTrainee =
      await Trainee.findOneAndDelete({

        id:
          traineeId

      });


    if (!deletedTrainee) {

      return res.status(404).json({

        message:
          "Trainee not found"

      });

    }


    res.json({

      message:
        "Trainee deleted successfully",

      trainee:
        deletedTrainee

    });

  } catch (error) {

    console.error(
      "Error deleting trainee:",
      error
    );

    res.status(500).json({

      message:
        "Failed to delete trainee",

      error:
        error.message

    });

  }

});


// ==========================================
// OUTCOME CHECK-IN
// ==========================================

app.post(
  "/api/trainees/:id/outcome",
  async (req, res) => {

    try {

      const {
        status,
        company,
        sector,
        salary,
        employmentDate,
        checkInDate,
        remarks
      } = req.body;


      // ------------------------------------------
      // VALIDATION
      // ------------------------------------------

      if (!status) {

        return res.status(400).json({

          message:
            "Outcome status is required"

        });

      }


      // ------------------------------------------
      // FIND TRAINEE
      // ------------------------------------------

      const trainee =
        await Trainee.findOne({

          id:
            Number(req.params.id)

        });


      if (!trainee) {

        return res.status(404).json({

          message:
            "Trainee not found"

        });

      }


      // ------------------------------------------
      // CHECK-IN DATE
      // ------------------------------------------

      const finalCheckInDate =
        checkInDate ||
        new Date()
          .toISOString()
          .split("T")[0];


      // ------------------------------------------
      // ADD OUTCOME HISTORY
      // ------------------------------------------

      if (!trainee.outcomeHistory) {

        trainee.outcomeHistory = [];

      }


      trainee.outcomeHistory.push({

        status:
          status,

        company:
          company || "",

        sector:
          sector || "",

        salary:
          salary || "",

        employmentDate:
          employmentDate || "",

        checkInDate:
          finalCheckInDate,

        remarks:
          remarks || ""

      });


      // ------------------------------------------
      // UPDATE CURRENT OUTCOME
      // ------------------------------------------

      trainee.status =
        status;


      trainee.company =
        company ||
        trainee.company ||
        "";


      trainee.sector =
        sector ||
        trainee.sector ||
        "";


      trainee.salary =
        salary ||
        trainee.salary ||
        "";


      trainee.employmentDate =
        employmentDate ||
        trainee.employmentDate ||
        "";


      // ------------------------------------------
      // SAVE
      // ------------------------------------------

      await trainee.save();


      // ------------------------------------------
      // RESPONSE
      // ------------------------------------------

      res.json({

        message:
          "Outcome check-in saved successfully",

        trainee:
          trainee,

        latestOutcome:
          trainee.outcomeHistory[
            trainee.outcomeHistory.length - 1
          ]

      });

    } catch (error) {

      console.error(
        "Outcome check-in error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to save outcome check-in",

        error:
          error.message

      });

    }

  }
);


// ==========================================
// GET OUTCOME HISTORY
// ==========================================

app.get(
  "/api/trainees/:id/outcomes",
  async (req, res) => {

    try {

      const trainee =
        await Trainee.findOne({

          id:
            Number(req.params.id)

        });


      if (!trainee) {

        return res.status(404).json({

          message:
            "Trainee not found"

        });

      }


      res.json({

        traineeId:
          trainee.id,

        traineeName:
          trainee.name,

        currentStatus:
          trainee.status,

        outcomeHistory:
          trainee.outcomeHistory || []

      });

    } catch (error) {

      console.error(
        "Error fetching outcome history:",
        error
      );

      res.status(500).json({

        message:
          "Failed to fetch outcome history",

        error:
          error.message

      });

    }

  }
);


// ==========================================
// RECALCULATE AI FOR EXISTING TRAINEES
// ==========================================

app.post(
  "/api/trainees/recalculate-ai",
  async (req, res) => {

    try {

      const trainees =
        await Trainee.find();

      let updatedCount = 0;


      for (const trainee of trainees) {

        const aiResponse =
          await axios.post(

            `${AI_SERVICE_URL}/predict`,

            {

              attendance:
                Number(
                  trainee.attendance
                ),

              assessment:
                Number(
                  trainee.assessment
                )

            }

          );


        trainee.risk =
          aiResponse.data.risk;


        trainee.aiConfidence =
          aiResponse.data.confidence;


        trainee.recommendedAction =
          aiResponse.data.recommendedAction;


        await trainee.save();

        updatedCount++;

      }


      res.json({

        message:
          "AI predictions recalculated successfully",

        updatedCount:
          updatedCount

      });

    } catch (error) {

      console.error(
        "Recalculate AI error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to recalculate AI predictions",

        error:
          error.message

      });

    }

  }
);


// ==========================================
// AI EARLY INTERVENTION ALERTS
// ==========================================
//
// High Risk   -> Immediate intervention
// Medium Risk -> Monitoring and support
// Low Risk    -> No alert
//
// Alerts are generated dynamically from
// the current MongoDB trainee data.
//
// ==========================================

app.get(
  "/api/alerts",
  async (req, res) => {

    try {

      // ------------------------------------------
      // GET ALL TRAINEES
      // ------------------------------------------

      const trainees =
        await Trainee
          .find()
          .sort({ id: 1 });


      // ------------------------------------------
      // CREATE ALERTS
      // ------------------------------------------

      const alerts =
        trainees

          .filter((trainee) => {

            return (
              trainee.risk === "High" ||
              trainee.risk === "Medium"
            );

          })

          .map((trainee) => {

            let priority =
              "Medium";

            let message =
              "Trainee needs additional monitoring and support.";


            // --------------------------------------
            // HIGH RISK
            // --------------------------------------

            if (
              trainee.risk === "High"
            ) {

              priority =
                "High";

              message =
                "Immediate counselling, skill support and placement assistance required.";

            }


            // --------------------------------------
            // LOW ATTENDANCE
            // --------------------------------------

            if (
              Number(
                trainee.attendance
              ) < 60
            ) {

              priority =
                "High";

              message =
                "Low attendance detected. Immediate counselling recommended.";

            }


            // --------------------------------------
            // LOW ASSESSMENT
            // --------------------------------------

            else if (
              Number(
                trainee.assessment
              ) < 50
            ) {

              if (
                trainee.risk !== "High"
              ) {

                priority =
                  "Medium";

              }

              message =
                "Low assessment score detected. Additional skill training recommended.";

            }


            // --------------------------------------
            // RETURN ALERT
            // --------------------------------------

            return {

              id:
                trainee.id,

              name:
                trainee.name,

              program:
                trainee.program,

              attendance:
                trainee.attendance,

              assessment:
                trainee.assessment,

              risk:
                trainee.risk,

              confidence:
                trainee.aiConfidence || 0,

              priority:
                priority,

              message:
                message,

              recommendedAction:
                trainee.recommendedAction ||
                message

            };

          });


      // ------------------------------------------
      // COUNT ALERTS
      // ------------------------------------------

      const highPriority =
        alerts.filter(

          (alert) =>
            alert.priority === "High"

        ).length;


      const mediumPriority =
        alerts.filter(

          (alert) =>
            alert.priority === "Medium"

        ).length;


      // ------------------------------------------
      // RESPONSE
      // ------------------------------------------

      res.json({

        totalAlerts:
          alerts.length,

        highPriority:
          highPriority,

        mediumPriority:
          mediumPriority,

        alerts:
          alerts

      });

    } catch (error) {

      console.error(
        "Error generating AI alerts:",
        error
      );

      res.status(500).json({

        message:
          "Failed to generate AI alerts",

        error:
          error.message

      });

    }

  }
);


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {

  res.status(404).json({

    message:
      "API endpoint not found"

  });

});


// ==========================================
// SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {

    console.log("");

    console.log(
      "========================================"
    );

    console.log(
      "KaushalTrack Backend"
    );

    console.log(
      "========================================"
    );

    console.log(
      `Server: http://localhost:${PORT}`
    );

    console.log(
      "MongoDB: Connected through Mongoose"
    );

    console.log(
      `AI Service: ${AI_SERVICE_URL}`
    );

    console.log(
      "Outcome Check-in API: Enabled"
    );

    console.log(
      "AI Alerts API: Enabled"
    );

    console.log(
      "Delete Trainee API: Enabled"
    );

    console.log(
      "Update Trainee API: Enabled"
    );

    console.log(
      "========================================"
    );

    console.log("");

  }
);