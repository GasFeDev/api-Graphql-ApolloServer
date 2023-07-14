import people from "../dataset";
import { logger } from "../../../logger";

export const getAllPeople = () => {
  logger.debug("The is the people route.");
  logger.info("returning people");
  logger.error("this is a sample error");
  return people;
};
