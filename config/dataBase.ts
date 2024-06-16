import mongoose from "mongoose";

const dbConnect = async () => {
  mongoose.set("strictQuery", false);
  await mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@auth-diy.lnxp6yk.mongodb.net/`
    )
    .then(() => {
      console.log("Successfully connected to mongo database");
    })
    .catch((error) => {
      console.log("mongo database connection failed.");
      console.error(error);
      process.exit(1);
    });
};

export default dbConnect;
