// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "aether_capital",
//     });
//     console.log(`✅ MongoDB connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`❌ MongoDB connection failed: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;


const connectDB = async () => {
  console.log("⏭️ MongoDB skipped for now");
};

export default connectDB;