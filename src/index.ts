import "dotenv/config";
import { getStartupWelcomeText } from "@cinnabar-forge/utils";

import app from "./express.js";
import { logger } from "./utils/logger.js";

const port = parseInt(process.env.PORT || "3000") || 3000;

app.listen(port, () => {
  logger.info(
    getStartupWelcomeText("moyklass-task", "0.0.0", false, "http", port, null),
  );
});
