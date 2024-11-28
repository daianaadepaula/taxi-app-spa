import dotenv from "dotenv";

dotenv.config({ path: '../.env' });

const uri = "mongodb+srv://daianaadepaula1:h4ISAczJzrFA4TTz@cluster0.imywo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const config = {
	port: 8080,
	mongoURI: uri,
	googleApiKey: process.env.GOOGLE_API_KEY || "",
};
