const { db } = require("../db");
require('dotenv').config();


module.exports.updateTimings = (req, res) => {

    const { competitionName, competitionDate, startTime, endTime,secretKey } = req.body;
    if(secretKey !== process.env.secret_key_manage) {
        return res.status(200).json({ success: false, message: "You do not have the rights to perform this update"});
    }
    const q = `
        UPDATE Competition 
        SET competitionName = ?, competitionDate = ?, startTime = ?, endTime = ?
        WHERE competition_id = 1;
    `;
    
    db.query(q, [competitionName, competitionDate, startTime, endTime], (error, result) => {
        if (error) {
            console.error("Error updating competition timings:", error);
            return res.status(500).json({ success: false, message: "Database update failed", error });
        }
        res.status(200).json({ success: true, message: "Competition timings updated successfully" });
    });
};


module.exports.getCompetitionTimings = (req, res) => {
    const q = `SELECT competitionName,competitionDate,
    startTime,endTime FROM Competition WHERE competition_id = 1;`;

    db.query(q, (err, result) => {
        if (err) {
            console.error("Error fetching competition timings:", err);
            return res.status(500).json({ error: "Internal Server Error in fetching competition timingss ",err  });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "Competition not found" });
        }

        const competitionData = result[0];
        res.status(200).json({
            competitionName: competitionData.competitionName,
            competitionDate: competitionData.competitionDate.toISOString().split("T")[0],
            startTime: competitionData.startTime, 
            endTime: competitionData.endTime
        });
    });
};
