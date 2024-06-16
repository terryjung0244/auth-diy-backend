import dotenv from "dotenv";
import path from "path";
import createServer from "./util/createServer";
import dbConnect from "./config/dataBase";

const main = async () => {
  dotenv.config({
    path: path.resolve(__dirname, `dev.env`),
  });
  await dbConnect();
};
main().catch((err) => console.log(err));

const app = createServer();

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Connected ${PORT}`);
});
