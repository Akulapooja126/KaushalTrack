import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import "./App.css";

const BACKEND_URL =
  "https://kaushaltrack-backend.onrender.com";

// =====================================================
// DASHBOARD
// =====================================================

function Dashboard({ trainees }) {
  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [alerts, setAlerts] =
    useState([]);

  const [alertsLoading, setAlertsLoading] =
    useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/alerts`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch AI alerts"
          );
        }

        const data =
          await response.json();

        // Backend returns the alerts array directly
        setAlerts(
          Array.isArray(data)
            ? data
            : data.alerts || []
        );
      } catch (error) {
        console.error(
          "Error fetching AI alerts:",
          error
        );
        setAlerts([]);
      } finally {
        setAlertsLoading(false);
      }
    };

    fetchAlerts();
  }, [trainees]);

  const total = trainees.length;

  const employed = trainees.filter(
    (trainee) =>
      trainee.status === "Employed"
  ).length;

  const seekingJob = trainees.filter(
    (trainee) =>
      trainee.status === "Seeking Job"
  ).length;

  const selfEmployed = trainees.filter(
    (trainee) =>
      trainee.status === "Self Employed"
  ).length;

  const highRisk = trainees.filter(
    (trainee) =>
      trainee.risk === "High"
  ).length;

  const mediumRisk = trainees.filter(
    (trainee) =>
      trainee.risk === "Medium"
  ).length;

  const lowRisk = trainees.filter(
    (trainee) =>
      trainee.risk === "Low"
  ).length;

  const highPriorityAlerts =
    alerts.filter(
      (alert) =>
        alert.risk === "High"
    ).length;

  const mediumPriorityAlerts =
    alerts.filter(
      (alert) =>
        alert.risk === "Medium"
    ).length;

  const getSelectedTrainees = () => {
    switch (selectedCategory) {
      case "Employed":
        return trainees.filter(
          (trainee) =>
            trainee.status === "Employed"
        );

      case "Seeking Job":
        return trainees.filter(
          (trainee) =>
            trainee.status === "Seeking Job"
        );

      case "Self Employed":
        return trainees.filter(
          (trainee) =>
            trainee.status === "Self Employed"
        );

      case "High Risk":
        return trainees.filter(
          (trainee) =>
            trainee.risk === "High"
        );

      case "Medium Risk":
        return trainees.filter(
          (trainee) =>
            trainee.risk === "Medium"
        );

      case "Low Risk":
        return trainees.filter(
          (trainee) =>
            trainee.risk === "Low"
        );

      case "Total":
        return trainees;

      default:
        return [];
    }
  };

  const selectedTrainees =
    getSelectedTrainees();

  return (
    <div>
      <h2>Dashboard</h2>

      <p>
        KaushalTrack overview and trainee impact
        monitoring
      </p>

      <div className="stats">
        <div
          className="stat-card clickable"
          onClick={() =>
            setSelectedCategory("Total")
          }
        >
          <h3>Total Trainees</h3>
          <strong>{total}</strong>
        </div>

        <div
          className="stat-card clickable"
          onClick={() =>
            setSelectedCategory("Employed")
          }
        >
          <h3>Employed</h3>
          <strong>{employed}</strong>
        </div>

        <div
          className="stat-card clickable"
          onClick={() =>
            setSelectedCategory("Seeking Job")
          }
        >
          <h3>Seeking Job</h3>
          <strong>{seekingJob}</strong>
        </div>

        <div
          className="stat-card clickable"
          onClick={() =>
            setSelectedCategory("Self Employed")
          }
        >
          <h3>Self Employed</h3>
          <strong>{selfEmployed}</strong>
        </div>

        <div
          className="stat-card clickable"
          onClick={() =>
            setSelectedCategory("High Risk")
          }
        >
          <h3>High Risk</h3>
          <strong>{highRisk}</strong>
        </div>

        <div
          className="stat-card clickable"
          onClick={() =>
            setSelectedCategory("Medium Risk")
          }
        >
          <h3>Medium Risk</h3>
          <strong>{mediumRisk}</strong>
        </div>

        <div
          className="stat-card clickable"
          onClick={() =>
            setSelectedCategory("Low Risk")
          }
        >
          <h3>Low Risk</h3>
          <strong>{lowRisk}</strong>
        </div>
      </div>

      {selectedCategory && (
        <div className="info-card">
          <div className="section-title">
            <h3>
              {selectedCategory === "Total"
                ? "All Trainees"
                : `${selectedCategory} Trainees`}
            </h3>

            <button
              className="small-button"
              type="button"
              onClick={() =>
                setSelectedCategory(null)
              }
            >
              Close
            </button>
          </div>

          {selectedTrainees.length === 0 ? (
            <p>No trainees found.</p>
          ) : (
            <div className="details-grid">
              {selectedTrainees.map(
                (trainee) => (
                  <div
                    className="detail-card"
                    key={
                      trainee._id ||
                      trainee.id
                    }
                  >
                    <h3>
                      {trainee.name}
                    </h3>

                    <p>
                      <strong>
                        Program:
                      </strong>{" "}
                      {trainee.program}
                    </p>

                    <p>
                      <strong>
                        Status:
                      </strong>{" "}
                      {trainee.status}
                    </p>

                    <p>
                      <strong>
                        Attendance:
                      </strong>{" "}
                      {trainee.attendance}%
                    </p>

                    <p>
                      <strong>
                        Assessment:
                      </strong>{" "}
                      {trainee.assessment}%
                    </p>

                    <p>
                      <strong>
                        AI Risk:
                      </strong>{" "}
                      {trainee.risk ||
                        "Not Available"}
                    </p>

                    <p>
                      <strong>
                        AI Confidence:
                      </strong>{" "}
                      {trainee.aiConfidence ??
                        0}
                      %
                    </p>

                    {trainee.status ===
                      "Employed" && (
                      <>
                        <p>
                          <strong>
                            Company:
                          </strong>{" "}
                          {trainee.company ||
                            "Not provided"}
                        </p>

                        <p>
                          <strong>
                            Sector:
                          </strong>{" "}
                          {trainee.sector ||
                            "Not provided"}
                        </p>

                        <p>
                          <strong>
                            Salary:
                          </strong>{" "}
                          {trainee.salary ||
                            "Not provided"}
                        </p>

                        <p>
                          <strong>
                            Employment Date:
                          </strong>{" "}
                          {trainee.employmentDate ||
                            "Not provided"}
                        </p>
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          ADVANCED ANALYTICS
          ===================================================== */}

      <div
        className="info-card"
        style={{
          marginBottom: "24px"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >
          <div>
            <h3
              style={{
                marginBottom: "6px"
              }}
            >
              📊 Advanced Impact Analytics
            </h3>

            <p
              style={{
                margin: 0
              }}
            >
              Data-driven view of employment
              outcomes, program performance and
              AI risk.
            </p>
          </div>

          <span
            style={{
              padding: "7px 12px",
              borderRadius: "18px",
              background: "#eef2ff",
              fontWeight: "700",
              fontSize: "13px"
            }}
          >
            Live from trainee records
          </span>
        </div>

        {(() => {
          const programNames =
            Array.from(
              new Set(
                trainees
                  .map(
                    (t) => t.program
                  )
                  .filter(Boolean)
              )
            ).sort();

          const programPerformance =
            programNames.map(
              (program) => {
                const group =
                  trainees.filter(
                    (t) =>
                      t.program ===
                      program
                  );

                const avgAssessment =
                  group.length
                    ? group.reduce(
                        (
                          sum,
                          t
                        ) =>
                          sum +
                          Number(
                            t.assessment ||
                              0
                          ),
                        0
                      ) /
                      group.length
                    : 0;

                const avgAttendance =
                  group.length
                    ? group.reduce(
                        (
                          sum,
                          t
                        ) =>
                          sum +
                          Number(
                            t.attendance ||
                              0
                          ),
                        0
                      ) /
                      group.length
                    : 0;

                const employedCount =
                  group.filter(
                    (t) =>
                      t.status ===
                      "Employed"
                  ).length;

                const employmentRate =
                  group.length
                    ? (employedCount /
                        group.length) *
                      100
                    : 0;

                return {
                  program:
                    program.length >
                    20
                      ? `${program.slice(
                          0,
                          20
                        )}…`
                      : program,

                  assessment:
                    Number(
                      avgAssessment.toFixed(
                        1
                      )
                    ),

                  attendance:
                    Number(
                      avgAttendance.toFixed(
                        1
                      )
                    ),

                  employmentRate:
                    Number(
                      employmentRate.toFixed(
                        1
                      )
                    )
                };
              }
            );

          const riskByProgram =
            programNames.map(
              (program) => {
                const group =
                  trainees.filter(
                    (t) =>
                      t.program ===
                      program
                  );

                return {
                  program:
                    program.length >
                    20
                      ? `${program.slice(
                          0,
                          20
                        )}…`
                      : program,

                  High: group.filter(
                    (t) =>
                      t.risk ===
                      "High"
                  ).length,

                  Medium:
                    group.filter(
                      (t) =>
                        t.risk ===
                        "Medium"
                    ).length,

                  Low: group.filter(
                    (t) =>
                      t.risk ===
                      "Low"
                  ).length
                };
              }
            );

          const outcomeData = [
            {
              name: "Employed",
              value: employed
            },
            {
              name: "Seeking Job",
              value: seekingJob
            },
            {
              name: "Self Employed",
              value: selfEmployed
            }
          ].filter(
            (item) =>
              item.value > 0
          );

          const employmentMonths =
            {};

          trainees.forEach(
            (trainee) => {
              if (
                trainee.status ===
                  "Employed" &&
                trainee.employmentDate
              ) {
                const date =
                  new Date(
                    trainee.employmentDate
                  );

                if (
                  !Number.isNaN(
                    date.getTime()
                  )
                ) {
                  const key =
                    date.toLocaleString(
                      "en-US",
                      {
                        month:
                          "short",
                        year:
                          "numeric"
                      }
                    );

                  employmentMonths[
                    key
                  ] =
                    (employmentMonths[
                      key
                    ] || 0) + 1;
                }
              }
            }
          );

          const employmentTrend =
            Object.entries(
              employmentMonths
            )
              .map(
                ([
                  month,
                  count
                ]) => ({
                  month,
                  employed:
                    count
                })
              )
              .sort(
                (a, b) =>
                  new Date(
                    a.month
                  ) -
                  new Date(
                    b.month
                  )
              );

          const averageAssessment =
            total
              ? trainees.reduce(
                  (
                    sum,
                    t
                  ) =>
                    sum +
                    Number(
                      t.assessment ||
                        0
                    ),
                  0
                ) / total
              : 0;

          const averageAttendance =
            total
              ? trainees.reduce(
                  (
                    sum,
                    t
                  ) =>
                    sum +
                    Number(
                      t.attendance ||
                        0
                    ),
                  0
                ) / total
              : 0;

          const employmentRate =
            total
              ? ((employed +
                  selfEmployed) /
                  total) *
                100
              : 0;

          const interventionRate =
            total
              ? ((highRisk +
                  mediumRisk) /
                  total) *
                100
              : 0;

          const impactCards = [
            [
              "Employment / Self-employment",
              `${employmentRate.toFixed(
                1
              )}%`,
              "Trainees with positive outcome"
            ],
            [
              "Average Attendance",
              `${averageAttendance.toFixed(
                1
              )}%`,
              "Across all trainees"
            ],
            [
              "Average Assessment",
              `${averageAssessment.toFixed(
                1
              )}%`,
              "Learning performance"
            ],
            [
              "Needs Intervention",
              `${interventionRate.toFixed(
                1
              )}%`,
              "Medium + High AI risk"
            ]
          ];

          return (
            <>
              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: "14px",
                  marginTop:
                    "20px"
                }}
              >
                {impactCards.map(
                  ([
                    title,
                    value,
                    subtitle
                  ]) => (
                    <div
                      key={
                        title
                      }
                      style={{
                        padding:
                          "16px",
                        borderRadius:
                          "12px",
                        border:
                          "1px solid #e5e7eb",
                        background:
                          "#fafafa"
                      }}
                    >
                      <div
                        style={{
                          fontSize:
                            "13px",
                          fontWeight:
                            "700",
                          marginBottom:
                            "7px"
                        }}
                      >
                        {
                          title
                        }
                      </div>

                      <div
                        style={{
                          fontSize:
                            "26px",
                          fontWeight:
                            "800"
                        }}
                      >
                        {
                          value
                        }
                      </div>

                      <div
                        style={{
                          fontSize:
                            "12px",
                          opacity:
                            0.7,
                          marginTop:
                            "4px"
                        }}
                      >
                        {
                          subtitle
                        }
                      </div>
                    </div>
                  )
                )}
              </div>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(340px, 1fr))",
                  gap: "20px",
                  marginTop:
                    "22px"
                }}
              >
                <div>
                  <h4>
                    🏆 Program Performance
                  </h4>

                  {programPerformance.length ===
                  0 ? (
                    <p>
                      No program data
                      available yet.
                    </p>
                  ) : (
                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >
                      <BarChart
                        data={
                          programPerformance
                        }
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                        />

                        <XAxis
                          dataKey="program"
                          angle={-20}
                          textAnchor="end"
                          height={70}
                          interval={0}
                        />

                        <YAxis
                          domain={[
                            0,
                            100
                          ]}
                        />

                        <Tooltip />

                        <Legend />

                        <Bar
                          dataKey="assessment"
                          name="Assessment %"
                        />

                        <Bar
                          dataKey="attendance"
                          name="Attendance %"
                        />

                        <Bar
                          dataKey="employmentRate"
                          name="Positive Outcome %"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div>
                  <h4>
                    ⚠️ Risk Distribution by Program
                  </h4>

                  {riskByProgram.length ===
                  0 ? (
                    <p>
                      No risk data
                      available yet.
                    </p>
                  ) : (
                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >
                      <BarChart
                        data={
                          riskByProgram
                        }
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                        />

                        <XAxis
                          dataKey="program"
                          angle={-20}
                          textAnchor="end"
                          height={70}
                          interval={0}
                        />

                        <YAxis
                          allowDecimals={
                            false
                          }
                        />

                        <Tooltip />

                        <Legend />

                        <Bar
                          dataKey="High"
                          stackId="risk"
                        />

                        <Bar
                          dataKey="Medium"
                          stackId="risk"
                        />

                        <Bar
                          dataKey="Low"
                          stackId="risk"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div>
                  <h4>
                    🎯 Outcome Distribution
                  </h4>

                  {outcomeData.length ===
                  0 ? (
                    <p>
                      No outcome data
                      available yet.
                    </p>
                  ) : (
                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >
                      <PieChart>
                        <Pie
                          data={
                            outcomeData
                          }
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={
                            95
                          }
                          label={({
                            name,
                            value
                          }) =>
                            `${name}: ${value}`
                          }
                        >
                          {outcomeData.map(
                            (
                              entry,
                              index
                            ) => (
                              <Cell
                                key={`outcome-${index}`}
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip />

                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div>
                  <h4>
                    📈 Employment Outcome Trend
                  </h4>

                  {employmentTrend.length ===
                  0 ? (
                    <p>
                      Employment dates
                      are needed to
                      display the trend.
                    </p>
                  ) : (
                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >
                      <BarChart
                        data={
                          employmentTrend
                        }
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                        />

                        <XAxis
                          dataKey="month"
                        />

                        <YAxis
                          allowDecimals={
                            false
                          }
                        />

                        <Tooltip />

                        <Legend />

                        <Bar
                          dataKey="employed"
                          name="Newly Employed"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div
                style={{
                  marginTop:
                    "18px",
                  padding:
                    "12px 14px",
                  borderRadius:
                    "10px",
                  background:
                    "#f8fafc",
                  fontSize:
                    "13px"
                }}
              >
                <strong>
                  Analytics note:
                </strong>{" "}
                These metrics are
                calculated from the
                trainee records currently
                stored in KaushalTrack.
                Industry-demand
                benchmarks remain
                demo/reference values unless
                connected to a live
                labour-market data source.
              </div>
            </>
          );
        })()}
      </div>

      {/* =====================================================
          AI ALERTS
          ===================================================== */}

      <div
        className="info-card"
        style={{
          marginBottom: "24px",
          borderLeft:
            "5px solid #e53935"
        }}
      >
        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: "16px",
            flexWrap:
              "wrap"
          }}
        >
          <div>
            <h3
              style={{
                marginBottom:
                  "6px"
              }}
            >
              🚨 AI Early Intervention Alerts
            </h3>

            <p
              style={{
                margin: 0
              }}
            >
              AI-identified trainees who
              may need additional support.
            </p>
          </div>

          <div
            style={{
              display:
                "flex",
              gap: "10px",
              flexWrap:
                "wrap"
            }}
          >
            <span
              style={{
                padding:
                  "8px 12px",
                borderRadius:
                  "20px",
                background:
                  "#ffebee",
                color:
                  "#c62828",
                fontWeight:
                  "700"
              }}
            >
              High:{" "}
              {highPriorityAlerts}
            </span>

            <span
              style={{
                padding:
                  "8px 12px",
                borderRadius:
                  "20px",
                background:
                  "#fff8e1",
                color:
                  "#ef6c00",
                fontWeight:
                  "700"
              }}
            >
              Medium:{" "}
              {mediumPriorityAlerts}
            </span>
          </div>
        </div>

        {alertsLoading ? (
          <p
            style={{
              marginTop:
                "18px"
            }}
          >
            Loading AI alerts...
          </p>
        ) : alerts.length ===
          0 ? (
          <p
            style={{
              marginTop:
                "18px"
            }}
          >
            ✅ No trainees currently
            require intervention.
          </p>
        ) : (
          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              marginTop:
                "20px"
            }}
          >
            {alerts.map(
              (alert) => {
                const risk =
                  alert.risk ||
                  "Medium";

                const isHigh =
                  risk ===
                  "High";

                return (
                  <div
                    key={
                      alert.id ||
                      alert._id ||
                      alert.name
                    }
                    style={{
                      padding:
                        "16px",
                      borderRadius:
                        "12px",
                      border: `1px solid ${
                        isHigh
                          ? "#ef9a9a"
                          : "#ffcc80"
                      }`,
                      background:
                        isHigh
                          ? "#fff5f5"
                          : "#fffaf0"
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap:
                          "10px"
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin:
                              "0 0 5px"
                          }}
                        >
                          {
                            alert.name
                          }
                        </h3>

                        <p
                          style={{
                            margin: 0,
                            fontSize:
                              "14px"
                          }}
                        >
                          {
                            alert.program
                          }
                        </p>
                      </div>

                      <strong
                        style={{
                          fontSize:
                            "12px",
                          padding:
                            "6px 9px",
                          borderRadius:
                            "15px",
                          background:
                            isHigh
                              ? "#ffebee"
                              : "#fff3e0",
                          color:
                            isHigh
                              ? "#c62828"
                              : "#ef6c00",
                          whiteSpace:
                            "nowrap"
                        }}
                      >
                        {risk} Risk
                      </strong>
                    </div>

                    <div
                      style={{
                        display:
                          "flex",
                        flexWrap:
                          "wrap",
                        gap:
                          "8px",
                        margin:
                          "14px 0",
                        fontSize:
                          "13px"
                      }}
                    >
                      <span>
                        Attendance:{" "}
                        {
                          alert.attendance ??
                          0
                        }%
                      </span>

                      <span>
                        Assessment:{" "}
                        {
                          alert.assessment ??
                          0
                        }%
                      </span>

                      <span>
                        AI Confidence:{" "}
                        {
                          alert.confidence ??
                          0
                        }%
                      </span>
                    </div>

                    <p
                      style={{
                        margin:
                          "8px 0",
                        fontWeight:
                          "600"
                      }}
                    >
                      {isHigh
                        ? "Immediate attention may be required."
                        : "Additional monitoring and support may be required."}
                    </p>

                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        fontSize:
                          "14px"
                      }}
                    >
                      <strong>
                        Recommended Action:
                      </strong>{" "}
                      {alert.recommendedAction ||
                        "Provide counselling and additional learning support."}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      <div className="info-card">
        <h3>
          KaushalTrack Purpose
        </h3>

        <p>
          KaushalTrack tracks trainee
          outcomes, identifies skill gaps
          and uses AI-powered risk
          prediction to help training
          administrators identify trainees
          who may require early support.
        </p>
      </div>
    </div>
  );
}

// =====================================================
// TRAINEE PROFILE / DETAILS
// =====================================================

function TraineeProfile({
  trainee,
  onClose
}) {
  const [history, setHistory] =
    useState([]);

  const [loadingHistory, setLoadingHistory] =
    useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response =
          await fetch(
            `${BACKEND_URL}/api/trainees/${trainee.id}/outcomes`
          );

        const data =
          await response.json();

        if (response.ok) {
          setHistory(
            data.outcomes ||
              data.outcomeHistory ||
              []
          );
        } else {
          console.error(
            "Failed to fetch profile history:",
            data.message
          );
        }
      } catch (error) {
        console.error(
          "Profile history error:",
          error
        );
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [trainee.id]);

  return (
    <div
      className="info-card"
      style={{
        marginBottom:
          "24px"
      }}
    >
      <div className="section-title">
        <div>
          <h2>
            👤 Trainee Profile
          </h2>

          <p>
            Complete details and outcome
            history for{" "}
            {trainee.name}
          </p>
        </div>

        <button
          type="button"
          className="small-button"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <h3>
            Basic Information
          </h3>

          <p>
            <strong>
              Name:
            </strong>{" "}
            {trainee.name ||
              "Not provided"}
          </p>

          <p>
            <strong>
              Trainee ID:
            </strong>{" "}
            {trainee.id ||
              "Not provided"}
          </p>

          <p>
            <strong>
              Program:
            </strong>{" "}
            {trainee.program ||
              "Not provided"}
          </p>

          <p>
            <strong>
              Status:
            </strong>{" "}
            {trainee.status ||
              "Not provided"}
          </p>
        </div>

        <div className="detail-card">
          <h3>
            Training Performance
          </h3>

          <p>
            <strong>
              Attendance:
            </strong>{" "}
            {trainee.attendance ??
              0}
            %
          </p>

          <p>
            <strong>
              Assessment:
            </strong>{" "}
            {trainee.assessment ??
              0}
            %
          </p>

          <p>
            <strong>
              AI Risk:
            </strong>{" "}
            <span
              className={`risk ${
                trainee.risk
                  ? trainee.risk.toLowerCase()
                  : ""
              }`}
            >
              {trainee.risk ||
                "Not Available"}
            </span>
          </p>

          <p>
            <strong>
              AI Confidence:
            </strong>{" "}
            {trainee.aiConfidence ??
              0}
            %
          </p>
        </div>

        <div className="detail-card">
          <h3>
            Employment Information
          </h3>

          <p>
            <strong>
              Company:
            </strong>{" "}
            {trainee.company ||
              "Not provided"}
          </p>

          <p>
            <strong>
              Sector:
            </strong>{" "}
            {trainee.sector ||
              "Not provided"}
          </p>

          <p>
            <strong>
              Salary / Wage:
            </strong>{" "}
            {trainee.salary ||
              "Not provided"}
          </p>

          <p>
            <strong>
              Employment Date:
            </strong>{" "}
            {trainee.employmentDate ||
              "Not provided"}
          </p>
        </div>

        <div className="detail-card">
          <h3>
            🤖 AI Recommendation
          </h3>

          <p>
            {trainee.recommendedAction ||
              "Provide additional counselling and learning support."}
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop:
            "24px"
        }}
      >
        <h3>
          📈 Outcome History
        </h3>

        {loadingHistory ? (
          <p>
            Loading outcome history...
          </p>
        ) : history.length ===
          0 ? (
          <p>
            No outcome check-ins
            recorded yet.
          </p>
        ) : (
          <div className="details-grid">
            {history
              .slice()
              .reverse()
              .map(
                (
                  outcome,
                  index
                ) => (
                  <div
                    className="detail-card"
                    key={
                      outcome._id ||
                      index
                    }
                  >
                    <h3>
                      Check-in #
                      {history.length -
                        index}
                    </h3>

                    <p>
                      <strong>
                        Check-in Date:
                      </strong>{" "}
                      {outcome.checkInDate ||
                        (outcome.date
                          ? new Date(
                              outcome.date
                            ).toLocaleDateString()
                          : "Not provided")}
                    </p>

                    <p>
                      <strong>
                        Status:
                      </strong>{" "}
                      {outcome.status ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>
                        Company:
                      </strong>{" "}
                      {outcome.company ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>
                        Sector:
                      </strong>{" "}
                      {outcome.sector ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>
                        Salary:
                      </strong>{" "}
                      {outcome.salary ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>
                        Employment Date:
                      </strong>{" "}
                      {outcome.employmentDate ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>
                        Remarks:
                      </strong>{" "}
                      {outcome.notes ||
                        outcome.remarks ||
                        "No remarks"}
                    </p>
                  </div>
                )
              )}
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// TRAINEES
// =====================================================

function Trainees({
  trainees,
  showForm,
  setShowForm,
  formData,
  handleChange,
  handleSubmit,
  editingTrainee,
  handleEditTrainee,
  handleDeleteTrainee,
  resetForm,
  onViewProfile
}) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [programFilter, setProgramFilter] =
    useState("All");

  const [riskFilter, setRiskFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("None");

  const programs =
    Array.from(
      new Set(
        trainees
          .map(
            (trainee) =>
              trainee.program
          )
          .filter(Boolean)
      )
    ).sort(
      (a, b) =>
        a.localeCompare(b)
    );

  const normalizedSearch =
    searchTerm
      .trim()
      .toLowerCase();

  const filteredTrainees =
    trainees
      .filter((trainee) => {
        const name =
          String(
            trainee.name || ""
          ).toLowerCase();

        const program =
          String(
            trainee.program ||
              ""
          ).toLowerCase();

        const matchesSearch =
          normalizedSearch ===
            "" ||
          name.includes(
            normalizedSearch
          ) ||
          program.includes(
            normalizedSearch
          );

        const matchesProgram =
          programFilter ===
            "All" ||
          trainee.program ===
            programFilter;

        const matchesRisk =
          riskFilter ===
            "All" ||
          trainee.risk ===
            riskFilter;

        const matchesStatus =
          statusFilter ===
            "All" ||
          trainee.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesProgram &&
          matchesRisk &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        if (
          sortBy ===
          "Assessment High"
        ) {
          return (
            Number(
              b.assessment ||
                0
            ) -
            Number(
              a.assessment ||
                0
            )
          );
        }

        if (
          sortBy ===
          "Assessment Low"
        ) {
          return (
            Number(
              a.assessment ||
                0
            ) -
            Number(
              b.assessment ||
                0
            )
          );
        }

        if (
          sortBy ===
          "Attendance High"
        ) {
          return (
            Number(
              b.attendance ||
                0
            ) -
            Number(
              a.attendance ||
                0
            )
          );
        }

        if (
          sortBy ===
          "Attendance Low"
        ) {
          return (
            Number(
              a.attendance ||
                0
            ) -
            Number(
              b.attendance ||
                0
            )
          );
        }

        if (
          sortBy ===
          "Name A-Z"
        ) {
          return String(
            a.name || ""
          ).localeCompare(
            String(
              b.name || ""
            )
          );
        }

        return 0;
      });

  const resetFilters = () => {
    setSearchTerm("");
    setProgramFilter("All");
    setRiskFilter("All");
    setStatusFilter("All");
    setSortBy("None");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            Trainees
          </h2>

          <p>
            Manage and monitor training
            participants
          </p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={() =>
            setShowForm(
              !showForm
            )
          }
        >
          ➕ Add Trainee
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>
            {editingTrainee
              ? "Edit Trainee"
              : "Add New Trainee"}
          </h3>

          <form
            onSubmit={
              handleSubmit
            }
          >
            <div className="form-group">
              <label>
                Name
              </label>

              <input
                type="text"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                placeholder="Enter trainee name"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Program
              </label>

              <input
                type="text"
                name="program"
                value={
                  formData.program
                }
                onChange={
                  handleChange
                }
                placeholder="Enter training program"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Attendance (%)
              </label>

              <input
                type="number"
                name="attendance"
                value={
                  formData.attendance
                }
                onChange={
                  handleChange
                }
                placeholder="Enter attendance"
                min="0"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Assessment (%)
              </label>

              <input
                type="number"
                name="assessment"
                value={
                  formData.assessment
                }
                onChange={
                  handleChange
                }
                placeholder="Enter assessment score"
                min="0"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Status
              </label>

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleChange
                }
              >
                <option value="Seeking Job">
                  Seeking Job
                </option>

                <option value="Employed">
                  Employed
                </option>

                <option value="Self Employed">
                  Self Employed
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Company
              </label>

              <input
                type="text"
                name="company"
                value={
                  formData.company
                }
                onChange={
                  handleChange
                }
                placeholder="Company name"
              />
            </div>

            <div className="form-group">
              <label>
                Sector
              </label>

              <input
                type="text"
                name="sector"
                value={
                  formData.sector
                }
                onChange={
                  handleChange
                }
                placeholder="IT, Banking, Healthcare..."
              />
            </div>

            <div className="form-group">
              <label>
                Salary / Wage
              </label>

              <input
                type="text"
                name="salary"
                value={
                  formData.salary
                }
                onChange={
                  handleChange
                }
                placeholder="₹25,000/month"
              />
            </div>

            <div className="form-group">
              <label>
                Employment Date
              </label>

              <input
                type="date"
                name="employmentDate"
                value={
                  formData.employmentDate
                }
                onChange={
                  handleChange
                }
              />
            </div>

            <div className="form-group">
              <label>
                AI Risk Prediction
              </label>

              <div className="ai-info">
                Automatically calculated by
                AI using attendance and
                assessment.
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="save-button"
              >
                {editingTrainee
                  ? "Update Trainee"
                  : "Save Trainee"}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={
                  resetForm
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="info-card">
        <h3>
          🔍 Search & Filter Trainees
        </h3>

        <p>
          Search by trainee name or
          program and filter the list by
          program, AI risk and employment
          status.
        </p>

        <div className="form-group">
          <label>
            Search Trainees
          </label>

          <input
            type="search"
            value={
              searchTerm
            }
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            placeholder="Type a name or program..."
            autoComplete="off"
          />
        </div>

        <div className="details-grid">
          <div className="form-group">
            <label>
              Training Program
            </label>

            <select
              value={
                programFilter
              }
              onChange={(e) =>
                setProgramFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Programs
              </option>

              {programs.map(
                (program) => (
                  <option
                    key={program}
                    value={
                      program
                    }
                  >
                    {program}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="form-group">
            <label>
              AI Risk
            </label>

            <select
              value={
                riskFilter
              }
              onChange={(e) =>
                setRiskFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Risk Levels
              </option>

              <option value="High">
                🔴 High Risk
              </option>

              <option value="Medium">
                🟡 Medium Risk
              </option>

              <option value="Low">
                🟢 Low Risk
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Employment Status
            </label>

            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Employed">
                Employed
              </option>

              <option value="Seeking Job">
                Seeking Job
              </option>

              <option value="Self Employed">
                Self Employed
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Sort By
            </label>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
            >
              <option value="None">
                Default Order
              </option>

              <option value="Assessment High">
                Assessment: High → Low
              </option>

              <option value="Assessment Low">
                Assessment: Low → High
              </option>

              <option value="Attendance High">
                Attendance: High → Low
              </option>

              <option value="Attendance Low">
                Attendance: Low → High
              </option>

              <option value="Name A-Z">
                Name: A → Z
              </option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="small-button"
            onClick={
              resetFilters
            }
          >
            🔄 Reset Filters
          </button>
        </div>

        <p
          style={{
            marginTop:
              "15px"
          }}
        >
          Showing{" "}
          <strong>
            {
              filteredTrainees.length
            }
          </strong>{" "}
          of{" "}
          <strong>
            {trainees.length}
          </strong>{" "}
          trainees
        </p>
      </div>

      <div className="trainee-grid">
        {filteredTrainees.length ===
        0 ? (
          <div className="info-card">
            <h3>
              🔎 No Trainees Found
            </h3>

            <p>
              No trainees match your
              search or filters.
            </p>

            <button
              type="button"
              className="small-button"
              onClick={
                resetFilters
              }
            >
              🔄 Clear Search & Filters
            </button>
          </div>
        ) : (
          filteredTrainees.map(
            (trainee) => (
              <div
                className="trainee-card"
                key={
                  trainee._id ||
                  trainee.id
                }
              >
                <h3>
                  {trainee.name}
                </h3>

                <p>
                  <strong>
                    Program:
                  </strong>{" "}
                  {trainee.program}
                </p>

                <p>
                  <strong>
                    Attendance:
                  </strong>{" "}
                  {trainee.attendance}%
                </p>

                <p>
                  <strong>
                    Assessment:
                  </strong>{" "}
                  {trainee.assessment}%
                </p>

                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  {trainee.status}
                </p>

                {trainee.company && (
                  <p>
                    <strong>
                      Company:
                    </strong>{" "}
                    {trainee.company}
                  </p>
                )}

                {trainee.sector && (
                  <p>
                    <strong>
                      Sector:
                    </strong>{" "}
                    {trainee.sector}
                  </p>
                )}

                {trainee.salary && (
                  <p>
                    <strong>
                      Salary:
                    </strong>{" "}
                    {trainee.salary}
                  </p>
                )}

                {trainee.employmentDate && (
                  <p>
                    <strong>
                      Employment Date:
                    </strong>{" "}
                    {
                      trainee.employmentDate
                    }
                  </p>
                )}

                <p>
                  <strong>
                    AI Risk:
                  </strong>{" "}
                  <span
                    className={`risk ${
                      trainee.risk
                        ? trainee.risk.toLowerCase()
                        : ""
                    }`}
                  >
                    {trainee.risk ||
                      "Not Available"}
                  </span>
                </p>

                <p>
                  <strong>
                    AI Confidence:
                  </strong>{" "}
                  {trainee.aiConfidence ??
                    0}
                  %
                </p>

                <p>
                  <strong>
                    Recommended Action:
                  </strong>{" "}
                  {trainee.recommendedAction ||
                    "Provide additional counselling and learning support."}
                </p>

                <div className="form-actions">
                  <button
                    type="button"
                    className="small-button"
                    onClick={() =>
                      onViewProfile(
                        trainee
                      )
                    }
                  >
                    👤 View Profile
                  </button>

                  <button
                    type="button"
                    className="small-button"
                    onClick={() =>
                      handleEditTrainee(
                        trainee
                      )
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() =>
                      handleDeleteTrainee(
                        trainee
                      )
                    }
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

// =====================================================
// OUTCOME CHECK-IN FORM
// =====================================================

function OutcomeCheckIn({
  trainee,
  onClose,
  onSaved
}) {
  const [formData, setFormData] =
    useState({
      status:
        trainee.status ||
        "Seeking Job",

      company:
        trainee.company ||
        "",

      sector:
        trainee.sector ||
        "",

      salary:
        trainee.salary ||
        "",

      employmentDate:
        trainee.employmentDate ||
        "",

      checkInDate:
        new Date()
          .toISOString()
          .split("T")[0],

      remarks:
        ""
    });

  const [saving, setSaving] =
    useState(false);

  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      // Backend expects "notes", not "remarks"
      const requestData = {
        status:
          formData.status,

        company:
          formData.company,

        sector:
          formData.sector,

        salary:
          formData.salary,

        employmentDate:
          formData.employmentDate,

        notes:
          formData.remarks
      };

      const response =
        await fetch(
          `${BACKEND_URL}/api/trainees/${trainee.id}/outcome`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify(
              requestData
            )
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to save outcome"
        );

        return;
      }

      alert(
        "Outcome check-in saved successfully!"
      );

      onSaved();
    } catch (error) {
      console.error(
        "Outcome check-in error:",
        error
      );

      alert(
        "Backend connection failed. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-card">
      <div className="section-title">
        <div>
          <h3>
            Outcome Check-in
          </h3>

          <p>
            Update outcome for{" "}
            <strong>
              {trainee.name}
            </strong>
          </p>
        </div>

        <button
          type="button"
          className="small-button"
          onClick={onClose}
          disabled={saving}
        >
          Close
        </button>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="form-group">
          <label>
            Status
          </label>

          <select
            name="status"
            value={
              formData.status
            }
            onChange={
              handleChange
            }
            required
          >
            <option value="Seeking Job">
              Seeking Job
            </option>

            <option value="Employed">
              Employed
            </option>

            <option value="Self Employed">
              Self Employed
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>
            Company
          </label>

          <input
            type="text"
            name="company"
            value={
              formData.company
            }
            onChange={
              handleChange
            }
            placeholder="Company name"
          />
        </div>

        <div className="form-group">
          <label>
            Sector
          </label>

          <input
            type="text"
            name="sector"
            value={
              formData.sector
            }
            onChange={
              handleChange
            }
            placeholder="IT, Banking, Healthcare..."
          />
        </div>

        <div className="form-group">
          <label>
            Salary / Wage
          </label>

          <input
            type="text"
            name="salary"
            value={
              formData.salary
            }
            onChange={
              handleChange
            }
            placeholder="₹25,000/month"
          />
        </div>

        <div className="form-group">
          <label>
            Employment Date
          </label>

          <input
            type="date"
            name="employmentDate"
            value={
              formData.employmentDate
            }
            onChange={
              handleChange
            }
          />
        </div>

        <div className="form-group">
          <label>
            Check-in Date
          </label>

          <input
            type="date"
            name="checkInDate"
            value={
              formData.checkInDate
            }
            onChange={
              handleChange
            }
            required
          />

          <small>
            The backend records the
            actual save time automatically.
          </small>
        </div>

        <div className="form-group">
          <label>
            Remarks
          </label>

          <textarea
            name="remarks"
            value={
              formData.remarks
            }
            onChange={
              handleChange
            }
            placeholder="Add notes about the trainee's current outcome..."
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="save-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Outcome Check-in"}
          </button>

          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// =====================================================
// OUTCOME HISTORY
// =====================================================

function OutcomeHistory({
  trainee,
  onClose
}) {
  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchHistory =
      async () => {
        try {
          const response =
            await fetch(
              `${BACKEND_URL}/api/trainees/${trainee.id}/outcomes`
            );

          const data =
            await response.json();

          if (response.ok) {
            setHistory(
              data.outcomes ||
                data.outcomeHistory ||
                []
            );
          } else {
            alert(
              data.message ||
                "Failed to fetch outcome history"
            );
          }
        } catch (error) {
          console.error(
            "History error:",
            error
          );

          alert(
            "Backend connection failed."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchHistory();
  }, [trainee.id]);

  return (
    <div className="info-card">
      <div className="section-title">
        <div>
          <h3>
            Outcome History
          </h3>

          <p>
            {trainee.name}
          </p>
        </div>

        <button
          type="button"
          className="small-button"
          onClick={
            onClose
          }
        >
          Close
        </button>
      </div>

      {loading ? (
        <p>
          Loading outcome history...
        </p>
      ) : history.length ===
        0 ? (
        <div>
          <p>
            No outcome check-ins
            recorded yet.
          </p>

          <p>
            Use{" "}
            <strong>
              Update Outcome
            </strong>{" "}
            to create the first
            check-in.
          </p>
        </div>
      ) : (
        <div className="details-grid">
          {history
            .slice()
            .reverse()
            .map(
              (
                outcome,
                index
              ) => (
                <div
                  className="detail-card"
                  key={
                    outcome._id ||
                    index
                  }
                >
                  <h3>
                    Check-in #
                    {history.length -
                      index}
                  </h3>

                  <p>
                    <strong>
                      Check-in Date:
                    </strong>{" "}
                    {outcome.checkInDate ||
                      (outcome.date
                        ? new Date(
                            outcome.date
                          ).toLocaleDateString()
                        : "Not provided")}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {outcome.status ||
                      "Not provided"}
                  </p>

                  <p>
                    <strong>
                      Company:
                    </strong>{" "}
                    {outcome.company ||
                      "Not provided"}
                  </p>

                  <p>
                    <strong>
                      Sector:
                    </strong>{" "}
                    {outcome.sector ||
                      "Not provided"}
                  </p>

                  <p>
                    <strong>
                      Salary:
                    </strong>{" "}
                    {outcome.salary ||
                      "Not provided"}
                  </p>

                  <p>
                    <strong>
                      Employment Date:
                    </strong>{" "}
                    {outcome.employmentDate ||
                      "Not provided"}
                  </p>

                  <p>
                    <strong>
                      Remarks:
                    </strong>{" "}
                    {outcome.notes ||
                      outcome.remarks ||
                      "No remarks"}
                  </p>
                </div>
              )
            )}
        </div>
      )}
    </div>
  );
}

// =====================================================
// OUTCOME TRACKER
// =====================================================

function OutcomeTracker({
  trainees,
  refreshTrainees
}) {
  const [selectedTrainee, setSelectedTrainee] =
    useState(null);

  const [viewingHistory, setViewingHistory] =
    useState(null);

  const total =
    trainees.length;

  const employed =
    trainees.filter(
      (trainee) =>
        trainee.status ===
        "Employed"
    ).length;

  const seekingJob =
    trainees.filter(
      (trainee) =>
        trainee.status ===
        "Seeking Job"
    ).length;

  const selfEmployed =
    trainees.filter(
      (trainee) =>
        trainee.status ===
        "Self Employed"
    ).length;

  const employmentRate =
    total > 0
      ? (
          (employed /
            total) *
          100
        ).toFixed(1)
      : 0;

  const handleSaved =
    async () => {
      setSelectedTrainee(
        null
      );

      await refreshTrainees();
    };

  return (
    <div>
      <h2>
        Outcome Tracker
      </h2>

      <p>
        Track employment and livelihood
        outcomes after training.
      </p>

      <div className="stats">
        <div className="stat-card">
          <h3>
            Total Trainees
          </h3>

          <strong>
            {total}
          </strong>
        </div>

        <div className="stat-card">
          <h3>
            Employed
          </h3>

          <strong>
            {employed}
          </strong>
        </div>

        <div className="stat-card">
          <h3>
            Seeking Job
          </h3>

          <strong>
            {seekingJob}
          </strong>
        </div>

        <div className="stat-card">
          <h3>
            Self Employed
          </h3>

          <strong>
            {selfEmployed}
          </strong>
        </div>

        <div className="stat-card">
          <h3>
            Employment Rate
          </h3>

          <strong>
            {employmentRate}%
          </strong>
        </div>
      </div>

      {selectedTrainee && (
        <OutcomeCheckIn
          trainee={
            selectedTrainee
          }
          onClose={() =>
            setSelectedTrainee(
              null
            )
          }
          onSaved={
            handleSaved
          }
        />
      )}

      {viewingHistory && (
        <OutcomeHistory
          trainee={
            viewingHistory
          }
          onClose={() =>
            setViewingHistory(
              null
            )
          }
        />
      )}

      <div className="info-card">
        <h3>
          Employment Outcome Details
        </h3>

        <div className="details-grid">
          {trainees.map(
            (trainee) => (
              <div
                className="detail-card"
                key={
                  trainee._id ||
                  trainee.id
                }
              >
                <h3>
                  {trainee.name}
                </h3>

                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  {trainee.status}
                </p>

                <p>
                  <strong>
                    Program:
                  </strong>{" "}
                  {trainee.program}
                </p>

                <p>
                  <strong>
                    Sector:
                  </strong>{" "}
                  {trainee.sector ||
                    "Not provided"}
                </p>

                <p>
                  <strong>
                    Company:
                  </strong>{" "}
                  {trainee.company ||
                    "Not provided"}
                </p>

                <p>
                  <strong>
                    Salary:
                  </strong>{" "}
                  {trainee.salary ||
                    "Not provided"}
                </p>

                <p>
                  <strong>
                    Employment Date:
                  </strong>{" "}
                  {trainee.employmentDate ||
                    "Not provided"}
                </p>

                <div className="form-actions">
                  <button
                    type="button"
                    className="save-button"
                    onClick={() => {
                      setViewingHistory(
                        null
                      );

                      setSelectedTrainee(
                        trainee
                      );
                    }}
                  >
                    📝 Update Outcome
                  </button>

                  <button
                    type="button"
                    className="small-button"
                    onClick={() => {
                      setSelectedTrainee(
                        null
                      );

                      setViewingHistory(
                        trainee
                      );
                    }}
                  >
                    📋 View History
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// SKILL GAP ANALYTICS
// =====================================================

function SkillGapAnalytics({
  trainees
}) {
  const industryDemand = {
    "Full Stack Development": 90,
    "Data Analytics": 85,
    "Python Programming": 88,
    "Java Programming": 82,
    "Java Script": 84,
    "Cloud Computing": 90,
    "AI and Machine Learning": 92,
    "C programming": 75
  };

  const recommendedSkills = {
    "Full Stack Development":
      "React.js, Node.js & SQL",

    "Data Analytics":
      "Python, SQL & Power BI",

    "Python Programming":
      "Advanced Python, APIs & Data Structures",

    "Java Programming":
      "Spring Boot, REST APIs & SQL",

    "Java Script":
      "JavaScript ES6+, React.js & Node.js",

    "Cloud Computing":
      "AWS/Azure & Cloud Deployment",

    "AI and Machine Learning":
      "Model Evaluation, Deep Learning & MLOps",

    "C programming":
      "Pointers, Data Structures & Problem Solving"
  };

  const programData =
    trainees.reduce(
      (
        result,
        trainee
      ) => {
        const existing =
          result.find(
            (item) =>
              item.program ===
              trainee.program
          );

        const assessment =
          Number(
            trainee.assessment
          ) || 0;

        if (existing) {
          existing.total +=
            1;

          existing.score +=
            assessment;
        } else {
          result.push({
            program:
              trainee.program,

            total: 1,

            score:
              assessment
          });
        }

        return result;
      },
      []
    );

  const chartData =
    programData.map(
      (item) => {
        const assessment =
          Number(
            (
              item.score /
              item.total
            ).toFixed(1)
          );

        const demand =
          industryDemand[
            item.program
          ] ?? 80;

        return {
          program:
            item.program,

          assessment,

          industryDemand:
            demand,

          skillGap:
            Math.max(
              0,
              Number(
                (
                  demand -
                  assessment
                ).toFixed(1)
              )
            )
        };
      }
    );

  const totalAssessment =
    trainees.reduce(
      (
        sum,
        trainee
      ) =>
        sum +
        (Number(
          trainee.assessment
        ) || 0),
      0
    );

  const averageAssessment =
    trainees.length
      ? Number(
          (
            totalAssessment /
            trainees.length
          ).toFixed(1)
        )
      : 0;

  const highSkillGapCount =
    trainees.filter(
      (trainee) =>
        Number(
          trainee.assessment
        ) < 50
    ).length;

  const mediumSkillGapCount =
    trainees.filter(
      (trainee) =>
        Number(
          trainee.assessment
        ) >= 50 &&
        Number(
          trainee.assessment
        ) < 70
    ).length;

  const lowSkillGapCount =
    trainees.filter(
      (trainee) =>
        Number(
          trainee.assessment
        ) >= 70
    ).length;

  const averageIndustryDemand =
    chartData.length
      ? Number(
          (
            chartData.reduce(
              (
                sum,
                item
              ) =>
                sum +
                item.industryDemand,
              0
            ) /
            chartData.length
          ).toFixed(1)
        )
      : 0;

  return (
    <div>
      <h2>
        Skill Gap Analytics
      </h2>

      <p>
        Analyze trainee assessment
        performance and compare current
        skills with sample
        industry-demand benchmarks to
        identify potential skill gaps.
      </p>

      <div className="stats">
        <div className="stat-card">
          <h3>
            Average Assessment
          </h3>

          <strong>
            {averageAssessment}%
          </strong>
        </div>

        <div className="stat-card">
          <h3>
            🔴 High Skill Gap
          </h3>

          <strong>
            {highSkillGapCount}
          </strong>
        </div>

        <div className="stat-card">
          <h3>
            🟡 Medium Skill Gap
          </h3>

          <strong>
            {mediumSkillGapCount}
          </strong>
        </div>

        <div className="stat-card">
          <h3>
            🟢 Low Skill Gap
          </h3>

          <strong>
            {lowSkillGapCount}
          </strong>
        </div>
      </div>

      <div className="info-card">
        <h3>
          Program-wise Assessment
          Performance
        </h3>

        <p>
          Average assessment score for
          each training program.
        </p>

        <div
          style={{
            width: "100%",
            height: 400
          }}
        >
          <ResponsiveContainer>
            <BarChart
              data={
                chartData
              }
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="program"
              />

              <YAxis
                domain={[
                  0,
                  100
                ]}
                label={{
                  value:
                    "Score (%)",
                  angle:
                    -90,
                  position:
                    "insideLeft"
                }}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="assessment"
                name="Average Assessment"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="info-card">
        <h3>
          Assessment vs Industry Demand
          Benchmark
        </h3>

        <p>
          The benchmark is sample demo
          data used to demonstrate how
          KaushalTrack can compare trainee
          performance with expected
          industry demand.
        </p>

        <p>
          Average benchmark across
          available programs:
          <strong>
            {" "}
            {
              averageIndustryDemand
            }
            %
          </strong>
        </p>

        <div
          style={{
            width: "100%",
            height: 430
          }}
        >
          <ResponsiveContainer>
            <BarChart
              data={
                chartData
              }
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="program"
              />

              <YAxis
                domain={[
                  0,
                  100
                ]}
                label={{
                  value:
                    "Score (%)",
                  angle:
                    -90,
                  position:
                    "insideLeft"
                }}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="assessment"
                name="Trainee Assessment"
              />

              <Bar
                dataKey="industryDemand"
                name="Industry Demand Benchmark"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="info-card">
        <h3>
          Skill Gap Details
        </h3>

        {trainees.length ===
        0 ? (
          <p>
            No trainees available for
            skill gap analysis.
          </p>
        ) : (
          trainees.map(
            (trainee) => {
              const assessment =
                Number(
                  trainee.assessment
                ) || 0;

              const demand =
                industryDemand[
                  trainee.program
                ] ?? 80;

              const skillGap =
                Math.max(
                  0,
                  Number(
                    (
                      demand -
                      assessment
                    ).toFixed(1)
                  )
                );

              let skillLevel;

              if (
                assessment < 50
              ) {
                skillLevel =
                  "High Skill Gap";
              } else if (
                assessment < 70
              ) {
                skillLevel =
                  "Medium Skill Gap";
              } else {
                skillLevel =
                  "Low Skill Gap";
              }

              const suggestedSkills =
                recommendedSkills[
                  trainee.program
                ] ||
                "Core technical and job-ready skills";

              return (
                <div
                  className="skill-row"
                  key={
                    trainee._id ||
                    trainee.id
                  }
                >
                  <div>
                    <strong>
                      {trainee.name}
                    </strong>

                    <span>
                      {trainee.program}
                    </span>
                  </div>

                  <div>
                    Assessment:{" "}
                    {assessment}%
                    {" — "}
                    <strong>
                      {
                        skillLevel
                      }
                    </strong>

                    <br />

                    Industry Demand:{" "}
                    {demand}%
                    {" — "}
                    Skill Gap:{" "}
                    {skillGap}%

                    <br />

                    <span>
                      Suggested Skills:{" "}
                      {
                        suggestedSkills
                      }
                    </span>
                  </div>
                </div>
              );
            }
          )
        )}
      </div>
    </div>
  );
}

// =====================================================
// AI RISK ENGINE
// =====================================================

function AIRiskEngine({
  trainees
}) {
  const highRiskTrainees =
    trainees.filter(
      (trainee) =>
        trainee.risk ===
        "High"
    );

  const mediumRiskTrainees =
    trainees.filter(
      (trainee) =>
        trainee.risk ===
        "Medium"
    );

  const lowRiskTrainees =
    trainees.filter(
      (trainee) =>
        trainee.risk ===
        "Low"
    );

  return (
    <div>
      <h2>
        AI Risk Engine
      </h2>

      <p>
        AI-powered prediction of
        trainees who may need early
        intervention and additional
        support.
      </p>

      <div className="stats">
        <div className="stat-card">
          <h3>
            🔴 High Risk
          </h3>

          <strong>
            {
              highRiskTrainees.length
            }
          </strong>
        </div>

        <div className="stat-card">
          <h3>
            🟡 Medium Risk
          </h3>

          <strong>
            {
              mediumRiskTrainees.length
            }
          </strong>
        </div>

        <div className="stat-card">
          <h3>
            🟢 Low Risk
          </h3>

          <strong>
            {
              lowRiskTrainees.length
            }
          </strong>
        </div>
      </div>

      <div className="info-card">
        <h3>
          🤖 AI Prediction Information
        </h3>

        <p>
          The AI Risk Engine analyzes
          trainee attendance and
          assessment performance using a
          Random Forest machine learning
          model.
        </p>

        <p>
          The system automatically
          classifies trainees into Low,
          Medium, or High risk
          categories.
        </p>
      </div>

      <div className="risk-list">
        {highRiskTrainees.map(
          (trainee) => (
            <div
              className="risk-card"
              key={
                trainee._id ||
                trainee.id
              }
            >
              <h3>
                ⚠️{" "}
                {trainee.name}
              </h3>

              <p>
                Program:{" "}
                {
                  trainee.program
                }
              </p>

              <p>
                Attendance:{" "}
                {
                  trainee.attendance
                }%
              </p>

              <p>
                Assessment:{" "}
                {
                  trainee.assessment
                }%
              </p>

              <p>
                Risk Level:{" "}
                <strong>
                  High
                </strong>
              </p>

              <p>
                AI Confidence:{" "}
                <strong>
                  {
                    trainee.aiConfidence ??
                    0
                  }
                  %
                </strong>
              </p>

              <p>
                Recommended Action:{" "}
                {
                  trainee.recommendedAction ||
                  "Provide additional counselling and learning support."
                }
              </p>
            </div>
          )
        )}
      </div>

      {mediumRiskTrainees.length >
        0 && (
        <div className="info-card">
          <h3>
            🟡 Medium Risk Trainees
          </h3>

          {mediumRiskTrainees.map(
            (trainee) => (
              <p
                key={
                  trainee._id ||
                  trainee.id
                }
              >
                <strong>
                  {
                    trainee.name
                  }
                </strong>
                {" — "}
                AI Confidence:{" "}
                {
                  trainee.aiConfidence ??
                  0
                }
                %
              </p>
            )
          )}
        </div>
      )}

      {lowRiskTrainees.length >
        0 && (
        <div className="info-card">
          <h3>
            🟢 Low Risk Trainees
          </h3>

          {lowRiskTrainees.map(
            (trainee) => (
              <p
                key={
                  trainee._id ||
                  trainee.id
                }
              >
                <strong>
                  {
                    trainee.name
                  }
                </strong>
                {" — "}
                AI Confidence:{" "}
                {
                  trainee.aiConfidence ??
                  0
                }
                %
              </p>
            )
          )}
        </div>
      )}

      {highRiskTrainees.length ===
        0 && (
        <div className="info-card">
          <h3>
            ✅ No High-Risk Trainees
          </h3>

          <p>
            Currently there are no
            trainees classified as high
            risk.
          </p>
        </div>
      )}
    </div>
  );
}

// =====================================================
// MAIN APP
// =====================================================

function App() {
  const [activePage, setActivePage] =
    useState("Dashboard");

  const [trainees, setTrainees] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingTrainee, setEditingTrainee] =
    useState(null);

  const [viewingTrainee, setViewingTrainee] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      program: "",
      attendance: "",
      assessment: "",
      status:
        "Seeking Job",
      company: "",
      sector: "",
      salary: "",
      employmentDate: ""
    });

  // ===================================================
  // FETCH TRAINEES
  // ===================================================

  const fetchTrainees =
    async () => {
      try {
        const response =
          await fetch(
            `${BACKEND_URL}/api/trainees`
          );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch trainees"
          );
        }

        const data =
          await response.json();

        setTrainees(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching trainees:",
          error
        );
      }
    };

  useEffect(() => {
    fetchTrainees();
  }, []);

  // ===================================================
  // HANDLE FORM CHANGES
  // ===================================================

  const handleChange =
    (e) => {
      const {
        name,
        value
      } = e.target;

      setFormData(
        (previousData) => ({
          ...previousData,
          [name]: value
        })
      );
    };

  // ===================================================
  // RESET FORM
  // ===================================================

  const resetForm = () => {
    setFormData({
      name: "",
      program: "",
      attendance: "",
      assessment: "",
      status:
        "Seeking Job",
      company: "",
      sector: "",
      salary: "",
      employmentDate: ""
    });

    setEditingTrainee(
      null
    );

    setShowForm(false);
  };

  // ===================================================
  // EDIT TRAINEE
  // ===================================================

  const handleEditTrainee =
    (trainee) => {
      setEditingTrainee(
        trainee
      );

      setViewingTrainee(
        null
      );

      setFormData({
        name:
          trainee.name ||
          "",

        program:
          trainee.program ||
          "",

        attendance:
          trainee.attendance ??
          "",

        assessment:
          trainee.assessment ??
          "",

        status:
          trainee.status ||
          "Seeking Job",

        company:
          trainee.company ||
          "",

        sector:
          trainee.sector ||
          "",

        salary:
          trainee.salary ||
          "",

        employmentDate:
          trainee.employmentDate ||
          ""
      });

      setShowForm(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

  // ===================================================
  // VIEW PROFILE
  // ===================================================

  const handleViewProfile =
    (trainee) => {
      setViewingTrainee(
        trainee
      );

      setShowForm(false);

      setEditingTrainee(
        null
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

  // ===================================================
  // DELETE TRAINEE
  // ===================================================

  const handleDeleteTrainee =
    async (trainee) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete ${trainee.name}?\n\nThis action cannot be undone.`
        );

      if (!confirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            `${BACKEND_URL}/api/trainees/${trainee.id}`,
            {
              method:
                "DELETE"
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "Failed to delete trainee"
          );

          return;
        }

        if (
          editingTrainee?.id ===
          trainee.id
        ) {
          resetForm();
        }

        if (
          viewingTrainee?.id ===
          trainee.id
        ) {
          setViewingTrainee(
            null
          );
        }

        alert(
          `${trainee.name} deleted successfully!`
        );

        await fetchTrainees();
      } catch (error) {
        console.error(
          "Delete trainee error:",
          error
        );

        alert(
          "Backend connection failed. Please try again."
        );
      }
    };

  // ===================================================
  // ADD / UPDATE TRAINEE
  // ===================================================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const attendance =
        Number(
          formData.attendance
        );

      const assessment =
        Number(
          formData.assessment
        );

      if (
        attendance < 0 ||
        attendance > 100 ||
        assessment < 0 ||
        assessment > 100
      ) {
        alert(
          "Attendance and assessment must be between 0 and 100."
        );

        return;
      }

      const traineeData = {
        name:
          formData.name.trim(),

        program:
          formData.program.trim(),

        attendance,

        assessment,

        status:
          formData.status,

        company:
          formData.company.trim(),

        sector:
          formData.sector.trim(),

        salary:
          formData.salary.trim(),

        employmentDate:
          formData.employmentDate
      };

      try {
        const isEditing =
          Boolean(
            editingTrainee
          );

        const response =
          await fetch(
            isEditing
              ? `${BACKEND_URL}/api/trainees/${editingTrainee.id}`
              : `${BACKEND_URL}/api/trainees`,
            {
              method:
                isEditing
                  ? "PUT"
                  : "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  traineeData
                )
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              (isEditing
                ? "Failed to update trainee"
                : "Failed to add trainee")
          );

          return;
        }

        if (isEditing) {
          const prediction =
            data.aiPrediction;

          if (prediction) {
            alert(
              `Trainee updated successfully!\n\nAI Risk: ${
                prediction.risk ||
                "Not Available"
              }\nAI Confidence: ${
                prediction.confidence ??
                0
              }%\n\nRecommended Action:\n${
                prediction.recommendedAction ||
                "Provide additional counselling and learning support."
              }`
            );
          } else {
            alert(
              "Trainee updated successfully!"
            );
          }
        } else {
          const prediction =
            data.aiPrediction;

          const risk =
            prediction?.risk ||
            "Not Available";

          const confidence =
            prediction?.confidence ??
            0;

          const action =
            prediction
              ?.recommendedAction ||
            "Provide additional counselling and learning support.";

          alert(
            `Trainee added successfully!\n\nAI Risk: ${risk}\nAI Confidence: ${confidence}%\n\nRecommended Action:\n${action}`
          );
        }

        resetForm();

        await fetchTrainees();
      } catch (error) {
        console.error(
          "Save trainee error:",
          error
        );

        alert(
          "Backend connection failed. Please try again."
        );
      }
    };

  // ===================================================
  // NAVIGATION
  // ===================================================

  const goToPage =
    (page) => {
      setActivePage(
        page
      );

      if (
        page !==
        "Trainees"
      ) {
        setShowForm(
          false
        );

        setViewingTrainee(
          null
        );

        setEditingTrainee(
          null
        );
      }
    };

  // ===================================================
  // RENDER PAGE
  // ===================================================

  const renderPage =
    () => {
      switch (
        activePage
      ) {
        case "Dashboard":
          return (
            <Dashboard
              trainees={
                trainees
              }
            />
          );

        case "Trainees":
          return (
            <>
              {viewingTrainee && (
                <TraineeProfile
                  trainee={
                    viewingTrainee
                  }
                  onClose={() =>
                    setViewingTrainee(
                      null
                    )
                  }
                />
              )}

              <Trainees
                trainees={
                  trainees
                }
                showForm={
                  showForm
                }
                setShowForm={
                  setShowForm
                }
                formData={
                  formData
                }
                handleChange={
                  handleChange
                }
                handleSubmit={
                  handleSubmit
                }
                editingTrainee={
                  editingTrainee
                }
                handleEditTrainee={
                  handleEditTrainee
                }
                handleDeleteTrainee={
                  handleDeleteTrainee
                }
                resetForm={
                  resetForm
                }
                onViewProfile={
                  handleViewProfile
                }
              />
            </>
          );

        case "Outcome Tracker":
          return (
            <OutcomeTracker
              trainees={
                trainees
              }
              refreshTrainees={
                fetchTrainees
              }
            />
          );

        case "Skill Gap Analytics":
          return (
            <SkillGapAnalytics
              trainees={
                trainees
              }
            />
          );

        case "AI Risk Engine":
          return (
            <AIRiskEngine
              trainees={
                trainees
              }
            />
          );

        default:
          return (
            <Dashboard
              trainees={
                trainees
              }
            />
          );
      }
    };

  return (
    <div className="app">
      <header className="header">
        <h1>
          KaushalTrack
        </h1>

        <p>
          AI-powered Outcome & Impact
          Tracking for Skilling
          Initiatives
        </p>
      </header>

      <nav className="navbar">
        {[
          "Dashboard",
          "Trainees",
          "Outcome Tracker",
          "Skill Gap Analytics",
          "AI Risk Engine"
        ].map(
          (page) => (
            <button
              type="button"
              key={page}
              className={
                activePage ===
                page
                  ? "active"
                  : ""
              }
              onClick={() =>
                goToPage(
                  page
                )
              }
            >
              {page}
            </button>
          )
        )}
      </nav>

      <main className="content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;