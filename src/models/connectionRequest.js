const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",  // reference to the user collection
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is not defined`
            }
        },
    },
    {
        timestamps: true
    }
);

connectionRequestSchema.index = {
    fromUserId: 1,
    toUserId: 1
}

connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!")
    }
})

const connecttionRequestModel = mongoose.model('connectionRequest', connectionRequestSchema);

module.exports = connecttionRequestModel