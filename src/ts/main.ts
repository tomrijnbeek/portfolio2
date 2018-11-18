import * as $ from "jquery";
import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
  $("#" + divName).html(sayHello(name));
}

showHello("greeting", "TypeScript");
