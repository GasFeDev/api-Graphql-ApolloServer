import people from "../dataset";

export const getPerson = (id: number) => {
  //get the object that contains the specified ID.
  return people.find((person) => person.id === id);
};
