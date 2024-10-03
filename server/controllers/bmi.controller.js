import BMI from "../models/bmi.model.js";
import User from "../models/user.model.js";

// Create BMI
export const createBmi = ({ body }, res) => {
    BMI.create(body)
        .then((dbBmiData) => {
            console.log(body)
            return User.findOneAndUpdate(
                { _id: { $eq: body.userId } },  // Find the user by userId
                { $push: { bmi: dbBmiData._id } },  // Add the BMI entry's ID to the user's `bmi` array
                { new: true }
            );
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: "BMI created but no user with this id!" });
            }
            res.json({ message: "BMI entry successfully created!" });
        })
        .catch((err) => res.status(500).json(err));
};

// Get BMI by ID
export const getBmiById = ({ params }, res) => {
    BMI.findOne({ _id: params.id })
        .then((dbBmiData) => {
            if (!dbBmiData) {
                return res.status(404).json({ message: "No BMI data found with this id!" });
            }
            res.json(dbBmiData);
        })
        .catch((err) => res.status(500).json(err));
};

// Delete BMI
export const deleteBmi = ({ params }, res) => {
    BMI.findOneAndDelete({ _id: params.id })
        .then((dbBmiData) => {
            if (!dbBmiData) {
                return res.status(404).json({ message: "No BMI data found with this id!" });
            }
            // Remove the BMI entry from the user's data
            return User.findOneAndUpdate(
                { bmi: params.id },
                { $pull: { bmi: params.id } },
                { new: true }
            );
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: "BMI deleted but no user with this id!" });
            }
            res.json({ message: "BMI entry successfully deleted!" });
        })
        .catch((err) => res.status(500).json(err));
};

// Get All BMI Entries
export const getAllBmiEntries = (req, res) => {
    BMI.find()
        .then((dbBmiData) => {
            if (!dbBmiData || dbBmiData.length === 0) {
                return res.status(404).json({ message: "No BMI entries found for this user!" });
            }
            res.json(dbBmiData);
        })
        .catch((err) => res.status(500).json({ error: err.message }));
};