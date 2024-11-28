import mongoose from "mongoose";
import { config } from "./index";

export const connectDB = async () => {
	try {
		await mongoose.connect(config.mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as mongoose.ConnectOptions);
		console.log("Conectado ao MongoDB!");
	} catch (error) {
		console.error("Erro ao conectar ao MongoDB:", error);
		process.exit(1); // Encerrar o servidor se falhar
	}
};
