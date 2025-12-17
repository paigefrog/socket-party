import { machine } from "./machine";

type States = "idle" | "playing" | "paused";

const fsm = machine.createMachine({
  states: {},
});
